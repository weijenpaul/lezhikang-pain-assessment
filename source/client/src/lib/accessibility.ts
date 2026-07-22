/** Shared accessibility helpers for the two self-assessment state machines. */
export const STEP_HEADING_SELECTOR = "[data-step-heading]";

/** WCAG 2.2 guidance and the project brief both require a 44 CSS-pixel target. */
export const BODY_MAP_HIT_TARGET_PX = 44;

export function isKeyboardActivationKey(key: string): boolean {
  return key === "Enter" || key === " ";
}

export function normalizeAccessibleText(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

export function buildStepAnnouncement(
  headingText: string | null | undefined,
  context = "內容"
): string {
  const heading = normalizeAccessibleText(headingText);
  return heading ? `${context}已更新：${heading}` : `${context}已更新`;
}
