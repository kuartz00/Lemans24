/**
 * Le Mans 24 Guide - MVP Application Logic (Updated)
 */

// ==========================================
// 1. Fallback Mockup Data
// ==========================================

const FALLBACK_HISTORY = [
  {
    "id": "intro",
    "title": "르망24란 무엇인가요?",
    "content": "르망 24시(24 Hours of Le Mans)는 프랑스 사르트 서킷에서 개최되는 세계 최고 역사의 내구 레이스입니다. 1923년 첫 대회를 시작으로 매년 6월 개최되며, 세계 최고 성능의 레이싱카들이 24시간 동안 끊임없이 달리며 한계를 시험합니다. 단순히 속도만 겨루는 것이 아니라 차량의 내구성, 연비, 신뢰성이 모두 우승을 결정하는 핵심 요소입니다."
  },
  {
    "id": "purpose",
    "title": "경기의 목적과 우승 조건은?",
    "content": "르망 24시의 우승 조건은 심플합니다. '24시간 동안 가장 긴 거리를 주행한 차량이 승리한다'는 것입니다. 이를 위해 차량 한 대당 3명의 드라이버가 교대로 운전하며, 평균 시속 220km/h가 넘는 속도로 서킷을 주행합니다. 주행 거리 합산은 약 5,000km를 초과하기도 하며, 이는 서울과 부산을 약 6회 왕복하는 거리와 맞먹습니다."
  },
  {
    "id": "why24",
    "title": "왜 하필 24시간 동안 달리나요?",
    "content": "24시간 내구 레이스는 인간의 체력적 한계와 기계의 기계적 한계를 극한까지 밀어붙이기 위해 고안되었습니다. 낮과 밤, 그리고 다시 아침으로 이어지는 시간의 변화 속에서 기온 변화, 칠흑 같은 어둠 속에서의 야간 주행, 수시로 변하는 악천후를 극복해야 합니다. 완성차 제조사들은 이 혹독한 24시간의 시험대를 거쳐 양산차에 탑재할 미래 신기술(하이브리드 시스템, 고전압 배터리, 고효율 엔진 등)을 개발하고 검증해 왔습니다."
  }
];

// 확장된 우승 결과 데이터: 2021~2026, 클래스별 (최신순 내림차순)
const FALLBACK_RESULTS = [
  // 2026 (예상/가정 데이터)
  { "year": "2026", "winner": "TBD", "class": "Hypercar", "car": "TBD", "note": "2026년 대회 결과는 아직 확정되지 않았습니다. 최신 결과는 르망 공식 사이트를 확인하세요." },
  // 2025
  { "year": "2025", "winner": "Ferrari AF Corse (#50)", "class": "Hypercar", "car": "Ferrari 499P", "note": "페라리가 치열한 수중전과 접전 속에서 토요타와 포르쉐를 제치고 역사적인 르망 3연패 대기록을 달성했습니다." },
  { "year": "2025", "winner": "Inter Europol Competition (#34)", "class": "LMP2", "car": "Oreca 07 Gibson", "note": "2025년 LMP2 클래스 우승팀으로, 일관된 페이스와 무결한 피트워크를 바탕으로 클래스 승리를 거머쥐었습니다." },
  { "year": "2025", "winner": "Iron Dames (#85)", "class": "LMGT3", "car": "Lamborghini Huracan GT3", "note": "전원 여성 드라이버로 구성된 아이언 데임즈가 감격적인 LMGT3 클래스 우승을 차지하며 역사를 새로 썼습니다." },
  // 2024
  { "year": "2024", "winner": "Ferrari AF Corse (#50)", "class": "Hypercar", "car": "Ferrari 499P", "note": "비가 쏟아지는 악천후 속에서 타이어 전략을 성공시킨 페라리가 단 14초 차이로 토요타를 누르고 2년 연속 우승을 차지했습니다." },
  { "year": "2024", "winner": "Racing Team Turkey (#37)", "class": "LMP2", "car": "Oreca 07 Gibson", "note": "2024년 LMP2 클래스 우승. 개막 하이퍼카 클래스와 다른 페이스 관리 전략으로 스태미나 레이스를 완주했습니다." },
  { "year": "2024", "winner": "Manthey PureRxcing (#92)", "class": "LMGT3", "car": "Porsche 911 GT3 R", "note": "LMGT3 클래스 신설 원년 우승팀으로 포르쉐 팩토리 지원을 받은 만테이 팀이 첫 우승 트로피를 품었습니다." },
  // 2023
  { "year": "2023", "winner": "Ferrari AF Corse (#51)", "class": "Hypercar", "car": "Ferrari 499P", "note": "르망 24시 개최 100주년이자 페라리의 최상위 클래스 복귀 첫해, 토요타의 6연패를 저지하고 50년 만에 감격의 우승을 품었습니다." },
  { "year": "2023", "winner": "United Autosports (#23)", "class": "LMP2", "car": "Oreca 07 Gibson", "note": "2023년 LMP2 클래스 우승. 유나이티드 오토스포츠가 숙련된 팀워크와 전략적 피트 스톱으로 클래스 정상에 올랐습니다." },
  // 2022
  { "year": "2022", "winner": "Toyota Gazoo Racing (#8)", "class": "Hypercar", "car": "Toyota GR010 Hybrid", "note": "토요타 레이싱 팀이 압도적인 완성도와 노련한 레이스 운영으로 르망 5연패를 달성하며 하이퍼카 강자의 면모를 굳혔습니다." },
  { "year": "2022", "winner": "United Autosports (#22)", "class": "LMP2", "car": "Oreca 07 Gibson", "note": "2022년 LMP2 클래스 우승. 영국 팀 유나이티드 오토스포츠가 안정적인 레이스로 LMP2 정상을 차지했습니다." },
  // 2021
  { "year": "2021", "winner": "Toyota Gazoo Racing (#7)", "class": "Hypercar", "car": "Toyota GR010 Hybrid", "note": "기존 LMP1 클래스를 대체하는 최상위 친환경 클래스 '하이퍼카(Hypercar)'가 최초 도입된 원년 대회의 첫 우승 팀으로 기록되었습니다." },
  { "year": "2021", "winner": "LMP2 Panis Racing (#65)", "class": "LMP2", "car": "Oreca 07 Gibson", "note": "2021년 LMP2 클래스 우승. 프랑스 파니 레이싱이 홈 이점을 살리며 감격적인 클래스 우승을 달성했습니다." }
];

