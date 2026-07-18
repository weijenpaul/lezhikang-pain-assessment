/**
 * 樂智康疼痛自我評估系統 — 決策樹資料
 * Style: Clinical Serenity — 資料層，無樣式
 * 41 個疾病終點，hasArticle 目前全為 false（文章上線後逐篇改 true）
 */

export interface Option {
  text: string;
  hint?: string;
  next: string; // question id or result id
}

export interface Question {
  id: string;
  text: string;
  subtext?: string;
  options: Option[];
}

export interface Region {
  id: string;
  name: string;
  shortName: string;
  description: string;
  lineCampaign: string;
  questions: Question[];
}

export interface ResultInfo {
  name: string;
  englishName?: string;
  slug: string;
  hasArticle: boolean;
  summary: string;
  regionId: string;
}

export const BLOG_BASE = "https://sharp-falcon-88717.zenbu.space/blog";
/** ★ 交班設定：院所頁網址（所有 CTA 皆導向此頁） */
export const LOCATIONS_URL = "https://sharp-falcon-88717.zenbu.space/locations";
export const LINE_BASE =
  "https://line.me/R/ti/p/@wjs1014p?utm_source=new_site&utm_medium=pain&utm_campaign=";

export const RED_FLAGS: string[] = [
  "下背痛合併大小便失禁、或解不出來",
  "會陰部（跨下區域）麻木",
  "手腳無力越來越明顯（垂足、握不住東西）",
  "外傷後劇痛、變形、或完全無法出力",
  "疼痛合併發燒、不明原因體重下降，或曾罹患癌症",
  "夜間持續痛醒，怎麼休息都沒有緩解",
];

