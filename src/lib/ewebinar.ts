const BASE_URL = "https://api.ewebinar.com/v2";

function getToken(): string {
  const token = process.env.EWEBINAR_API_TOKEN;
  if (!token) {
    throw new Error("EWEBINAR_API_TOKEN is not set in the environment");
  }
  return token;
}

async function ewebinarFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`eWebinar API ${path} failed: ${res.status} ${body}`);
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