const FALLBACK_TEAMS = [
  {
    "id": "genesis",
    "name": "Genesis Racing",
    "country": "🇰🇷 South Korea",
    "class": "Hypercar",
    "features": "현대자동차의 프리미엄 브랜드 제네시스가 르망24시 최상위 등급인 하이퍼카(LMDh 규정) 클래스 참전을 공식 선언했습니다. 고성능 기술력 입증과 글로벌 프리미엄 브랜드 이미지 강화를 목표로 독자적인 차량 개발을 조율하고 있으며, 모터스포츠 팬들의 엄청난 기대를 모으고 있습니다.",
    "officialUrl": "https://www.genesis.com/kr/ko/motorsport.html"
  },
  {
    "id": "ferrari",
    "name": "Ferrari AF Corse",
    "country": "🇮🇹 Italy",
    "class": "Hypercar",
    "features": "이탈리아의 자존심이자 F1의 전설 페라리의 르망 공식 팀입니다. 2023년 50년 만에 복귀하자마자 100주년 대회를 우승하고, 이어서 2024년, 2025년까지 3연속 우승을 쓸어 담으며 최강의 저력을 보여주고 있는 최고 권위의 팀입니다.",
    "officialUrl": "https://www.ferrari.com/en-EN/motorsport/le-mans"
  },
  {
    "id": "porsche",
    "name": "Porsche Penske Motorsport",
    "country": "🇩🇪 Germany",
    "class": "Hypercar",
    "features": "르망 역사상 통산 최다 우승(19회) 기록을 보유한 포르쉐와 미국의 명문 팀 펜스키가 결성한 팩토리 드림팀입니다. 안정적이고 완성도 높은 하이브리드 머신 963을 통해 매년 우승 후보 1순위로 지목되고 있습니다.",
    "officialUrl": "https://motorsports.porsche.com/int/en"
  },
  {
    "id": "toyota",
    "name": "Toyota Gazoo Racing",
    "country": "🇯🇵 Japan",
    "class": "Hypercar",
    "features": "2018년부터 2022년까지 르망 5연패를 달성한 내구레이스의 지배자입니다. 높은 내구성 신뢰도와 풍부한 24시간 레이스 운영 경험을 바탕으로 완벽에 가까운 팀워크와 노련한 레이스 전략을 구사합니다.",
    "officialUrl": "https://gazooracing.com/motorsport/wec"
  },
  {
    "id": "cadillac",
    "name": "Cadillac Racing",
    "country": "🇺🇸 USA",
    "class": "Hypercar",
    "features": "5.5리터 자연흡기 V8 엔진을 탑재하여 서킷 전체를 뒤흔드는 마초적인 배기 사운드로 가장 높은 현장 인기를 누리는 팀입니다. 강력한 직진 가속도와 독특한 실루엣이 상징적입니다.",
    "officialUrl": "https://www.cadillac.com/world-of-cadillac/racing"
  },
  {
    "id": "bmw",
    "name": "BMW M Team WRT",
    "country": "🇩🇪 Germany",
    "class": "Hypercar",
    "features": "유럽 유수의 내구레이스 명가 WRT 팀이 운영을 맡고, BMW M 부서의 하이퍼카 M Hybrid V8을 결합했습니다. 예술적이고 개성 넘치는 리버리 아트카 디자인과 강렬한 프론트 그릴 디자인이 인상적입니다.",
    "officialUrl": "https://www.bmw-motorsport.com"
  },
  {
    "id": "alpine",
    "name": "Alpine Endurance Team",
    "country": "🇫🇷 France",
    "class": "Hypercar",
    "features": "프랑스를 대표하는 스포츠카 브랜드 알핀의 하이퍼카 팀입니다. 프렌치 블루 컬러가 감싸안은 유려한 A424 차량을 선보이며 홈 팬들의 열성적인 응원을 등에 업고 상위권 도약을 목표로 하고 있습니다.",
    "officialUrl": "https://www.alpinecars.com/motorsport"
  },
  {
    "id": "jota",
    "name": "Hertz Team JOTA",
    "country": "🇬🇧 UK",
    "class": "Hypercar",
    "features": "포르쉐 963 차량을 공급받아 출전하는 하이퍼카 클래스의 최강 프라이빗(민간) 팀입니다. 화려한 금빛 골드 리버리를 두르고 팩토리 팀 못지않은 우수한 스피드와 전략으로 포디움을 위협합니다.",
    "officialUrl": "https://www.jotasport.com"
  },
  {
    "id": "irondames",
    "name": "Iron Dames",
    "country": "🇮🇹 Italy",
    "class": "LMGT3",
    "features": "여성 모터스포츠 활성화를 목표로 전원 여성 레이서로만 구성된 역사적인 팀입니다. 눈에 띄는 핫핑크 컬러의 람보르기니 Huracan 차량을 운용하며 우수한 주행력과 승부처 결단력으로 클래스 우승을 사수하는 강팀입니다.",
    "officialUrl": "https://www.irondames.com"
  },
  {
    "id": "proton",
    "name": "Proton Competition",
    "country": "🇩🇪 Germany",
    "class": "LMGT3",
    "features": "포르쉐 차량을 기반으로 수십 년간 내구 레이스의 중추 역할을 해온 역사 깊은 GT 명가입니다. 숙련된 드라이버 관리와 피트워크로 기복 없는 레이스 주행을 자랑합니다.",
    "officialUrl": "https://www.proton-competition.com"
  },
  {
    "id": "united",
    "name": "United Autosports",
    "country": "🇬🇧 UK",
    "class": "LMGT3",
    "features": "맥라렌의 GT3 머신을 들고 출전하는 다국적 강팀입니다. 정교하게 다듬어진 차체 에어로다이내믹 기술과 프로 및 아마추어 드라이버의 균형 있는 경기 조율이 돋보입니다.",
    "officialUrl": "https://www.unitedautosports.com"
  },
  {
    "id": "akkodis",
    "name": "Akkodis ASP Team",
    "country": "🇫🇷 France",
    "class": "LMGT3",
    "features": "렉서스 RC F GT3 차량을 조율하는 GT 무대의 잔뼈 굵은 실력파 팀입니다. 타 차량 대비 높은 직선 구간 스피드와 우수한 고속 코너 안정성을 살려 순위 경쟁에 뛰어듭니다.",
    "officialUrl": "https://www.akkodis-asp.com"
  }
];

