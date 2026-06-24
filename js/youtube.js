/**
 * Le Mans 24 Guide — YouTube Data API v3 Integration Module
 * FIA World Endurance Championship Channel: @FIAWEC
 * Channel ID: UCgnpv3zS4h2nI5eD995q1yA
 */

// 캐시 버전 — API Key가 바뀌거나 채널ID가 변경될 때 자동으로 구버전 캐시 무효화
const CACHE_VERSION = 'v3_fiawec_correct';

// ==========================================
// Mock Fallback Data (API 오류 시 사용하는 실제 르망 관련 영상)
// ==========================================

// 실제 FIA WEC 르망24 Extended Highlights 영상들 (알려진 실제 video ID)
const MOCK_HIGHLIGHTS = {
  videoId: 'Zn3s_2LPy-c',  // 2023 Le Mans 24H Extended Highlights – FIA WEC
  title: '2023 24 Hours of Le Mans — Extended Highlights',
  description: 'The extended highlights of the 2023 24 Hours of Le Mans, the 100th anniversary edition.',
  publishedAt: '2023-06-11T18:00:00Z',
  thumbnailUrl: 'https://img.youtube.com/vi/Zn3s_2LPy-c/maxresdefault.jpg'
};

const MOCK_EVENT_FEEDS = [
  {
    eventName: '24 Hours of Le Mans',
    year: '2024',
    videos: [
      {
        videoId: 'Zn3s_2LPy-c',
        title: '2023 24 Hours of Le Mans — Extended Highlights',
        thumbnail: 'https://img.youtube.com/vi/Zn3s_2LPy-c/hqdefault.jpg'
      },
      {
        videoId: 'A7kOhzfHnxg',
        title: '2024 24 Hours of Le Mans — Race Start Highlights',
        thumbnail: 'https://img.youtube.com/vi/A7kOhzfHnxg/hqdefault.jpg'
      },
      {
        videoId: 'sBNk7rHBSbc',
        title: '2022 24 Hours of Le Mans — Extended Highlights',
        thumbnail: 'https://img.youtube.com/vi/sBNk7rHBSbc/hqdefault.jpg'
      }
    ]
  },
  {
    eventName: '6 Hours of Spa-Francorchamps',
    year: '2024',
    videos: [
      {
        videoId: 'E4JNlNbNf7E',
        title: '2024 6 Hours of Spa-Francorchamps — Extended Highlights',
        thumbnail: 'https://img.youtube.com/vi/E4JNlNbNf7E/hqdefault.jpg'
      },
      {
        videoId: 'tHKiZBi3HrI',
        title: '2023 6 Hours of Spa — Extended Highlights',
        thumbnail: 'https://img.youtube.com/vi/tHKiZBi3HrI/hqdefault.jpg'
      }
    ]
  },
  {
    eventName: '6 Hours of Imola',
    year: '2024',
    videos: [
      {
        videoId: 'V2OlpEsikV4',
        title: '2024 6 Hours of Imola — Extended Highlights',
        thumbnail: 'https://img.youtube.com/vi/V2OlpEsikV4/hqdefault.jpg'
      }
    ]
  }
];

// ==========================================
// Cache Utilities
// ==========================================

function getCacheKey(base) {
  return `${CACHE_VERSION}_${base}`;
}

/**
 * API Key가 설정돼 있을 때 이전 버전 캐시 전체 초기화
 */
function clearOldCaches() {
  // 이전 잘못된 캐시 키들 정리
  const legacyKeys = [
    'yt_highlights_cache',
    'yt_events_cache',
    'v1_yt_highlights_cache',
    'v1_yt_events_cache',
    'v2_fiawec_yt_highlights_cache',
    'v2_fiawec_yt_events_cache',
  ];
  legacyKeys.forEach(k => sessionStorage.removeItem(k));
}

// ==========================================
// YouTube API Functions
// ==========================================

/**
 * YouTube API 호출: 최신 Extended Highlights 영상 가져오기
 */
