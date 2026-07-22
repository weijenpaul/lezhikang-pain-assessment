/**
 * /kids — 樂智康兒童發展自我檢測（嵌入版，單頁狀態機）＋美感優化 v2（設計紅隊 15 項）
 * landing（落地說明）→ test（intro 生日 → quiz 逐題 → result 結果），全在本頁切換
 * 嵌入規範：不帶 app 頁首/頁尾（站台 chrome 提供），免責聲明常駐；
 * 主題：.kids-scope 作用域 token（墨綠 #0E7C6B），不影響 /pain
 * 紅線：判讀邏輯/題庫/免責聲明零改動；「否」按鈕暖灰不可紅；動效 ≤300ms 且尊重 reduced-motion
 */
import { useMemo, useState } from "react";
import {
  CATEGORY_META,
  QUESTIONNAIRES,
  findQuestionnaire,
  type Category,
  type Questionnaire,
} from "@/lib/kids/questionnaires";
import {
  calcAge,
  evaluate,
  LOCATIONS_URL,
  BLOG_URL,
  type AgeResult,
  type ScreeningResult,
} from "@/lib/kids/screening";
import { recommendArticles } from "@/lib/kids/articles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { StepLiveRegion, useStepFocus } from "@/hooks/useStepFocus";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ClipboardCheck,
  Clock3,
  Eye,
  FileCheck2,
  Footprints,
  Hand,
  MapPin,
  MessageCircle,
  MessageSquareText,
  Printer,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";

const CDN_KIDS =
  "https://cdn.jsdelivr.net/gh/weijenpaul/lezhikang-pain-assessment@v8/assets/kids";
const CDN_KIDS_V9 =
  "https://cdn.jsdelivr.net/gh/weijenpaul/lezhikang-pain-assessment@v9/assets/kids";
const HERO_IMG = `${CDN_KIDS}/kids-hero.webp`;

/* 美感優化插圖（2026-07 設計紅隊交班包，jsDelivr @v9） */
const ILLUS = {
  birthday: `${CDN_KIDS_V9}/illus-birthday.webp`,
  resultSupport: `${CDN_KIDS_V9}/illus-result-support.webp`,
  resultCelebrate: `${CDN_KIDS_V9}/illus-result-celebrate.webp`,
  ctaTeam: `${CDN_KIDS_V9}/illus-cta-team.webp`,
  quizCorner: `${CDN_KIDS_V9}/illus-quiz-corner.webp`,
} as const;

const CATEGORY_ICON = {
  粗大動作: Footprints,
  精細動作: Hand,
  語言認知: MessageCircle,
  社會情緒: Users,
} as const;

/** 院所頁歸因：與疼痛系統同一套 ?from= 口徑 */
const locUrl = (from: string) => `${LOCATIONS_URL}?from=${from}`;

const CATEGORIES = Object.keys(CATEGORY_META) as Category[];

const FAQS = [
  {
    q: "這個檢測結果代表孩子確診發展遲緩嗎？",
    a: "不是的。這是一份參考國健署《兒童健康手冊》發展里程碑編製的自我檢核工具，目的是幫助家長「初步觀察」孩子的發展狀態，結果僅供參考，不能取代醫師的專業診斷。若結果建議進一步評估，表示值得請專業人員看看，並不代表孩子一定有發展問題。",
  },
  {
    q: "檢測需要多久？需要準備什麼嗎？",
    a: "大約 3 分鐘。您只需要輸入孩子的出生年月日（早產兒可加填出生週數），系統會自動找出適合的年齡題組。題目都是日常生活中可以觀察到的行為，不需要任何器材，憑您平時對孩子的了解作答即可。",
  },
  {
    q: "我的資料會被儲存或外流嗎？",
    a: "您輸入的生日與作答內容，所有運算都在您的瀏覽器中完成，不會上傳或儲存到任何伺服器，離開頁面後即消失。本網站僅收集匿名的瀏覽統計（如頁面瀏覽次數），不涉及您的作答內容或個人資料。",
  },
  {
    q: "如果結果建議進一步評估，下一步該怎麼做？",
    a: "建議您攜帶兒童健康手冊，諮詢小兒科或復健科醫師。樂智康醫學北桃竹 10 間院所提供兒童發展相關醫療服務，您可以就近選擇方便的院所諮詢。3 歲前是大腦可塑性最高的黃金療育期，早一步了解、早一步安心。",
  },
  {
    q: "孩子是早產兒，年齡要怎麼算？",
    a: "未滿 2 歲的早產兒建議使用「矯正年齡」評估發展：矯正年齡＝實足年齡－（40 週－出生週數）。您只要在檢測時填寫出生週數，系統就會自動幫您換算，不需要自己計算。",
  },
];

