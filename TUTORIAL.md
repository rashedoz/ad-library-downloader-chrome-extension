# Tutorial — Ad Library Video Downloader

A complete walkthrough for installing, using, and troubleshooting the extension.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Your First Download](#your-first-download)
4. [Using the Popup](#using-the-popup)
5. [Downloading Videos](#downloading-videos)
6. [Tips for Finding More Videos](#tips-for-finding-more-videos)
7. [Where Are My Downloads?](#where-are-my-downloads)
8. [Updating the Extension](#updating-the-extension)
9. [Uninstalling](#uninstalling)
10. [Troubleshooting](#troubleshooting)
11. [FAQ](#faq)

---

## Prerequisites

- **Google Chrome** (version 88 or later) or any Chromium-based browser (Edge, Brave, Arc, etc.)
- Access to the internet
- No Facebook login is required — the Ad Library is publicly accessible

---

## Installation

### Step 1: Download the Extension

Download or clone the repository to your computer:

```bash
git clone https://github.com/your-username/Ad_Library_Downloader.git
```

Or download the ZIP file and extract it to a folder you'll remember.

### Step 2: Open Chrome Extensions Page

Open Chrome and type this in the address bar:

```
chrome://extensions
```

Press Enter.

### Step 3: Enable Developer Mode

In the top-right corner of the extensions page, flip the **Developer mode** toggle to **ON**.

You'll see three new buttons appear: "Load unpacked", "Pack extension", and "Update".

### Step 4: Load the Extension

1. Click **Load unpacked**.
2. Navigate to the `Ad_Library_Downloader` folder (the one containing `manifest.json`).
3. Click **Select Folder** (Mac) or **Select** (Windows).

The extension card should now appear on the page with the name "Ad Library Video Downloader".

### Step 5: Pin the Extension

1. Click the **puzzle piece icon** in Chrome's toolbar (top-right).
2. Find "Ad Library Video Downloader" in the list.
3. Click the **pin icon** next to it.

The extension icon (a red play button) will now be always visible in your toolbar.

---

## Your First Download

### Step 1: Go to Facebook Ad Library

Navigate to:

```
https://www.facebook.com/ads/library
```

### Step 2: Search for Ads

1. Select a country from the dropdown (e.g., "United States").
2. Choose an ad category (e.g., "All ads").
3. Type an advertiser name or keyword in the search box (e.g., "Nike", "Samsung", "Shopify").
4. Press Enter.

### Step 3: Scroll to Load Videos

Facebook loads ads lazily as you scroll. Scroll down the page to load more ad cards. Video ads will begin playing (muted) as they come into view.

**Tip:** The more you scroll, the more videos the extension will find.

### Step 4: Open the Extension

Click the **Ad Library Downloader** icon in your toolbar.

The popup will automatically scan the page and show all detected videos.

### Step 5: Download

Click the **red download button** next to any video to save it, or click **Download All** to grab everything at once.

---

## Using the Popup

The popup has three main areas:

### Header
- Shows the extension name and a **badge count** of detected videos.

### Toolbar
- **Scan Page** — Manually triggers a fresh scan. Use this after scrolling to find newly loaded videos.
- **Download All** — Downloads every detected video at once. Disabled when no videos are found.

### Video List

Each detected video appears as a card showing:

| Element | Description |
|---|---|
| **Thumbnail** | Preview image of the video (if available). Shows a play icon placeholder if no thumbnail exists. |
| **Title** | The advertiser name or ad context text extracted from the surrounding page elements. |
| **Meta** | Video duration (e.g., `0:30`) and resolution (e.g., `1080x1920`) when available. |
| **Download Button** | Red button with a download arrow — click to save that individual video. |

### Empty State

If no videos are found, the popup shows one of these messages:

- **"No videos found yet"** — You're on the Ad Library but no video ads have loaded. Scroll the page.
- **"Not on Facebook Ad Library"** — You're on a different website. Navigate to the Ad Library first.
- **"Could not connect to page"** — The content script isn't running. Refresh the Ad Library page.

---

## Downloading Videos

### Individual Download

1. Find the video you want in the popup list.
2. Click the **red download button** on its row.
3. The video begins downloading immediately.

### Bulk Download

1. Click **Download All** in the toolbar.
2. All detected videos will start downloading simultaneously.
3. Chrome may ask for permission if multiple downloads are triggered — click **Allow**.

### File Naming

Videos are named using the advertiser name/ad context:

```
Nike_Just_Do_It.mp4
Samsung_Galaxy_S25.mp4
```

- Special characters are removed.
- Spaces are replaced with underscores.
- Names are truncated to 100 characters.
- If no context is found, the file is named `ad_video.mp4`.

---

## Tips for Finding More Videos

1. **Scroll extensively** — Facebook loads ads dynamically. The further you scroll, the more videos the extension detects.

2. **Use specific searches** — Search for well-known brands (they tend to run more video ads).

3. **Filter by media type** — In the Ad Library filters, look for options to show only video ads when available.

4. **Click "See ad details"** — Expanding an individual ad card may load additional video sources.

5. **Re-scan after scrolling** — Click "Scan Page" after scrolling to pick up any videos that loaded since the last scan.

6. **Wait for videos to load** — Some video elements need a moment to initialize. If you see blank cards, wait a few seconds and scan again.

---

## Where Are My Downloads?

All videos are saved to a subfolder called `ad_library_videos` inside your browser's default downloads directory:

| OS | Default Path |
|---|---|
| **macOS** | `~/Downloads/ad_library_videos/` |
| **Windows** | `C:\Users\YourName\Downloads\ad_library_videos\` |
| **Linux** | `~/Downloads/ad_library_videos/` |

You can change your default downloads folder in Chrome Settings > Downloads.

---

## Updating the Extension

When you pull new changes or download an updated version:

1. Replace the old extension folder with the new files.
2. Go to `chrome://extensions`.
3. Click the **refresh icon** on the Ad Library Video Downloader card.

Or simply click the **Update** button at the top of the extensions page.

---

## Uninstalling

1. Go to `chrome://extensions`.
2. Find "Ad Library Video Downloader".
3. Click **Remove**.
4. Confirm the removal.

Your previously downloaded videos will remain in the `ad_library_videos` folder.

---

## Troubleshooting

### "Not on Facebook Ad Library"

**Cause:** You're on a different page.
**Fix:** Navigate to `https://www.facebook.com/ads/library/` and search for ads.

### "Could not connect to page"

**Cause:** The content script wasn't injected. This happens if:
- You installed the extension after the page was already loaded.
- The page was open before enabling the extension.

**Fix:** Refresh the Facebook Ad Library page (`Cmd+R` / `Ctrl+R`), then click the extension icon again.

### No videos appear after scanning

**Cause:** The visible ads may be image-only, or video elements haven't loaded yet.
**Fix:**
1. Scroll down to load more ads (look for ads with a play button overlay).
2. Wait 3-5 seconds for video elements to initialize.
3. Click "Scan Page" again.

### Downloads fail or produce 0-byte files

**Cause:** The video URL has expired. Facebook CDN URLs have a limited lifespan.
**Fix:** Refresh the page, scroll to reload the ads, and download again promptly.

### Chrome asks "This site is trying to download multiple files"

**Cause:** You clicked "Download All" with many videos.
**Fix:** Click **Allow** in the Chrome prompt. This is standard Chrome behavior for batch downloads.

### Extension icon is greyed out

**Cause:** You're not on a matching URL.
**Fix:** The extension only activates on `facebook.com/ads/library/*` pages. Navigate there first.

---

## FAQ

**Q: Do I need a Facebook account?**
A: No. The Facebook Ad Library is publicly accessible without logging in.

**Q: Does this work on Instagram ads?**
A: The Ad Library shows ads from all Meta platforms (Facebook, Instagram, Messenger, Audience Network). If the ad appears in the Ad Library with a video, the extension can detect it.

**Q: Does this work on other websites?**
A: No. The extension is scoped exclusively to the Facebook Ad Library. It will not run on any other site.

**Q: What video quality are the downloads?**
A: The extension downloads whatever quality Facebook serves in the Ad Library. This is typically the preview quality shown in the library, not necessarily the original upload quality.

**Q: Is this legal?**
A: The Facebook Ad Library is a public transparency tool. However, downloaded videos are the intellectual property of the advertisers. Use downloads for research, analysis, and reference. Do not re-publish or redistribute ad creatives without permission.

**Q: Will this work on Firefox / Safari?**
A: Not directly. This extension is built for Chrome's Manifest V3 API. Firefox uses a different extension format. A port would require modifications.

**Q: Does the extension collect any data?**
A: No. The extension runs entirely in your browser. No data is sent to any server. No analytics, no tracking, no accounts.
