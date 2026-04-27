# Project Brief — Ad Library Video Downloader

## Overview

**Ad Library Video Downloader** is a lightweight Chrome extension (Manifest V3) that enables users to detect and download video advertisements from the Facebook Ad Library. It is designed for marketers, researchers, and competitive analysts who need to save video ad creatives for offline review.

---

## Problem Statement

The Facebook Ad Library provides transparency into active and inactive ads across Meta platforms. While the library allows users to browse and view ad creatives, there is no built-in way to download video content. Users who need to save videos for competitive analysis, research reports, or creative reference must resort to screen recording or third-party tools.

This extension solves that by detecting video sources directly from the page and providing a native download experience.

---

## Target Users

| User Type | Use Case |
|---|---|
| **Digital Marketers** | Analyze competitor video ad creatives, build swipe files |
| **Creative Agencies** | Research ad trends, reference formats and styles |
| **Academic Researchers** | Study political ads, misinformation, or ad targeting |
| **Brand Managers** | Monitor how competitors position their products |

---

## Technical Architecture

### Component Diagram

```
┌─────────────────────────────────────────────────────┐
│  Facebook Ad Library Page                           │
│                                                     │
│  ┌─────────────┐   ┌──────────────────────────┐    │
│  │ <video> DOM │   │ XHR / Fetch API Traffic  │    │
│  │  elements   │   │  (contains .mp4 URLs)    │    │
│  └──────┬──────┘   └────────────┬─────────────┘    │
│         │                       │                   │
│         └───────────┬───────────┘                   │
│                     ▼                               │
│         ┌───────────────────────┐                   │
│         │    content.js         │                   │
│         │  - DOM scanner        │                   │
│         │  - XHR interceptor    │                   │
│         │  - Fetch interceptor  │                   │
│         │  - Video Map store    │                   │
│         └───────────┬───────────┘                   │
└─────────────────────┼───────────────────────────────┘
                      │ chrome.runtime.onMessage
                      ▼
┌─────────────────────────────────────────────────────┐
│  Extension                                          │
│                                                     │
│  ┌──────────────┐          ┌──────────────────┐    │
│  │  popup.html  │──msg───▶ │  background.js   │    │
│  │  popup.js    │          │  (service worker) │    │
│  │              │          │                   │    │
│  │  - Renders   │          │  - chrome         │    │
│  │    video list│          │    .downloads     │    │
│  │  - Scan btn  │          │    .download()   │    │
│  │  - DL btns   │          │                   │    │
│  └──────────────┘          └──────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### Data Flow

1. User navigates to `facebook.com/ads/library` and scrolls through ads.
2. `content.js` is injected automatically (`run_at: document_idle`).
3. The content script begins:
   - **Periodic DOM scan** (every 2s) — finds `<video>` elements, extracts non-blob `src` URLs.
   - **XHR interception** — wraps `XMLHttpRequest.prototype.open/send` to read response bodies containing `.mp4` URLs.
   - **Fetch interception** — wraps `window.fetch` to clone responses and extract `.mp4` URLs.
4. All discovered videos are stored in a `Map` keyed by URL (deduplication).
5. When the user opens the popup, `popup.js` sends a `getVideos` message to `content.js`.
6. `content.js` responds with the current video list.
7. `popup.js` renders the list. On download click, it sends a `download` message to `background.js`.
8. `background.js` calls `chrome.downloads.download()` to save the file.

### Key Design Decisions

| Decision | Rationale |
|---|---|
| **Manifest V3** | Required for new Chrome extensions. Uses service worker instead of persistent background page. |
| **No external dependencies** | Keeps the extension lightweight, fast to load, and easy to audit. |
| **Dual detection (DOM + network)** | DOM scanning catches visible `<video>` elements. Network interception catches URLs that may be loaded before the video is rendered or in lazy-loaded ad cards. |
| **Blob URL filtering** | Blob URLs are non-downloadable cross-origin. The network interceptor captures the original `.mp4` URL before it becomes a blob. |
| **2-second scan interval** | Balances responsiveness with performance. Facebook lazy-loads ad cards on scroll, so periodic re-scanning is necessary. |
| **Filename sanitization** | Advertiser names may contain special characters. Filenames are cleaned and truncated to 100 chars. |
| **`ad_library_videos/` subfolder** | Keeps downloads organized and separate from other browser downloads. |

---

## Permissions Justification

The extension follows the **principle of least privilege**:

- **`activeTab`** — Only accesses the tab when the user explicitly clicks the extension icon.
- **`downloads`** — Required to programmatically save files via `chrome.downloads`.
- **`host_permissions`** — Scoped exclusively to `https://www.facebook.com/ads/library/*`. The content script does not run on any other domain.

No data is collected, transmitted, or stored outside the browser.

---

## Security Considerations

- The content script runs in the page's JavaScript context (required for XHR/fetch interception) but only on the Ad Library domain.
- No user data, cookies, or authentication tokens are accessed.
- Downloaded files are standard `.mp4` video files — no executable code.
- The extension does not modify page content or inject visible UI into Facebook.

---

## Future Enhancements (Potential)

- **Image ad downloads** — Extend detection to image creatives.
- **Ad metadata export** — Export advertiser name, ad ID, active dates, and targeting info as CSV/JSON alongside the video.
- **Batch scroll-and-collect** — Automatically scroll the page to load all ads before scanning.
- **Download progress indicator** — Show progress bars in the popup for active downloads.
- **Chrome Web Store distribution** — Package and publish for one-click installation.

---

## Version History

| Version | Date | Notes |
|---|---|---|
| 1.0.0 | 2026-04-27 | Initial release — video detection, download, popup UI |
