/* Ncheta — Animated Assets v2.0
 * Initialises all placeholder animations defined in index.html.
 * Respects prefers-reduced-motion throughout. */
(function () {
  'use strict';

  var ACCENT  = '#C4A265';
  var BG_CARD = '#1A1815';
  var BG_BASE = '#0C0B09';
  var TEXT_PRI = '#EDECE8';
  var TEXT_SEC = '#9A9690';
  var BORDER  = '#2A2723';
  var MED     = '#6B5D4A';
  var DIM     = '#3A3530';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── boot ────────────────────────────────────────────────────────── */
  function init() {
    initParticles();
    injectProgressRing();
    injectSRSCurve();
    injectInputIcons();
    injectHeatmap();
    initExamCode();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ══════════════════════════════════════════════════════════════════
     ASSET 7 — Hero Particle Background (canvas)
  ══════════════════════════════════════════════════════════════════ */
  function initParticles() {
    var canvas = document.getElementById('hero-particles');
    if (!canvas) return;

    var hero = canvas.parentElement;
    var ctx  = canvas.getContext('2d');
    var W, H, particles, animId, resizeTimer;

    function mkParticle() {
      return {
        x:        Math.random() * W,
        y:        Math.random() * H,
        r:        1.5 + Math.random() * 1.5,
        opacity:  0.04 + Math.random() * 0.11,
        speed:    0.18 + Math.random() * 0.32,
        sway:     Math.random() * Math.PI * 2,
        swaySpd:  0.004 + Math.random() * 0.007,
        swayAmp:  6    + Math.random() * 9,
      };
    }

    function resize() {
      W = canvas.width  = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.y    -= p.speed;
        p.sway += p.swaySpd;
        var px = p.x + Math.sin(p.sway) * p.swayAmp;
        if (p.y + p.r < 0) { p.y = H + p.r; p.x = Math.random() * W; }
        ctx.beginPath();
        ctx.arc(px, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(196,162,101,' + p.opacity + ')';
        ctx.fill();
      }
      animId = requestAnimationFrame(frame);
    }

    if (reduced) return;

    resize();
    particles = [];
    for (var n = 0; n < 36; n++) particles.push(mkParticle());
    frame();

    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════════════════════════
     ASSET 3 — Progress Ring (SVG injected)
  ══════════════════════════════════════════════════════════════════ */
  function injectProgressRing() {
    var el = document.getElementById('progress-ring');
    if (!el) return;

    // r=60 → C = 2π×60 ≈ 376.99
    var C   = 376.99;
    var end = C * 0.3; // 70% filled → dashoffset at 30% of circ

    var dur  = reduced ? '0s' : '4s';
    var anim = reduced
      ? 'stroke-dashoffset:' + end + ';'
      : 'animation:pr_fill ' + dur + ' ease-in-out infinite;';

    el.style.cssText = [
      'width:120px', 'height:120px', 'border:none',
      'background:transparent', 'border-radius:0',
      'position:absolute', 'top:-20px', 'right:-20px', 'z-index:2'
    ].join(';');

    el.innerHTML =
      '<style>' +
        '@keyframes pr_fill{' +
          '0%{stroke-dashoffset:' + C + '}' +
          '60%{stroke-dashoffset:' + end + '}' +
          '82%{stroke-dashoffset:' + end + '}' +
          '100%{stroke-dashoffset:' + C + '}' +
        '}' +
        '@keyframes pr_n1{0%,3%{opacity:1}4%,100%{opacity:0}}' +
        '@keyframes pr_n2{0%,18%{opacity:0}19%,33%{opacity:1}34%,100%{opacity:0}}' +
        '@keyframes pr_n3{0%,33%{opacity:0}34%,57%{opacity:1}58%,100%{opacity:0}}' +
        '@keyframes pr_n4{0%,57%{opacity:0}58%,80%{opacity:1}81%,100%{opacity:0}}' +
        '@keyframes pr_n5{0%,80%{opacity:0}81%,100%{opacity:1}}' +
      '</style>' +
      '<svg viewBox="0 0 200 200" width="120" height="120">' +
        '<circle cx="100" cy="100" r="60" fill="none" stroke="' + BORDER + '" stroke-width="8"/>' +
        '<circle cx="100" cy="100" r="60" fill="none" stroke="' + ACCENT + '" stroke-width="8"' +
          ' stroke-linecap="round" transform="rotate(-90 100 100)"' +
          ' stroke-dasharray="' + C + '" style="' + anim + '"/>' +
        '<g font-family="DM Serif Display,serif" text-anchor="middle" font-size="34">' +
          num('17','pr_n1',dur,TEXT_PRI,false) +
          num('13','pr_n2',dur,TEXT_PRI,true)  +
          num(' 9','pr_n3',dur,TEXT_PRI,true)  +
          num(' 6','pr_n4',dur,TEXT_PRI,true)  +
          num(' 5','pr_n5',dur,ACCENT  ,true)  +
        '</g>' +
        '<text x="100" y="128" text-anchor="middle" fill="' + TEXT_SEC + '"' +
          ' font-size="11" font-family="Outfit,sans-serif">cards due</text>' +
      '</svg>';

    function num(n, aname, d, fill, hidden) {
      var base = 'fill:' + fill + ';' + (hidden ? 'opacity:0;' : '');
      var an   = reduced ? '' : 'animation:' + aname + ' ' + d + ' linear infinite;';
      return '<text x="100" y="112" style="' + base + an + '">' + n + '</text>';
    }
  }

  /* ══════════════════════════════════════════════════════════════════
     ASSET 2 — Spaced Repetition Curve (canvas drawn)
  ══════════════════════════════════════════════════════════════════ */
  function injectSRSCurve() {
    var el = document.getElementById('srs-curve-animation');
    if (!el) return;

    el.style.cssText = 'width:100%;height:100px;display:block;';

    var id  = 'srs_cv_' + Date.now();
    el.innerHTML = '<canvas id="' + id + '" style="width:100%;height:100px;display:block;"></canvas>';

    var canvas = document.getElementById(id);
    var ctx    = canvas.getContext('2d');

    /* The four review bumps: [normalised x of review, y_before_review (0-1 = top-bottom), y_after] */
    var reviews = [
      { rx: 0.24, yd: 0.78, yr: 0.14 },
      { rx: 0.46, yd: 0.62, yr: 0.10 },
      { rx: 0.67, yd: 0.50, yr: 0.08 },
      { rx: 0.88, yd: 0.40, yr: 0.06 },
    ];
    var dayLabels = ['Day 1', 'Day 3', 'Day 7', 'Day 21'];

    var PAD = { l: 28, r: 10, t: 10, b: 22 };

    function setSize() {
      canvas.width  = canvas.offsetWidth  || 460;
      canvas.height = canvas.offsetHeight || 100;
    }
    setSize();

    function draw(t) {          // t: 0-1 overall progress
      setSize();
      var W = canvas.width, H = canvas.height;
      var pw = W - PAD.l - PAD.r;
      var ph = H - PAD.t - PAD.b;
      ctx.clearRect(0, 0, W, H);

      /* axes */
      ctx.strokeStyle = '#2A2723';
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.moveTo(PAD.l, PAD.t);
      ctx.lineTo(PAD.l, PAD.t + ph);
      ctx.lineTo(PAD.l + pw, PAD.t + ph);
      ctx.stroke();

      /* day labels */
      ctx.fillStyle  = '#5E5B56';
      ctx.font       = '8px Outfit, sans-serif';
      ctx.textAlign  = 'center';
      reviews.forEach(function (rv, i) {
        if (t >= (i + 1) / (reviews.length + 1)) {
          ctx.fillText(dayLabels[i], PAD.l + rv.rx * pw, H - 4);
        }
      });

      /* retention label */
      ctx.save();
      ctx.translate(10, PAD.t + ph / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillText('Retention', 0, 0);
      ctx.restore();

      /* build the path: start high, decay, bounce at each review */
      var segments = buildSegments();
      var totalPts = 0;
      segments.forEach(function (s) { totalPts += s.length; });
      var drawPts  = Math.floor(totalPts * t);
      var drawn    = 0;

      ctx.lineWidth   = 1.5;
      ctx.strokeStyle = '#5E5B56';
      ctx.lineJoin    = 'round';
      ctx.beginPath();
      var started = false;

      for (var si = 0; si < segments.length; si++) {
        var seg = segments[si];
        for (var pi = 0; pi < seg.length; pi++) {
          if (drawn >= drawPts) break;
          var pt = seg[pi];
          var px = PAD.l + pt.x * pw;
          var py = PAD.t + pt.y * ph;
          if (!started) { ctx.moveTo(px, py); started = true; }
          else          { ctx.lineTo(px, py); }
          drawn++;
        }
        if (drawn >= drawPts) break;
      }
      ctx.stroke();

      /* gold review pulses */
      reviews.forEach(function (rv, i) {
        var threshold = (i + 1) / (reviews.length + 1) * 0.95;
        if (t < threshold) return;
        var rx = PAD.l + rv.rx * pw;
        var ry = PAD.t + rv.yr * ph;
        var rb = PAD.t + ph;

        ctx.save();
        ctx.globalAlpha   = 0.65;
        ctx.strokeStyle   = ACCENT;
        ctx.lineWidth     = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(rx, rb);
        ctx.lineTo(rx, ry);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;

        ctx.beginPath();
        ctx.arc(rx, ry, 3, 0, Math.PI * 2);
        ctx.fillStyle = ACCENT;
        ctx.fill();
        ctx.restore();
      });
    }

    function buildSegments() {
      /* Each segment: array of {x, y} normalised pts (0-1) */
      var segs   = [];
      var steps  = 28;
      var startY = 0.08;

      /* chunk 0: initial decay before first review */
      var seg0 = [];
      for (var i = 0; i <= steps; i++) {
        var t2 = i / steps;
        var x  = t2 * reviews[0].rx;
        var y  = startY + (reviews[0].yd - startY) * (1 - Math.exp(-t2 * 3));
        seg0.push({ x: x, y: y });
      }
      segs.push(seg0);

      /* subsequent decay chunks */
      for (var ri = 0; ri < reviews.length - 1; ri++) {
        var fromX = reviews[ri].rx;
        var toX   = reviews[ri + 1].rx;
        var fromY = reviews[ri].yr;
        var toY   = reviews[ri + 1].yd;
        var seg   = [];
        for (var j = 0; j <= steps; j++) {
          var frac = j / steps;
          var x2   = fromX + (toX - fromX) * frac;
          var y2   = fromY + (toY - fromY) * (1 - Math.exp(-frac * 2.2));
          seg.push({ x: x2, y: y2 });
        }
        segs.push(seg);
      }

      /* final flat segment after last review */
      var lastRv = reviews[reviews.length - 1];
      var segF   = [];
      for (var k = 0; k <= steps; k++) {
        var fk = k / steps;
        segF.push({ x: lastRv.rx + (1 - lastRv.rx) * fk, y: lastRv.yr + 0.04 * fk });
      }
      segs.push(segF);

      return segs;
    }

    if (reduced) { draw(1); return; }

    var progress = 0;
    var holdTimer;
    function tick() {
      progress = Math.min(progress + 0.005, 1);
      draw(progress);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        holdTimer = setTimeout(function () { progress = 0; tick(); }, 3500);
      }
    }
    tick();
  }

  /* ══════════════════════════════════════════════════════════════════
     ASSET 4 — Input Mode Icons (SVG injected)
  ══════════════════════════════════════════════════════════════════ */
  function injectInputIcons() {
    var el = document.getElementById('input-icons');
    if (!el) return;

    el.style.cssText = [
      'width:100%', 'height:56px', 'display:flex', 'align-items:center',
      'background:none', 'border:none', 'margin-bottom:4px', 'overflow:visible'
    ].join(';');

    var d = reduced ? '0s' : '';
    var glowDur = '3.2s';
    /* Icon width = 40, gap = (320-4*40)/3 = 53px between centres … scaled via viewBox */

    el.innerHTML =
      '<style>' +
        ic('doc',  d, 0.0,  glowDur) +
        ic('cam',  d, 0.35, glowDur) +
        ic('mic',  d, 0.70, glowDur) +
        ic('txt',  d, 1.05, glowDur) +
        '@keyframes ii_appear{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}' +
        '@keyframes ii_gold{0%,75%,100%{stroke:' + TEXT_PRI + '}40%{stroke:' + ACCENT + '}}' +
        '@keyframes ii_blink{0%,49%{opacity:1}50%,100%{opacity:0}}' +
      '</style>' +
      '<svg viewBox="0 0 296 56" width="100%" height="56" fill="none"' +
          ' stroke="' + TEXT_PRI + '" stroke-width="1.5"' +
          ' stroke-linecap="round" stroke-linejoin="round">' +

        /* Document */
        '<g class="ii_doc" transform="translate(8,8)">' +
          '<rect x="0" y="0" width="28" height="36" rx="3"/>' +
          '<polyline points="18,0 18,11 28,11" stroke-linejoin="miter"/>' +
          '<line x1="6" y1="18" x2="22" y2="18"/>' +
          '<line x1="6" y1="25" x2="18" y2="25"/>' +
          '<line x1="6" y1="31" x2="14" y2="31"/>' +
        '</g>' +

        /* Camera */
        '<g class="ii_cam" transform="translate(88,10)">' +
          '<rect x="0" y="6" width="36" height="26" rx="4"/>' +
          '<polyline points="10,6 13,0 23,0 26,6"/>' +
          '<circle cx="18" cy="19" r="8"/>' +
          '<circle cx="18" cy="19" r="4" opacity="0.45"/>' +
          '<circle cx="30" cy="11" r="2.5" fill="' + ACCENT + '" opacity="0.7" stroke="none"/>' +
        '</g>' +

        /* Microphone */
        '<g class="ii_mic" transform="translate(168,8)">' +
          '<rect x="9" y="0" width="18" height="24" rx="9"/>' +
          '<path d="M3 20 C3 30 33 30 33 20"/>' +
          '<line x1="18" y1="30" x2="18" y2="38"/>' +
          '<line x1="11" y1="38" x2="25" y2="38"/>' +
        '</g>' +

        /* Text cursor */
        '<g class="ii_txt" transform="translate(248,10)">' +
          '<rect x="0" y="0" width="36" height="32" rx="4"/>' +
          '<line x1="8" y1="10" x2="28" y2="10"/>' +
          '<line x1="8" y1="18" x2="28" y2="18"/>' +
          '<line x1="8" y1="26" x2="20" y2="26"/>' +
          '<line x1="21" y1="5" x2="21" y2="13" stroke="' + ACCENT + '" stroke-width="2"' +
            ' style="animation:ii_blink 1s step-end infinite"/>' +
        '</g>' +

      '</svg>';

    function ic(name, baseD, delaySec, goldDur) {
      var appear = 'ii_appear 0.45s ' + (baseD === '0s' ? '0s' : (delaySec + 's')) + ' ease both';
      var gold   = baseD === '0s'
        ? ''
        : ',ii_gold ' + goldDur + ' ' + (delaySec + 0.45) + 's ease infinite';
      return '.ii_' + name + '{animation:' + appear + gold + '}';
    }
  }

  /* ══════════════════════════════════════════════════════════════════
     ASSET 5 — Heatmap Build Animation (SVG injected)
  ══════════════════════════════════════════════════════════════════ */
  function injectHeatmap() {
    var el = document.getElementById('heatmap-animation');
    if (!el) return;

    el.style.cssText = 'width:100%;height:72px;display:block;';

    var COLS = 7, ROWS = 3, SIZE = 13, GAP = 3;
    var VW = COLS * (SIZE + GAP) - GAP;   // 104
    var VH = ROWS * (SIZE + GAP) - GAP;   // 43

    /* [col, row, intensity] 0=dim 1=med 2=gold */
    var active = [
      [0,0,0],[2,0,1],[4,0,0],
      [0,1,1],[1,1,0],[3,1,2],[5,1,0],
      [0,2,2],[1,2,1],[2,2,0],[3,2,1],[4,2,2],
    ];

    var colors = [DIM, MED, ACCENT];
    var styleStr = '<style>@keyframes hm_cell{from{opacity:0;transform:scale(0.7);transform-box:fill-box;transform-origin:center}to{opacity:1;transform:scale(1)}}</style>';
    var rects    = '';

    /* empty cells */
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        var x = c * (SIZE + GAP), y = r * (SIZE + GAP);
        rects += '<rect x="' + x + '" y="' + y + '" width="' + SIZE + '" height="' + SIZE + '"' +
          ' rx="2.5" fill="' + BG_CARD + '" stroke="' + BORDER + '" stroke-width="0.5"/>';
      }
    }

    /* active cells */
    active.forEach(function (cell, i) {
      var cx = cell[0], cy = cell[1], ci = cell[2];
      var ax = cx * (SIZE + GAP), ay = cy * (SIZE + GAP);
      var delay = reduced ? 0 : (0.15 + i * 0.09);
      rects +=
        '<rect x="' + ax + '" y="' + ay + '" width="' + SIZE + '" height="' + SIZE + '"' +
        ' rx="2.5" fill="' + colors[ci] + '" opacity="0"' +
        ' style="animation:hm_cell 0.35s ' + delay + 's ease forwards"/>';
    });

    /* day labels */
    var days = ['M','T','W','T','F','S','S'];
    var labels = '';
    days.forEach(function (d, i) {
      var lx = i * (SIZE + GAP) + SIZE / 2;
      labels += '<text x="' + lx + '" y="' + (VH + 11) + '"' +
        ' text-anchor="middle" fill="' + TEXT_SEC + '"' +
        ' font-size="7" font-family="Outfit,sans-serif">' + d + '</text>';
    });

    el.innerHTML =
      styleStr +
      '<svg viewBox="0 ' + (-4) + ' ' + VW + ' ' + (VH + 16) + '"' +
        ' width="100%" height="72" style="max-width:' + (VW + 32) + 'px;">' +
        rects + labels +
      '</svg>';
  }

  /* ══════════════════════════════════════════════════════════════════
     ASSET 6 — Exam Code Reveal (JS animated)
  ══════════════════════════════════════════════════════════════════ */
  function initExamCode() {
    var el = document.getElementById('exam-code-animation');
    if (!el) return;

    var FINAL   = '5HCVCS';
    var CHARSET = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';

    /* Override positioning from HTML placeholder */
    el.style.cssText = [
      'position:absolute', 'bottom:-16px', 'left:-24px',
      'width:200px', 'z-index:2',
      'background:' + BG_CARD,
      'border:1px solid ' + BORDER,
      'border-radius:14px',
      'padding:12px 14px',
      'display:flex', 'flex-direction:column', 'align-items:center', 'gap:8px',
    ].join(';');

    /* Slot container */
    var slotsWrap = document.createElement('div');
    slotsWrap.style.cssText = 'display:flex;gap:5px;';

    var slots = FINAL.split('').map(function () {
      var s = document.createElement('div');
      s.style.cssText = [
        'width:24px', 'height:30px',
        'border:1px solid ' + BORDER,
        'border-radius:5px',
        'display:flex', 'align-items:center', 'justify-content:center',
        'font-family:Outfit,monospace', 'font-size:14px', 'font-weight:700',
        'color:' + ACCENT,
        'background:' + BG_BASE,
        'transition:border-color 0.3s',
      ].join(';');
      slotsWrap.appendChild(s);
      return s;
    });

    var label = document.createElement('div');
    label.textContent = 'Share with students';
    label.style.cssText = [
      'font-size:9px', 'color:' + TEXT_SEC,
      'font-family:Outfit,sans-serif',
      'opacity:0', 'transition:opacity 0.5s',
      'letter-spacing:0.03em',
    ].join(';');

    el.innerHTML = '';
    el.appendChild(slotsWrap);
    el.appendChild(label);

    if (reduced) {
      slots.forEach(function (s, i) { s.textContent = FINAL[i]; s.style.borderColor = ACCENT; });
      label.style.opacity = '1';
      return;
    }

    function revealCode() {
      label.style.opacity = '0';
      slots.forEach(function (s) { s.textContent = ''; s.style.borderColor = BORDER; });

      slots.forEach(function (slot, idx) {
        setTimeout(function () {
          var count = 0, max = 5;
          var iv = setInterval(function () {
            slot.textContent = CHARSET[Math.floor(Math.random() * CHARSET.length)];
            count++;
            if (count >= max) {
              clearInterval(iv);
              slot.textContent = FINAL[idx];
              if (idx === slots.length - 1) {
                /* All revealed — gold border glow */
                slots.forEach(function (s) { s.style.borderColor = ACCENT; });
                setTimeout(function () { label.style.opacity = '1'; }, 250);
                setTimeout(revealCode, 3200);
              }
            }
          }, 70);
        }, idx * 170);
      });
    }

    revealCode();
  }

})();