export const regions: Region[] = [
  {
    id: "neck-shoulder",
    name: "肩頸與肩膀",
    shortName: "肩頸",
    description: "脖子、肩膀、上背與肩胛骨一帶的疼痛",
    lineCampaign: "pain-shoulder-neck",
    questions: [
      {
        id: "q1",
        text: "哪一種情況最接近你的感覺？",
        options: [
          { text: "早上起床突然發生，脖子卡住轉不動", next: "result_acute_wry_neck" },
          { text: "長期肩頸緊繃痠痛，有時會痠到後腦或太陽穴", next: "result_cervicogenic_headache" },
          { text: "肩頸痛，而且會一路麻到手臂或手指", next: "result_cervical_radiculopathy" },
          { text: "肩膀舉不高，或舉到特定角度會痛", next: "q2" },
          { text: "肩膀突然劇烈疼痛，甚至痛到無法入睡", next: "result_calcific_tendinitis" },
          { text: "肩胛骨內側（膏肓的位置）痠痛", next: "result_rhomboid_pain" },
          { text: "肩頸長期痠痛，按壓肌肉有特別痛的點", next: "result_myofascial_pain_neck" },
        ],
      },
      {
        id: "q2",
        text: "關於「舉不高」，哪一種比較符合？",
        options: [
          {
            text: "手完全舉不高，連別人幫忙抬也抬不上去，關節很緊",
            hint: "各方向都卡，像被凍住",
            next: "result_frozen_shoulder",
          },
          {
            text: "舉到大約與肩同高的角度特別痛，超過或放下就比較不痛",
            hint: "特定角度的「痛弧」",
            next: "result_shoulder_impingement",
          },
          {
            text: "肩膀無力，手自己舉不太起來，有時有撕裂般的痛",
            hint: "無力感比疼痛更明顯",
            next: "result_rotator_cuff_tear",
          },
        ],
      },
    ],
  },
  {
    id: "elbow-hand",
    name: "手肘與手腕",
    shortName: "手肘手",
    description: "手肘、手腕與手指的疼痛或麻木",
    lineCampaign: "pain-elbow-hand",
    questions: [
      {
        id: "q1",
        text: "疼痛主要在哪個位置？",
        options: [
          { text: "手肘", next: "q2" },
          { text: "手腕或手指", next: "q3" },
        ],
      },
      {
        id: "q2",
        text: "手肘痛在哪一側？",
        options: [
          {
            text: "手肘外側，擰毛巾、提重物時會痛",
            next: "result_tennis_elbow",
          },
          {
            text: "手肘內側，手腕用力彎曲或抓握時會痛",
            next: "result_golfers_elbow",
          },
        ],
      },
      {
        id: "q3",
        text: "手腕或手指的症狀，哪一種最接近？",
        options: [
          {
            text: "手指會麻（大拇指到中指），晚上或騎車時更明顯",
            next: "result_carpal_tunnel",
          },
          {
            text: "大拇指根部靠手腕處痛，抱小孩、擰毛巾會痛",
            next: "result_de_quervains",
          },
          {
            text: "手指彎下去卡住，伸直時會「喀」一聲",
            next: "result_trigger_finger",
          },
          {
            text: "手腕小指側痛，撐地、轉門把、擰瓶蓋特別痛",
            next: "result_tfcc",
          },
          {
            text: "手腕背側或掌側有凸起的腫塊，按壓痠痛",
            next: "result_ganglion_cyst",
          },
        ],
      },
    ],
  },
  {
    id: "low-back",
    name: "腰背部",
    shortName: "腰背",
    description: "下背、腰部與脊椎周圍的疼痛",
    lineCampaign: "pain-low-back",
    questions: [
      {
        id: "q1",
        text: "你的腰痛比較像哪一種？",
        options: [
          {
            text: "突然發生（搬重物、彎腰後），腰劇痛到挺不直",
            next: "result_acute_low_back_pain",
          },
          {
            text: "痛像一條線，從腰往下竄到屁股或腿",
            next: "q2",
          },
          {
            text: "只有腰背局部痛，沒有往下延伸",
            next: "q3",
          },
        ],
      },
      {
        id: "q2",
        text: "往下竄的痛，什麼時候最明顯？",
        options: [
          {
            text: "彎腰、久坐、咳嗽時比較痛，可能伴隨腳麻",
            next: "result_herniated_disc",
          },
          {
            text: "走路走久了腿痠麻痛，坐下或彎腰休息就好轉",
            next: "result_spinal_stenosis",
          },
        ],
      },
      {
        id: "q3",
        text: "局部腰痛的特徵是？",
        options: [
          {
            text: "身體往後仰特別痛，有時覺得腰部不穩、無力",
            next: "result_spondylolisthesis",
          },
          {
            text: "痛在腰臀交界偏一側，翻身、單腳站、上下車時明顯",
            next: "result_sacroiliac_joint_pain",
          },
          {
            text: "久坐久站容易痠，按壓腰部肌肉有特別痛的點",
            next: "result_myofascial_pain_back",
          },
          {
            text: "外觀有高低肩、骨盆歪斜，或已知脊椎彎曲",
            next: "result_scoliosis",
          },
        ],
      },
    ],
  },
  {
    id: "pelvis-thigh",
    name: "骨盆與大腿",
    shortName: "臀腿",
    description: "臀部、髖部、鼠蹊與大腿的疼痛",
    lineCampaign: "pain-hip-thigh",
    questions: [
      {
        id: "q1",
        text: "疼痛主要在哪個位置？",
        options: [
          {
            text: "屁股深處痛，有時延伸到大腿後側",
            next: "q2",
          },
          {
            text: "大腿外側痛，跑步或上下樓梯時特別明顯",
            next: "result_itbs",
          },
          {
            text: "鼠蹊部（該邊）深處痛，髖關節活動卡卡的",
            next: "result_hip_osteoarthritis",
          },
          {
            text: "屁股外側痛，側睡壓到會痛",
            next: "result_greater_trochanteric_pain",
          },
        ],
      },
      {
        id: "q2",
        text: "屁股深處的痛，比較像哪一種？",
        options: [
          {
            text: "從腰一路竄下來的線狀痛麻感",
            next: "result_sciatica",
          },
          {
            text: "主要是屁股深處痠痛，久坐加重，比較不是從腰開始",
            next: "result_piriformis_syndrome",
          },
        ],
      },
    ],
  },
  {
    id: "knee",
    name: "膝蓋",
    shortName: "膝蓋",
    description: "膝關節前後內外側的疼痛",
    lineCampaign: "pain-knee",
    questions: [
      {
        id: "q1",
        text: "你的膝蓋痛比較像哪一種？",
        options: [
          {
            text: "上下樓梯痛、蹲下困難，關節僵硬（多為中老年）",
            next: "result_knee_osteoarthritis",
          },
          {
            text: "膝蓋正前方痛，久坐起身、下樓梯時明顯（年輕人、跑者常見）",
            next: "result_pfps",
          },
          {
            text: "運動扭傷或撞擊後，膝蓋腫、不穩或卡住",
            next: "q2",
          },
          {
            text: "膝蓋骨正下方痛，跳躍或跑步後特別明顯",
            next: "result_patellar_tendinitis",
          },
          {
            text: "膝蓋內側偏下方痛，上樓梯或起身時明顯",
            next: "result_pes_anserine_bursitis",
          },
        ],
      },
      {
        id: "q2",
        text: "受傷後的感覺比較偏向？",
        options: [
          {
            text: "膝蓋鬆鬆的、不穩定，好像隨時會軟腳",
            next: "result_acl_injury",
          },
          {
            text: "膝蓋卡卡的，有時伸不直或彎不下去",
            next: "result_meniscus_tear",
          },
          {
            text: "膝蓋內側或外側有明確壓痛，有扭到的病史",
            next: "result_mcl_lcl_injury",
          },
        ],
      },
    ],
  },
  {
    id: "leg-foot",
    name: "小腿與足踝",
    shortName: "小腿腳",
    description: "小腿、腳踝、腳跟與腳掌的疼痛",
    lineCampaign: "pain-leg-foot",
    questions: [
      {
        id: "q1",
        text: "疼痛主要在哪個位置？",
        options: [
          {
            text: "腳底或腳跟，早上下床第一步最痛",
            next: "result_plantar_fasciitis",
          },
          {
            text: "腳踝，扭到之後腫痛",
            next: "result_ankle_sprain",
          },
          {
            text: "腳後跟上方（阿基里斯腱的位置）",
            next: "result_achilles_tendinitis",
          },
          {
            text: "小腿肌肉，運動中突然像被打到一樣痛",
            next: "result_calf_strain",
          },
          {
            text: "大拇趾根部往外凸，穿鞋摩擦會痛",
            next: "result_hallux_valgus",
          },
          {
            text: "前腳掌痛，腳趾有麻感，穿窄鞋更明顯",
            next: "result_mortons_neuroma",
          },
        ],
      },
    ],
  },
];

