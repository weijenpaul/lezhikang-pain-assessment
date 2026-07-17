/**
 * 樂智康疼痛自我評估系統 — 主頁
 * Style: Clinical Serenity — 瑞士排版 × 現代醫療編輯設計
 * 白底大量留白、青綠 #009B8D 唯一強調色、單題單屏、雙欄不對稱結構
 */
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  MessageCircle,
  RotateCcw,
  Stethoscope,
} from "lucide-react";
import BodyMap from "@/components/BodyMap";
import {
  RED_FLAGS,
  Region,
  articleUrl,
  getQuestion,
  getRegion,
  lineUrl,
  regions,
  results,
} from "@/lib/decisionTree";

// ★ 交班設定：logo 與人體圖同放一個資料夾，路徑對應 BodyMap.tsx 的 ASSET_BASE
const LOGO = "https://cdn.jsdelivr.net/gh/weijenpaul/lezhikang-pain-assessment@v1/assets/pain/logo-horizontal-medical.png";

type Step =
  | { stage: "intro" }
  | { stage: "region" }
  | { stage: "guide"; guideId: string }
  | { stage: "redflag"; regionId: string }
  | { stage: "redflag-warning"; regionId: string }
  | { stage: "question"; regionId: string; questionId: string; history: string[] }
  | { stage: "result"; regionId: string; resultId: string };

/** 頂部進度：intro=0, region=1, redflag=2, question=3, result=4 */
function stageIndex(step: Step): number {
  switch (step.stage) {
    case "intro":
      return 0;
    case "region":
    case "guide":
      return 1;
    case "redflag":
    case "redflag-warning":
      return 2;
    case "question":
      return 3;
    case "result":
      return 4;
  }
}

const STEP_LABELS = ["開始", "指出部位", "安全確認", "描述感覺", "評估結果"];

