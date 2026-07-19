/**
 * 疾病 → 免開刀治療推薦對照（2026-07-19 對照表 v2）
 * 來源：PAIN-TO-TREATMENT-MAPPING.md ＋ 鄭醫師修正 5 行 ＋ slug 對齊 41 疾病 ＋ 3 行保守新增
 * 同步維護：build-scripts/treatment_map_v2.json（唯一事實來源）
 */
export type TreatmentId = "prp" | "shockwave" | "hyaluronic-acid" | "manual-therapy";

export const TREATMENT_MAP: Record<string, TreatmentId[]> = {
  "achilles-tendinitis": ["shockwave", "prp", "manual-therapy"],
  "acl-injury": ["prp", "manual-therapy"],
  "acute-low-back-pain": ["manual-therapy", "shockwave"],
  "acute-wry-neck": ["manual-therapy"],
  "ankle-sprain": ["prp", "manual-therapy"],
  "back-myofascial-pain": ["manual-therapy", "shockwave"],
  "calcific-tendinitis": ["shockwave", "manual-therapy"],
  "calf-strain": ["manual-therapy", "shockwave"],
  "carpal-tunnel": ["prp", "manual-therapy"],
  "cervical-radiculopathy": ["manual-therapy", "prp"],
  "cervicogenic-headache": ["manual-therapy"],
  "de-quervains": ["shockwave", "prp", "manual-therapy"],
  "frozen-shoulder": ["manual-therapy", "prp", "hyaluronic-acid"],
  "ganglion-cyst": ["manual-therapy"],
  "golfers-elbow": ["shockwave", "prp", "manual-therapy"],
  "greater-trochanteric-pain": ["shockwave", "prp", "manual-therapy"],
  "hallux-valgus": ["manual-therapy", "shockwave"],
  "herniated-disc": ["manual-therapy", "prp"],
  "hip-osteoarthritis": ["prp", "hyaluronic-acid", "manual-therapy"],
  "itbs": ["shockwave", "manual-therapy"],
  "knee-osteoarthritis": ["prp", "hyaluronic-acid", "manual-therapy"],
  "mcl-lcl-injury": ["prp", "manual-therapy"],
  "meniscus-tear": ["prp", "hyaluronic-acid", "manual-therapy"],
  "mortons-neuroma": ["prp", "shockwave", "manual-therapy"],
  "neck-myofascial-pain": ["manual-therapy", "shockwave"],
  "patellar-tendinitis": ["shockwave", "prp", "manual-therapy"],
  "pes-anserine-bursitis": ["shockwave", "prp", "manual-therapy"],
  "pfps": ["manual-therapy", "shockwave", "prp"],
  "piriformis-syndrome": ["manual-therapy", "shockwave", "prp"],
  "plantar-fasciitis": ["shockwave", "prp", "manual-therapy"],
  "rhomboid-pain": ["manual-therapy", "shockwave"],
  "rotator-cuff-tear": ["prp", "shockwave", "manual-therapy"],
  "sacroiliac-joint-pain": ["prp", "manual-therapy", "shockwave"],
  "sciatica": ["prp", "manual-therapy"],
  "scoliosis": ["manual-therapy"],
  "shoulder-impingement": ["shockwave", "manual-therapy", "prp"],
  "spinal-stenosis": ["manual-therapy", "prp"],
  "spondylolisthesis": ["prp", "manual-therapy"],
  "tennis-elbow": ["shockwave", "prp", "manual-therapy"],
  "tfcc-injury": ["prp", "manual-therapy"],
  "trigger-finger": ["prp", "manual-therapy"]
};

export const TREATMENT_INFO: Record<TreatmentId, { name: string; slug: string; desc: string }> = {
  "prp": { name: "PRP 增生療法", slug: "prp-regenerative-therapy", desc: "以自體血小板製劑為基礎的注射治療" },
  "shockwave": { name: "體外震波治療", slug: "shockwave-therapy", desc: "非侵入式的高能量聲波治療" },
  "hyaluronic-acid": { name: "玻尿酸注射", slug: "hyaluronic-acid-injection", desc: "補充關節潤滑與緩衝的注射選項" },
  "manual-therapy": { name: "徒手與運動治療", slug: "manual-exercise-therapy", desc: "動作訓練與徒手技術，重建功能的基礎" },
};