export const results: Record<string, ResultInfo> = {
  result_acute_wry_neck: {
    name: "急性落枕（頸部肌肉痙攣）",
    englishName: "Acute Wry Neck",
    slug: "acute-wry-neck",
    hasArticle: false,
    regionId: "neck-shoulder",
    summary:
      "睡姿不良或突然轉頭後，頸部肌肉急性痙攣，造成脖子卡住、轉動劇痛。多數在數天內緩解，但反覆發作可能與頸椎小面關節問題有關。",
  },
  result_cervicogenic_headache: {
    name: "頸因性頭痛",
    englishName: "Cervicogenic Headache",
    slug: "cervicogenic-headache",
    hasArticle: false,
    regionId: "neck-shoulder",
    summary:
      "頭痛的根源其實在頸椎。長時間低頭、姿勢不良使上頸椎關節與肌肉緊繃，疼痛從後腦延伸到太陽穴或眼窩，常被誤認為偏頭痛。",
  },
  result_cervical_radiculopathy: {
    name: "頸椎神經壓迫",
    englishName: "Cervical Radiculopathy",
    slug: "cervical-radiculopathy",
    hasArticle: false,
    regionId: "neck-shoulder",
    summary:
      "頸椎的椎間盤突出或骨刺壓迫神經根，疼痛與麻木感沿著神經一路延伸到手臂、手指，可能伴隨無力感。",
  },
  result_calcific_tendinitis: {
    name: "鈣化性肌腱炎",
    englishName: "Calcific Tendinitis",
    slug: "calcific-tendinitis",
    hasArticle: false,
    regionId: "neck-shoulder",
    summary:
      "鈣質沉積在旋轉肌腱內，急性發作時肩膀劇痛、無法睡向患側。超音波可清楚看到鈣化點，體外震波與超音波導引治療是常見的治療選項。",
  },
  result_rotator_cuff_tear: {
    name: "肩旋轉肌腱撕裂",
    englishName: "Rotator Cuff Tear",
    slug: "rotator-cuff-tear",
    hasArticle: false,
    regionId: "neck-shoulder",
    summary:
      "包覆肩關節的旋轉肌腱部分或完全斷裂，手舉不起來、無力感明顯。超音波檢查可即時評估撕裂範圍，決定保守治療或進一步處置。",
  },
  result_frozen_shoulder: {
    name: "五十肩（沾黏性肩關節囊炎）",
    englishName: "Frozen Shoulder",
    slug: "frozen-shoulder",
    hasArticle: false,
    regionId: "neck-shoulder",
    summary:
      "肩關節囊發炎沾黏，各方向活動都受限，連別人幫忙抬也抬不上去。及早介入關節囊擴張治療與復健，有機會縮短病程。",
  },
  result_shoulder_impingement: {
    name: "肩夾擠症候群",
    englishName: "Shoulder Impingement",
    slug: "shoulder-impingement",
    hasArticle: false,
    regionId: "neck-shoulder",
    summary:
      "手舉到特定角度時，肌腱在肩峰下被夾擠產生疼痛（痛弧）。與姿勢、肩胛骨動作失衡有關，超音波可評估發炎與夾擠程度。",
  },
  result_rhomboid_pain: {
    name: "膏肓痛（菱形肌筋膜炎）",
    englishName: "Rhomboid / Interscapular Pain",
    slug: "rhomboid-pain",
    hasArticle: false,
    regionId: "neck-shoulder",
    summary:
      "肩胛骨內側的頑固痠痛，久坐、打電腦後加重。常與頸椎神經、肌筋膜激痛點有關，「病入膏肓」其實有解。",
  },
  result_myofascial_pain_neck: {
    name: "肩頸筋膜炎",
    englishName: "Neck Myofascial Pain",
    slug: "neck-myofascial-pain",
    hasArticle: false,
    regionId: "neck-shoulder",
    summary:
      "肩頸肌肉長期緊繃形成激痛點，按壓會有明顯痛點且可能傳導到其他部位。與姿勢、壓力、睡眠品質密切相關。",
  },
  result_tennis_elbow: {
    name: "網球肘（肱骨外上髁炎）",
    englishName: "Tennis Elbow",
    slug: "tennis-elbow",
    hasArticle: false,
    regionId: "elbow-hand",
    summary:
      "手肘外側肌腱因反覆使用而退化發炎，擰毛巾、提東西就痛。不只網球選手，家庭主婦與上班族更常見。",
  },
  result_golfers_elbow: {
    name: "高爾夫球肘（肱骨內上髁炎）",
    englishName: "Golfer's Elbow",
    slug: "golfers-elbow",
    hasArticle: false,
    regionId: "elbow-hand",
    summary:
      "手肘內側肌腱發炎，抓握、手腕彎曲用力時疼痛。常見於需要反覆抓握的工作與運動。",
  },
  result_carpal_tunnel: {
    name: "腕隧道症候群",
    englishName: "Carpal Tunnel Syndrome",
    slug: "carpal-tunnel",
    hasArticle: false,
    regionId: "elbow-hand",
    summary:
      "正中神經在手腕處被壓迫，大拇指到中指麻木刺痛，夜間或騎機車時特別明顯。超音波可直接看到神經腫脹程度。",
  },
  result_de_quervains: {
    name: "媽媽手（狄奎凡氏症）",
    englishName: "De Quervain's Tenosynovitis",
    slug: "de-quervains",
    hasArticle: false,
    regionId: "elbow-hand",
    summary:
      "大拇指側手腕的肌腱腱鞘發炎，抱小孩、擰毛巾、滑手機都會痛。及早治療配合工學調整，恢復效果好。",
  },
  result_trigger_finger: {
    name: "板機指",
    englishName: "Trigger Finger",
    slug: "trigger-finger",
    hasArticle: false,
    regionId: "elbow-hand",
    summary:
      "手指屈肌腱腱鞘增厚卡住，手指彎曲後卡住、伸直時「喀」一聲。超音波導引注射可精準處理，多數不需開刀。",
  },
  result_tfcc: {
    name: "TFCC 損傷（三角纖維軟骨複合體）",
    englishName: "TFCC Injury",
    slug: "tfcc-injury",
    hasArticle: false,
    regionId: "elbow-hand",
    summary:
      "手腕小指側的軟骨結構受損，撐地、轉門把、擰瓶蓋時疼痛。常見於健身、瑜珈與跌倒撐地後，超音波與理學檢查可評估。",
  },
  result_ganglion_cyst: {
    name: "腕部腱鞘囊腫",
    englishName: "Ganglion Cyst",
    slug: "ganglion-cyst",
    hasArticle: false,
    regionId: "elbow-hand",
    summary:
      "手腕背側或掌側出現的圓形腫塊，內含關節液，按壓痠痛或影響活動。超音波可確認性質，導引抽吸為常見處置。",
  },
  result_acute_low_back_pain: {
    name: "閃到腰（急性下背拉傷）",
    englishName: "Acute Low Back Strain",
    slug: "acute-low-back-pain",
    hasArticle: false,
    regionId: "low-back",
    summary:
      "搬重物或彎腰瞬間腰部劇痛、挺不直。多為肌肉或小面關節急性受傷，正確處置可加速恢復、避免變成慢性腰痛。",
  },
  result_herniated_disc: {
    name: "腰椎間盤突出",
    englishName: "Lumbar Disc Herniation",
    slug: "herniated-disc",
    hasArticle: false,
    regionId: "low-back",
    summary:
      "椎間盤突出壓迫神經根，腰痛合併下肢放射痛麻，彎腰、久坐、咳嗽時加重。多數可透過保守治療改善，不一定需要開刀。",
  },
  result_spinal_stenosis: {
    name: "腰椎神經壓迫（椎管狹窄）",
    englishName: "Lumbar Spinal Stenosis",
    slug: "spinal-stenosis",
    hasArticle: false,
    regionId: "low-back",
    summary:
      "椎管空間狹窄壓迫神經，走路走久腿痠麻痛、需要坐下休息（神經性跛行）。好發於中老年，治療選項多元。",
  },
  result_spondylolisthesis: {
    name: "脊椎滑脫",
    englishName: "Spondylolisthesis",
    slug: "spondylolisthesis",
    hasArticle: false,
    regionId: "low-back",
    summary:
      "椎體往前滑移造成腰部不穩定，後仰時疼痛明顯、久站腰痠無力。核心肌群訓練與增生療法是重要的保守治療選項。",
  },
  result_sacroiliac_joint_pain: {
    name: "薦髂關節炎",
    englishName: "Sacroiliac Joint Dysfunction",
    slug: "sacroiliac-joint-pain",
    hasArticle: false,
    regionId: "low-back",
    summary:
      "骨盆與脊椎交界的薦髂關節發炎或失能，痛在腰臀交界偏一側，翻身、上下車、單腳承重時明顯。",
  },
  result_myofascial_pain_back: {
    name: "肌筋膜疼痛症候群（慢性下背痛）",
    englishName: "Myofascial Pain Syndrome",
    slug: "back-myofascial-pain",
    hasArticle: false,
    regionId: "low-back",
    summary:
      "腰背肌肉的激痛點造成慢性痠痛，久坐久站加重。找出激痛點與誘發因子，配合治療與運動可有效改善。",
  },
  result_scoliosis: {
    name: "成人脊椎側彎",
    englishName: "Adult Scoliosis",
    slug: "scoliosis",
    hasArticle: false,
    regionId: "low-back",
    summary:
      "脊椎左右彎曲合併旋轉，成人常以腰背痠痛、高低肩、骨盆歪斜表現。評估彎曲角度後，運動治療與疼痛管理雙軌並行。",
  },
  result_sciatica: {
    name: "坐骨神經痛",
    englishName: "Sciatica",
    slug: "sciatica",
    hasArticle: false,
    regionId: "pelvis-thigh",
    summary:
      "坐骨神經受刺激，疼痛麻木從腰臀沿大腿後側往下延伸。「坐骨神經痛」是症狀而非診斷——找出壓迫源頭才能對症治療。",
  },
  result_piriformis_syndrome: {
    name: "梨狀肌症候群",
    englishName: "Piriformis Syndrome",
    slug: "piriformis-syndrome",
    hasArticle: false,
    regionId: "pelvis-thigh",
    summary:
      "臀部深處的梨狀肌緊繃壓迫坐骨神經，久坐加重、屁股深處痠痛。與椎間盤問題的鑑別是治療關鍵。",
  },
  result_itbs: {
    name: "髂脛束症候群",
    englishName: "IT Band Syndrome",
    slug: "itbs",
    hasArticle: false,
    regionId: "pelvis-thigh",
    summary:
      "大腿外側的髂脛束過度緊繃，跑步、上下樓梯時大腿外側到膝蓋外側疼痛。跑者常見，與訓練量及臀肌力量有關。",
  },
  result_hip_osteoarthritis: {
    name: "髖關節退化性關節炎",
    englishName: "Hip Osteoarthritis",
    slug: "hip-osteoarthritis",
    hasArticle: false,
    regionId: "pelvis-thigh",
    summary:
      "髖關節軟骨磨損，鼠蹊部深處疼痛、髖部活動卡緊，走久加重。及早介入可延緩退化、維持活動力。",
  },
  result_greater_trochanteric_pain: {
    name: "大轉子疼痛症候群（髖部滑囊炎）",
    englishName: "Greater Trochanteric Pain Syndrome",
    slug: "greater-trochanteric-pain",
    hasArticle: false,
    regionId: "pelvis-thigh",
    summary:
      "髖部外側的肌腱與滑囊發炎，側睡壓到會痛、走路上樓梯痠痛。與臀中肌肌腱病變密切相關，超音波可精準評估。",
  },
  result_knee_osteoarthritis: {
    name: "退化性膝關節炎",
    englishName: "Knee Osteoarthritis",
    slug: "knee-osteoarthritis",
    hasArticle: false,
    regionId: "knee",
    summary:
      "膝關節軟骨磨損，上下樓梯痛、蹲下困難、關節僵硬。從運動治療、增生療法到 PRP，開刀前還有很多選項。",
  },
  result_pfps: {
    name: "髕骨股骨疼痛症候群",
    englishName: "Patellofemoral Pain Syndrome",
    slug: "pfps",
    hasArticle: false,
    regionId: "knee",
    summary:
      "膝蓋骨滑動軌跡異常造成的膝前痛，久坐起身、下樓梯時明顯。年輕族群與跑者最常見的膝痛，肌力訓練是治療核心。",
  },
  result_patellar_tendinitis: {
    name: "髕腱炎（跳躍膝）",
    englishName: "Patellar Tendinitis",
    slug: "patellar-tendinitis",
    hasArticle: false,
    regionId: "knee",
    summary:
      "膝蓋骨下方的髕腱因反覆跳躍負荷而退化發炎，籃球、排球運動員常見。離心訓練與震波治療證據充分。",
  },
  result_pes_anserine_bursitis: {
    name: "鵝足滑囊炎",
    englishName: "Pes Anserine Bursitis",
    slug: "pes-anserine-bursitis",
    hasArticle: false,
    regionId: "knee",
    summary:
      "膝蓋內側下方的鵝足滑囊發炎，上樓梯、起身時內側痛，常與退化性關節炎混淆或並存。超音波可明確區分。",
  },
  result_acl_injury: {
    name: "十字韌帶損傷",
    englishName: "ACL Injury",
    slug: "acl-injury",
    hasArticle: false,
    regionId: "knee",
    summary:
      "運動中扭轉受傷後膝蓋腫脹、不穩定、軟腳感。損傷程度決定治療方向，完整評估是第一步。",
  },
  result_meniscus_tear: {
    name: "半月板損傷",
    englishName: "Meniscus Tear",
    slug: "meniscus-tear",
    hasArticle: false,
    regionId: "knee",
    summary:
      "膝關節內的半月板軟骨撕裂，膝蓋卡卡、有時伸不直，蹲或旋轉時疼痛。許多類型可透過保守治療與再生注射改善。",
  },
  result_mcl_lcl_injury: {
    name: "膝蓋韌帶損傷（內外側副韌帶）",
    englishName: "MCL / LCL Injury",
    slug: "mcl-lcl-injury",
    hasArticle: false,
    regionId: "knee",
    summary:
      "膝蓋內側或外側副韌帶扭傷，有明確受傷病史、局部壓痛。多數等級可保守治療，增生療法是部分患者的輔助治療選項。",
  },
  result_plantar_fasciitis: {
    name: "足底筋膜炎",
    englishName: "Plantar Fasciitis",
    slug: "plantar-fasciitis",
    hasArticle: false,
    regionId: "leg-foot",
    summary:
      "足底筋膜退化發炎，早上下床第一步最痛。震波治療、足弓支撐與伸展運動三管齊下是常見的治療組合。",
  },
  result_ankle_sprain: {
    name: "腳踝韌帶扭傷",
    englishName: "Ankle Sprain",
    slug: "ankle-sprain",
    hasArticle: false,
    regionId: "leg-foot",
    summary:
      "翻腳刀後腳踝外側腫痛。「扭到腳只要冰敷休息」是迷思——韌帶癒合品質決定會不會反覆扭傷，完整評估很重要。",
  },
  result_achilles_tendinitis: {
    name: "跟腱炎（阿基里斯腱炎）",
    englishName: "Achilles Tendinitis",
    slug: "achilles-tendinitis",
    hasArticle: false,
    regionId: "leg-foot",
    summary:
      "腳後跟上方的阿基里斯腱因過度負荷退化發炎，跑跳後疼痛僵硬。離心訓練與震波治療有較充分的實證支持。",
  },
  result_calf_strain: {
    name: "小腿拉傷（網球腿）",
    englishName: "Calf Strain",
    slug: "calf-strain",
    hasArticle: false,
    regionId: "leg-foot",
    summary:
      "運動中小腿突然像被打到一樣劇痛，多為腓腸肌內側頭撕裂。超音波可評估撕裂範圍，指引安全回場時程。",
  },
  result_hallux_valgus: {
    name: "拇趾外翻",
    englishName: "Hallux Valgus",
    slug: "hallux-valgus",
    hasArticle: false,
    regionId: "leg-foot",
    summary:
      "大拇趾根部向外偏移凸出，穿鞋摩擦疼痛、前足變寬。鞋具調整、足弓支撐與運動治療可減緩惡化與疼痛。",
  },
  result_mortons_neuroma: {
    name: "莫頓氏神經瘤",
    englishName: "Morton's Neuroma",
    slug: "mortons-neuroma",
    hasArticle: false,
    regionId: "leg-foot",
    summary:
      "前腳掌的趾間神經增厚，走路像踩到石頭、腳趾麻刺，穿窄鞋加重。超音波可直接看到神經瘤，導引注射是常見的治療選項。",
  },
};

export function getRegion(id: string): Region | undefined {
  return regions.find((r) => r.id === id);
}

export function getQuestion(region: Region, qid: string): Question | undefined {
  return region.questions.find((q) => q.id === qid);
}

export function lineUrl(campaign: string): string {
  return `${LINE_BASE}${campaign}`;
}

/** 院所頁連結：現行 CTA 統一導向找院所頁（不用 LINE） */
export function locationsUrl(from?: string): string {
  return from ? `${LOCATIONS_URL}?from=${from}` : LOCATIONS_URL;
}

export function articleUrl(slug: string): string {
  return `${BLOG_BASE}/${slug}`;
}
