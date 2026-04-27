const countEl = document.getElementById('count');
const scanBtn = document.getElementById('scanBtn');
const downloadAllBtn = document.getElementById('downloadAllBtn');
const emptyState = document.getElementById('emptyState');
const videoList = document.getElementById('videoList');

let videos = [];

function formatDuration(secs) {
  if (!secs) return '';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatResolution(w, h) {
  if (!w || !h) return '';
  return `${w}x${h}`;
}

function renderVideos() {
  if (videos.length === 0) {
    emptyState.style.display = '';
    videoList.style.display = 'none';
    countEl.style.display = 'none';
    downloadAllBtn.disabled = true;
    return;
  }

  emptyState.style.display = 'none';
  videoList.style.display = '';
  countEl.style.display = '';
  countEl.textContent = videos.length;
  downloadAllBtn.disabled = false;

  videoList.innerHTML = '';
  videos.forEach((video, i) => {
    const item = document.createElement('div');
    item.className = 'video-item';

    const meta = [
      formatDuration(video.duration),
      formatResolution(video.width, video.height),
    ].filter(Boolean).join(' | ');

    const thumbHtml = video.thumbnail
      ? `<img class="video-thumb" src="${video.thumbnail}" alt="">`
      : `<div class="video-thumb">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e94560" stroke-width="1.5">
             <polygon points="5 3 19 12 5 21 5 3"/>
           </svg>
         </div>`;

    item.innerHTML = `
      ${thumbHtml}
      <div class="video-info">
        <div class="title" title="${video.context}">${video.context}</div>
        <div class="meta">${meta || 'Video'}</div>
      </div>
      <button class="btn-dl" data-index="${i}" title="Download">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      </button>
    `;
    videoList.appendChild(item);
  });

  // Attach download handlers
  videoList.querySelectorAll('.btn-dl').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      downloadVideo(videos[idx]);
    });
  });
}

function downloadVideo(video) {
  const filename = sanitizeFilename(video.context) + '.mp4';
  chrome.runtime.sendMessage({
    action: 'download',
    url: video.url,
    filename: filename,
  });
}

function sanitizeFilename(name) {
  return name
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 100) || 'ad_video';
}

function fetchVideos() {
  scanBtn.textContent = 'Scanning...';
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab || !tab.url || !tab.url.includes('facebook.com/ads/library')) {
      scanBtn.textContent = 'Scan Page';
      emptyState.querySelector('p').textContent = 'Not on Facebook Ad Library';
      emptyState.querySelector('.hint').textContent = 'Navigate to facebook.com/ads/library to use this extension.';
      return;
    }

    chrome.tabs.sendMessage(tab.id, { action: 'getVideos' }, (response) => {
      scanBtn.textContent = 'Scan Page';
      if (chrome.runtime.lastError) {
        emptyState.querySelector('p').textContent = 'Could not connect to page';
        emptyState.querySelector('.hint').textContent = 'Try refreshing the Facebook Ad Library page.';
        return;
      }
      if (response && response.videos) {
        videos = response.videos;
        renderVideos();
      }
    });
  });
}

scanBtn.addEventListener('click', fetchVideos);

downloadAllBtn.addEventListener('click', () => {
  videos.forEach(video => downloadVideo(video));
});

// Auto-scan on popup open
fetchVideos();
