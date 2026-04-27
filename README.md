# Ad Library Video Downloader

A Chrome extension that detects and downloads video ads directly from the [Facebook Ad Library](https://www.facebook.com/ads/library/).

---

## Features

- **Automatic Video Detection** — Content script continuously scans the page every 2 seconds as you scroll, picking up newly loaded video ads.
- **Network Interception** — Intercepts XHR and Fetch responses to capture `.mp4` URLs returned by Facebook's API, catching videos that aren't directly visible in the DOM.
- **One-Click Downloads** — Download individual videos or batch-download all detected videos at once.
- **Dark-Themed Popup UI** — Clean, minimal interface showing video thumbnails, advertiser names, duration, and resolution.
- **Organized Output** — All downloads are saved into an `ad_library_videos/` subfolder inside your default downloads directory.
- **Manifest V3** — Built on the latest Chrome extension platform with a service worker background script.

---

## Installation

### From Source (Developer Mode)

1. **Clone or download** this repository:
   ```bash
   git clone https://github.com/your-username/Ad_Library_Downloader.git
   ```

2. Open Chrome and navigate to:
   ```
   chrome://extensions
   ```

3. Enable **Developer mode** using the toggle in the top-right corner.

4. Click **Load unpacked**.

5. Select the `Ad_Library_Downloader` folder.

6. The extension icon will appear in your toolbar. Pin it for easy access.

---

## Quick Start

1. Navigate to **[facebook.com/ads/library](https://www.facebook.com/ads/library/)**.
2. Search for an advertiser or keyword.
3. Scroll through results to load video ads.
4. Click the **extension icon** in your toolbar.
5. The popup auto-scans and displays all detected videos.
6. Click the **download button** on any individual video, or click **Download All**.

Videos are saved to:
```
~/Downloads/ad_library_videos/
```

---

## Project Structure

```
Ad_Library_Downloader/
├── manifest.json      # Extension manifest (Manifest V3)
├── background.js      # Service worker — handles chrome.downloads API
├── content.js         # Content script — video detection & network interception
├── popup.html         # Extension popup UI (HTML + CSS)
├── popup.js           # Popup logic — scan, render, download triggers
├── icons/
│   ├── icon16.png     # Toolbar icon
│   ├── icon48.png     # Extensions page icon
│   └── icon128.png    # Chrome Web Store icon
├── README.md          # This file
├── PROJECT_BRIEF.md   # Architecture & technical brief
└── TUTORIAL.md        # Step-by-step usage tutorial
```

---

## How It Works

### Video Detection (content.js)

The content script uses two complementary strategies:

1. **DOM Scanning** — Queries all `<video>` elements on the page, extracts `src` or `<source>` URLs (filtering out `blob:` URLs), and reads metadata like poster image, dimensions, and duration.

2. **Network Interception** — Monkey-patches `XMLHttpRequest` and `fetch` to inspect API responses. When a response body contains `.mp4` URLs, those are extracted and added to the detected video list.

A periodic scan runs every 2 seconds to catch dynamically loaded ads as the user scrolls.

### Popup (popup.html + popup.js)

When opened, the popup sends a `getVideos` message to the content script and renders the results. Each video card shows:
- Thumbnail (if available)
- Advertiser name / ad context
- Video duration and resolution
- Individual download button

### Background Service Worker (background.js)

Listens for `download` messages from the popup and triggers `chrome.downloads.download()` with the video URL and a sanitized filename.

---

## Permissions

| Permission | Why |
|---|---|
| `activeTab` | Access the current tab to communicate with the content script |
| `downloads` | Save video files to the user's downloads folder |
| `host_permissions: facebook.com/ads/library/*` | Run the content script only on Ad Library pages |

The extension requests **no broad permissions** — it only activates on Facebook Ad Library pages.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| **"Not on Facebook Ad Library"** | Make sure you're on `facebook.com/ads/library` — the extension only works on that specific page. |
| **"Could not connect to page"** | Refresh the Ad Library page. The content script needs to be injected fresh after extension installation. |
| **No videos detected** | Scroll through the ad results to trigger video loading. Some ads are image-only. Click "Scan Page" after scrolling. |
| **Download fails** | The video URL may have expired. Refresh the page and re-scan. Facebook CDN URLs are time-limited. |
| **Blob URLs skipped** | By design — blob URLs can't be downloaded directly. The network interceptor captures the underlying `.mp4` URL instead. |

---

## Limitations

- Only works on the **Facebook Ad Library** (`facebook.com/ads/library`). Does not work on Facebook feeds, Instagram, or other pages.
- Videos served exclusively via blob URLs without a corresponding `.mp4` network request may not be detected.
- Facebook CDN URLs expire after a period of time. Download promptly after scanning.
- The extension does not bypass any access restrictions — you must be able to view the ad to download its video.

---

## Tech Stack

- **Platform**: Chrome Extension Manifest V3
- **Languages**: Vanilla JavaScript, HTML, CSS
- **APIs**: `chrome.downloads`, `chrome.tabs`, `chrome.runtime` messaging
- **No dependencies** — zero external libraries or build steps

---

## License

This project is provided for **educational and research purposes**. Respect Facebook's Terms of Service and applicable copyright laws when downloading ad content. Downloaded videos remain the intellectual property of their respective advertisers.
