/**
 * 樂智康兒童發展自我檢測 — 年齡計算與判讀邏輯
 *
 * 年齡計算：
 * - 實足年齡 = 檢測日 - 出生日
 * - 早產矯正：出生時未滿 37 週且實足年齡未滿 2 歲者，
 *   矯正年齡 = 實足年齡 - (40 週 - 出生週數)
 *
 * 判讀規則（借鑑 Taipei-II）：
 * - 警訊題 1 題未通過 → red（建議進一步評估）
 * - 一般題累計 2 題以上未通過 → red
 * - 一般題僅 1 題未通過 → amber（持續觀察，1-2 個月後再測）
 * - 全部通過 → green
 */

import {
  CATEGORY_META,
  type Category,
  type Question,
  type Questionnaire,
} from "./questionnaires";

export interface AgeResult {
  /** 實足月齡（含小數） */
  chronologicalMonths: number;
  /** 用於選表的月齡（早產已矯正） */
  effectiveMonths: number;
  /** 是否套用了早產矯正 */
  corrected: boolean;
  /** 顯示用文字，例如「2 歲 3 個月」 */
  displayAge: string;
}

export function calcAge(
  birthDate: Date,
  gestationalWeeks: number | null,
  today: Date = new Date()
): AgeResult {
  const msPerDay = 24 * 60 * 60 * 1000;
  const days = Math.floor((today.getTime() - birthDate.getTime()) / msPerDay);
  const chronologicalMonths = days / 30.4375;

  let effectiveMonths = chronologicalMonths;
  let corrected = false;
  if (
    gestationalWeeks !== null &&
    gestationalWeeks > 0 &&
    gestationalWeeks < 37 &&
    chronologicalMonths < 24
  ) {
    const correctionWeeks = 40 - gestationalWeeks;
    effectiveMonths = chronologicalMonths - (correctionWeeks * 7) / 30.4375;
    corrected = true;
  }

  const displayMonths = Math.max(0, Math.floor(effectiveMonths));
  const years = Math.floor(displayMonths / 12);
  const months = displayMonths % 12;
  const displayAge =
    years > 0
      ? months > 0
        ? `${years} 歲 ${months} 個月`
        : `${years} 歲`
      : `${displayMonths} 個月`;

  return { chronologicalMonths, effectiveMonths, corrected, displayAge };
}

export type Light = "green" | "amber" | "red";

export interface CategoryResult {
  category: Category;
  total: number;
  passed: number;
  failedQuestions: Question[];
  failedWarning: boolean;
}

export interface ScreeningResult {
  light: Light;
  failedWarningCount: number;
  failedNormalCount: number;
  categories: CategoryResult[];
  /** 未通過（含警訊）最嚴重的面向，依警訊題優先、未通過題數排序 */
  concernedCategories: Category[];
}

/** answers: questionId -> true(勾「是」) / false(勾「否」) */
export function evaluate(
  questionnaire: Questionnaire,
  answers: Record<string, boolean>
): ScreeningResult {
  const isFailed = (q: Question) => {
    const ans = answers[q.id];
    if (ans === undefined) return false;
    return q.reverse ? ans === true : ans === false;
  };

  let failedWarningCount = 0;
  let failedNormalCount = 0;

  const catMap = new Map<Category, CategoryResult>();
  (Object.keys(CATEGORY_META) as Category[]).forEach((c) =>
    catMap.set(c, {
      category: c,
      total: 0,
      passed: 0,
      failedQuestions: [],
      failedWarning: false,
    })
  );

  for (const q of questionnaire.questions) {
    const cat = catMap.get(q.category)!;
    cat.total += 1;
    if (isFailed(q)) {
      cat.failedQuestions.push(q);
      if (q.isWarning) {
        cat.failedWarning = true;
        failedWarningCount += 1;
      } else {
        failedNormalCount += 1;
      }
    } else {
      cat.passed += 1;
    }
  }

  let light: Light = "green";
  if (failedWarningCount >= 1 || failedNormalCount >= 2) light = "red";
  else if (failedNormalCount === 1) light = "amber";

  const concernedCategories = Array.from(catMap.values())
    .filter((c) => c.failedQuestions.length > 0)
    .sort(
      (a, b) =>
        Number(b.failedWarning) - Number(a.failedWarning) ||
        b.failedQuestions.length - a.failedQuestions.length
    )
    .map((c) => c.category);

  return {
    light,
    failedWarningCount,
    failedNormalCount,
    categories: Array.from(catMap.values()).filter((c) => c.total > 0),
    concernedCategories,
  };
}

export const LOCATIONS_URL = "https://sharp-falcon-88717.zenbu.space/locations";
export const BLOG_URL = "https://sharp-falcon-88717.zenbu.space/blog";