async function fetchLatestHighlights() {
  const apiKey = window.YT_API_KEY;
  const channelId = window.FIA_WEC_CHANNEL_ID;

  // API Key 존재 시 구버전 캐시 우선 제거
  if (apiKey) clearOldCaches();

  if (!apiKey) {
    console.warn('[YouTube] API Key 없음 — Mock 데이터 사용');
    return MOCK_HIGHLIGHTS;
  }

  const cacheKey = getCacheKey('highlights');
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      console.log('[YouTube] Highlights 캐시 데이터 사용:', parsed.title);
      return parsed;
    } catch (e) {
      sessionStorage.removeItem(cacheKey);
    }
  }

  try {
    // "Extended Highlights" 최신 영상 검색
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.set('part', 'snippet');
    searchUrl.searchParams.set('channelId', channelId);
    searchUrl.searchParams.set('q', 'Extended Highlights');
    searchUrl.searchParams.set('order', 'date');
    searchUrl.searchParams.set('maxResults', '1');
    searchUrl.searchParams.set('type', 'video');
    searchUrl.searchParams.set('key', apiKey);

    const res = await fetch(searchUrl.toString());

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      console.error('[YouTube] API Error:', res.status, errBody);
      throw new Error(`YouTube API error: ${res.status}`);
    }

    const data = await res.json();

    if (!data.items || data.items.length === 0) {
      console.warn('[YouTube] Highlights 검색 결과 없음 — Mock 사용');
      return MOCK_HIGHLIGHTS;
    }

    const item = data.items[0];
    const result = {
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      thumbnailUrl:
        item.snippet.thumbnails?.maxres?.url ||
        item.snippet.thumbnails?.high?.url ||
        item.snippet.thumbnails?.medium?.url ||
        `https://img.youtube.com/vi/${item.id.videoId}/hqdefault.jpg`
    };

    console.log('[YouTube] Highlights 실시간 로드 완료:', result.title, result.videoId);
    sessionStorage.setItem(cacheKey, JSON.stringify(result));
    return result;
  } catch (err) {
    console.error('[YouTube] fetchLatestHighlights 실패:', err);
    return MOCK_HIGHLIGHTS;
  }
}

/**
 * YouTube API 호출: 이벤트(대회명)별 최근 영상 목록
 */
async function fetchVideosByEvents() {
  const apiKey = window.YT_API_KEY;
  const channelId = window.FIA_WEC_CHANNEL_ID;

  if (!apiKey) {
    console.warn('[YouTube] API Key 없음 — Mock 이벤트 피드 사용');
    return MOCK_EVENT_FEEDS;
  }

  const cacheKey = getCacheKey('events');
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      console.log('[YouTube] Events 캐시 데이터 사용');
      return parsed;
    } catch (e) {
      sessionStorage.removeItem(cacheKey);
    }
  }

  const eventQueries = [
    { eventName: '24 Hours of Le Mans',           query: 'Le Mans 24 Hours Extended Highlights' },
    { eventName: '6 Hours of Spa-Francorchamps',  query: '6 Hours Spa Extended Highlights' },
    { eventName: '6 Hours of Imola',              query: '6 Hours Imola Extended Highlights' },
    { eventName: '6 Hours of Fuji',               query: '6 Hours Fuji Extended Highlights' },
    { eventName: '8 Hours of Bahrain',            query: '8 Hours Bahrain Highlights' },
  ];

  try {
    const results = await Promise.all(
      eventQueries.map(async ({ eventName, query }) => {
        const url = new URL('https://www.googleapis.com/youtube/v3/search');
        url.searchParams.set('part', 'snippet');
        url.searchParams.set('channelId', channelId);
        url.searchParams.set('q', query);
        url.searchParams.set('order', 'date');
        url.searchParams.set('maxResults', '5');
        url.searchParams.set('type', 'video');
        url.searchParams.set('key', apiKey);

        const res = await fetch(url.toString());
        if (!res.ok) {
          console.warn(`[YouTube] "${eventName}" 검색 실패: ${res.status}`);
          return { eventName, year: '', videos: [] };
        }

        const data = await res.json();
        const items = data.items || [];

        const videos = items.map(item => ({
          videoId: item.id.videoId,
          title: item.snippet.title,
          thumbnail:
            item.snippet.thumbnails?.high?.url ||
            item.snippet.thumbnails?.medium?.url ||
            `https://img.youtube.com/vi/${item.id.videoId}/hqdefault.jpg`
        }));

        const year = items.length > 0
          ? new Date(items[0].snippet.publishedAt).getFullYear().toString()
          : '';

        return { eventName, year, videos };
      })
    );

    const filtered = results.filter(r => r.videos.length > 0);
    console.log('[YouTube] Events 실시간 로드 완료. 이벤트 수:', filtered.length);

    if (filtered.length > 0) {
      sessionStorage.setItem(cacheKey, JSON.stringify(filtered));
      return filtered;
    } else {
      console.warn('[YouTube] API 결과 없음 — Mock 이벤트 피드 사용');
      return MOCK_EVENT_FEEDS;
    }
  } catch (err) {
    console.error('[YouTube] fetchVideosByEvents 실패:', err);
    return MOCK_EVENT_FEEDS;
  }
}

// ==========================================
// Video Section Renderer
// ==========================================

/**
 * 영상 섹션 전체 렌더링
 */
