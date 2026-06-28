/**
 * Le Mans 24 Guide — YouTube Integration Module (RSS-based, No API Key Required)
 * FIA World Endurance Championship Channel: @FIAWEC
 * Verified Channel ID: UCwU7U7PiarcJKLjDJTnANjw
 *
 * 동작 방식:
 *   1. YouTube RSS 피드 (무료, 인증 불필요)로 최신 영상 자동 로드
 *   2. RSS 실패 시 아래 검증된 실제 video ID 목록으로 fallback
 *   3. API Key 가 config.js 에 설정되어 있으면 YouTube Data API v3 도 활용
 */

// 캐시 버전 키 — 채널 ID 수정 후 구버전 캐시 무효화
const CACHE_VERSION = 'v5_rss_fiawec';

// ==========================================
// Fallback Data — 직접 검증된 실제 video ID 목록 (2026년 6월 기준)
// oEmbed API로 유효성 확인 완료
// ==========================================
const VERIFIED_HIGHLIGHTS = {
  videoId: 'Z3j3YYbsBzg',
  title: '10 Best Night Racing Moments | 24 Hours of Le Mans 2026 | FIA WEC',
  description: 'Relive the best night racing moments from the 24 Hours of Le Mans 2026.',
  publishedAt: '2026-06-26T16:00:23Z',
  thumbnailUrl: 'https://i.ytimg.com/vi/Z3j3YYbsBzg/hqdefault.jpg'
};

// 검증된 FIA WEC 영상 목록 (실제 채널에서 확인된 ID들)
const VERIFIED_VIDEOS = [
  {
    videoId: 'Z3j3YYbsBzg',
    title: '10 Best Night Racing Moments | 24 Hours of Le Mans 2026',
    thumbnail: 'https://i.ytimg.com/vi/Z3j3YYbsBzg/hqdefault.jpg',
    publishedAt: '2026-06-26T16:00:23Z'
  }
];

// ==========================================
// Cache Utilities
// ==========================================

function getCacheKey(base) {
  return `${CACHE_VERSION}_${base}`;
}

function clearOldCaches() {
  const legacyKeys = [
    'yt_highlights_cache', 'yt_events_cache',
    'v1_yt_highlights_cache', 'v1_yt_events_cache',
    'v2_fiawec_yt_highlights_cache', 'v2_fiawec_yt_events_cache',
    'v3_fiawec_correct_highlights', 'v3_fiawec_correct_events',
    'v4_rss_fiawec_highlights', 'v4_rss_fiawec_videos',
  ];
  legacyKeys.forEach(k => sessionStorage.removeItem(k));
}

// ==========================================
// RSS Feed Parser — YouTube 공개 피드 사용 (API 키 불필요)
// ==========================================

/**
 * FIA WEC YouTube RSS 피드에서 최신 영상 목록을 가져옵니다.
 * CORS 우회를 위해 allorigins.win 프록시를 사용합니다.
 */
async function fetchFromRSS() {
  const channelId = window.FIA_WEC_CHANNEL_ID;
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  // CORS 우회 공개 프록시
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;

  const cacheKey = getCacheKey('rss_videos');
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      // 15분 캐시
      if (Date.now() - parsed.timestamp < 15 * 60 * 1000) {
        console.log('[RSS] 캐시 데이터 사용:', parsed.videos.length, '개 영상');
        return parsed.videos;
      }
    } catch (e) {
      sessionStorage.removeItem(cacheKey);
    }
  }

  try {
    const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`프록시 응답 오류: ${res.status}`);

    const json = await res.json();
    const xmlText = json.contents;
    if (!xmlText) throw new Error('RSS 내용이 비어 있음');

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
    const entries = Array.from(xmlDoc.querySelectorAll('entry'));

    if (entries.length === 0) throw new Error('RSS 항목 없음');

    const videos = entries
      .filter(entry => {
        // Shorts는 제외 (link href에 /shorts/ 포함된 것)
        const link = entry.querySelector('link')?.getAttribute('href') || '';
        return !link.includes('/shorts/');
      })
      .map(entry => {
        const videoId = entry.querySelector('videoId')?.textContent || '';
        const title = entry.querySelector('title')?.textContent || '';
        const published = entry.querySelector('published')?.textContent || '';
        const thumbnail = entry.querySelector('thumbnail')?.getAttribute('url')
          || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

        return { videoId, title, publishedAt: published, thumbnail };
      })
      .filter(v => v.videoId); // videoId 없는 항목 제거

    console.log('[RSS] 실시간 로드 완료:', videos.length, '개 영상');

    // 캐시 저장
    sessionStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), videos }));
    return videos;
  } catch (err) {
    console.warn('[RSS] 피드 로드 실패:', err.message);
    return null;
  }
}

// ==========================================
// YouTube Data API v3 (API Key 있을 때만 사용)
// ==========================================