const TODAY_FACTS = [
  "르망 24시에서는 차의 최고 속도가 400km/h에 달하기도 했습니다. 현재는 안전상의 이유로 직선 시케인이 설치되어 340km/h선으로 제한됩니다.",
  "드라이버 3명이 교대로 운전하며, 1명의 드라이버가 연속으로 운전할 수 있는 최대 시간은 4시간으로 엄격히 제한됩니다.",
  "르망 레이싱은 예전에 드라이버들이 신호가 떨어지면 서킷 반대편에서 차를 향해 달려가 올라타 시동을 걸고 출발하는 전통이 있었습니다.",
  "포르쉐는 르망 24시 통산 19회 우승으로 제조사 최다 우승 타이틀을 보유하고 있습니다. 그 뒤를 페라리가 11회로 따르고 있습니다.",
  "피트인 시 타이어를 바꾸거나 기름을 넣는 전략은 1초 단위로 성패가 결정됩니다. 24시간 동안 수십 번의 피트 스톱이 일어납니다."
];

// 서킷 구간 상세 데이터
const CIRCUIT_SECTORS = {
  ford: {
    name: "Ford Chicanes",
    korName: "포드 시케인 (출발/결승선)",
    speed: "약 200 km/h",
    type: "🏁 복합 시케인",
    description: "서킷의 시작이자 끝인 출발/결승선 구역입니다. 경기 초반 앞차 추월을 위해 브레이킹 포인트 싸움이 가장 치열하게 벌어지는 구간이며, 지속적인 고속 선회 이후 급감속이 요구됩니다.",
    tip: "💡 공략 포인트: 좌우로 꺾이는 S자 시케인에서 출구 쪽 라인 선점이 다음 직선 가속의 핵심입니다."
  },
  dunlop: {
    name: "Dunlop Curves",
    korName: "던롭 커브",
    speed: "약 270 km/h",
    type: "🔄 고속 복합 코너",
    description: "던롭 교량 아래를 통과한 뒤 이어지는 연속 고속 코너 구간입니다. 다운포스가 부족한 LMGT3 차량에게 가장 불리한 구간이며, 하이퍼카와의 격차가 가장 크게 벌어지는 곳입니다.",
    tip: "💡 공략 포인트: 스로틀 개방 타이밍이 핵심 — 코너 진입 속도보다 코너 출구에서의 전속력 가속이 랩타임을 결정합니다."
  },
  mulsanne: {
    name: "Mulsanne Straight",
    korName: "뮬산 스트레이트",
    speed: "약 340 km/h",
    type: "⚡ 초장거리 직선 구간",
    description: "르망 서킷의 상징 구간입니다. 총 길이 약 5.5km의 초장거리 직선으로 하이퍼카가 최고 시속 345km까지 가속합니다. 1990년 안전 규정 개정으로 뮬산 코너 이전 두 개의 시케인이 추가되었습니다.",
    tip: "💡 관전 포인트: 두 시케인 사이의 순간 전속력 구간에서 클래스별 속도 차이가 가장 극명하게 드러납니다."
  },
  indianapolis: {
    name: "Indianapolis Corner",
    korName: "인디애나폴리스 코너",
    speed: "약 230 km/h",
    type: "🔁 장반경 고속 코너",
    description: "뮬산 스트레이트 말미의 300km/h 이상 속도에서 급격히 감속해야 하는 고속 코너입니다. 브레이킹 거리 계산 실패는 즉시 그래블 트랩 또는 벽 충돌로 이어집니다. 역사적으로 가장 많은 리타이어가 발생한 곳 중 하나입니다.",
    tip: "💡 공략 포인트: 초반 진입 속도보다 늦게 감속할수록 코너 안쪽 클리핑 포인트 공략이 어려워집니다."
  },
  porsche: {
    name: "Porsche Curves",
    korName: "포르쉐 커브",
    speed: "약 260 km/h",
    type: "🌀 고속 연속 코너",
    description: "포르쉐 커브는 여러 개의 빠른 코너가 연달아 이어지는 구간으로 드라이버의 집중력과 차량의 에어로다이내믹 세팅이 극도로 중요합니다. 야간 주행 시 가시거리가 제한되어 특히 위험한 구간으로 꼽힙니다.",
    tip: "💡 관전 포인트: 야간 레이스에서 헤드라이트 불빛으로 차량 추적이 가능한 구간 — 박진감 넘치는 포지션 다툼을 볼 수 있습니다."
  },
  final: {
    name: "Maison Blanche",
    korName: "메종 블랑쉐",
    speed: "약 250 km/h",
    type: "📍 마지막 섹터",
    description: "결승선을 앞두고 통과하는 마지막 고속 구간입니다. '하얀 집'이라는 뜻의 메종 블랑쉐 코너는 결승선까지 마지막 가속을 붙이는 시점입니다. 레이스 마무리 단계에서 피트 스톱 타이밍을 노리는 팀들에게 전략적으로 중요한 위치입니다.",
    tip: "💡 공략 포인트: 이 구간에서 피트 레인 진입 여부를 판단하는 전략적 결정이 최종 순위를 뒤바꾸기도 합니다."
  }
};

