/**
 * Style: Clinical Serenity — AI 生成醫療級人體插圖底圖 + SVG 透明熱區疊加
 * 全身無死角：骨科 6 大區 + 非骨科引導區（頭臉、胸、腹，虛線顯示）
 * 熱區座標由像素逐行偵測校準（bodymap_coords.md）
 * 正面關鍵：頭 y22-190(x364-451)、肩線 y195-215 展開至 x281/534、
 * 手臂外緣 y235:275→y535:180-635(手)、軀幹內緣 y295:320/494 → y495:312/502、
 * 胯下 y~580、腿 y595-995（外緣 306/508、內緣膝處 366/446）、足 y995-1035 x284-530
 */
import { useEffect, useState } from "react";

export interface BodyMapProps {
  onSelect: (regionId: string) => void;
}

const TEAL = "#009B8D";
// ★ 交班設定：將 assets/ 資料夾的 18 張圖上傳到 Zenbu 後，只需修改下面這一個常數。
// 例：圖片放在 https://sharp-falcon-88717.zenbu.space/images/pain/ 則改為 "/images/pain"。
const ASSET_BASE = "https://cdn.jsdelivr.net/gh/weijenpaul/lezhikang-pain-assessment@v1/assets/pain";
const FRONT_IMG = `${ASSET_BASE}/body-front.png`;
const BACK_IMG = `${ASSET_BASE}/body-back.png`;

/** 像素級貼合的部位高亮遮罩（由底圖輪廓自動提取，teal 填色 PNG） */
const MASK_IMG: Record<string, string> = {
  "f-head": `${ASSET_BASE}/mask-f-head.png`,
  "f-shoulder": `${ASSET_BASE}/mask-f-shoulder.png`,
  "f-chest": `${ASSET_BASE}/mask-f-chest.png`,
  "f-abdomen": `${ASSET_BASE}/mask-f-abdomen.png`,
  "f-arm": `${ASSET_BASE}/mask-f-arm.png`,
  "f-thigh": `${ASSET_BASE}/mask-f-thigh.png`,
  "f-knee": `${ASSET_BASE}/mask-f-knee.png`,
  "f-leg": `${ASSET_BASE}/mask-f-leg.png`,
  "b-head": `${ASSET_BASE}/mask-b-head.png`,
  "b-upperback": `${ASSET_BASE}/mask-b-upperback.png`,
  "b-lowback": `${ASSET_BASE}/mask-b-lowback.png`,
  "b-pelvis": `${ASSET_BASE}/mask-b-pelvis.png`,
  "b-arm": `${ASSET_BASE}/mask-b-arm.png`,
  "b-thigh": `${ASSET_BASE}/mask-b-thigh.png`,
  "b-knee": `${ASSET_BASE}/mask-b-knee.png`,
  "b-leg": `${ASSET_BASE}/mask-b-leg.png`,
};

const VW = 816;
const VH = 1088;

interface ZoneDef {
  key: string;
  id: string;
  view: "front" | "back";
  label: string;
  labelSide: "left" | "right";
  labelY: number;
  d: string;
  guide?: boolean;
}