function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-muted-foreground ${className}`}>
      本檢測工具由樂智康醫學參考衛生福利部國民健康署《兒童健康手冊》之兒童發展里程碑編製，僅供家長初步參考，
      <strong className="font-medium text-foreground/80">
        不能取代醫師的專業診斷
      </strong>
      。每個孩子的發展步調不同，若您對孩子的發展有任何疑慮，建議諮詢小兒科、復健科醫師或聯合評估中心。您的作答內容僅在您的瀏覽器中運算，不會上傳或儲存至伺服器。
    </p>
  );
}

export default function Kids() {
  const [mode, setMode] = useState<"landing" | "test">("landing");
  const { announcement, containerRef } = useStepFocus(mode, {
    context: "兒童發展檢測",
  });
  const start = () => {
    setMode("test");
    window.scrollTo({ top: 0 });
  };
  const exit = () => {
    setMode("landing");
    window.scrollTo({ top: 0 });
  };
  return (
    <div
      className="kids-scope flex min-h-screen flex-col bg-background text-foreground"
      style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
    >
      <StepLiveRegion message={announcement} />
      <main ref={containerRef} className="flex-1">
        {mode === "landing" ? (
          <Landing onStart={start} />
        ) : (
          <TestFlow onExit={exit} />
        )}
      </main>
    </div>
  );
}

/* ================= 落地說明頁 ================= */
function Landing({ onStart }: { onStart: () => void }) {
  return (
    <>
      {/* Hero（D1：右上超大極淡墨綠圓弧＋CTA 下信任小字） */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-64 h-[36rem] w-[36rem] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(14,124,107,0.06) 0%, rgba(14,124,107,0.06) 55%, transparent 72%)",
          }}
        />
        <div className="container relative grid items-center gap-10 py-14 md:grid-cols-[1.1fr_1fr] md:py-20">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-accent-foreground">
              <FileCheck2 className="h-3.5 w-3.5" />
              參考國健署《兒童健康手冊》發展里程碑編製
            </p>
            <h1 data-step-heading tabIndex={-1} className="text-3xl font-black leading-snug text-foreground md:text-[2.6rem] md:leading-[1.3]">
              別擔心，
              <br />
              每個孩子都有自己的步調。
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              花 3 分鐘回答幾個日常觀察的小問題，初步了解孩子在
              <span className="font-medium text-foreground">
                粗大動作、精細動作、語言認知、社會情緒
              </span>
              四大面向的發展狀態。這不是考試，只是幫您更了解孩子。
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onStart}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-bold text-primary-foreground shadow-md transition-all hover:opacity-90 active:scale-[0.97]"
              >
                開始檢測
                <ArrowRight className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" /> 約 3 分鐘
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> 免註冊・作答不上傳
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              免費使用・約 3 分鐘・不需留下個人資料
            </p>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-lg shadow-primary/10">
              <img
                src={HERO_IMG}
                alt="家長與孩子一起玩積木的溫馨插圖"
                loading="eager"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 left-6 rounded-2xl bg-card px-5 py-3 shadow-md">
              <p className="text-xs text-muted-foreground">適用年齡</p>
              <p className="text-sm font-bold text-foreground">
                4 個月～未滿 7 歲・共 {QUESTIONNAIRES.length} 個年齡題組
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 四大面向 */}
      <section className="bg-card py-16">
        <div className="container">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            我們陪您觀察孩子的四大發展面向
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            兒童發展不只是「會不會走路、會不會說話」。系統會依孩子的實足年齡，自動載入對應的題組，從四個面向完整觀察。
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((cat) => {
              const meta = CATEGORY_META[cat];
              return (
                <div
                  key={cat}
                  className="group overflow-hidden rounded-2xl border border-border/70 bg-background transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div
                    className="relative aspect-[3/2] overflow-hidden"
                    style={{ backgroundColor: meta.bg }}
                  >
                    <img
                      src={meta.banner}
                      alt={cat}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <span
                      className="absolute bottom-0 left-0 h-1 w-full"
                      style={{ backgroundColor: meta.color }}
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: meta.color }}
                      />
                      {cat}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {meta.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 三步驟（D2：icon 圓容器＋描邊數字＋卡間虛線連接） */}
      <section className="container py-16">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          三個步驟，3 分鐘完成
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              step: "01",
              icon: CalendarDays,
              iconBg: "#E6F2EF",
              iconColor: "#0C7464",
              title: "輸入孩子的生日",
              desc: "系統自動計算實足年齡，早產兒也會自動換算矯正年齡，找出最適合的年齡題組。",
            },
            {
              step: "02",
              icon: MessageSquareText,
              iconBg: "#FBF3E4",
              iconColor: "#8A5A10",
              title: "回答日常觀察小問題",
              desc: "每題只需回答「是」或「否」，都是平常和孩子相處就觀察得到的行為，沒有標準答案的壓力。",
            },
            {
              step: "03",
              icon: ClipboardCheck,
              iconBg: "#FCEBE8",
              iconColor: "#A84536",
              title: "查看發展狀態分析",
              desc: "立即獲得四大面向的初步分析，並提供對應的衛教資訊與後續建議，陪您安心走下一步。",
            },
          ].map((s, i) => {
            const StepIcon = s.icon;
            return (
              <div key={s.step} className="relative rounded-2xl bg-card p-6 shadow-sm">
                {i < 2 && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-6 top-12 hidden w-6 border-t-2 border-dashed border-primary/30 md:block"
                  />
                )}
                <div className="flex items-center gap-4">
                  <span
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: s.iconBg }}
                  >
                    <StepIcon className="h-6 w-6" style={{ color: s.iconColor }} />
                  </span>
                  <span
                    className="text-4xl font-black text-transparent"
                    style={{ WebkitTextStroke: "1.5px #0E7C6B" }}
                  >
                    {s.step}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-10 flex justify-center">
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-bold text-primary-foreground shadow-md transition-all hover:opacity-90 active:scale-[0.97]"
          >
            立即開始檢測
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* 為什麼早期觀察重要（D3：統計卡半透明白底＋大號米白數字） */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-xs font-medium text-primary-foreground">
              給爸媽的小提醒
            </p>
            <h2 className="text-2xl font-bold md:text-3xl">
              為什麼 3 歲前的觀察特別重要？
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/85 md:text-base">
              0 到 3 歲是大腦發展最快速、可塑性最高的階段，衛福部也將 3
              歲前視為早期療育的「黃金期」——多數研究支持：愈早發現、愈早開始介入，對孩子的幫助愈大。台灣每年有近 4
              萬名兒童被通報發展遲緩，其中不少孩子因為「再等等看」而延誤了評估時機。定期自我檢核，就是給孩子多一層守護。
            </p>
            <p className="mt-4 text-sm italic text-primary-foreground">
              「早一步了解，不是貼標籤，而是給孩子最溫柔的陪伴。」
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { num: "0-3 歲", label: "大腦發展黃金期" },
              { num: "近 4 萬", label: "每年發展遲緩通報人數" },
              { num: "3 分鐘", label: "完成一次自我檢核" },
              { num: "13 組", label: "分齡題組精準對應" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl p-5"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                <p className="text-3xl font-black text-[#FAF7F0] md:text-[40px] md:leading-tight">
                  {item.num}
                </p>
                <p className="mt-1.5 text-xs text-primary-foreground">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-16">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          家長常見問題
        </h2>
        <div className="mt-8 max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 底部 CTA */}
      <section className="container pb-16">
        <div className="rounded-3xl bg-accent p-8 md:p-12">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-accent-foreground md:text-2xl">
                現在就花 3 分鐘，更了解您的孩子
              </h2>
              <p className="mt-2 text-sm text-accent-foreground">
                免註冊、作答內容不上傳，結果立即呈現。若有疑慮，樂智康北桃竹 10 間院所都在您身邊。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onStart}
                className="rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground shadow-md transition-all hover:opacity-90 active:scale-[0.97]"
              >
                開始檢測
              </button>
              <a
                href={locUrl("kids-landing")}
                className="rounded-full border border-primary/40 bg-card px-7 py-3 text-sm font-bold text-primary transition-all hover:bg-primary/5 active:scale-[0.97]"
              >
                查看北桃竹院所
              </a>
            </div>
          </div>
          <div className="mt-6 border-t border-accent-foreground/10 pt-5">
            <Disclaimer />
          </div>
        </div>
      </section>
    </>
  );
}

/* ================= 檢測流程（intro → quiz → result） ================= */
type Stage = "intro" | "quiz" | "result";

function TestFlow({ onExit }: { onExit: () => void }) {
  const [stage, setStage] = useState<Stage>("intro");

  // intro state
  const [birthDate, setBirthDate] = useState("");
  const [isPreterm, setIsPreterm] = useState(false);
  const [weeks, setWeeks] = useState("");
  const [error, setError] = useState("");

  // quiz state
  const [age, setAge] = useState<AgeResult | null>(null);
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [idx, setIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const focusToken = stage === "quiz" ? `${stage}:${idx}` : stage;
  const { announcement, containerRef } = useStepFocus<HTMLDivElement>(focusToken, {
    context: "兒童發展檢測",
  });

  const result: ScreeningResult | null = useMemo(() => {
    if (stage !== "result" || !questionnaire) return null;
    return evaluate(questionnaire, answers);
  }, [stage, questionnaire, answers]);

  function startQuiz() {
    setError("");
    if (!birthDate) {
      setError("請先選擇孩子的出生年月日");
      return;
    }
    const bd = new Date(birthDate + "T00:00:00");
    if (isNaN(bd.getTime()) || bd > new Date()) {
      setError("出生日期格式不正確，請重新選擇");
      return;
    }
    let gw: number | null = null;
    if (isPreterm) {
      gw = parseInt(weeks, 10);
      if (isNaN(gw) || gw < 20 || gw > 42) {
        setError("請填寫正確的出生週數（20～42 週）");
        return;
      }
    }
    const a = calcAge(bd, gw);
    const q = findQuestionnaire(a.effectiveMonths);
    if (!q) {
      if (a.effectiveMonths < 3.5) {
        setError(
          "孩子目前未滿 3 個半月，本檢測適用 4 個月以上的孩子。建議先依兒童健康手冊定期接受健兒門診檢查。"
        );
      } else {
        setError(
          "孩子已超過本檢測適用年齡（未滿 7 歲）。若您對孩子的發展或學習有疑慮，建議直接諮詢專業醫療人員。"
        );
      }
      return;
    }
    setAge(a);
    setQuestionnaire(q);
    setAnswers({});
    setIdx(0);
    setAnimKey((k) => k + 1);
    setStage("quiz");
    window.scrollTo({ top: 0 });
  }

  function answer(val: boolean) {
    if (!questionnaire) return;
    const q = questionnaire.questions[idx];
    setAnswers((prev) => ({ ...prev, [q.id]: val }));
    if (idx + 1 < questionnaire.questions.length) {
      setIdx(idx + 1);
      setAnimKey((k) => k + 1);
    } else {
      setStage("result");
      window.scrollTo({ top: 0 });
    }
  }

  function back() {
    if (idx > 0) {
      setIdx(idx - 1);
      setAnimKey((k) => k + 1);
    } else {
      setStage("intro");
    }
  }

  function restart() {
    setStage("intro");
    setAnswers({});
    setIdx(0);
  }

  return (
    <div ref={containerRef}>
      <StepLiveRegion message={announcement} />
      {stage === "intro" && (
        <IntroStage
          birthDate={birthDate}
          setBirthDate={setBirthDate}
          isPreterm={isPreterm}
          setIsPreterm={setIsPreterm}
          weeks={weeks}
          setWeeks={setWeeks}
          error={error}
          onStart={startQuiz}
          onExit={onExit}
        />
      )}
      {stage === "quiz" && questionnaire && age && (
        <QuizStage
          questionnaire={questionnaire}
          age={age}
          idx={idx}
          animKey={animKey}
          answers={answers}
          onAnswer={answer}
          onBack={back}
        />
      )}
      {stage === "result" && result && questionnaire && age && (
        <ResultStage
          result={result}
          questionnaire={questionnaire}
          age={age}
          onRestart={restart}
        />
      )}
    </div>
  );
}

/* ---------------- Stage 1: 生日輸入（D6：左圖右卡） ---------------- */
function IntroStage(props: {
  birthDate: string;
  setBirthDate: (v: string) => void;
  isPreterm: boolean;
  setIsPreterm: (v: boolean) => void;
  weeks: string;
  setWeeks: (v: string) => void;
  error: string;
  onStart: () => void;
  onExit: () => void;
}) {
  return (
    <section className="container py-10 md:py-14">
      <div className="mx-auto w-full max-w-4xl">
        <button
          onClick={props.onExit}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> 回到說明頁
        </button>
        <div className="grid items-center gap-8 md:grid-cols-[5fr_6fr] md:gap-10">
          {/* 左側插圖（手機版為頂部橫幅） */}
          <div className="order-1 md:order-none">
            <img
              src={ILLUS.birthday}
              alt="媽媽抱著寶寶一起看日曆的溫暖插圖"
              className="w-full rounded-3xl object-cover shadow-sm md:-rotate-2"
              loading="eager"
            />
            <p className="mt-4 hidden text-center text-sm leading-relaxed text-muted-foreground md:block">
              每個孩子都有自己的成長步調，
              <br />
              我們陪您一起看見他的樣子。
            </p>
          </div>
          {/* 右側卡片：品牌色頂邊＋柔和陰影 */}
          <div
            className="overflow-hidden rounded-3xl border-t-4 border-primary bg-card p-8 md:p-10"
            style={{ boxShadow: "0 8px 32px rgba(14,124,107,0.10)" }}
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-bold tracking-wide text-primary">
                STEP 1 / 3・孩子的生日
              </span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                <span className="block h-full w-1/3 rounded-full bg-primary/70" />
              </span>
            </div>
            <h1 data-step-heading tabIndex={-1} className="text-2xl font-bold text-foreground">
              先告訴我們孩子的生日
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              系統會自動計算實足年齡，載入最適合的年齡題組。作答內容僅在您的瀏覽器中運算。
            </p>

            <div className="mt-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <p className="text-xs text-primary">
                  請放心，這一步只是為了幫孩子挑對題組。
                </p>
                <Label htmlFor="birth" className="font-medium">
                  出生年月日
                </Label>
                <Input
                  id="birth"
                  type="date"
                  value={props.birthDate}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => props.setBirthDate(e.target.value)}
                  className="h-14 rounded-xl border-primary/25 bg-secondary/40 text-base focus-visible:border-primary focus-visible:ring-primary/30"
                />
                <p className="text-xs text-muted-foreground">
                  例如：2024 年 7 月 1 日。點選欄位右側圖示可開啟日曆選擇。
                </p>
              </div>

              <div className="rounded-2xl bg-[#E6F2EF]/80 p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <Checkbox
                    checked={props.isPreterm}
                    onCheckedChange={(v) => props.setIsPreterm(v === true)}
                    className="mt-0.5"
                  />
                  <span className="text-sm leading-relaxed">
                    <span className="font-medium text-foreground">
                      孩子是早產兒（未滿 37 週出生）
                    </span>
                    <br />
                    <span className="text-muted-foreground">
                      未滿 2 歲的早產寶寶，系統會自動以「矯正年齡」評估，更貼近孩子的真實發展狀態。
                    </span>
                  </span>
                </label>
                {props.isPreterm && (
                  <div className="mt-4 flex flex-col gap-2">
                    <Label htmlFor="weeks" className="text-sm">
                      出生時的懷孕週數
                    </Label>
                    <Input
                      id="weeks"
                      type="number"
                      inputMode="numeric"
                      placeholder="例如：34"
                      min={20}
                      max={42}
                      value={props.weeks}
                      onChange={(e) => props.setWeeks(e.target.value)}
                      className="h-11 max-w-[10rem] rounded-xl"
                    />
                  </div>
                )}
              </div>

              {props.error && (
                <div role="alert" aria-live="assertive" className="flex items-start gap-2.5 rounded-xl bg-destructive/10 p-4 text-sm leading-relaxed text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {props.error}
                </div>
              )}

              <Button
                onClick={props.onStart}
                className="h-13 rounded-full py-6 text-base font-bold shadow-md transition-all hover:opacity-90 active:scale-[0.97]"
              >
                下一步：開始作答
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 px-2">
          <Disclaimer />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Stage 2: 逐題作答（D7：色帶＋icon＋大按鈕＋鼓勵語＋角落裝飾） ---------------- */
function QuizStage(props: {
  questionnaire: Questionnaire;
  age: AgeResult;
  idx: number;
  animKey: number;
  answers: Record<string, boolean>;
  onAnswer: (v: boolean) => void;
  onBack: () => void;
}) {
  const { questionnaire, age, idx, animKey, answers, onAnswer, onBack } = props;
  const q = questionnaire.questions[idx];
  const total = questionnaire.questions.length;
  const meta = CATEGORY_META[q.category];
  const CatIcon = CATEGORY_ICON[q.category as keyof typeof CATEGORY_ICON];
  const prevAnswer = answers[q.id];
  const halfway = idx + 1 === Math.ceil(total / 2);

  return (
    <section className="container relative flex justify-center overflow-hidden py-10 md:py-14">
      {/* 右下角淡水彩裝飾（嵌入版用 absolute，不蓋到站台頁尾） */}
      <img
        src={ILLUS.quizCorner}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 z-0 hidden w-[280px] opacity-50 md:block"
      />
      <div className="relative z-10 w-full max-w-xl">
        {/* 頂部資訊 + 進度 */}
        <div className="mb-6 flex items-center justify-between text-sm">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> 上一題
          </button>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary">
            {age.displayAge}題組{age.corrected && "（矯正年齡）"}・第 {idx + 1} / {total} 題
          </span>
        </div>
        <div className="mb-2 h-2.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${((idx + 1) / total) * 100}%` }}
            role="progressbar"
            aria-label="兒童發展檢測作答進度"
            aria-valuemin={1}
            aria-valuemax={total}
            aria-valuenow={idx + 1}
          />
        </div>
        {halfway ? (
          <p className="mb-6 text-center text-xs font-medium text-primary">
            已經一半了，孩子的樣子越來越清楚囉
          </p>
        ) : (
          <div className="mb-6" />
        )}

        {/* 題目卡片 */}
        <div
          key={animKey}
          className="quiz-card-enter overflow-hidden rounded-3xl bg-card shadow-sm"
        >
          {/* 面向色帶 */}
          <div className="h-2" style={{ backgroundColor: meta.color }} />
          <div className="p-8 md:p-10">
            <span
              className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold"
              style={{ backgroundColor: meta.bg, color: meta.color }}
            >
              {CatIcon && <CatIcon className="h-3.5 w-3.5" />}
              {q.category}
            </span>
            <h2 data-step-heading tabIndex={-1} className="text-xl font-bold leading-relaxed text-foreground md:text-2xl">
              {q.text}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              依照您平時的觀察回答就好，沒有標準答案的壓力。
            </p>

            <div className="mt-9 grid grid-cols-2 gap-4">
              <button
                onClick={() => onAnswer(true)}
                aria-pressed={prevAnswer === true}
                className={`flex min-h-24 flex-col items-center justify-center gap-1.5 rounded-2xl border-2 text-lg font-bold transition-all duration-150 hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-[0.97] ${
                  prevAnswer === true
                    ? "border-primary bg-primary text-primary-foreground shadow-md"
                    : "border-primary/30 bg-background text-foreground"
                }`}
              >
                <Check className="h-6 w-6" />
                是
                {prevAnswer === true && (
                  <span className="text-xs underline underline-offset-2">已選擇</span>
                )}
              </button>
              <button
                onClick={() => onAnswer(false)}
                aria-pressed={prevAnswer === false}
                className={`flex min-h-24 flex-col items-center justify-center gap-1.5 rounded-2xl border-2 text-lg font-bold transition-all duration-150 hover:border-[#8A8578] hover:bg-[#8A8578] hover:text-white active:scale-[0.97] ${
                  prevAnswer === false
                    ? "border-[#8A8578] bg-[#8A8578] text-white shadow-md"
                    : "border-border bg-background text-foreground"
                }`}
              >
                <X className="h-6 w-6" />
                否
                {prevAnswer === false && (
                  <span className="text-xs underline underline-offset-2">已選擇</span>
                )}
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          這不是考試，沒有對錯——點選答案後會自動前往下一題，也可以隨時回到上一題修改。
          <br />
          本檢核僅供參考，不能取代醫師診斷。
        </p>
      </div>
    </section>
  );
}