// ==========================================
// 2. State & Data Handlers
// ==========================================

let historyData = [];
let resultsData = [];
let teamsData = [];

async function loadAppData() {
  try {
    const response = await fetch('./data/history.json');
    if (!response.ok) throw new Error('History Fetch Failed');
    historyData = await response.json();
  } catch (e) {
    console.warn("Using fallback history data:", e);
    historyData = FALLBACK_HISTORY;
  }

  try {
    const response = await fetch('./data/results.json');
    if (!response.ok) throw new Error('Results Fetch Failed');
    resultsData = await response.json();
  } catch (e) {
    console.warn("Using fallback results data:", e);
    resultsData = FALLBACK_RESULTS;
  }

  try {
    const response = await fetch('./data/teams.json');
    if (!response.ok) throw new Error('Teams Fetch Failed');
    teamsData = await response.json();
  } catch (e) {
    console.warn("Using fallback teams data:", e);
    teamsData = FALLBACK_TEAMS;
  }
}

// ==========================================
// 3. Wikipedia API Integration
// ==========================================

async function fetchWikipediaSummary() {
  const cacheKey = 'wiki_le_mans_summary';
  const cachedData = sessionStorage.getItem(cacheKey);

  if (cachedData) {
    renderWikiCard(JSON.parse(cachedData));
    return;
  }

  try {
    const response = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/24_Hours_of_Le_Mans');
    if (!response.ok) throw new Error('Wikipedia API returned error status');
    const data = await response.json();
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
    renderWikiCard(data);
  } catch (error) {
    console.error("Wikipedia API fetch failed:", error);
    renderWikiCardFallback();
  }
}

