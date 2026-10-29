# Voice Demo Player

A small demo-reel player for voice actor websites. It is one JavaScript file with no dependencies. It works on any site that lets you add HTML: plain HTML, WordPress, Squarespace, Wix, Webflow, React, and others.

It is the player from the RealVOTalent embed widget, rebuilt to play your own audio files.

## Features

- Play, pause, and seek
- Track list when there is more than one demo; plays the next demo when one ends
- Six color themes, or your own colors
- Optional download buttons
- Optional call-to-action button (for example "Hire Me" or "Book a Session")
- Only one player on the page plays at a time
- Styles are isolated, so your site CSS does not change the player and the player does not change your site

## Quick start

1. Copy `voice-demo-player.js` and your demo files (MP3 is best) to your site.
2. Add the script once, in the page `<head>` or before `</body>`:

   ```html
   <script src="/voice-demo-player.js" defer></script>
   ```

3. Put the player where you want it. Each link is one demo. The link text is the demo title.

   ```html
   <voice-demo-player name="Jane Doe" theme="light" button-url="/contact">
     <a href="/audio/commercial.mp3">Commercial</a>
     <a href="/audio/narration.mp3">Narration</a>
   </voice-demo-player>
   ```

If JavaScript is off, visitors see the plain links and can still open the demos.

## Options

Set these as attributes on `<voice-demo-player>`.

| Attribute | Example | What it does |
|-----------|---------|--------------|
| `name` | `name="Jane Doe"` | Shows under the demo title. Also used in download file names. |
| `theme` | `theme="dark"` | `light` (default), `dark`, `midnight`, `warm`, `forest`, `minimal` |
| `bg` | `bg="#1f1135"` | Background color. Overrides the theme. |
| `text` | `text="#f5f3ff"` | Text color. Overrides the theme. |
| `accent` | `accent="#f472b6"` | Button and progress color. Overrides the theme. |
| `downloads` | `downloads` | Shows download buttons. |
| `button-url` | `button-url="mailto:jane@example.com"` | Shows the call-to-action button and sets its link. No button if you leave it out. |
| `button-text` | `button-text="Book a Session"` | Button label. Default: "Hire {name} Now". |
| `button-new-tab` | `button-new-tab` | Opens the button link in a new tab. |

Colors use 6-digit hex values. The player picks black or white button text to match the accent color.

## Width

The player fills its container up to 320 px. To change the maximum width, add CSS on your site:

```css
voice-demo-player { max-width: 480px; }
```

## Seeking needs Range support

To let visitors drag the progress bar, the server that holds the audio files must support HTTP Range requests (it answers with `206 Partial Content`). Almost all web hosts and CDNs do. If seeking jumps back to the start, the audio host does not support Range requests. Move the files to a host that does.

## Downloads from another domain

If the audio files are on a different domain from the site (for example a CDN or cloud storage), the browser can only save them when that server sends CORS headers. Without CORS headers, the download button opens the file in a new tab instead. Files on the same domain as the site always download.

## Moving from the RealVOTalent embed

RealVOTalent closes on 2026-11-04. After that date the old embed code (an `<iframe>` that loads from `realvotalent.com/embed/...`) shows nothing.

1. Download your demo files. Use the originals if you have them.
2. Upload the demo files and `voice-demo-player.js` to your site.
3. Delete the old `<iframe ...>` and the `<script>` that came after it.
4. Add the new player as shown in Quick start. Use the same theme and colors as before.

The old embed URL options map like this:

| Old URL option | New attribute |
|----------------|---------------|
| `theme=dark` | `theme="dark"` |
| `bg=1f1135` | `bg="#1f1135"` |
| `text=f5f3ff` | `text="#f5f3ff"` |
| `accent=f472b6` | `accent="#f472b6"` |
| `dl=1` | `downloads` |

## Example

Open `example/index.html` through a local web server to see three players:

```bash
npx serve .
# or
python3 -m http.server
```

Then go to `/example/`. The audio files in `example/audio/` are test tones.

## Browser support

Current versions of Chrome, Edge, Firefox, and Safari (desktop and mobile).

## License

MIT. See [LICENSE](LICENSE).