async function fetchFromYouTubeAPI() {
  const apiKey = window.YT_API_KEY;
  const channelId = window.FIA_WEC_CHANNEL_ID;

  if (!apiKey) return null;

  clearOldCaches();

  const cacheKey = getCacheKey('api_videos');
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < 30 * 60 * 1000) {
        console.log('[API] 캐시 데이터 사용');
        return parsed.videos;
      }
    } catch (e) {
      sessionStorage.removeItem(cacheKey);
    }
  }

  try {
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.set('part', 'snippet');
    searchUrl.searchParams.set('channelId', channelId);
    searchUrl.searchParams.set('order', 'date');
    searchUrl.searchParams.set('maxResults', '15');
    searchUrl.searchParams.set('type', 'video');
    searchUrl.searchParams.set('videoDuration', 'medium'); // Shorts 제외
    searchUrl.searchParams.set('key', apiKey);

    const res = await fetch(searchUrl.toString(), { signal: AbortSignal.timeout(8000) });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      console.error('[API] YouTube API 오류:', res.status, errBody);
      return null;
    }

    const data = await res.json();
    const items = data.items || [];

    const videos = items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      publishedAt: item.snippet.publishedAt,
      thumbnail:
        item.snippet.thumbnails?.high?.url ||
        item.snippet.thumbnails?.medium?.url ||
        `https://i.ytimg.com/vi/${item.id.videoId}/hqdefault.jpg`
    }));

    console.log('[API] YouTube Data API 로드 완료:', videos.length, '개 영상');
    sessionStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), videos }));
    return videos;
  } catch (err) {
    console.error('[API] YouTube API 호출 실패:', err);
    return null;
  }
}

// ==========================================
// 통합 데이터 로더
// ==========================================

async function loadAllVideos() {
  // 1순위: YouTube Data API (API Key 있을 때)
  const apiVideos = await fetchFromYouTubeAPI();
  if (apiVideos && apiVideos.length > 0) return apiVideos;

  // 2순위: RSS 피드 (무료, 자동)
  const rssVideos = await fetchFromRSS();
  if (rssVideos && rssVideos.length > 0) return rssVideos;

  // 3순위: 검증된 fallback 목록
  console.warn('[Video] 모든 소스 실패 — 검증된 목록 사용');
  return VERIFIED_VIDEOS;
}

// ==========================================
// Video Section Renderer
// ==========================================

/**
 * 영상 섹션 전체 렌더링 (RSS 기반)
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
    const videos = await loadAllVideos();

    // 히어로 — 가장 최신 영상 또는 검증된 데이터
    const heroVideo = {
      videoId: videos[0]?.videoId || VERIFIED_HIGHLIGHTS.videoId,
      title: videos[0]?.title || VERIFIED_HIGHLIGHTS.title,
      publishedAt: videos[0]?.publishedAt || VERIFIED_HIGHLIGHTS.publishedAt,
      thumbnailUrl: videos[0]?.thumbnail || VERIFIED_HIGHLIGHTS.thumbnailUrl,
    };

    renderVideoHero(heroVideo, heroContainer);

    // 피드 — 나머지 영상들을 "FIA WEC 최신 영상" 섹션으로 표시
    const feedVideos = videos.slice(1).map(v => ({
      videoId: v.videoId,
      title: v.title,
      thumbnail: v.thumbnail || `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`
    }));

    if (feedVideos.length > 0) {
      const year = videos[0]?.publishedAt
        ? new Date(videos[0].publishedAt).getFullYear().toString()
        : '2026';

      const eventFeeds = [{
        eventName: 'FIA WEC — 최신 영상',
        year,
        videos: feedVideos
      }];
      renderEventFeeds(eventFeeds, feedContainer);
    } else {
      feedContainer.innerHTML = '';
    }

    heroContainer.dataset.loaded = 'true';
  } catch (err) {
    console.error('[Video] initVideoSection 실패:', err);
    // fallback 렌더링
    renderVideoHero(VERIFIED_HIGHLIGHTS, heroContainer);
    heroContainer.dataset.loaded = 'true';
  }
}

/**
 * 히어로 배너 렌더링
 */
function renderVideoHero(video, container) {
  const publishDate = video.publishedAt
    ? new Date(video.publishedAt).toLocaleDateString('ko-KR', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
    : '';

  const thumbUrl = video.thumbnailUrl
    || `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`;

  container.innerHTML = `
    <div class="video-hero-card">
      <div class="video-hero-label">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        LATEST FIA WEC VIDEO
      </div>
      <div class="video-hero-embed">
        <div class="video-thumb-overlay" data-video-id="${video.videoId}" onclick="activateHeroEmbed(this)">
          <img
            src="${thumbUrl}"
            onerror="this.src='https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg'"
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
 * 히어로 썸네일 클릭 → YouTube 새 창으로 열기
 */
function activateHeroEmbed(overlayEl) {
  const videoId = overlayEl.getAttribute('data-video-id');
  window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
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
                onerror="this.src='https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg'"
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
 * 카루셀 카드 클릭 → YouTube 새 창으로 열기
 */
function openVideoModal(videoId, title) {
  window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
}

function closeVideoModal() {
  // 더 이상 모달을 사용하지 않지만 안전을 위해 유지
  const modal = document.getElementById('video-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;