/* ---------------- Stage 3: 結果頁（D9/D10/D11/D12/D13/D14） ---------------- */
const LIGHT_META = {
  green: {
    label: "發展符合年齡",
    icon: Sparkles,
    color: "#0C7464",
    bg: "#E6F2EF",
    headline: "太好了！孩子目前的發展與年齡相符",
    body: "本次檢核的項目孩子都達到了對應年齡的發展里程碑。每個階段的發展重點不同，建議您每 2～3 個月回來做一次檢核，持續陪伴孩子成長。",
  },
  amber: {
    label: "建議持續觀察",
    icon: Eye,
    color: "#8A5A10",
    bg: "#FBF3E4",
    headline: "大致符合年齡，有一個項目值得多觀察",
    body: "孩子大部分的發展都達到了年齡標準，只有一個項目尚未通過。這不一定代表有問題——有些能力只是還沒被引導出來。建議您在日常中多提供練習機會，並於 1～2 個月後再次檢核；若仍未通過，或您有其他疑慮，歡迎諮詢專業醫師。",
  },
  red: {
    label: "建議進一步評估",
    icon: AlertCircle,
    color: "#A84536",
    bg: "#FCEBE8",
    headline: "有幾個項目值得請專業人員看看",
    body: "本次檢核中有部分重要項目尚未通過。請先別過度擔心——這只是初步的參考結果，不代表孩子一定有發展問題，但確實值得請專業醫師進一步了解。3 歲前是大腦發展的黃金期，早一步了解，就是給孩子多一層守護。",
  },
} as const;

