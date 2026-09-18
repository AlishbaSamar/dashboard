"use client";

import { ErrorState } from "@/components/ErrorState";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <ErrorState
      message="Something went wrong loading this webinar. Please try again."
      onRetry={reset}
      backHref="/"
    />
  );
}
