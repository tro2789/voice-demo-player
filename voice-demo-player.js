/*!
 * Voice Demo Player v1.0.0
 * A small demo-reel player for voice actor websites. No dependencies.
 * MIT License, (c) 2026 Trevor O'Hare
 */
(function () {
  'use strict'

  if (typeof window === 'undefined' || !window.customElements) return
  if (window.customElements.get('voice-demo-player')) return

  var THEMES = {
    light: { bg: '#ffffff', text: '#1a3a50', accent: '#006aa3' },
    dark: { bg: '#1c1c1c', text: '#d4d4d4', accent: '#a78bfa' },
    midnight: { bg: '#0f172a', text: '#e2e8f0', accent: '#38bdf8' },
    warm: { bg: '#fffbf5', text: '#44403c', accent: '#d97706' },
    forest: { bg: '#f0fdf4', text: '#1a3a2e', accent: '#16a34a' },
    minimal: { bg: '#ffffff', text: '#374151', accent: '#111827' },
  }
  var DEFAULT_THEME = 'light'

  // Only one player on the page plays at a time
  var PLAY_EVENT = 'voice-demo-player:play'

  var ICON_PLAY = '<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M2.5 1v10l8-5-8-5z"/></svg>'
  var ICON_PAUSE = '<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><rect x="1.5" y="1" width="3" height="10" rx="0.8"/><rect x="7.5" y="1" width="3" height="10" rx="0.8"/></svg>'
  var ICON_DOWNLOAD = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 1v8.5M3.5 6.5L7 10l3.5-3.5M2 12h10"/></svg>'
  var ICON_DOWNLOAD_SMALL = '<svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 1v8.5M3.5 6.5L7 10l3.5-3.5M2 12h10"/></svg>'
  var ICON_BARS =
    '<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">' +
    '<rect x="1" y="3" width="2" height="6" rx="0.5" opacity="0.9"><animate attributeName="height" values="6;3;6" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y" values="3;4.5;3" dur="0.8s" repeatCount="indefinite"/></rect>' +
    '<rect x="5" y="2" width="2" height="8" rx="0.5" opacity="0.9"><animate attributeName="height" values="8;4;8" dur="0.6s" repeatCount="indefinite"/><animate attributeName="y" values="2;4;2" dur="0.6s" repeatCount="indefinite"/></rect>' +
    '<rect x="9" y="4" width="2" height="4" rx="0.5" opacity="0.9"><animate attributeName="height" values="4;7;4" dur="0.7s" repeatCount="indefinite"/><animate attributeName="y" values="4;2.5;4" dur="0.7s" repeatCount="indefinite"/></rect>' +
    '</svg>'

  var STYLES =
    ':host{display:block;width:100%;max-width:320px}' +
    ':host([hidden]){display:none}' +
    '*{box-sizing:border-box}' +
    '.player{display:flex;flex-direction:column;font-family:system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);border-radius:10px;overflow:hidden;box-shadow:var(--shadow)}' +
    '.error{padding:10px 12px;font-size:11px;color:var(--subtext);text-align:center;border-bottom:1px solid var(--border);background:var(--hover)}' +
    '.now{padding:10px 12px 0}' +
    '.row{display:flex;align-items:center;gap:10px;margin-bottom:8px}' +
    '.play{width:32px;height:32px;padding:0;border-radius:50%;border:none;background:var(--accent);color:var(--btn-text);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:var(--accent-shadow);transition:transform .15s ease}' +
    '.play:hover{transform:scale(1.06)}' +
    '.meta{flex:1;min-width:0}' +
    '.title{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-0.01em}' +
    '.name{font-size:11px;color:var(--subtext);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.dl{width:28px;height:28px;padding:0;border-radius:6px;border:none;background:transparent;color:var(--muted);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:color .15s}' +
    '.dl:hover{color:var(--accent)}' +
    '.seek-row{display:flex;align-items:center;gap:6px;padding-bottom:8px}' +
    '.time{font-size:10px;color:var(--muted);width:28px;font-variant-numeric:tabular-nums}' +
    '.time.end{text-align:right}' +
    '.seek{-webkit-appearance:none;appearance:none;flex:1;height:4px;margin:0;border-radius:2px;cursor:pointer;background:linear-gradient(to right,var(--accent) var(--progress,0%),var(--track-bg) var(--progress,0%))}' +
    '.seek::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;height:10px;width:10px;border-radius:50%;background:var(--accent);cursor:pointer}' +
    '.seek::-moz-range-thumb{height:10px;width:10px;border:none;border-radius:50%;background:var(--accent);cursor:pointer}' +
    '.list{border-top:1px solid var(--border);padding:4px 0}' +
    '.item{display:flex;align-items:center;transition:background .15s}' +
    '.item:hover{background:var(--hover)}' +
    '.item.active{background:var(--active-bg)}' +
    '.track{flex:1;min-width:0;display:flex;align-items:center;gap:8px;padding:6px 12px;border:none;background:transparent;cursor:pointer;text-align:left;font:inherit;color:var(--text)}' +
    '.num{width:16px;font-size:10px;font-weight:500;flex-shrink:0;display:flex;justify-content:center;color:var(--muted)}' +
    '.item.active .num{color:var(--accent)}' +
    '.track-title{flex:1;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--subtext)}' +
    '.item.active .track-title{font-weight:600;color:var(--accent)}' +
    '.track-dl{width:20px;height:20px;margin-right:12px;padding:0;border:none;border-radius:4px;background:transparent;color:var(--muted);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:color .15s}' +
    '.track-dl:hover{color:var(--accent)}' +
    '.cta-wrap{padding:6px 12px 10px}' +
    '.cta{display:block;width:100%;padding:8px 0;background:var(--accent);color:var(--btn-text);font-size:12px;font-weight:600;text-align:center;text-decoration:none;border-radius:6px;letter-spacing:.01em;transition:opacity .15s}' +
    '.cta:hover{opacity:.9}' +
    'button:focus-visible,a:focus-visible,input:focus-visible{outline:2px solid var(--accent);outline-offset:2px}'

  function hexToRgb(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : { r: 0, g: 0, b: 0 }
  }

  function isDarkColor(hex) {
    var c = hexToRgb(hex)
    return (c.r * 299 + c.g * 587 + c.b * 114) / 1000 < 128
  }

  function normalizeHex(value) {
    if (!value) return null
    var v = value.trim()
    return /^#?[0-9a-f]{6}$/i.test(v) ? (v.charAt(0) === '#' ? v : '#' + v) : null
  }

  function rgba(c, a) {
    return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + a + ')'
  }

  function deriveColors(bg, text, accent) {
    var t = hexToRgb(text)
    var a = hexToRgb(accent)
    var dark = isDarkColor(bg)
    return {
      '--bg': bg,
      '--text': text,
      '--accent': accent,
      '--subtext': rgba(t, dark ? 0.7 : 0.65),
      '--muted': rgba(t, dark ? 0.5 : 0.45),
      '--border': rgba(t, dark ? 0.12 : 0.14),
      '--track-bg': rgba(t, 0.1),
      '--hover': rgba(t, dark ? 0.06 : 0.04),
      '--active-bg': rgba(a, 0.08),
      '--accent-shadow': '0 2px 6px ' + rgba(a, 0.25),
      '--shadow': dark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
      '--btn-text': isDarkColor(accent) ? '#ffffff' : '#000000',
    }
  }

  function formatTime(s) {
    if (!isFinite(s) || s < 0) s = 0
    var m = Math.floor(s / 60)
    var sec = Math.floor(s % 60)
    return m + ':' + (sec < 10 ? '0' : '') + sec
  }

  function el(tag, className) {
    var node = document.createElement(tag)
    if (className) node.className = className
    return node
  }

  class VoiceDemoPlayer extends HTMLElement {
    connectedCallback() {
      var self = this
      if (!this._built) {
        var tracks = this._readTracks()
        // The script ran before the links were parsed. Wait for the page.
        if (!tracks.length && document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', function () {
            if (self.isConnected) self.connectedCallback()
          }, { once: true })
          return
        }
        if (!tracks.length) return
        this._tracks = tracks
        this._build()
        this._built = true
      }
      this._onOtherPlay = function (e) {
        if (e.detail !== self && !self._audio.paused) self._audio.pause()
      }
      window.addEventListener(PLAY_EVENT, this._onOtherPlay)
    }

    disconnectedCallback() {
      if (this._onOtherPlay) window.removeEventListener(PLAY_EVENT, this._onOtherPlay)
      if (this._audio) this._audio.pause()
    }

    _readTracks() {
      return Array.prototype.map.call(this.querySelectorAll('a[href]'), function (a) {
        return { title: a.textContent.trim() || 'Demo', src: a.href }
      })
    }

    _build() {
      var self = this
      var name = (this.getAttribute('name') || '').trim()
      var downloads = this.hasAttribute('downloads')
      var buttonUrl = this.getAttribute('button-url')
      var buttonText = this.getAttribute('button-text') || (name ? 'Hire ' + name + ' Now' : 'Get in Touch')

      var base = THEMES[this.getAttribute('theme')] || THEMES[DEFAULT_THEME]
      var colors = deriveColors(
        normalizeHex(this.getAttribute('bg')) || base.bg,
        normalizeHex(this.getAttribute('text')) || base.text,
        normalizeHex(this.getAttribute('accent')) || base.accent
      )

      var root = this.attachShadow({ mode: 'open' })
      var style = el('style')
      style.textContent = STYLES
      root.appendChild(style)

      var player = el('div', 'player')
      Object.keys(colors).forEach(function (k) { player.style.setProperty(k, colors[k]) })
      root.appendChild(player)

      var error = el('div', 'error')
      error.setAttribute('role', 'alert')
      error.textContent = 'This demo could not be loaded.'
      error.hidden = true
      player.appendChild(error)

      // Now playing
      var now = el('div', 'now')
      var row = el('div', 'row')
      var playBtn = el('button', 'play')
      playBtn.type = 'button'
      var meta = el('div', 'meta')
      var title = el('div', 'title')
      meta.appendChild(title)
      if (name) {
        var nameLine = el('div', 'name')
        nameLine.textContent = name
        meta.appendChild(nameLine)
      }
      row.appendChild(playBtn)
      row.appendChild(meta)
      var dlBtn = null
      if (downloads) {
        dlBtn = el('button', 'dl')
        dlBtn.type = 'button'
        dlBtn.innerHTML = ICON_DOWNLOAD
        dlBtn.addEventListener('click', function () { self._download(self._index) })
        row.appendChild(dlBtn)
      }
      now.appendChild(row)

      var seekRow = el('div', 'seek-row')
      var cur = el('span', 'time')
      var seek = el('input', 'seek')
      seek.type = 'range'
      seek.min = '0'
      seek.max = '0'
      seek.step = '0.1'
      seek.value = '0'
      seek.setAttribute('aria-label', 'Seek')
      var dur = el('span', 'time end')
      seekRow.appendChild(cur)
      seekRow.appendChild(seek)
      seekRow.appendChild(dur)
      now.appendChild(seekRow)
      player.appendChild(now)

      // Track list
      var items = []
      if (this._tracks.length > 1) {
        var list = el('div', 'list')
        this._tracks.forEach(function (t, i) {
          var item = el('div', 'item')
          var btn = el('button', 'track')
          btn.type = 'button'
          var num = el('span', 'num')
          var tt = el('span', 'track-title')
          tt.textContent = t.title
          btn.appendChild(num)
          btn.appendChild(tt)
          btn.addEventListener('click', function () { self._playTrack(i) })
          item.appendChild(btn)
          if (downloads) {
            var tdl = el('button', 'track-dl')
            tdl.type = 'button'
            tdl.innerHTML = ICON_DOWNLOAD_SMALL
            tdl.setAttribute('aria-label', 'Download ' + t.title)
            tdl.addEventListener('click', function () { self._download(i) })
            item.appendChild(tdl)
          }
          list.appendChild(item)
          items.push({ item: item, btn: btn, num: num })
        })
        player.appendChild(list)
      }

      // Call-to-action button
      if (buttonUrl) {
        var ctaWrap = el('div', 'cta-wrap')
        var cta = el('a', 'cta')
        cta.href = buttonUrl
        cta.textContent = buttonText
        if (this.hasAttribute('button-new-tab')) {
          cta.target = '_blank'
          cta.rel = 'noopener noreferrer'
        }
        ctaWrap.appendChild(cta)
        player.appendChild(ctaWrap)
      }

      var audio = new Audio()
      audio.preload = 'metadata'

      this._ui = { error: error, playBtn: playBtn, title: title, dlBtn: dlBtn, cur: cur, seek: seek, dur: dur, items: items }
      this._audio = audio
      this._index = 0

      audio.addEventListener('timeupdate', function () { self._renderTime() })
      audio.addEventListener('loadedmetadata', function () { self._renderTime() })
      audio.addEventListener('durationchange', function () { self._renderTime() })
      audio.addEventListener('play', function () { self._renderState() })
      audio.addEventListener('pause', function () { self._renderState() })
      audio.addEventListener('ended', function () {
        if (self._index < self._tracks.length - 1) {
          self._playTrack(self._index + 1)
        } else {
          audio.currentTime = 0
          self._renderState()
        }
      })
      audio.addEventListener('error', function () {
        error.hidden = false
        self._renderState()
      })

      playBtn.addEventListener('click', function () {
        if (audio.paused) self._play()
        else audio.pause()
      })
      seek.addEventListener('input', function () {
        try {
          audio.currentTime = Number(seek.value)
        } catch (e) {
          // Safari throws IndexSizeError when seeking audio that has not loaded
        }
        self._renderTime()
      })

      this._load(0)
    }

    _load(index) {
      this._index = index
      this._ui.error.hidden = true
      this._audio.src = this._tracks[index].src
      this._ui.title.textContent = this._tracks[index].title
      if (this._ui.dlBtn) this._ui.dlBtn.setAttribute('aria-label', 'Download ' + this._tracks[index].title)
      this._renderTime()
      this._renderState()
    }

    _play() {
      var self = this
      window.dispatchEvent(new CustomEvent(PLAY_EVENT, { detail: this }))
      var p = this._audio.play()
      if (p && p.catch) p.catch(function () { self._renderState() })
    }

    _playTrack(index) {
      if (index !== this._index) this._load(index)
      this._play()
    }

    _renderTime() {
      var a = this._audio
      var d = isFinite(a.duration) ? a.duration : 0
      var c = a.currentTime || 0
      this._ui.cur.textContent = formatTime(c)
      this._ui.dur.textContent = formatTime(d)
      this._ui.seek.max = String(d)
      this._ui.seek.value = String(c)
      this._ui.seek.style.setProperty('--progress', (d > 0 ? (c / d) * 100 : 0) + '%')
    }

    _renderState() {
      var playing = !this._audio.paused
      var index = this._index
      this._ui.playBtn.innerHTML = playing ? ICON_PAUSE : ICON_PLAY
      this._ui.playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play')
      this._ui.items.forEach(function (it, i) {
        var active = i === index
        it.item.classList.toggle('active', active)
        if (active) it.btn.setAttribute('aria-current', 'true')
        else it.btn.removeAttribute('aria-current')
        if (active && playing) it.num.innerHTML = ICON_BARS
        else it.num.textContent = String(i + 1)
      })
    }

    _download(index) {
      var t = this._tracks[index]
      var extMatch = t.src.split(/[?#]/)[0].match(/\.([a-z0-9]{2,4})$/i)
      var ext = extMatch ? extMatch[1] : 'mp3'
      var name = (this.getAttribute('name') || '').trim()
      var base = [name, t.title].filter(Boolean).join(' ')
        .replace(/[^a-zA-Z0-9\s-]/g, '').trim().replace(/\s+/g, '_') || 'demo'
      fetch(t.src)
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status)
          return r.blob()
        })
        .then(function (blob) {
          var url = URL.createObjectURL(blob)
          var a = document.createElement('a')
          a.href = url
          a.download = base + '.' + ext
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          setTimeout(function () { URL.revokeObjectURL(url) }, 1000)
        })
        .catch(function () {
          // Cross-origin files without CORS cannot be fetched. Open the file instead.
          window.open(t.src, '_blank', 'noopener')
        })
    }
  }

  window.customElements.define('voice-demo-player', VoiceDemoPlayer)
})()