const zones: ZoneDef[] = [
  /* ================= 正面 ================= */
  {
    key: "f-head",
    id: "head-face",
    view: "front",
    label: "頭部臉部",
    labelSide: "right",
    labelY: 96,
    guide: true,
    // 頭橢圓：x364-451, y22-170；含下顎頸上段至 y185
    d: "M408 20 C 372 20 362 56 362 96 C 362 112 368 124 376 132 L 440 132 C 448 124 454 112 454 96 C 454 56 444 20 408 20 Z",
  },
  {
    key: "f-shoulder",
    id: "neck-shoulder",
    view: "front",
    label: "肩頸肩膀",
    labelSide: "right",
    labelY: 240,
    // 頸 y170-215 + 肩帶 y195-290：外緣從 x298(y195) 到 x275(y235)，含三角肌上緣
    d: "M376 132 L 440 132 L 436 178 L 434 204 C 468 208 506 216 530 228 C 550 238 562 252 566 268 L 561 284 C 511 268 460 260 408 260 C 356 260 305 268 255 284 L 250 268 C 254 252 266 238 286 228 C 310 216 348 208 382 204 L 380 178 Z",
  },
  {
    key: "f-chest",
    id: "chest",
    view: "front",
    label: "胸部",
    labelSide: "left",
    labelY: 350,
    guide: true,
    // 軀幹內緣 y295: x320-494 → y415: x326-488
    d: "M330 268 C 380 258 436 258 486 268 L 488 408 C 436 422 380 422 328 408 Z",
  },
  {
    key: "f-abdomen",
    id: "abdomen",
    view: "front",
    label: "腹部",
    labelSide: "left",
    labelY: 480,
    guide: true,
    // y415-540，內緣 x314-500
    d: "M326 414 C 378 428 438 428 490 414 L 493 498 C 439 512 377 512 323 498 Z",
  },
  {
    key: "f-arm",
    id: "elbow-hand",
    view: "front",
    label: "手肘手腕",
    labelSide: "right",
    labelY: 440,
    // 左臂：外緣 y255:273 → y495:223 → 手 y535:180；內緣 y295:318 → y495:256（沿軀幹側）
    d: "M300 224 C 284 234 272 248 268 266 L 262 320 C 258 358 252 396 246 434 C 240 472 232 508 222 540 L 210 574 L 246 588 L 262 552 C 272 516 280 478 286 440 C 292 400 298 360 302 320 L 308 272 C 308 254 306 238 300 224 Z M516 224 C 532 234 544 248 548 266 L 554 320 C 558 358 564 396 570 434 C 576 472 584 508 594 540 L 606 574 L 570 588 L 554 552 C 544 516 536 478 530 440 C 524 400 518 360 514 320 L 508 272 C 508 254 510 238 516 224 Z",
  },
  {
    key: "f-thigh",
    id: "pelvis-thigh-front",
    view: "front",
    label: "髖與大腿",
    labelSide: "left",
    labelY: 620,
    // 髖 y540-580（x306-508）+ 大腿 y580-735（外緣 306/508，內緣沿胯下 V 形）
    d: "M323 502 C 377 516 439 516 493 502 L 504 560 C 506 598 505 636 502 674 C 500 698 498 718 495 736 L 430 742 L 408 700 L 386 742 L 321 736 C 318 718 316 698 314 674 C 311 636 310 598 312 560 Z",
  },
  {
    key: "f-knee",
    id: "knee",
    view: "front",
    label: "膝蓋",
    labelSide: "right",
    labelY: 785,
    // 膝 y735-820：左腿 x306-370，右腿 x444-508
    d: "M314 740 L 372 744 L 370 806 L 308 802 C 310 782 312 760 314 740 Z M502 740 L 444 744 L 446 806 L 508 802 C 506 782 504 760 502 740 Z",
  },
  {
    key: "f-leg",
    id: "leg-foot",
    view: "front",
    label: "小腿足踝",
    labelSide: "right",
    labelY: 930,
    // 小腿 y820-995（左 308-364 漸縮 316-354）+ 足 y995-1035（左 284-344）
    d: "M306 806 L 370 810 C 366 848 362 888 360 920 C 359 946 357 970 354 990 L 350 998 L 300 1012 L 284 1030 L 344 1034 L 350 1002 L 354 990 C 322 986 310 962 312 930 C 313 894 309 848 306 806 Z M510 806 L 446 810 C 450 848 454 888 456 920 C 457 946 459 970 462 990 L 466 998 L 516 1012 L 532 1030 L 472 1034 L 466 1002 L 462 990 C 494 986 506 962 504 930 C 503 894 507 848 510 806 Z",
  },
  /* ================= 背面 ================= */
  {
    key: "b-head",
    id: "head-face",
    view: "back",
    label: "頭部後腦",
    labelSide: "right",
    labelY: 96,
    guide: true,
    d: "M408 18 C 372 18 360 54 360 94 C 360 108 366 120 374 128 L 442 128 C 450 120 456 108 456 94 C 456 54 444 18 408 18 Z",
  },
  {
    key: "b-upperback",
    id: "neck-shoulder",
    view: "back",
    label: "頸與上背",
    labelSide: "right",
    labelY: 270,
    // 後頸 y128-196 + 肩頂細帶 + 上背（外緣沿腋窩線 x344/472，不含三角肌與手臂）
    d: "M374 128 L 442 128 L 434 172 L 432 196 C 466 198 496 204 514 212 L 518 226 C 500 219 482 216 472 217 L 470 244 C 472 284 475 322 479 354 C 420 338 396 338 337 354 C 341 322 344 284 346 244 L 344 217 C 334 216 316 219 298 226 L 302 212 C 320 204 350 198 384 196 L 382 172 Z",
  },
  {
    key: "b-lowback",
    id: "low-back",
    view: "back",
    label: "腰背部",
    labelSide: "right",
    labelY: 440,
    // y360-530（內緣 x312-500）
    d: "M274 360 C 362 336 454 336 542 360 L 536 428 C 532 460 528 492 524 522 C 448 506 368 506 292 522 C 288 492 284 460 280 428 Z",
  },
  {
    key: "b-pelvis",
    id: "pelvis-thigh",
    view: "back",
    label: "臀部骨盆",
    labelSide: "right",
    labelY: 570,
    // 臀 y530-620
    d: "M290 516 C 368 500 448 500 526 516 L 528 566 C 528 598 520 622 504 634 C 442 650 374 650 312 634 C 296 622 288 598 288 566 Z",
  },
  {
    key: "b-arm",
    id: "elbow-hand",
    view: "back",
    label: "手肘手腕",
    labelSide: "left",
    labelY: 440,
    // 從三角肌中段 y240 起，內緣沿腋窩線 x344/472，不吃肩頂
    d: "M270 240 L 340 240 L 342 300 C 338 348 332 394 326 432 C 318 472 308 508 296 542 L 284 576 L 240 566 L 252 532 C 260 500 265 470 267 438 C 269 398 268 358 267 318 Z M546 240 L 476 240 L 474 300 C 478 348 484 394 490 432 C 498 472 508 508 520 542 L 532 576 L 576 566 L 564 532 C 556 500 551 470 549 438 C 547 398 548 358 549 318 Z",
  },
  {
    key: "b-thigh",
    id: "pelvis-thigh",
    view: "back",
    label: "大腿後側",
    labelSide: "right",
    labelY: 680,
    // y620-735
    d: "M312 640 C 374 656 442 656 504 640 C 511 642 516 646 519 650 L 514 692 C 512 710 510 726 508 738 L 430 744 L 408 714 L 386 744 L 308 738 C 306 726 304 710 302 692 L 297 650 C 300 646 305 642 312 640 Z",
  },
  {
    key: "b-knee",
    id: "knee-back",
    view: "back",
    label: "膝蓋後側",
    labelSide: "left",
    labelY: 785,
    d: "M312 742 L 370 746 L 368 806 L 306 802 C 308 782 310 762 312 742 Z M504 742 L 446 746 L 448 806 L 510 802 C 508 782 506 762 504 742 Z",
  },
  {
    key: "b-leg",
    id: "leg-foot",
    view: "back",
    label: "小腿足跟",
    labelSide: "left",
    labelY: 930,
    // 小腿 y820-995 + 足跟 y995-1030（x287-526）
    d: "M304 806 L 370 810 C 366 848 362 886 360 918 C 359 944 358 968 355 988 L 352 998 L 300 1010 L 287 1026 L 346 1030 L 352 1000 L 355 988 C 324 984 312 960 314 928 C 314 892 308 848 304 806 Z M512 806 L 444 810 C 448 848 452 886 454 918 C 455 944 456 968 459 988 L 462 998 L 514 1010 L 527 1026 L 468 1030 L 462 1000 L 459 988 C 490 984 502 960 500 928 C 500 892 506 848 512 806 Z",
  },
];