function SectionMark({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-block w-6 h-[3px] bg-[#009B8D] rounded-full" />
      <span className="text-sm font-semibold tracking-widest text-[#009B8D]">{children}</span>
    </div>
  );
}

export default function Home() {
  const [step, setStep] = useState<Step>({ stage: "intro" });
  const [animKey, setAnimKey] = useState(0);

  const go = (next: Step) => {
    setStep(next);
    setAnimKey((k) => k + 1);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [animKey]);

  const progress = (stageIndex(step) / 4) * 100;

  /** BodyMap 熱區 id → 流程分派：骨科區映射至 6 大 region，非骨科區進 guide */
  const dispatchZone = (zoneId: string) => {
    const mapped =
      zoneId === "pelvis-thigh-front"
        ? "pelvis-thigh"
        : zoneId === "knee-back"
          ? "knee"
          : zoneId;
    if (mapped === "head-face" || mapped === "chest" || mapped === "abdomen") {
      go({ stage: "guide", guideId: mapped });
    } else {
      go({ stage: "redflag", regionId: mapped });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#2B3634]" style={{ fontFamily: "'Noto Sans TC', sans-serif" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-[#E4ECEA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="https://sharp-falcon-88717.zenbu.space" aria-label="樂智康醫學首頁">
            <img src={LOGO} alt="樂智康醫學" className="h-10 sm:h-11 w-auto" />
          </a>
          <div className="flex items-center gap-5">
            <span className="hidden sm:inline text-[11px] tracking-[0.18em] text-[#9AA8A5] font-medium">
              疼痛自我評估
            </span>
            <a
              href={lineUrl("pain-header")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#009B8D] hover:text-[#007A6E] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              LINE 預約
            </a>
          </div>
        </div>
        {/* 進度軌：細青綠線，從首屏即可見 */}
        <div className="h-[2px] bg-[#EDF3F1]">
          <div
            className="h-full bg-[#009B8D] transition-all duration-500 ease-out"
            style={{ width: `${Math.max(progress, 4)}%` }}
          />
        </div>
      </header>

      {/* 步驟指示 */}
      {step.stage !== "intro" && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-5">
          <ol className="flex items-center gap-1 text-[11px] sm:text-xs text-[#9AA8A5] flex-wrap">
            {STEP_LABELS.map((label, i) => (
              <li key={label} className="flex items-center gap-1">
                <span
                  className={
                    i <= stageIndex(step)
                      ? "text-[#009B8D] font-semibold"
                      : ""
                  }
                >
                  {label}
                </span>
                {i < STEP_LABELS.length - 1 && (
                  <ChevronRight className="w-3 h-3 opacity-50" />
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      <main key={animKey} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {step.stage === "intro" && <Intro onStart={() => go({ stage: "region" })} />}

        {step.stage === "region" && (
          <RegionSelect
            onSelect={dispatchZone}
            onBack={() => go({ stage: "intro" })}
          />
        )}

        {step.stage === "guide" && (
          <GuidePage
            guideId={step.guideId}
            onBack={() => go({ stage: "region" })}
          />
        )}

        {step.stage === "redflag" && (
          <RedFlagCheck
            onSafe={() =>
              go({
                stage: "question",
                regionId: step.regionId,
                questionId: "q1",
                history: [],
              })
            }
            onWarning={() => go({ stage: "redflag-warning", regionId: step.regionId })}
            onBack={() => go({ stage: "region" })}
          />
        )}

        {step.stage === "redflag-warning" && (
          <RedFlagWarning onRestart={() => go({ stage: "intro" })} />
        )}

        {step.stage === "question" && (
          <QuestionFlow
            regionId={step.regionId}
            questionId={step.questionId}
            history={step.history}
            onAnswer={(next) => {
              if (next.startsWith("result_")) {
                go({ stage: "result", regionId: step.regionId, resultId: next });
              } else {
                go({
                  stage: "question",
                  regionId: step.regionId,
                  questionId: next,
                  history: [...step.history, step.questionId],
                });
              }
            }}
            onBack={() => {
              if (step.history.length > 0) {
                const prev = step.history[step.history.length - 1];
                go({
                  stage: "question",
                  regionId: step.regionId,
                  questionId: prev,
                  history: step.history.slice(0, -1),
                });
              } else {
                go({ stage: "redflag", regionId: step.regionId });
              }
            }}
          />
        )}

        {step.stage === "result" && (
          <ResultPage
            regionId={step.regionId}
            resultId={step.resultId}
            onRestart={() => go({ stage: "intro" })}
            onBackToQuestions={() =>
              go({ stage: "question", regionId: step.regionId, questionId: "q1", history: [] })
            }
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-[#E4ECEA] bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 text-center space-y-2">
          <p className="text-xs text-[#9AA8A5] leading-relaxed">
            本頁為衛教資訊與自我評估參考，不能取代醫師當面診斷。若症狀持續或加劇，請盡速就醫。
          </p>
          <p className="text-xs text-[#B8C4C1]">
            © 樂智康醫學 Wonderful Wisdom Wellness · 串起北桃竹 10 間復健科院所
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ============ 開始頁 ============ */
function Intro({ onStart }: { onStart: () => void }) {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-10">
      <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-center">
        <div className="space-y-7">
          <SectionMark>疼痛自我評估</SectionMark>
          <h1 className="text-[clamp(30px,5vw,46px)] font-black leading-[1.25] tracking-tight text-[#1F2D2A]">
            指給我們看，
            <br />
            哪裡在痛？
          </h1>
          <p className="text-[17px] leading-[1.9] text-[#4A4A4A] max-w-md">
            用 60 秒，點選疼痛的部位、描述你的感覺，我們幫你初步判斷「最可能是什麼問題」，並告訴你下一步該怎麼做。
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onStart}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#009B8D] text-white text-base font-bold hover:bg-[#007A6E] active:scale-[0.97] transition-all duration-150"
            >
              指出疼痛的位置
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
            <span className="inline-flex items-center gap-1.5 text-sm text-[#9AA8A5]">
              <Clock className="w-4 h-4" />
              約 60 秒 · 免填資料
            </span>
          </div>
          {/* 評估流程預告：進度語言從首屏可見 */}
          <ol className="flex items-center gap-0 pt-2 max-w-md">
            {["指出部位", "安全確認", "描述感覺", "評估結果"].map((s, i, arr) => (
              <li key={s} className="flex items-center flex-1 last:flex-none">
                <span className="flex flex-col items-start gap-1.5">
                  <span className="w-2 h-2 rounded-full border border-[#009B8D] bg-white" />
                  <span className="text-[11px] text-[#7A8886] whitespace-nowrap">{s}</span>
                </span>
                {i < arr.length - 1 && (
                  <span className="flex-1 h-px bg-[#CFE3E0] mx-2 -mt-5" />
                )}
              </li>
            ))}
          </ol>
          <div className="pt-2 grid grid-cols-3 gap-4 max-w-md">
            {[
              { n: "6", label: "疼痛部位" },
              { n: "41", label: "常見診斷" },
              { n: "10", label: "北桃竹院所" },
            ].map((s) => (
              <div key={s.label} className="border-l-2 border-[#E0F5F2] pl-3">
                <div
                  className="text-2xl font-bold text-[#009B8D]"
                  style={{ fontFamily: "'Montserrat','Noto Sans TC',sans-serif" }}
                >
                  {s.n}
                </div>
                <div className="text-xs text-[#7A8886] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="bg-white border border-[#E4ECEA] p-6 relative">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-[#009B8D] via-[#009B8D]/30 to-transparent" />
            <div className="flex items-baseline justify-between mb-3 px-1">
              <span className="text-[11px] tracking-[0.22em] font-semibold text-[#6B7C79]">樂智康疼痛地圖</span>
              <span className="text-[10px] tracking-wider text-[#B8C4C1]" style={{ fontFamily: "'Montserrat',sans-serif" }}>PAIN ATLAS</span>
            </div>
            <BodyMap onSelect={() => onStart()} />
          </div>
        </div>
      </div>
      <p className="mt-10 text-xs text-[#9AA8A5] max-w-lg leading-relaxed">
        本工具提供的是「自我評估參考」，並非正式醫療診斷。結果僅協助你理解可能的原因，實際診斷仍需由醫師當面評估。
      </p>
    </section>
  );
}

/* ============ 部位選擇 ============ */
function RegionSelect({
  onSelect,
  onBack,
}: {
  onSelect: (id: string) => void;
  onBack: () => void;
}) {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-10">
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-start">
        <div className="space-y-6 lg:sticky lg:top-28">
          <SectionMark>STEP 1</SectionMark>
          <h2 className="text-[clamp(24px,4vw,36px)] font-black leading-snug text-[#1F2D2A]">
            哪個部位在痛？
          </h2>
          <p className="text-[16px] leading-[1.85] text-[#4A4A4A]">
            直接點人體圖上的部位，或從右側清單選擇。不確定的話，選「最痛的那一區」就好。
          </p>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm text-[#9AA8A5] hover:text-[#009B8D] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            回上一步
          </button>
          <div className="hidden lg:block bg-white border border-[#E4ECEA] p-5 relative">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-[#009B8D] via-[#009B8D]/30 to-transparent" />
            <BodyMap onSelect={onSelect} />
          </div>
        </div>

        <div className="space-y-3">
          <div className="lg:hidden bg-white border border-[#E4ECEA] p-4 mb-5">
            <BodyMap onSelect={onSelect} />
          </div>
          {regions.map((r, i) => (
            <button
              key={r.id}
              onClick={() => onSelect(r.id)}
              className="w-full text-left bg-white border border-[#E4ECEA] border-l-2 border-l-transparent px-5 py-4 flex items-center justify-between gap-4 hover:border-l-[#009B8D] hover:border-[#BFDAD6] hover:bg-[#FBFDFD] active:scale-[0.995] transition-all duration-150 group"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div>
                <div className="font-bold text-[17px] text-[#1F2D2A] group-hover:text-[#009B8D] transition-colors">
                  {r.name}
                </div>
                <div className="text-sm text-[#7A8886] mt-0.5">{r.description}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#C4D2CF] group-hover:text-[#009B8D] group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ 非骨科區引導頁 ============ */
const GUIDE_INFO: Record<
  string,
  {
    title: string;
    lead: string;
    causes: string[];
    advice: { dept: string; when: string }[];
    note: string;
  }
> = {
  "head-face": {
    title: "頭部臉部疼痛",
    lead: "頭部與臉部的疼痛原因很多，從緊縮型頭痛、偏頭痛到鼻竇、牙齒、三叉神經問題都有可能，需要醫師當面鑑別。",
    causes: [
      "緊縮型頭痛、偏頭痛",
      "頸因性頭痛（從肩頸延伸上來的疼痛）",
      "鼻竇炎、牙科問題、顳顎關節障礙",
    ],
    advice: [
      { dept: "神經內科", when: "反覆頭痛、單側搏動性疼痛、伴隨噁心畏光" },
      { dept: "復健科", when: "頭痛伴隨肩頸痠痛僵硬、低頭工作後加劇" },
      { dept: "耳鼻喉科／牙科", when: "伴隨鼻塞、臉頰壓痛或牙齒疼痛" },
    ],
    note: "小提醒：如果你的頭痛是從「肩頸痠痛」延伸上來的，可以回到上一步選「肩頸肩膀」，完成評估看看是不是頸因性頭痛。",
  },
  chest: {
    title: "胸部疼痛",
    lead: "胸痛需要先排除心臟與肺部的問題，這不適合用自我評估工具判斷，建議優先就醫確認。",
    causes: [
      "心臟、肺部等內科問題（需優先排除）",
      "肋間神經痛、肋軟骨炎",
      "胸壁肌肉拉傷（多半有明確用力或撞擊史）",
    ],
    advice: [
      { dept: "急診／心臟內科", when: "胸悶壓迫感、冒冷汗、疼痛向左臂或下巴擴散 — 請立即就醫" },
      { dept: "胸腔內科", when: "伴隨咳嗽、呼吸時疼痛加劇" },
      { dept: "復健科", when: "確定是碰撞或用力後的胸壁疼痛，壓了會痛" },
    ],
    note: "安全第一：只要胸痛原因不明確，請先當作內科問題處理，盡快就醫。",
  },
  abdomen: {
    title: "腹部疼痛",
    lead: "肚子痛屬於腸胃、泌尿或婦科範疇，不是骨科／復健科的評估範圍，建議直接就醫確認。",
    causes: [
      "腸胃問題（胃炎、腸絞痛、便秘等）",
      "泌尿道問題（結石、感染）",
      "婦科問題（經痛、卵巢囊腫等）",
    ],
    advice: [
      { dept: "腸胃肝膽科", when: "上腹痛、伴隨噁心、食欲不振" },
      { dept: "泌尿科", when: "單側腰腹絞痛、解尿灼熱或血尿" },
      { dept: "婦產科", when: "下腹痛與月經週期相關" },
    ],
    note: "小提醒：如果疼痛其實在「腰部後方」，可以回到上一步切換背面選「腰背部」進行評估。",
  },
};

function GuidePage({ guideId, onBack }: { guideId: string; onBack: () => void }) {
  const info = GUIDE_INFO[guideId];
  if (!info) return null;
  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-10">
      <div className="space-y-6">
        <SectionMark>就醫指引</SectionMark>
        <h2 className="text-[clamp(24px,4vw,34px)] font-black leading-snug text-[#1F2D2A]">
          {info.title}：這不在骨科評估範圍，但我們告訴你下一步
        </h2>
        <p className="text-[16px] leading-[1.85] text-[#4A4A4A]">{info.lead}</p>

        <div className="bg-white border border-[#E4ECEA] p-6 space-y-3">
          <div className="text-sm font-bold tracking-wide text-[#6B7C79]">常見的可能原因</div>
          <ul className="space-y-2">
            {info.causes.map((c) => (
              <li key={c} className="flex items-start gap-2.5 text-[15px] text-[#4A4A4A] leading-relaxed">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#009B8D] shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-[#E4ECEA] p-6 space-y-4">
          <div className="text-sm font-bold tracking-wide text-[#6B7C79]">建議的就醫科別</div>
          <div className="space-y-3">
            {info.advice.map((a) => (
              <div key={a.dept} className="flex items-start gap-3 border-l-2 border-[#E0F5F2] pl-4 py-1">
                <Stethoscope className="w-4.5 h-4.5 text-[#009B8D] mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-[15px] text-[#1F2D2A]">{a.dept}</div>
                  <div className="text-sm text-[#7A8886] mt-0.5 leading-relaxed">{a.when}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#F4FAF9] border border-[#D4E7E4] p-5 text-[14px] leading-relaxed text-[#4A6360]">
          {info.note}
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <a
            href={lineUrl(`guide-${guideId}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#009B8D] text-white font-bold hover:bg-[#007A6E] active:scale-[0.97] transition-all duration-150"
          >
            <MessageCircle className="w-4.5 h-4.5" />
            不確定怎麼辦？LINE 問我們
          </a>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#D4E7E4] text-[#4A6360] font-medium hover:border-[#009B8D] hover:text-[#009B8D] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            回到部位選擇
          </button>
        </div>
      </div>
    </section>
  );
}

/* ============ 紅旗篩查 ============ */
function RedFlagCheck({
  onSafe,
  onWarning,
  onBack,
}: {
  onSafe: () => void;
  onWarning: () => void;
  onBack: () => void;
}) {
  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-10">
      <div className="space-y-6">
        <SectionMark>STEP 2 · 安全確認</SectionMark>
        <h2 className="text-[clamp(24px,4vw,34px)] font-black leading-snug text-[#1F2D2A]">
          先確認一件重要的事
        </h2>
        <p className="text-[16px] leading-[1.85] text-[#4A4A4A]">
          以下是需要「盡快就醫、不適合自我評估」的警訊。請問你目前有沒有下列任何一種情況？
        </p>

        <div className="bg-white border border-[#F0D9D4] border-l-2 border-l-[#D9634E] p-6 space-y-3.5">
          {RED_FLAGS.map((flag) => (
            <div key={flag} className="flex items-start gap-3">
              <AlertTriangle className="w-4.5 h-4.5 text-[#D9634E] mt-0.5 shrink-0" />
              <span className="text-[15px] leading-relaxed text-[#4A4A4A]">{flag}</span>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={onSafe}
            className="px-6 py-4 bg-[#009B8D] text-white font-bold text-base hover:bg-[#007A6E] active:scale-[0.98] transition-all duration-150"
          >
            都沒有，繼續評估
          </button>
          <button
            onClick={onWarning}
            className="px-6 py-4 bg-white border border-[#D9634E] text-[#D9634E] font-bold text-base hover:bg-[#FDF5F3] active:scale-[0.98] transition-all duration-150"
          >
            有其中一項
          </button>
        </div>

        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-[#9AA8A5] hover:text-[#009B8D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          回上一步
        </button>
      </div>
    </section>
  );
}

/* ============ 紅旗警示頁 ============ */
function RedFlagWarning({ onRestart }: { onRestart: () => void }) {
  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-10">
      <div className="bg-white border border-[#F0D9D4] border-t-2 border-t-[#D9634E] p-8 space-y-5 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-[#FDF0ED] flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-[#D9634E]" />
        </div>
        <h2 className="text-2xl font-black text-[#1F2D2A]">請盡快就醫，不要等</h2>
        <p className="text-[16px] leading-[1.9] text-[#4A4A4A] text-left">
          你勾選的情況屬於醫療上的「危險警訊」，可能代表神經受到嚴重壓迫、感染或其他需要立即處理的問題。這已經超出自我評估的範圍——請直接前往醫院就診，或立即聯繫我們安排優先看診。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <a
            href={lineUrl("pain-redflag")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#D9634E] text-white font-bold hover:bg-[#C4523E] active:scale-[0.98] transition-all"
          >
            <MessageCircle className="w-4.5 h-4.5" />
            LINE 聯繫，安排優先看診
          </a>
          <button
            onClick={onRestart}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-[#E4ECEA] text-[#4A4A4A] font-medium hover:border-[#009B8D] hover:text-[#009B8D] transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            重新評估
          </button>
        </div>
      </div>
    </section>
  );
}

/* ============ 問答流程 ============ */
function QuestionFlow({
  regionId,
  questionId,
  history,
  onAnswer,
  onBack,
}: {
  regionId: string;
  questionId: string;
  history: string[];
  onAnswer: (next: string) => void;
  onBack: () => void;
}) {
  const region = getRegion(regionId) as Region;
  const question = getQuestion(region, questionId);
  if (!question) return null;

  const qNumber = history.length + 1;

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-10">
      <div className="space-y-7">
        <div className="flex items-center justify-between">
          <SectionMark>
            STEP 3 · {region.name} · 第 {qNumber} 題
          </SectionMark>
        </div>

        <h2 className="text-[clamp(22px,3.6vw,32px)] font-black leading-snug text-[#1F2D2A]">
          {question.text}
        </h2>
        {question.subtext && (
          <p className="text-[15px] text-[#7A8886] leading-relaxed -mt-3">{question.subtext}</p>
        )}

        <div className="space-y-3">
          {question.options.map((opt, i) => (
            <button
              key={opt.text}
              onClick={() => onAnswer(opt.next)}
              className="w-full text-left bg-white border border-[#E4ECEA] border-l-2 border-l-transparent px-5 py-4 flex items-center justify-between gap-4 hover:border-l-[#009B8D] hover:border-[#BFDAD6] hover:bg-[#FBFDFD] active:scale-[0.995] transition-all duration-150 group"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div>
                <span className="text-[16px] font-medium text-[#2B3634] leading-relaxed group-hover:text-[#00776C] transition-colors">
                  {opt.text}
                </span>
                {opt.hint && (
                  <div className="text-[13px] text-[#9AA8A5] mt-1">{opt.hint}</div>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-[#C4D2CF] group-hover:text-[#009B8D] group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>

        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-[#9AA8A5] hover:text-[#009B8D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          回上一步
        </button>
      </div>
    </section>
  );
}

/* ============ 結果頁 ============ */
function ResultPage({
  regionId,
  resultId,
  onRestart,
  onBackToQuestions,
}: {
  regionId: string;
  resultId: string;
  onRestart: () => void;
  onBackToQuestions: () => void;
}) {
  const region = getRegion(regionId) as Region;
  const result = results[resultId];
  if (!result) return null;

  /** 同部位的其他可能（最多 3 個） */
  const related = useMemo(
    () =>
      Object.entries(results)
        .filter(([id, r]) => r.regionId === regionId && id !== resultId)
        .slice(0, 3),
    [regionId, resultId]
  );

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-10">
      <div className="space-y-8">
        <div className="space-y-5">
          <SectionMark>評估結果</SectionMark>
          <div className="inline-flex items-center gap-2 text-sm text-[#7A8886]">
            <CheckCircle2 className="w-4 h-4 text-[#009B8D]" />
            根據你的描述，你的狀況最可能是——
          </div>
          <h2 className="text-[clamp(28px,5vw,42px)] font-black leading-tight text-[#1F2D2A]">
            {result.name}
          </h2>
          {result.englishName && (
            <p
              className="text-sm tracking-wide text-[#9AA8A5] -mt-2"
              style={{ fontFamily: "'Montserrat',sans-serif" }}
            >
              {result.englishName}
            </p>
          )}
        </div>

        {/* 說明 */}
        <div className="bg-white border border-[#E4ECEA] border-l-2 border-l-[#009B8D] p-6 sm:p-7">
          <div className="flex items-start gap-3">
            <Stethoscope className="w-5 h-5 text-[#009B8D] mt-1 shrink-0" />
            <p className="text-[16px] leading-[1.95] text-[#4A4A4A]">{result.summary}</p>
          </div>
        </div>

        {/* 衛教文章 CTA */}
        {result.hasArticle ? (
          <a
            href={articleUrl(result.slug)}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-[#F0FAF8] border border-[#B5E3DC] p-6 sm:p-7 hover:border-[#009B8D] hover:bg-[#E7F7F4] active:scale-[0.995] transition-all duration-150 group"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-[#007A6E] mt-1 shrink-0" />
                <div>
                  <div className="font-bold text-[17px] text-[#00544C]">
                    深入了解：{result.name}
                  </div>
                  <div className="text-sm text-[#3E7A72] mt-1 leading-relaxed">
                    完整的成因、症狀、治療選項與居家自救方法，都整理在這篇衛教文章裡。
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[#007A6E] group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          </a>
        ) : (
          <div className="bg-[#F5F8F7] border border-[#E0E9E7] p-6 sm:p-7">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-[#9AA8A5] mt-1 shrink-0" />
              <div>
                <div className="font-bold text-[16px] text-[#4A4A4A]">
                  這個主題的完整衛教文章即將上線
                </div>
                <div className="text-sm text-[#7A8886] mt-1 leading-relaxed">
                  想先了解自己的狀況？直接用 LINE 描述你的症狀，讓醫師為你說明。
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LINE 預約 CTA */}
        <div className="bg-[#1F2D2A] p-7 sm:p-8 space-y-4 relative">
          <div className="absolute top-0 left-0 w-16 h-[3px] bg-[#009B8D]" />
          <h3 className="text-xl font-bold text-white leading-snug">
            看完還是不確定？不用自己當醫師。
          </h3>
          <p className="text-[15px] leading-[1.85] text-[#B8CFCB]">
            自我評估只是第一步。描述你的感覺，讓醫師用超音波看清楚問題在哪——樂智康在北桃竹有
            10 間復健科院所，離你最近的那間就能安排。
          </p>
          <a
            href={lineUrl(region.lineCampaign)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#009B8D] text-white font-bold hover:bg-[#00B3A3] active:scale-[0.97] transition-all duration-150"
          >
            <MessageCircle className="w-4.5 h-4.5" />
            LINE 預約，找離你最近的院所
          </a>
        </div>

        {/* 其他可能 */}
        {related.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[#7A8886]">
              覺得不太像？{region.name}也常見這些問題：
            </p>
            <div className="grid sm:grid-cols-3 gap-2.5">
              {related.map(([id, r]) =>
                r.hasArticle ? (
                  <a
                    key={id}
                    href={articleUrl(r.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white border border-[#E4ECEA] px-4 py-3 text-sm font-medium text-[#4A4A4A] hover:border-[#009B8D] hover:text-[#009B8D] transition-all"
                  >
                    {r.name}
                  </a>
                ) : (
                  <span
                    key={id}
                    className="bg-white border border-[#E4ECEA] px-4 py-3 text-sm text-[#9AA8A5]"
                  >
                    {r.name}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {/* 免責 + 重新評估 */}
        <div className="border-t border-[#E4ECEA] pt-6 space-y-4">
          <p className="text-xs leading-relaxed text-[#9AA8A5]">
            此結果為根據你的描述所做的「自我評估參考」，並非正式醫療診斷。相同的症狀可能由不同的原因造成，實際診斷需由醫師當面理學檢查與影像評估確認。
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={onBackToQuestions}
              className="inline-flex items-center gap-1.5 text-sm text-[#7A8886] hover:text-[#009B8D] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              重新回答這個部位
            </button>
            <button
              onClick={onRestart}
              className="inline-flex items-center gap-1.5 text-sm text-[#7A8886] hover:text-[#009B8D] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              評估其他部位
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
