/**
 * 樂智康兒童發展自我檢測 — 題庫資料
 *
 * 設計依據：
 * - 題目內容以國健署《兒童健康手冊》家長紀錄事項（家長自填題）為基礎，白話重寫
 * - 分表架構與判讀邏輯借鑑 Taipei-II 檢核表（13 個年齡分表、★警訊題規則）
 * - 為樂智康自編題庫，待醫師團隊審訂
 *
 * 判讀規則（Taipei-II 邏輯）：
 * - 「警訊題（is_warning=true）」1 題未通過 → 紅燈（建議進一步評估）
 * - 一般題累計 2 題以上未通過 → 紅燈
 * - 一般題僅 1 題未通過 → 琥珀燈（持續觀察，1-2 個月後再測）
 * - 全數通過 → 綠燈
 *
 * 反向題（reverse=true）：題目描述的是「異常行為」，回答「是」代表未通過。
 */

export type Category = "粗大動作" | "精細動作" | "語言認知" | "社會情緒";

export interface Question {
  id: string;
  text: string;
  /** 面向；警訊觀察題也歸入最相關面向 */
  category: Category;
  /** 星號警訊題：未通過即紅燈 */
  isWarning: boolean;
  /** 反向題：答「是」= 未通過 */
  reverse?: boolean;
}

export interface Questionnaire {
  /** 顯示名稱 */
  ageGroup: string;
  /** 適用實足月齡（含下限、不含上限），單位：月 */
  minMonths: number;
  maxMonths: number;
  questions: Question[];
}

export const CATEGORY_META: Record<
  Category,
  {
    color: string;
    bg: string;
    icon: string;
    /** 滿版橫幅插圖（3:2），首頁四面向卡片使用 */
    banner: string;
    blogTag: string;
    description: string;
  }
> = {
  粗大動作: {
    color: "#0E7C6B",
    bg: "#E6F2EF",
    icon: "https://cdn.jsdelivr.net/gh/weijenpaul/lezhikang-pain-assessment@v8/assets/kids/domain-gross-motor.webp",
    banner: "https://cdn.jsdelivr.net/gh/weijenpaul/lezhikang-pain-assessment@v8/assets/kids/banner-gross-motor.webp",
    blogTag: "gross-motor",
    description: "翻身、坐、爬、走、跑、跳等大肌肉動作",
  },
  精細動作: {
    color: "#C98A2D",
    bg: "#FBF3E4",
    icon: "https://cdn.jsdelivr.net/gh/weijenpaul/lezhikang-pain-assessment@v8/assets/kids/domain-fine-motor.webp",
    banner: "https://cdn.jsdelivr.net/gh/weijenpaul/lezhikang-pain-assessment@v8/assets/kids/banner-fine-motor.webp",
    blogTag: "fine-motor",
    description: "抓握、堆疊、塗鴉、使用湯匙等手部小肌肉動作",
  },
  語言認知: {
    color: "#D9705F",
    bg: "#FCEBE8",
    icon: "https://cdn.jsdelivr.net/gh/weijenpaul/lezhikang-pain-assessment@v8/assets/kids/domain-language.webp",
    banner: "https://cdn.jsdelivr.net/gh/weijenpaul/lezhikang-pain-assessment@v8/assets/kids/banner-language.webp",
    blogTag: "language",
    description: "理解指令、發音、說話、認知理解能力",
  },
  社會情緒: {
    color: "#5B7DB1",
    bg: "#EAF0F8",
    icon: "https://cdn.jsdelivr.net/gh/weijenpaul/lezhikang-pain-assessment@v8/assets/kids/domain-social.webp",
    banner: "https://cdn.jsdelivr.net/gh/weijenpaul/lezhikang-pain-assessment@v8/assets/kids/banner-social.webp",
    blogTag: "social",
    description: "眼神互動、模仿、遊戲、生活自理與人際互動",
  },
};