export default function BodyMap({ onSelect }: BodyMapProps) {
  const [view, setView] = useState<"front" | "back">("front");
  const [hovered, setHovered] = useState<string | null>(null);
  const [baseFailed, setBaseFailed] = useState<Record<string, boolean>>({});

  // 預載背面視角 9 張（底圖 + 8 遮罩），切換視角零延遲
  useEffect(() => {
    [BACK_IMG, ...zones.filter((z) => z.view === "back").map((z) => MASK_IMG[z.key])]
      .filter(Boolean)
      .forEach((src) => {
        const img = new Image();
        img.src = src;
      });
  }, []);

  const visibleZones = zones.filter((z) => z.view === view);
  const showFallback = !!baseFailed[view];

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 正面 / 背面切換 */}
      <div
        className="inline-flex border border-[#D4E7E4] bg-white"
        role="tablist"
        aria-label="切換人體視角"
      >
        {(["front", "back"] as const).map((v, i) => (
          <button
            key={v}
            role="tab"
            aria-selected={view === v}
            onClick={() => {
              setView(v);
              setHovered(null);
            }}
            className={`px-6 py-1.5 text-sm transition-all duration-200 font-medium ${
              i === 1 ? "border-l border-[#D4E7E4]" : ""
            } ${
              view === v
                ? "bg-[#009B8D] text-white"
                : "text-[#4A4A4A] hover:text-[#009B8D] bg-white"
            }`}
          >
            {v === "front" ? "正面" : "背面"}
          </button>
        ))}
      </div>

      <div className="relative w-full max-w-[400px]">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          className="w-full h-auto select-none"
          aria-label="人體部位選擇圖"
        >
          <image
            href={view === "front" ? FRONT_IMG : BACK_IMG}
            x="0"
            y="0"
            width={VW}
            height={VH}
            preserveAspectRatio="xMidYMid meet"
            onError={() => setBaseFailed((f) => ({ ...f, [view]: true }))}
          />
          {/* 遮罩高亮圖層：與底圖像素貼合，hover/點選時亮起 */}
          {visibleZones.map((z) => (
            <image
              key={`mask-${z.key}`}
              href={MASK_IMG[z.key]}
              x="0"
              y="0"
              width={VW}
              height={VH}
              preserveAspectRatio="xMidYMid meet"
              style={{
                opacity: hovered === z.key ? (z.guide ? 0.45 : 0.55) : 0,
                transition: "opacity 160ms ease-out",
                pointerEvents: "none",
              }}
            />
          ))}
          {visibleZones.map((z) => {
            const active = hovered === z.key;
            const lineX1 = z.labelSide === "right" ? 596 : 220;
            const lineX2 = z.labelSide === "right" ? 636 : 180;
            const textX = z.labelSide === "right" ? 644 : 172;
            return (
              <g
                key={z.key}
                onMouseEnter={() => setHovered(z.key)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelect(z.id)}
                role="button"
                aria-label={z.label}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") onSelect(z.id);
                }}
              >
                <path
                  d={z.d}
                  fill={showFallback ? "#E0F5F2" : "#ffffff"}
                  fillOpacity={showFallback ? (active ? 0.9 : 0.55) : 0}
                  stroke={showFallback ? "#7FBDB6" : "none"}
                  strokeWidth={showFallback ? 2 : 0}
                  style={{ cursor: "pointer", pointerEvents: "all" }}
                />
                <g
                  style={{
                    transition: "opacity 160ms ease-out",
                    opacity: active ? 1 : 0.85,
                    pointerEvents: "none",
                  }}
                >
                  <line
                    x1={lineX1}
                    y1={z.labelY - 7}
                    x2={lineX2}
                    y2={z.labelY - 7}
                    stroke={active ? TEAL : "#B8CFCB"}
                    strokeWidth="2"
                  />
                  {/* hover 時標籤反白成 teal 膠囊，遠比單純變粗明顯 */}
                  {active && (
                    <rect
                      x={
                        z.labelSide === "right"
                          ? textX - 14
                          : textX - z.label.length * 26 - 14
                      }
                      y={z.labelY - 27}
                      width={z.label.length * 26 + 28}
                      height={40}
                      rx={20}
                      fill={TEAL}
                    />
                  )}
                  <text
                    x={textX}
                    y={z.labelY}
                    fontSize="26"
                    fontWeight={active ? 700 : 500}
                    fill={active ? "#FFFFFF" : z.guide ? "#93A5A2" : "#546965"}
                    textAnchor={z.labelSide === "right" ? "start" : "end"}
                    style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
                  >
                    {z.label}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
        <p className="text-center text-xs text-[#9AA8A5] mt-1">
          全身皆可點選．虛線區域為非骨科範圍，點選後將提供就醫指引
        </p>
      </div>
    </div>
  );
}
