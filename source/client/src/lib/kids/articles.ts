/**
 * 結果頁衛教文章推薦對應表
 *
 * 文章尚未上架，url 先暫連部落格總覽頁（BLOG_URL），
 * 待文章於 /blog 上架後，逐篇替換為正式網址。
 * 編號對應《篩檢APP衛教文章清單》（P/C/T 系列）。
 */

import type { Category } from "./questionnaires";
import { BLOG_URL } from "./screening";

export interface Article {
  code: string;
  title: string;
  description: string;
  url: string;
}

/** 各面向核心指南（P 系列） */
export const CORE_ARTICLES: Record<Category, Article> = {
  語言認知: {
    code: "P-01",
    title: "孩子說話慢、聽不懂指令？兒童語言認知發展全指南",
    description: "從發展里程碑到就醫時機，帶您完整了解孩子的語言與認知發展。",
    url: BLOG_URL,
  },
  粗大動作: {
    code: "P-02",
    title: "翻身、爬行、走路慢半拍？兒童粗大動作發展全指南",
    description: "認識大肌肉動作發展的關鍵里程碑，以及哪些警訊需要留意。",
    url: BLOG_URL,
  },
  精細動作: {
    code: "P-03",
    title: "不會拿湯匙、握筆怪怪的？兒童精細動作發展全指南",
    description: "手部小肌肉是學習的基礎，帶您了解精細動作的發展與警訊。",
    url: BLOG_URL,
  },
  社會情緒: {
    code: "P-04",
    title: "不看人、不理人、愛發脾氣？兒童社會情緒發展全指南",
    description: "眼神互動、模仿與遊戲行為，是觀察孩子社會發展的重要窗口。",
    url: BLOG_URL,
  },
};

/** 分齡警訊文章（C 系列），依「面向 + 月齡區間」對應 */
interface AgedArticle extends Article {
  category: Category;
  minMonths: number;
  maxMonths: number;
}

export const AGED_ARTICLES: AgedArticle[] = [
  // 嬰幼兒期 4個月-1歲半
  { code: "C-11", category: "語言認知", minMonths: 0, maxMonths: 17.5, title: "寶寶叫名字沒反應、很少發出聲音？1 歲前的語言警訊", description: "嬰兒期的語言前期能力，是未來說話的地基。", url: BLOG_URL },
  { code: "C-12", category: "粗大動作", minMonths: 0, maxMonths: 17.5, title: "8 個月還不會爬、1 歲還不會站正常嗎？", description: "認識嬰兒期粗大動作的正常時程與警訊時程。", url: BLOG_URL },
  { code: "C-13", category: "精細動作", minMonths: 0, maxMonths: 17.5, title: "寶寶不太伸手抓東西？嬰兒期的手部發展觀察重點", description: "從握拳到捏取，寶寶的小手正在快速進化。", url: BLOG_URL },
  { code: "C-14", category: "社會情緒", minMonths: 0, maxMonths: 17.5, title: "寶寶不太看人、逗他沒反應？早期社會互動警訊", description: "眼神接觸與社會性微笑，是最早的互動語言。", url: BLOG_URL },
  // 學步期 1歲半-3歲
  { code: "C-21", category: "語言認知", minMonths: 17.5, maxMonths: 41.5, title: "2 歲還不會講話怎麼辦？語言發展遲緩的判斷與對策", description: "「大雞晚啼」還是需要評估？帶您用科學標準判斷。", url: BLOG_URL },
  { code: "C-22", category: "粗大動作", minMonths: 17.5, maxMonths: 41.5, title: "走路常跌倒、墊腳尖走路要緊嗎？學步期的動作警訊", description: "步態與平衡是學步期最重要的觀察指標。", url: BLOG_URL },
  { code: "C-23", category: "精細動作", minMonths: 17.5, maxMonths: 41.5, title: "不會疊積木、不會拿湯匙？學步期的手部發展", description: "生活自理的第一步，從小肌肉開始。", url: BLOG_URL },
  { code: "C-24", category: "社會情緒", minMonths: 17.5, maxMonths: 41.5, title: "不會玩假扮遊戲、行為固執？學步期的社會情緒警訊", description: "假扮遊戲與共享注意力，是社會發展的重要里程碑。", url: BLOG_URL },
  // 幼兒園期 3歲半-6歲
  { code: "C-31", category: "語言認知", minMonths: 41.5, maxMonths: 84, title: "說話結巴、講不清楚？幼兒園期的語言發展警訊", description: "上學後語言需求大增，這些警訊別輕忽。", url: BLOG_URL },
  { code: "C-32", category: "粗大動作", minMonths: 41.5, maxMonths: 84, title: "跑步笨拙、不敢跳？幼兒園期的動作協調觀察", description: "動作協調影響孩子的自信與同儕互動。", url: BLOG_URL },
  { code: "C-33", category: "精細動作", minMonths: 41.5, maxMonths: 84, title: "握筆姿勢奇怪、不會用剪刀？入學前的精細動作準備", description: "書寫前能力是小一適應的關鍵。", url: BLOG_URL },
  { code: "C-34", category: "社會情緒", minMonths: 41.5, maxMonths: 84, title: "無法排隊等待、容易和同學起衝突？談幼兒的情緒與衝動控制", description: "團體生活的挑戰，可能是發展給的提示。", url: BLOG_URL },
];

/** 導流轉換文章（T 系列） */
export const TRANSFER_ARTICLES: Article[] = [
  {
    code: "T-02",
    title: "懷疑孩子發展遲緩？評估前你必須知道的 5 件事",
    description: "就醫前的完整準備清單，讓評估更順利、更有效率。",
    url: BLOG_URL,
  },
  {
    code: "T-03",
    title: "被幼兒園老師說要帶去評估怎麼辦？給家長的心理調適",
    description: "早期發現不是貼標籤，而是給孩子最好的禮物。",
    url: BLOG_URL,
  },
];

/** 依結果組合推薦文章：未通過面向的分齡文章 + 核心指南 + 導流文章 */
export function recommendArticles(
  concernedCategories: Category[],
  effectiveMonths: number,
  light: "green" | "amber" | "red"
): Article[] {
  const picks: Article[] = [];
  const seen = new Set<string>();
  const add = (a: Article | undefined) => {
    if (a && !seen.has(a.code)) {
      seen.add(a.code);
      picks.push(a);
    }
  };

  // 紅/黃燈時先保留導流文章名額，避免被面向文章擠掉
  if (light !== "green") {
    add(TRANSFER_ARTICLES[0]); // T-02 評估前 5 件事（必推）
  }

  for (const cat of concernedCategories.slice(0, 2)) {
    add(
      AGED_ARTICLES.find(
        (a) =>
          a.category === cat &&
          effectiveMonths >= a.minMonths &&
          effectiveMonths < a.maxMonths
      )
    );
    add(CORE_ARTICLES[cat]);
  }

  if (light !== "green") {
    TRANSFER_ARTICLES.forEach(add); // T-03 若還有名額則補上
  }

  return picks.slice(0, 4);
}
