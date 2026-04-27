chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'download') {
    chrome.downloads.download({
      url: msg.url,
      filename: `ad_library_videos/${msg.filename}`,
      saveAs: false,
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error('Download failed:', chrome.runtime.lastError.message);
      }
    });
  }
});
