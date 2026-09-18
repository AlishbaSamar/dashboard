const BASE_URL = "https://api.ewebinar.com/v2";

/** Thrown for any failed eWebinar API call. `message` is safe to show to a viewer. */
export class EwebinarApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = "EwebinarApiError";
  }
}

function getToken(): string {
  const token = process.env.EWEBINAR_API_TOKEN;
  if (!token) {
    throw new EwebinarApiError(
      "The dashboard isn't configured with an eWebinar API token yet. Set EWEBINAR_API_TOKEN and redeploy."
    );
  }
  return token;
}

async function ewebinarFetch<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
      next: { revalidate: 300 },
    });
  } catch {
    throw new EwebinarApiError("Couldn't reach eWebinar. Check your connection and try again.");
  }

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new EwebinarApiError(
        "eWebinar rejected the dashboard's API token. It may have been regenerated or revoked — check the integration settings in eWebinar.",
        res.status
      );
    }
    if (res.status === 429) {
      throw new EwebinarApiError(
        "eWebinar is rate-limiting requests right now. Wait a moment and try again.",
        res.status
      );
    }
    if (res.status >= 500) {
      throw new EwebinarApiError("eWebinar's API is temporarily unavailable. Try again shortly.", res.status);
    }
    const body = await res.text().catch(() => "");
    throw new EwebinarApiError(`eWebinar API request failed (${res.status}). ${body}`.trim(), res.status);
  }

  return res.json() as Promise<T>;
}

export type Webinar = {
  id: string;
  title: string;
  durationSecs: number;
  language: string;
  moderator: { name: string; firstName: string; lastName: string; email: string };
  urls: { registrationUrl: string };
};

type WebinarsResponse = { webinars: Webinar[]; nextCursor?: string };

export type AttendanceState = "Joined" | "NotJoined" | "Watched" | "Missed";

export type Registrant = {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  webinarId: number;
  webinarTitle: string;
  state: AttendanceState;
  attended?: string;
  registeredTime: string;
  joinedTime?: string;
  leftTime?: string;
  leftAtSecs?: number;
  sessionType?: string;
  totalWatchedPercent?: number;
  watchedScheduledPercent?: number;
  watchedReplayPercent?: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  country?: string;
  city?: string;
  deviceTypeWhenRegistered?: string;
  deviceTypeWhenWatching?: string;
  // Custom registration fields — property names vary per webinar's form config,
  // so both variants are read with a fallback wherever job title/company are shown.
  role?: string;
  role_1?: string;
  company?: string;
  company_1?: string;
};

type RegistrantsResponse = { registrants: Registrant[]; nextCursor?: string | null };

export async function getWebinars(): Promise<Webinar[]> {
  const data = await ewebinarFetch<WebinarsResponse>("/webinars");
  return data.webinars;
}

export async function getAllRegistrants(): Promise<Registrant[]> {
  const all: Registrant[] = [];
  let cursor: string | undefined;

  do {
    const query = cursor ? `?nextCursor=${encodeURIComponent(cursor)}` : "";
    const data = await ewebinarFetch<RegistrantsResponse>(`/registrants${query}`);
    all.push(...data.registrants);
    cursor = data.nextCursor ?? undefined;
  } while (cursor);

  return all;
}