function renderWikiCard(apiData) {
  const container = document.getElementById('wiki-api-container');
  if (!container) return;

  const description = apiData.description || 'Annual endurance sports car race held in France';
  const wikiUrl = apiData.content_urls?.desktop?.page || 'https://en.wikipedia.org/wiki/24_Hours_of_Le_Mans';
  const koreanSummary = `위키백과 실시간 제공 정보에 따르면, 르망 24시(${apiData.title || '24 Hours of Le Mans'})는 프랑스에서 매년 개최되는 대규모 모터스포츠 축제이자 대표적인 스포츠카 내구 레이스입니다. (${description})`;

  container.innerHTML = `
    <div class="wiki-card">
      <div class="wiki-title-tag">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14h-2v-4h2zm0-6h-2V8h2z"/></svg>
        WIKIPEDIA 실시간 정보
      </div>
      <p class="wiki-text">${koreanSummary}</p>
      <a href="${wikiUrl}" target="_blank" class="wiki-link" aria-label="Wikipedia 르망24 문서 새로고침 이동">Wikipedia에서 영어 원문 읽기 &rarr;</a>
    </div>
  `;
}

function renderWikiCardFallback() {
  const container = document.getElementById('wiki-api-container');
  if (!container) return;

  container.innerHTML = `
    <div class="wiki-card" style="border-left-color: var(--text-muted)">
      <div class="wiki-title-tag" style="color: var(--text-muted)">WIKIPEDIA 연결 안 됨</div>
      <p class="wiki-text">인터넷 연결이 오프라인 상태이거나 API 호출이 지연되고 있습니다. 오프라인 상태에서도 핵심 내구 레이스 가이드를 자유롭게 감상하실 수 있습니다.</p>
    </div>
  `;
}

// ==========================================
// 4. UI Rendering Functions
// ==========================================

function renderDailyFact() {
  const factTextElement = document.getElementById('daily-fact-text');
  if (!factTextElement) return;
  const randomIndex = Math.floor(Math.random() * TODAY_FACTS.length);
  factTextElement.textContent = TODAY_FACTS[randomIndex];
}