async function initVideoSection() {
  const heroContainer = document.getElementById('video-hero-container');
  const feedContainer = document.getElementById('video-feed-container');

  if (!heroContainer || !feedContainer) return;

  // 이미 로드됐으면 재렌더 방지
  if (heroContainer.dataset.loaded === 'true') return;

  heroContainer.innerHTML = `<div class="video-loading"><div class="video-loading-spinner"></div><p>영상 불러오는 중...</p></div>`;
  feedContainer.innerHTML = '';

  try {
    const [highlights, eventFeeds] = await Promise.all([
      fetchLatestHighlights(),
      fetchVideosByEvents()
    ]);

    renderVideoHero(highlights, heroContainer);
    renderEventFeeds(eventFeeds, feedContainer);
    heroContainer.dataset.loaded = 'true';
  } catch (err) {
    console.error('[Video] initVideoSection 실패:', err);
    heroContainer.innerHTML = `
      <div class="video-error">
        영상을 불러올 수 없습니다.<br>
        <small>API Key 또는 인터넷 연결을 확인해 주세요.</small>
      </div>
    `;
  }
}

/**
 * 히어로 배너 렌더링 (최신 Extended Highlights)
 */
function renderVideoHero(video, container) {
  const publishDate = video.publishedAt
    ? new Date(video.publishedAt).toLocaleDateString('ko-KR', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
    : '';

  // 썸네일: API에서 받은 URL 우선, 없으면 YouTube 기본 썸네일
  const thumbUrl = video.thumbnailUrl
    || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;

  container.innerHTML = `
    <div class="video-hero-card">
      <div class="video-hero-label">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        LATEST EXTENDED HIGHLIGHTS
      </div>
      <div class="video-hero-embed">
        <div class="video-thumb-overlay" data-video-id="${video.videoId}" onclick="activateHeroEmbed(this)">
          <img
            src="${thumbUrl}"
            onerror="this.src='https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg'"
            alt="${video.title} 썸네일"
          >
          <div class="video-play-btn" aria-label="영상 재생">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </div>
      </div>
      <div class="video-hero-info">
        <h2 class="video-hero-title">${video.title}</h2>
        ${publishDate ? `<span class="video-hero-date">${publishDate}</span>` : ''}
        <a href="https://www.youtube.com/watch?v=${video.videoId}" target="_blank" rel="noopener noreferrer" class="video-yt-link">
          YouTube에서 보기 →
        </a>
      </div>
    </div>
  `;
}

/**
 * 히어로 썸네일 클릭 → iframe 실제 재생으로 전환
 */
function activateHeroEmbed(overlayEl) {
  const videoId = overlayEl.getAttribute('data-video-id');
  const wrapper = overlayEl.parentElement;
  wrapper.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0"
      title="FIA WEC Extended Highlights"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  `;
}

window.activateHeroEmbed = activateHeroEmbed;

/**
 * 이벤트별 영상 카루셀 피드 렌더링
 */
function renderEventFeeds(eventFeeds, container) {
  if (!eventFeeds || eventFeeds.length === 0) {
    container.innerHTML = `<p class="video-no-feed">표시할 대회 영상이 없습니다.</p>`;
    return;
  }

  container.innerHTML = eventFeeds.map(feed => `
    <div class="video-event-section">
      <div class="video-event-header">
        ${feed.year ? `<span class="video-event-year">${feed.year}</span>` : ''}
        <h3 class="video-event-name">${feed.eventName}</h3>
      </div>
      <div class="video-carousel" role="list">
        ${feed.videos.map(v => `
          <div class="video-card" role="listitem">
            <div class="video-card-thumb" data-video-id="${v.videoId}" onclick="openVideoModal('${v.videoId}', \`${v.title.replace(/`/g, "'")}\`)">
              <img
                src="${v.thumbnail}"
                alt="${v.title} 썸네일"
                loading="lazy"
                onerror="this.src='https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg'"
              >
              <div class="video-card-play">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </div>
            </div>
            <p class="video-card-title">${v.title}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

/**
 * 카루셀 카드 클릭 → 모달 팝업 재생
 */
function openVideoModal(videoId, title) {
  let modal = document.getElementById('video-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'video-modal';
    modal.className = 'video-modal-overlay';
    modal.innerHTML = `
      <div class="video-modal-inner">
        <button class="video-modal-close" onclick="closeVideoModal()" aria-label="닫기">✕</button>
        <div class="video-modal-embed" id="video-modal-embed"></div>
        <p class="video-modal-title" id="video-modal-title"></p>
      </div>
    `;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeVideoModal();
    });
    document.body.appendChild(modal);
  }

  document.getElementById('video-modal-embed').innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0"
      title="${title}"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  `;
  document.getElementById('video-modal-title').textContent = title;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  const modal = document.getElementById('video-modal');
  if (modal) {
    modal.classList.remove('active');
    document.getElementById('video-modal-embed').innerHTML = '';
    document.body.style.overflow = '';
  }
}

window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;
