import { useEffect, useRef, useState } from "react";
import {
  buildStepAnnouncement,
  STEP_HEADING_SELECTOR,
} from "@/lib/accessibility";

interface UseStepFocusOptions {
  context?: string;
  skipInitial?: boolean;
}

/**
 * Moves focus to the newly rendered step heading and announces the transition.
 * The announcement is intentionally separate from the focused heading so screen
 * reader users still hear a deterministic state-change message.
 */
export function useStepFocus<T extends HTMLElement = HTMLElement>(
  changeToken: string | number,
  { context = "內容", skipInitial = true }: UseStepFocusOptions = {}
) {
  const containerRef = useRef<T>(null);
  const firstRun = useRef(true);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      if (skipInitial) return;
    }

    const heading = containerRef.current?.querySelector<HTMLElement>(
      STEP_HEADING_SELECTOR
    );
    if (!heading) return;

    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });

    const frame = window.requestAnimationFrame(() => {
      heading.focus({ preventScroll: true });
      setAnnouncement(buildStepAnnouncement(heading.textContent, context));
    });

    return () => window.cancelAnimationFrame(frame);
  }, [changeToken, context, skipInitial]);

  return { announcement, containerRef };
}

export function StepLiveRegion({ message }: { message: string }) {
  return (
    <p className="sr-only" aria-live="polite" aria-atomic="true">
      {message}
    </p>
  );
}