function renderHistoryAccordion() {
  const container = document.getElementById('history-accordion-container');
  if (!container) return;

  container.innerHTML = historyData.map((item, index) => `
    <div class="accordion-item ${index === 0 ? 'active' : ''}">
      <button class="accordion-header" aria-expanded="${index === 0}" aria-controls="accordion-panel-${item.id}">
        <span>${item.title}</span>
        <svg class="accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div id="accordion-panel-${item.id}" class="accordion-content">
        <p>${item.content}</p>
      </div>
    </div>
  `).join('');

  const headers = container.querySelectorAll('.accordion-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      container.querySelectorAll('.accordion-item').forEach(el => {
        el.classList.remove('active');
        el.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * Render Recent Results with class filter
 */
function renderRecentResults(filterClass = 'ALL') {
  const container = document.getElementById('results-timeline-container');
  if (!container) return;

  // 연도 내림차순 정렬
  const sorted = [...resultsData].sort((a, b) => parseInt(b.year) - parseInt(a.year));

  // 클래스 필터링
  const filtered = filterClass === 'ALL'
    ? sorted
    : sorted.filter(r => r.class === filterClass);

  if (filtered.length === 0) {
    container.innerHTML = `<div class="no-results">해당 클래스의 결과 데이터가 없습니다.</div>`;
    return;
  }

  // 클래스별 배지 색상
  const classBadgeClass = {
    'Hypercar': 'timeline-class-hypercar',
    'LMP2': 'timeline-class-lmp2',
    'LMGT3': 'timeline-class-lmgt3'
  };

  // TBD 항목은 스타일 구분
  container.innerHTML = filtered.map((result, idx) => {
    const isTBD = result.winner === 'TBD';
    return `
      <div class="timeline-item ${isTBD ? 'timeline-item-tbd' : ''}">
        <div class="timeline-marker ${idx === 0 && !isTBD ? 'timeline-marker-first' : ''}"></div>
        <div class="timeline-header">
          <span class="timeline-year">${result.year}년</span>
          <span class="timeline-class ${classBadgeClass[result.class] || ''}">${result.class}</span>
        </div>
        ${!isTBD ? `
        <div class="timeline-winner-info">🏆 ${result.winner}</div>
        <div class="timeline-car">🏎️ ${result.car}</div>
        ` : `<div class="timeline-winner-info" style="color: var(--text-muted)">⏳ 대회 결과 집계 전</div>`}
        <div class="timeline-comment">${result.note}</div>
      </div>
    `;
  }).join('');
}

/**
 * Render Teams — no emblems, with official link
 */
function renderTeams(filterKeyword = '') {
  const container = document.getElementById('teams-grid-container');
  if (!container) return;

  const keyword = filterKeyword.toLowerCase().trim();
  const filtered = teamsData.filter(team => {
    return team.name.toLowerCase().includes(keyword) ||
           team.country.toLowerCase().includes(keyword) ||
           team.class.toLowerCase().includes(keyword) ||
           team.features.toLowerCase().includes(keyword);
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        검색 결과에 맞는 참가 팀이 존재하지 않습니다.<br>
        다른 키워드로 다시 검색해 보세요.
      </div>
    `;
    return;
  }

  const classBadgeClass = { 'Hypercar': 'class-hypercar', 'LMP2': 'class-lmp2', 'LMGT3': 'class-lmgt3' };

  container.innerHTML = filtered.map(team => {
    const badge = classBadgeClass[team.class] || '';
    const linkHtml = team.officialUrl ? `
      <a href="${team.officialUrl}" target="_blank" rel="noopener noreferrer" class="team-official-link" aria-label="${team.name} 공식 사이트 열기">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        공식 사이트 바로가기
      </a>
    ` : '';

    return `
      <div class="glass-card team-card">
        <div class="team-card-header">
          <div class="team-name-block">
            <div class="team-name">${team.name}</div>
            <div class="team-country">${team.country}</div>
          </div>
          <span class="team-class-badge ${badge}">${team.class}</span>
        </div>
        <div class="team-features">${team.features}</div>
        ${linkHtml}
      </div>
    `;
  }).join('');
}

// ==========================================
// 5. Circuit Section Logic
// ==========================================

function initCircuitSection() {
  const sectors = document.querySelectorAll('.circuit-sector');
  const infoPanel = document.getElementById('circuit-sector-info');
  if (!sectors.length || !infoPanel) return;

  sectors.forEach(sector => {
    const handler = () => {
      const sectorId = sector.getAttribute('data-sector');
      const data = CIRCUIT_SECTORS[sectorId];
      if (!data) return;

      // 활성화 상태 토글
      sectors.forEach(s => s.classList.remove('active'));
      sector.classList.add('active');

      infoPanel.innerHTML = `
        <div class="circuit-sector-detail">
          <div class="circuit-sector-detail-header">
            <div>
              <div class="circuit-sector-type">${data.type}</div>
              <h3 class="circuit-sector-name">${data.name}</h3>
              <div class="circuit-sector-korname">${data.korName}</div>
            </div>
            <div class="circuit-sector-speed">
              <div class="circuit-sector-speed-value">${data.speed}</div>
              <div class="circuit-sector-speed-label">최고 통과 속도</div>
            </div>
          </div>
          <p class="circuit-sector-desc">${data.description}</p>
          <div class="circuit-sector-tip">${data.tip}</div>
        </div>
      `;

      // 패널로 부드럽게 스크롤
      infoPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    sector.addEventListener('click', handler);
    sector.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
    });
  });
}

// ==========================================
// 6. Results Filter Tab Logic
// ==========================================

function initResultsFilter() {
  const filterBtns = document.querySelectorAll('.results-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterClass = btn.getAttribute('data-class');
      renderRecentResults(filterClass);
    });
  });
}

// ==========================================
// 7. SPA Routing & Event Binding
// ==========================================

const SECTIONS = ['home', 'about', 'guide', 'circuit', 'compare', 'results', 'teams', 'video'];

function handleRouting() {
  let hash = window.location.hash.substring(1);
  if (!SECTIONS.includes(hash)) {
    hash = 'home';
    window.location.hash = '#home';
    return;
  }

  SECTIONS.forEach(sec => {
    const el = document.getElementById(`section-${sec}`);
    if (el) {
      if (sec === hash) {
        el.classList.add('active');
        if (sec === 'about') {
          fetchWikipediaSummary();
        } else if (sec === 'home') {
          renderDailyFact();
        } else if (sec === 'video') {
          initVideoSection();
        }
      } else {
        el.classList.remove('active');
      }
    }
  });

  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(nav => {
    const secTarget = nav.getAttribute('data-section');
    if (secTarget === hash) {
      nav.classList.add('active');
      nav.setAttribute('aria-current', 'page');
    } else {
      nav.classList.remove('active');
      nav.removeAttribute('aria-current');
    }
  });

  window.scrollTo(0, 0);
}

function initClassTabSwitcher() {
  const tabContainer = document.querySelector('.tabs-container');
  if (!tabContainer) return;

  const tabButtons = tabContainer.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const classId = btn.getAttribute('data-class');
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const panels = document.querySelectorAll('.class-panel');
      panels.forEach(panel => {
        panel.id === `panel-${classId}` ? panel.classList.add('active') : panel.classList.remove('active');
      });
    });
  });
}

function initThemeManager() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  const savedTheme = localStorage.getItem('theme-preference');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  let currentTheme = 'dark';
  if (savedTheme) {
    currentTheme = savedTheme;
  } else if (!systemPrefersDark) {
    currentTheme = 'light';
  }

  document.body.setAttribute('data-theme', currentTheme);
  themeToggle.setAttribute('aria-label', currentTheme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환');

  themeToggle.addEventListener('click', () => {
    const theme = document.body.getAttribute('data-theme');
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme-preference', newTheme);
    themeToggle.setAttribute('aria-label', newTheme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환');
  });
}

// ==========================================
// 8. Initialization
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
  initThemeManager();
  await loadAppData();

  renderDailyFact();
  renderHistoryAccordion();
  renderRecentResults();
  renderTeams();
  initClassTabSwitcher();
  initCircuitSection();
  initResultsFilter();

  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(nav => {
    nav.addEventListener('click', () => {
      const section = nav.getAttribute('data-section');
      if (section) {
        window.location.hash = `#${section}`;
      }
    });
  });

  const searchInput = document.getElementById('team-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderTeams(e.target.value);
    });
  }

  const ctaBeginner = document.getElementById('cta-go-beginner');
  const ctaResults = document.getElementById('cta-go-results');

  if (ctaBeginner) {
    ctaBeginner.addEventListener('click', () => { window.location.hash = '#guide'; });
  }
  if (ctaResults) {
    ctaResults.addEventListener('click', () => { window.location.hash = '#results'; });
  }

  window.addEventListener('hashchange', handleRouting);
  handleRouting();
});
