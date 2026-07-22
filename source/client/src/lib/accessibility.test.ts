import { describe, expect, it } from "vitest";
import {
  BODY_MAP_HIT_TARGET_PX,
  buildStepAnnouncement,
  isKeyboardActivationKey,
  normalizeAccessibleText,
} from "./accessibility";

describe("keyboard activation", () => {
  it("accepts Enter and Space, but not unrelated keys", () => {
    expect(isKeyboardActivationKey("Enter")).toBe(true);
    expect(isKeyboardActivationKey(" ")).toBe(true);
    expect(isKeyboardActivationKey("Spacebar")).toBe(false);
    expect(isKeyboardActivationKey("ArrowDown")).toBe(false);
  });
});

describe("step announcements", () => {
  it("normalizes heading whitespace before announcing", () => {
    expect(normalizeAccessibleText("  第 2 題\n  肩膀痛嗎？ ")).toBe(
      "第 2 題 肩膀痛嗎？"
    );
    expect(
      buildStepAnnouncement("  肩膀痛嗎？ ", "疼痛評估")
    ).toBe("疼痛評估已更新：肩膀痛嗎？");
  });

  it("keeps a useful fallback when a heading is unavailable", () => {
    expect(buildStepAnnouncement("", "兒童檢測")).toBe("兒童檢測已更新");
  });
});

describe("body-map targets", () => {
  it("keeps each isolated label target at least 44 CSS pixels", () => {
    expect(BODY_MAP_HIT_TARGET_PX).toBeGreaterThanOrEqual(44);
  });
});