export const QUESTIONNAIRES: Questionnaire[] = [
  {
    ageGroup: "4 個月",
    minMonths: 3.5,
    maxMonths: 5.5,
    questions: [
      { id: "4m_1", text: "趴著時，寶寶能將頭抬高到 45 度以上？", category: "粗大動作", isWarning: false },
      { id: "4m_2", text: "趴著時，能用兩隻前臂撐起身體，把頭抬高到 90 度？", category: "粗大動作", isWarning: false },
      { id: "4m_3", text: "直立抱著時，頭部能保持挺直，並可以左右轉動？", category: "粗大動作", isWarning: false },
      { id: "4m_4", text: "雙手大部分時間會自然張開，不再總是緊握拳頭？", category: "精細動作", isWarning: false },
      { id: "4m_5", text: "眼睛會跟著移動的物品看，範圍可以超過 90 度？", category: "精細動作", isWarning: false },
      { id: "4m_6", text: "會發出「ㄚ」、「ㄍㄨ」等聲音，甚至一長串咿咿呀呀？", category: "語言認知", isWarning: false },
      { id: "4m_7", text: "激動或生氣時，會發出很大的叫聲？", category: "語言認知", isWarning: false },
      { id: "4m_8", text: "逗弄寶寶時，他會用微笑或笑聲回應您？", category: "社會情緒", isWarning: false },
      { id: "4m_9", text: "對周遭聲音有反應，聽到聲音會轉頭尋找？", category: "社會情緒", isWarning: true },
      { id: "4m_10", text: "對人的臉孔感興趣，會注視著看？", category: "社會情緒", isWarning: false },
      { id: "4m_11", text: "寶寶的身體有不尋常的僵硬，或特別軟趴趴的現象？", category: "粗大動作", isWarning: true, reverse: true },
    ],
  },
  {
    ageGroup: "6 個月",
    minMonths: 5.5,
    maxMonths: 8.5,
    questions: [
      { id: "6m_1", text: "寶寶自己會翻身（從趴著翻成躺著，或從躺著翻成趴著）？", category: "粗大動作", isWarning: true },
      { id: "6m_2", text: "大人扶著腋下時，雙腳能稍微支撐身體的重量？", category: "粗大動作", isWarning: false },
      { id: "6m_3", text: "看到眼前的玩具，會主動伸手去抓？", category: "精細動作", isWarning: true },
      { id: "6m_4", text: "雙手會各拿一個玩具互相敲打？", category: "精細動作", isWarning: false },
      { id: "6m_5", text: "會發出「ㄇㄚ」、「ㄅㄚ」、「ㄉㄚ」等不同的音？", category: "語言認知", isWarning: false },
      { id: "6m_6", text: "聽到耳邊或身後的鈴聲、聲響，會轉頭尋找聲音來源？", category: "語言認知", isWarning: true },
      { id: "6m_7", text: "用小手帕輕輕蓋住寶寶的臉，他會自己用手拿開？", category: "語言認知", isWarning: false },
      { id: "6m_8", text: "看到熟悉的人會主動微笑，對陌生人可能表現出害怕或退縮？", category: "社會情緒", isWarning: false },
      { id: "6m_9", text: "會用哭鬧或肢體動作表達需要（例如要抱抱、肚子餓）？", category: "社會情緒", isWarning: false },
      { id: "6m_10", text: "叫寶寶的名字時，他會轉頭或有反應？", category: "社會情緒", isWarning: false },
      { id: "6m_11", text: "寶寶的雙眼視線不一致，有鬥雞眼或斜視的現象？", category: "精細動作", isWarning: true, reverse: true },
    ],
  },
  {
    ageGroup: "9 個月",
    minMonths: 8.5,
    maxMonths: 11.5,
    questions: [
      { id: "9m_1", text: "不需要大人扶，寶寶自己可以坐得很穩、不會倒下？", category: "粗大動作", isWarning: true },
      { id: "9m_2", text: "會用雙手和雙膝爬行（肚子離開地面）？", category: "粗大動作", isWarning: false },
      { id: "9m_3", text: "能扶著家具或大人的手，自己站起來？", category: "粗大動作", isWarning: false },
      { id: "9m_4", text: "會把手上的玩具從一隻手換到另一隻手？", category: "精細動作", isWarning: true },
      { id: "9m_5", text: "能用大拇指和其他手指捏起小東西（例如小餅乾）？", category: "精細動作", isWarning: false },
      { id: "9m_6", text: "會連續發出「ㄇㄚㄇㄚㄇㄚ」或「ㄅㄚㄅㄚㄅㄚ」的聲音？", category: "語言認知", isWarning: true },
      { id: "9m_7", text: "當大人說「不行」時，寶寶會停下動作？", category: "語言認知", isWarning: false },
      { id: "9m_8", text: "會跟大人玩「躲貓貓」的遊戲（遮住臉再打開）？", category: "社會情緒", isWarning: false },
      { id: "9m_9", text: "叫寶寶的名字，他會轉頭看您？", category: "社會情緒", isWarning: true },
      { id: "9m_10", text: "會模仿大人的簡單動作（例如拍拍手、揮手再見）？", category: "社會情緒", isWarning: false },
      { id: "9m_11", text: "寶寶很少發出聲音，或對大人的逗弄沒什麼反應？", category: "社會情緒", isWarning: true, reverse: true },
    ],
  },
  {
    ageGroup: "1 歲",
    minMonths: 11.5,
    maxMonths: 14.5,
    questions: [
      { id: "1y_1", text: "從躺著的姿勢，孩子能自己坐起來？", category: "粗大動作", isWarning: true },
      { id: "1y_2", text: "能扶著家具或牆壁，自己慢慢走幾步？", category: "粗大動作", isWarning: false },
      { id: "1y_3", text: "能用大拇指和食指的指尖，精準捏起很小的東西（例如米粒）？", category: "精細動作", isWarning: true },
      { id: "1y_4", text: "會把小東西放進杯子或容器裡？", category: "精細動作", isWarning: false },
      { id: "1y_5", text: "除了爸爸、媽媽之外，還會說 1 到 2 個有意義的單字？", category: "語言認知", isWarning: false },
      { id: "1y_6", text: "聽得懂簡單的指令（例如「給我」、「過來」）並做出動作？", category: "語言認知", isWarning: false },
      { id: "1y_7", text: "大人把玩具藏在布底下，孩子會掀開布找玩具？", category: "語言認知", isWarning: false },
      { id: "1y_8", text: "想要東西時，會用手指著那個東西，或發出聲音表達？", category: "社會情緒", isWarning: true },
      { id: "1y_9", text: "會主動把玩具拿給大人看，或遞給大人？", category: "社會情緒", isWarning: false },
      { id: "1y_10", text: "會自己拿著餅乾或麵包吃？", category: "社會情緒", isWarning: false },
      { id: "1y_11", text: "叫孩子的名字時，他通常不理人，彷彿聽不到？", category: "社會情緒", isWarning: true, reverse: true },
    ],
  },
  {
    ageGroup: "1 歲 3 個月",
    minMonths: 14.5,
    maxMonths: 17.5,
    questions: [
      { id: "1y3m_1", text: "不需要扶任何東西，孩子自己可以獨立走幾步？", category: "粗大動作", isWarning: false },
      { id: "1y3m_2", text: "可以自己爬上較矮的椅子坐好？", category: "粗大動作", isWarning: false },
      { id: "1y3m_3", text: "會自己用手拿水杯喝水？", category: "精細動作", isWarning: false },
      { id: "1y3m_4", text: "會試著把兩塊積木疊在一起？", category: "精細動作", isWarning: false },
      { id: "1y3m_5", text: "能聽懂並指出 1 到 2 個身體部位（例如問「眼睛在哪裡？」）？", category: "語言認知", isWarning: false },
      { id: "1y3m_6", text: "會模仿大人說出簡單的單字？", category: "語言認知", isWarning: false },
      { id: "1y3m_7", text: "會用點頭表示「要」，搖頭表示「不要」？", category: "社會情緒", isWarning: false },
      { id: "1y3m_8", text: "會模仿大人做家事的動作（例如拿抹布擦桌子）？", category: "社會情緒", isWarning: false },
      { id: "1y3m_9", text: "會用手指著感興趣的東西，並轉頭看大人有沒有在看？", category: "社會情緒", isWarning: true },
      { id: "1y3m_10", text: "孩子走路時經常跌倒，或明顯走不穩？", category: "粗大動作", isWarning: false, reverse: true },
      { id: "1y3m_11", text: "孩子缺乏眼神交流，很少看大人的眼睛？", category: "社會情緒", isWarning: true, reverse: true },
    ],
  },
  {
    ageGroup: "1 歲半",
    minMonths: 17.5,
    maxMonths: 23.5,
    questions: [
      { id: "1y6m_1", text: "孩子能自己走得很穩，不會經常跌倒？", category: "粗大動作", isWarning: true },
      { id: "1y6m_2", text: "能牽著大人的手，或扶著欄杆走上樓梯？", category: "粗大動作", isWarning: false },
      { id: "1y6m_3", text: "能自己彎腰或蹲下撿東西，然後再站起來？", category: "粗大動作", isWarning: false },
      { id: "1y6m_4", text: "會自己用湯匙吃東西（掉出來一些沒關係）？", category: "精細動作", isWarning: false },
      { id: "1y6m_5", text: "會拿筆在紙上塗鴉？", category: "精細動作", isWarning: false },
      { id: "1y6m_6", text: "會說 5 個以上有意義的單字（例如車車、狗狗、水水）？", category: "語言認知", isWarning: true },
      { id: "1y6m_7", text: "能聽從簡單的口頭指令（例如「把球拿給爸爸」）？", category: "語言認知", isWarning: true },
      { id: "1y6m_8", text: "能正確指出至少 3 個身體部位？", category: "語言認知", isWarning: false },
      { id: "1y6m_9", text: "會拿玩具電話假裝講電話，或拿空杯子假裝喝水？", category: "社會情緒", isWarning: true },
      { id: "1y6m_10", text: "大人指著遠處的東西時，孩子會順著手勢看過去？", category: "社會情緒", isWarning: true },
      { id: "1y6m_11", text: "孩子不會用手指指東西，想要什麼只會拉大人的手去拿？", category: "社會情緒", isWarning: true, reverse: true },
    ],
  },
  {
    ageGroup: "2 歲",
    minMonths: 23.5,
    maxMonths: 29.5,
    questions: [
      { id: "2y_1", text: "能牽著大人的手，或扶著欄杆走下樓梯？", category: "粗大動作", isWarning: true },
      { id: "2y_2", text: "會雙腳同時離地往上跳？", category: "粗大動作", isWarning: false },
      { id: "2y_3", text: "能自己踢球，而且不會跌倒？", category: "粗大動作", isWarning: false },
      { id: "2y_4", text: "能把至少 4 塊積木疊高不倒？", category: "精細動作", isWarning: false },
      { id: "2y_5", text: "會一頁一頁地翻厚紙板書？", category: "精細動作", isWarning: false },
      { id: "2y_6", text: "會把兩個字組合成短句（例如「媽媽抱抱」、「喝水水」）？", category: "語言認知", isWarning: false },
      { id: "2y_7", text: "能正確指出圖畫書中大人說到的物品或動物？", category: "語言認知", isWarning: true },
      { id: "2y_8", text: "至少會說 10 個別人聽得懂的單字？", category: "語言認知", isWarning: true },
      { id: "2y_9", text: "會自己脫掉沒有鞋帶的鞋子或襪子？", category: "社會情緒", isWarning: false },
      { id: "2y_10", text: "會拿食物餵洋娃娃或玩偶「吃」？", category: "社會情緒", isWarning: true },
      { id: "2y_11", text: "孩子只會重複別人說的話（鸚鵡式仿說），不會自己表達？", category: "語言認知", isWarning: true, reverse: true },
    ],
  },
  {
    ageGroup: "2 歲半",
    minMonths: 29.5,
    maxMonths: 35.5,
    questions: [
      { id: "2y6m_1", text: "能自己上下樓梯，不需要大人牽？", category: "粗大動作", isWarning: false },
      { id: "2y6m_2", text: "會雙腳往前跳一小段距離？", category: "粗大動作", isWarning: false },
      { id: "2y6m_3", text: "能把至少 6 塊積木疊高？", category: "精細動作", isWarning: false },
      { id: "2y6m_4", text: "會轉開瓶蓋或門把？", category: "精細動作", isWarning: false },
      { id: "2y6m_5", text: "能正確指出至少 6 個身體部位？", category: "語言認知", isWarning: true },
      { id: "2y6m_6", text: "會問「這是什麼？」或「為什麼？」", category: "語言認知", isWarning: false },
      { id: "2y6m_7", text: "能聽懂並完成兩個連續動作的指令（例如「去拿鞋子，放在門口」）？", category: "語言認知", isWarning: false },
      { id: "2y6m_8", text: "會自己用湯匙吃東西，而且不太會掉出來？", category: "社會情緒", isWarning: false },
      { id: "2y6m_9", text: "開始對其他小朋友感興趣，會在旁邊看或一起玩？", category: "社會情緒", isWarning: false },
      { id: "2y6m_10", text: "白天大部分時間，能表達想尿尿或大便？", category: "社會情緒", isWarning: false },
      { id: "2y6m_11", text: "孩子行為非常固執，日常習慣稍有改變就大發脾氣、難以安撫？", category: "社會情緒", isWarning: false, reverse: true },
    ],
  },
  {
    ageGroup: "3 歲",
    minMonths: 35.5,
    maxMonths: 41.5,
    questions: [
      { id: "3y_1", text: "能雙腳同時從樓梯最後一階跳下來？", category: "粗大動作", isWarning: true },
      { id: "3y_2", text: "能單腳站 1 到 2 秒？", category: "粗大動作", isWarning: false },
      { id: "3y_3", text: "會踩三輪車的踏板往前騎？", category: "粗大動作", isWarning: true },
      { id: "3y_4", text: "會模仿大人畫出一條直線或圓形？", category: "精細動作", isWarning: false },
      { id: "3y_5", text: "會自己穿上沒有鞋帶的鞋子？", category: "精細動作", isWarning: false },
      { id: "3y_6", text: "能說出自己的名字？", category: "語言認知", isWarning: false },
      { id: "3y_7", text: "能正確使用「你」、「我」、「他」？", category: "語言認知", isWarning: false },
      { id: "3y_8", text: "能指出圖畫書中物品的用途（例如「哪一個可以吃？」）？", category: "語言認知", isWarning: false },
      { id: "3y_9", text: "會和其他小朋友一起玩扮家家酒？", category: "社會情緒", isWarning: false },
      { id: "3y_10", text: "會自己解開比較大的鈕扣？", category: "精細動作", isWarning: true },
      { id: "3y_11", text: "孩子說話經常結巴，或大部分的人都聽不懂他在說什麼？", category: "語言認知", isWarning: true, reverse: true },
    ],
  },
  {
    ageGroup: "3 歲半",
    minMonths: 41.5,
    maxMonths: 47.5,
    questions: [
      { id: "3y6m_1", text: "能單腳站超過 3 秒？", category: "粗大動作", isWarning: false },
      { id: "3y6m_2", text: "能接住大人從近距離拋過來的大球？", category: "粗大動作", isWarning: false },
      { id: "3y6m_3", text: "會用剪刀剪紙（不一定要剪得直）？", category: "精細動作", isWarning: false },
      { id: "3y6m_4", text: "會畫出一個看起來像人的圖（至少有頭和五官）？", category: "精細動作", isWarning: false },
      { id: "3y6m_5", text: "能正確說出至少一種顏色？", category: "語言認知", isWarning: true },
      { id: "3y6m_6", text: "能用 3 到 4 個詞組成完整句子回答問題？", category: "語言認知", isWarning: true },
      { id: "3y6m_7", text: "知道「上面」、「下面」、「裡面」的意思？", category: "語言認知", isWarning: false },
      { id: "3y6m_8", text: "會自己穿上簡單的衣服（例如套頭 T 恤）？", category: "社會情緒", isWarning: false },
      { id: "3y6m_9", text: "玩遊戲時，知道要輪流等待？", category: "社會情緒", isWarning: false },
      { id: "3y6m_10", text: "白天可以自己去上廁所，不需要包尿布？", category: "社會情緒", isWarning: false },
      { id: "3y6m_11", text: "孩子經常毫無理由地大發脾氣，而且很難安撫？", category: "社會情緒", isWarning: false, reverse: true },
    ],
  },
  {
    ageGroup: "4 歲",
    minMonths: 47.5,
    maxMonths: 59.5,
    questions: [
      { id: "4y_1", text: "能單腳連續跳 2 到 3 下？", category: "粗大動作", isWarning: false },
      { id: "4y_2", text: "能一腳一階、不扶欄杆走下樓梯？", category: "粗大動作", isWarning: false },
      { id: "4y_3", text: "會照著範例畫出一個「十字形」？", category: "精細動作", isWarning: false },
      { id: "4y_4", text: "會沿著直線把紙剪開？", category: "精細動作", isWarning: false },
      { id: "4y_5", text: "能說出 2 種以上物品的用途（例如「杯子是用來做什麼的？」）？", category: "語言認知", isWarning: false },
      { id: "4y_6", text: "能正確說出至少 1～2 種顏色（例如紅色、藍色）？", category: "語言認知", isWarning: true },
      { id: "4y_7", text: "能聽懂並完成三個連續動作的指令？", category: "語言認知", isWarning: false },
      { id: "4y_8", text: "會和其他小朋友玩有規則的遊戲（例如紅綠燈、鬼抓人）？", category: "社會情緒", isWarning: false },
      { id: "4y_9", text: "玩扮家家酒時，會扮演不同的角色（例如當醫生、當媽媽）？", category: "社會情緒", isWarning: false },
      { id: "4y_10", text: "會自己扣好衣服上的鈕扣？", category: "精細動作", isWarning: false },
      { id: "4y_11", text: "孩子經常坐不住、一直跑來跑去，很難安靜下來？", category: "社會情緒", isWarning: false, reverse: true },
    ],
  },
  {
    ageGroup: "5 歲",
    minMonths: 59.5,
    maxMonths: 71.5,
    questions: [
      { id: "5y_1", text: "能單腳站超過 5 秒？", category: "粗大動作", isWarning: true },
      { id: "5y_2", text: "能用腳尖接腳跟的方式，往前走一條直線？", category: "粗大動作", isWarning: false },
      { id: "5y_3", text: "會照著範例畫出一個「正方形」？", category: "精細動作", isWarning: true },
      { id: "5y_4", text: "能畫出有頭、身體、手腳的完整人像？", category: "精細動作", isWarning: false },
      { id: "5y_5", text: "能正確點數 10 個以內的物品？", category: "語言認知", isWarning: false },
      { id: "5y_6", text: "能清楚表達自己的想法，和大人正常對話聊天？", category: "語言認知", isWarning: true },
      { id: "5y_7", text: "知道「昨天」、「今天」、「明天」的概念？", category: "語言認知", isWarning: false },
      { id: "5y_8", text: "會自己穿好衣服，包括拉上拉鍊？", category: "社會情緒", isWarning: false },
      { id: "5y_9", text: "在團體中能遵守遊戲規則，不會經常耍賴？", category: "社會情緒", isWarning: false },
      { id: "5y_10", text: "孩子做事容易分心，無法專注完成一件小任務？", category: "社會情緒", isWarning: false, reverse: true },
    ],
  },
  {
    ageGroup: "6 歲",
    minMonths: 71.5,
    maxMonths: 84,
    questions: [
      { id: "6y_1", text: "能一腳一階上下樓梯，不需要扶欄杆？", category: "粗大動作", isWarning: true },
      { id: "6y_2", text: "能接住從地上彈起來、網球大小的球？", category: "粗大動作", isWarning: false },
      { id: "6y_3", text: "會照著範例畫出一個「三角形」？", category: "精細動作", isWarning: true },
      { id: "6y_4", text: "能寫出自己的名字（不一定要很工整）？", category: "精細動作", isWarning: false },
      { id: "6y_5", text: "能和大人一問一答、正常對話聊天，有條理地表達自己的想法？", category: "語言認知", isWarning: true },
      { id: "6y_6", text: "知道左手和右手的分別？", category: "語言認知", isWarning: false },
      { id: "6y_7", text: "認得常見的硬幣（例如 1 元、5 元、10 元）？", category: "語言認知", isWarning: false },
      { id: "6y_8", text: "會自己洗澡、洗頭，並把身體擦乾？", category: "社會情緒", isWarning: false },
      { id: "6y_9", text: "會主動幫忙做簡單的家事（例如收碗筷、摺衣服）？", category: "社會情緒", isWarning: false },
      { id: "6y_10", text: "孩子經常打斷別人說話，或動作粗魯、容易推擠到別人？", category: "社會情緒", isWarning: false, reverse: true },
    ],
  },
];

/** 依實足月齡找到對應的分表；超出範圍回傳 null */
export function findQuestionnaire(ageInMonths: number): Questionnaire | null {
  return (
    QUESTIONNAIRES.find(
      (q) => ageInMonths >= q.minMonths && ageInMonths < q.maxMonths
    ) ?? null
  );
}
