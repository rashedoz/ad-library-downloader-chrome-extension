(() => {
  const foundVideos = new Map();

  function extractVideoSrc(videoEl) {
    // Direct src on the video element
    if (videoEl.src && !videoEl.src.startsWith('blob:')) {
      return videoEl.src;
    }
    // Check <source> children
    const source = videoEl.querySelector('source');
    if (source && source.src && !source.src.startsWith('blob:')) {
      return source.src;
    }
    return null;
  }

  function getThumbnail(videoEl) {
    return videoEl.poster || null;
  }

  function getAdContext(videoEl) {
    // Walk up to find the ad card container and extract advertiser name / ad ID
    let container = videoEl.closest('[class*="ad"]') || videoEl.parentElement;
    let text = '';
    for (let i = 0; i < 8 && container; i++) {
      const spans = container.querySelectorAll('span, a');
      for (const el of spans) {
        if (el.textContent && el.textContent.trim().length > 2 && el.textContent.trim().length < 100) {
          text = el.textContent.trim();
          break;
        }
      }
      if (text) break;
      container = container.parentElement;
    }
    return text || 'Facebook Ad';
  }

  function scanForVideos() {
    const videos = document.querySelectorAll('video');
    let newCount = 0;

    videos.forEach((video, index) => {
      const src = extractVideoSrc(video);
      if (src && !foundVideos.has(src)) {
        const info = {
          url: src,
          thumbnail: getThumbnail(video),
          context: getAdContext(video),
          width: video.videoWidth || video.clientWidth || 0,
          height: video.videoHeight || video.clientHeight || 0,
          duration: isFinite(video.duration) ? video.duration : 0,
        };
        foundVideos.set(src, info);
        newCount++;
      }
    });

    return newCount;
  }

  // Also intercept XHR/fetch responses that contain video URLs
  const videoUrlPatterns = [
    /video[^"']*\.mp4/i,
    /\/v\/t[\d.]+\//,
    /fbcdn.*?video/i,
  ];

  function extractUrlsFromText(text) {
    const urlRegex = /https?:\/\/[^\s"'<>]+\.mp4[^\s"'<>]*/gi;
    const matches = text.match(urlRegex) || [];
    matches.forEach(url => {
      const clean = url.replace(/\\u0025/g, '%').replace(/\\/g, '');
      if (!foundVideos.has(clean)) {
        foundVideos.set(clean, {
          url: clean,
          thumbnail: null,
          context: 'Intercepted Video',
          width: 0,
          height: 0,
          duration: 0,
        });
      }
    });
  }

  // Monkey-patch XHR to catch video URLs in API responses
  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url) {
    this._adLibUrl = url;
    return origOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function () {
    this.addEventListener('load', function () {
      try {
        if (typeof this.responseText === 'string' && this.responseText.includes('mp4')) {
          extractUrlsFromText(this.responseText);
        }
      } catch (e) { /* ignore cross-origin errors */ }
    });
    return origSend.apply(this, arguments);
  };

  // Monkey-patch fetch
  const origFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await origFetch.apply(this, args);
    try {
      const clone = response.clone();
      clone.text().then(text => {
        if (text.includes('mp4')) {
          extractUrlsFromText(text);
        }
      }).catch(() => {});
    } catch (e) { /* ignore */ }
    return response;
  };

  // Periodic scan for new video elements (ads load dynamically)
  setInterval(scanForVideos, 2000);
  scanForVideos();

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === 'getVideos') {
      scanForVideos();
      sendResponse({ videos: Array.from(foundVideos.values()) });
    }
    return true;
  });
})();