function ResultStage(props: {
  result: ScreeningResult;
  questionnaire: Questionnaire;
  age: AgeResult;
  onRestart: () => void;
}) {
  const { result, questionnaire, age, onRestart } = props;
  const lm = LIGHT_META[result.light];
  const Icon = lm.icon;
  const articles = recommendArticles(
    result.concernedCategories,
    age.effectiveMonths,
    result.light
  );
  const resultIllus =
    result.light === "green" ? ILLUS.resultCelebrate : ILLUS.resultSupport;
  const resultIllusAlt =
    result.light === "green"
      ? "孩子開心跳躍、爸媽拍手慶祝的水彩插圖"
      : "醫師蹲下與孩子溫柔互動的水彩插圖";

  return (
    <section className="container flex justify-center py-10 md:py-14">
      <div className="w-full max-w-2xl">
        <p className="mb-2 text-center text-xs font-medium tracking-wide text-primary print:hidden">
          STEP 3 / 3・檢核結果
        </p>

        {/* 結果總覽：上圖下文＋燈號徽章＋左對齊（D9/D13） */}
        <div
          id="result-card"
          className="relative overflow-hidden rounded-3xl shadow-sm"
          style={{ backgroundColor: lm.bg }}
        >
          <div
            className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full"
            style={{ backgroundColor: lm.color, opacity: 0.08 }}
          />
          <img
            src={resultIllus}
            alt={resultIllusAlt}
            className="h-48 w-full object-cover md:h-60"
          />
          <div className="p-8 md:p-10">
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold text-white"
              style={{ backgroundColor: lm.color }}
            >
              <Icon className="h-4 w-4" />
              {lm.label}
            </span>
            <h1 data-step-heading tabIndex={-1} className="mt-4 text-xl font-bold leading-relaxed text-foreground md:text-2xl">
              {lm.headline}
            </h1>
            <p
              className="mt-3 text-sm leading-relaxed text-foreground/75"
              style={{ maxWidth: "34em" }}
            >
              {lm.body}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-foreground/70">
                受測年齡：{age.displayAge}
                {age.corrected && "（已套用早產矯正年齡）"}
              </span>
              <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-foreground/70">
                使用題組：{questionnaire.ageGroup}
              </span>
            </div>
          </div>
        </div>

        {/* 四面向分析（D10：語意制配色——全過墨綠、含未過琥珀；未過題目小卡） */}
        <div id="result-analysis" className="mt-8 rounded-3xl bg-card p-7 shadow-sm md:p-8">
          <h2 className="text-lg font-bold text-foreground">四大面向分析</h2>
          <div className="mt-5 flex flex-col gap-5">
            {result.categories.map((c) => {
              const meta = CATEGORY_META[c.category];
              const pct = Math.round((c.passed / c.total) * 100);
              const failed = c.failedQuestions.length > 0;
              const barColor = failed ? "#8A5A10" : "#0C7464";
              return (
                <div key={c.category}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-2 font-bold text-foreground">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: meta.color }}
                      />
                      {c.category}
                      {c.failedWarning && (
                        <span className="rounded-full bg-[#FBF3E4] px-2 py-0.5 text-[11px] font-medium text-[#7A4D0A]">
                          含重點觀察項目
                        </span>
                      )}
                    </span>
                    <span className="text-muted-foreground">
                      通過 {c.passed} / {c.total} 題
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${pct}%`, backgroundColor: barColor }}
                    />
                  </div>
                  {failed && (
                    <ul className="mt-2.5 flex flex-col gap-2">
                      {c.failedQuestions.map((fq) => (
                        <li
                          key={fq.id}
                          className="flex items-start gap-2 rounded-xl bg-[#FBF3E4]/70 px-3.5 py-2.5 text-xs leading-relaxed text-foreground/75"
                        >
                          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8A5A10]" />
                          {fq.text}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 導流 CTA：左文右圖（D11）＋列印（D12） */}
        <div className="mt-8 overflow-hidden rounded-3xl bg-primary text-primary-foreground shadow-md print:hidden">
          <div className="grid md:grid-cols-[3fr_2fr]">
            <div className="p-8 md:p-10">
              <h2 className="text-xl font-bold">
                {result.light === "green"
                  ? "想更全面了解孩子的發展？"
                  : "讓專業團隊陪您一起看看"}
              </h2>
              <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-primary-foreground/85">
                {result.light === "green"
                  ? "樂智康醫學北桃竹 10 間院所提供兒童發展相關醫療服務，歡迎就近諮詢，讓專業團隊陪伴孩子每個成長階段。"
                  : "自我檢核只是第一步。樂智康醫學北桃竹 10 間院所提供兒童發展相關醫療服務，建議您攜帶兒童健康手冊與本次結果，就近諮詢專業醫師。"}
              </p>
              <p className="mt-3 text-xs text-primary-foreground">
                台北 6 間・桃園 1 間・新竹 3 間
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={locUrl(`kids-result-${result.light}`)}
                  className="inline-flex items-center gap-2 rounded-full bg-card px-7 py-3 text-sm font-bold text-primary shadow-sm transition-all hover:opacity-90 active:scale-[0.97]"
                >
                  <MapPin className="h-4 w-4" />
                  {result.light === "green"
                    ? "查看北桃竹院所資訊"
                    : "查看院所・就近諮詢"}
                </a>
                <button
                  onClick={onRestart}
                  className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/40 px-7 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary-foreground/10 active:scale-[0.97]"
                >
                  <RotateCcw className="h-4 w-4" />
                  重新檢測
                </button>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/40 px-7 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary-foreground/10 active:scale-[0.97]"
                >
                  <Printer className="h-4 w-4" />
                  列印／儲存結果
                </button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <img
                src={ILLUS.ctaTeam}
                alt="樂智康醫療團隊插圖"
                className="h-full w-full object-cover"
              />
              <div
                className="absolute inset-y-0 left-0 w-16"
                style={{
                  background: "linear-gradient(to right, var(--primary), transparent)",
                }}
              />
            </div>
          </div>
        </div>

        {/* 衛教文章推薦（D14：面向色頂條＋hover 動效） */}
        {articles.length > 0 && (
          <div className="mt-8 print:hidden">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
              <BookOpen className="h-5 w-5 text-primary" />
              為您挑選的衛教文章
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {articles.map((a) => {
                const topColor = a.code.startsWith("T")
                  ? "#8A5A10"
                  : (CATEGORY_META[
                      (a as { category?: string }).category as keyof typeof CATEGORY_META
                    ]?.color ?? "#0C7464");
                return (
                  <a
                    key={a.code}
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="h-1" style={{ backgroundColor: topColor }} />
                    <div className="p-5">
                      <h3 className="text-sm font-bold leading-snug text-foreground group-hover:text-primary">
                        {a.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                        {a.description}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                        閱讀文章{" "}
                        <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              更多衛教內容請見{" "}
              <a
                href={BLOG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                樂智康衛教專區
              </a>
            </p>
          </div>
        )}

        <div className="mt-10 rounded-2xl bg-secondary/60 p-5 print:hidden">
          <Disclaimer />
        </div>
      </div>
    </section>
  );
}
