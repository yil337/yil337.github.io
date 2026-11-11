(function() {
  var A = '/assets/yard/';
  // key: [文件名, 整张宽, 高, 帧数, 待机动画秒数(0=不动)]
  var S = {
    bush1: ['Bush_1_Green', 15, 13, 1], bush2: ['Bush_2_Green', 28, 13, 1],
    grass1: ['Grass_1_Green', 7, 5, 1], grass2: ['Grass_2_Green', 12, 10, 1],
    grass3: ['Grass_3_Green', 16, 15, 1], grass4: ['Grass_4_Green', 16, 11, 1],
    flowerP: ['Flowers_1_purple', 14, 12, 1], flowerB: ['Flowers_2_blue', 16, 14, 1],
    flowerY: ['Flowers_2_yellow', 16, 14, 1], flowerR: ['Flowers_3_red', 9, 9, 1],
    shroom: ['Mushrooms_2_Red', 10, 8, 1], stump: ['Stump_2_Mushrooms', 15, 12, 1],
    oak: ['Tree_9_Small-oak_Green', 39, 45, 1], oak2: ['Tree_10_Small-oak_Green', 24, 36, 1],
    pine: ['Tree_3_Normal_Green', 21, 30, 1], fruit: ['Yard_FruitTree_Fruit', 36, 42, 1],
    goal: ['Yard_Goal', 34, 22, 1], ball: ['Yard_Ball', 10, 10, 1],
    dog: ['Yard_Dog_side_sit-Sheet2', 28, 11, 2, 1.4], cat: ['Yard_Cat_side_sleep-Sheet2', 30, 11, 2, 2.4],
    chicken: ['Yard_Chicken_side_peck-Sheet2', 22, 10, 2, 0.9], bird: ['Yard_Bird_side_peck-Sheet2', 18, 8, 2, 0.8],
    bed: ['Yard_GardenBed', 36, 22, 1], tomato: ['Yard_Crop_Tomato_Growing', 14, 18, 1],
    corn: ['Yard_Crop_Corn_Growing', 14, 22, 1], pumpkin: ['Yard_Crop_Pumpkin_Growing', 16, 14, 1],
    coop: ['Yard_Coop', 28, 26, 1], well: ['Yard_Well', 24, 28, 1], bench: ['Yard_Bench', 26, 14, 1],
    radio: ['Yard_Radio', 18, 20, 1], logseat: ['Yard_LogSeat', 18, 9, 1],
    swing: ['Yard_Swing-Sheet4', 120, 28, 4, 0], punch: ['Yard_PunchBag', 10, 18, 1],
    campfire: ['Yard_Campfire', 24, 15, 1], flame: ['Yard_Campfire_Flame-Sheet6', 84, 18, 6, 0.6]
  };
  // 坐着的人 = 游戏里的随从服装（原创角色；像知名作品的几个不放）。每人全页只出现一次，座位多于人就空着。
  var PEOPLE_SMALL = ['Assault', 'Sniper', 'Medic', 'Comms', 'Demo', 'PeaceElite', 'Air-Drone', 'Hanc'];
  var PEOPLE_BIG = ['Zombie-Scavenger', 'Ganki', 'FlameOn', 'SpaceHunter', 'Dark', 'Grenader', 'Sword', 'Boss', 'Enjineer', 'Trader', 'Commander'];
  // P_<名>_<朝向>_sit = 和游戏里坐着的住户一样：坐姿身体（游戏的坐姿腿）+ 服装 idle，中心对齐叠起来
  // （生成脚本 hi_zombie/tools/site_seated_people.py）。每帧宽高 = 身体 / 服装取大，画布中心 = 人的中心。
  PEOPLE_SMALL.concat(PEOPLE_BIG).forEach(function(n) {
    var big = PEOPLE_BIG.indexOf(n) >= 0, w = big ? 26 : 14, h = big ? 32 : 26;
    S['p_' + n + '_r'] = ['P_' + n + '_side_sit', w * 6, h, 6, 0.9];
    S['p_' + n + '_l'] = ['P_' + n + '_side_left_sit', w * 6, h, 6, 0.9];
  });
  // 一组小场景：[key, x, y(顶边), 左右翻]，单位 = 原图像素。
  // ['seat', 中心x, 座位贴图底边y, 朝左] = 坐一个人。摆位同游戏：人的中心 = 座位底边往上 10px（木墩底边 = y + 9，长椅 = y + 14）。
  var VIGNETTES = [
    [['goal', 0, 0], ['ball', 6, 27], ['dog', 22, 25]],
    [['logseat', 0, 18], ['seat', 9, 27, 0], ['campfire', 21, 12], ['flame', 26, -4], ['logseat', 47, 18], ['seat', 56, 27, 1]],
    [['bed', 0, 8], ['corn', 2, -4], ['tomato', 12, 2], ['pumpkin', 22, 10]],
    [['logseat', 0, 18], ['seat', 9, 27, 0], ['logseat', 34, 18], ['seat', 43, 27, 1]],
    [['coop', 0, 0], ['chicken', 27, 18], ['chicken', 9, 28, 1]],
    [['logseat', 0, 10], ['seat', 9, 19, 0], ['bush1', 21, 8]],
    [['fruit', 0, 0], ['shroom', 30, 36]],
    [['logseat', 0, 14], ['seat', 9, 23, 0], ['radio', 20, 3]],
    [['swing', 0, 0]],
    [['well', 0, 0], ['bird', 28, 20]],
    [['bench', 0, 6], ['seat', 8, 20, 0], ['cat', 27, 9]],
    [['punch', 2, 0], ['stump', 14, 8]],
    [['oak', 0, 0]],
    [['pine', 4, 0], ['bush2', 0, 23]],
    [['oak2', 0, 0], ['bush1', 18, 25]]
  ];
  var FILLERS = ['grass1', 'grass2', 'grass3', 'grass4', 'grass3', 'grass4', 'flowerP', 'flowerB', 'flowerY', 'flowerR', 'shroom', 'bush1'];
  var STEP = { grass3: 'Grass_3_Stepping-On-Animation_Green-Sheet2', grass4: 'Grass_4_Stepping-On-Animation_Green-Sheet2' };
  var VEG = /^(bush|grass|flower|shroom|stump|oak|pine|fruit)/;

  function rng(seed) { return function() { seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function fw(k) { return S[k][1] / S[k][3]; }

  function fx(parent, x, y, s, kind) {
    var e = document.createElement('div'); e.className = 'yfx';
    if (kind === 'z' || kind === 'hi') { e.className += ' zz'; e.textContent = kind === 'z' ? 'z' : 'Hi!'; }
    else {
      var f = kind === 'heart' ? ['Heart_Small_Full', 11, 10] : ['Yard_MusicNote', 7, 9];
      e.style.width = f[1] * s + 'px'; e.style.height = f[2] * s + 'px';
      e.style.backgroundImage = 'url(' + A + f[0] + '.png)'; e.style.backgroundSize = '100% 100%';
    }
    e.style.left = x + 'px'; e.style.top = y + 'px';
    parent.appendChild(e); setTimeout(function() { e.remove(); }, 1200);
  }
  function once(o, cls, ms) { o.classList.remove(cls); void o.offsetWidth; o.classList.add(cls);
    clearTimeout(o._t); o._t = setTimeout(function() { o.classList.remove(cls); }, ms); }
  function setSheet(i, k, s, play) {
    var d = S[k]; i.style.backgroundImage = 'url(' + A + d[0] + '.png)';
    i.style.backgroundSize = d[1] * s + 'px ' + d[2] * s + 'px';
    i.style.setProperty('--sw', -d[1] * s + 'px');
    i.style.animation = play ? 'ysheet ' + play + 's steps(' + d[3] + ') infinite' : 'none';
    i.style.backgroundPosition = '0 0';
  }

  function sprite(parent, k, x, y, s, flip, bounds) {
    var d = S[k], w = fw(k) * s, h = d[2] * s;
    var o = document.createElement('div'); o.className = 'yi'; o.dataset.kind = k; o.setAttribute('aria-hidden', 'true');
    var z = Math.round(y + h) + (k === 'flame' ? 60 : k.indexOf('p_') === 0 ? 4 * s : 0);   // 火苗画在火堆上；人画在座位前
    o.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:' + h + 'px;z-index:' + z;
    var i = document.createElement('i'); o.appendChild(i);
    setSheet(i, k, s, d[3] > 1 ? d[4] : 0);
    if (k.indexOf('p_') === 0) i.style.animationDelay = -(Math.random() * 0.9).toFixed(2) + 's';   // 各人呼吸不同步
    if (flip) i.style.transform = 'scaleX(-1)';
    parent.appendChild(o);

    var cx = function() { return o.offsetLeft + w / 2; };
    if (VEG.test(k)) {                                   // 植被：路过晃一下，草丛被踩弯
      o.addEventListener('mouseenter', function() {
        if (STEP[k]) {
          i.style.backgroundImage = 'url(' + A + STEP[k] + '.png)';
          i.style.backgroundSize = 2 * fw(k) * s + 'px ' + h + 'px';
          i.style.backgroundPosition = -fw(k) * s + 'px 0';
          clearTimeout(o._g); o._g = setTimeout(function() { setSheet(i, k, s, 0); }, 260);
        } else once(o, 'rustle', 380);
      });
      if (/oak|pine|fruit/.test(k)) bindAction(o, function() { once(o, 'rustle', 380); }, 'Shake the tree');
      return o;
    }
    var act = {
      dog: function() { once(o, 'hop', 450); fx(parent, cx() - 11, o.offsetTop - 30, 2, 'heart'); },
      chicken: function() { once(o, 'hop', 450); },
      cat: function() { fx(parent, cx() + 4, o.offsetTop - 18, s, 'z'); },
      punch: function() { once(o, 'swingbag', 1000); },
      swing: function() { setSheet(i, k, s, 0.9); clearTimeout(o._g);
        o._g = setTimeout(function() { setSheet(i, k, s, 0); }, 2700); },
      radio: function() {
        if (o._on) { clearInterval(o._on); o._on = 0; o.classList.remove('bop'); return; }
        o.classList.add('bop');
        var note = function() { fx(parent, cx() - 10 + Math.random() * 14, o.offsetTop - 24, 2, 'note'); };
        note(); if (!document.body.classList.contains('motion-off') && !matchMedia('(prefers-reduced-motion: reduce)').matches) o._on = setInterval(function(){if (!o.isConnected || document.hidden || document.body.classList.contains('motion-off')) {clearInterval(o._on);o._on=0;o.classList.remove('bop');o.setAttribute('aria-pressed','false');return;}note();},650);
      },
      ball: function() {
        var cur = o._dx || 0, left = o.offsetLeft;
        var lo = bounds[0] - left, hi = bounds[1] - left - w;
        var next = cur + (Math.random() < 0.5 ? -1 : 1) * (30 + Math.random() * 70);
        if (next < lo || next > hi) next = cur - (next - cur);
        next = Math.max(lo, Math.min(hi, next)); o._dx = next;
        o.style.transition = 'transform 0.9s cubic-bezier(.2,.8,.3,1)';
        o.style.transform = 'translateX(' + Math.round(next) + 'px)';
        once(o, 'spin', 1000);
      },
      bird: function() {
        if (o._away) return; o._away = 1;
        i.style.backgroundImage = 'url(' + A + 'Yard_Bird_side_fly-Sheet2.png)';
        i.style.animation = 'ysheet 0.25s steps(2) infinite';
        var dir = Math.random() < 0.5 ? -1 : 1;
        i.style.transform = dir < 0 ? 'scaleX(-1)' : '';
        o.style.transition = 'transform 1.2s linear, opacity 1.2s steps(6)';
        o.style.transform = 'translate(' + dir * 90 + 'px,-110px)'; o.style.opacity = '0';
        setTimeout(function() {
          o.style.transition = 'opacity 0.6s steps(4)'; o.style.transform = '';
          if (!o.isConnected) return; setSheet(i, k, s, S.bird[4]); i.style.transform = flip ? 'scaleX(-1)' : '';
          o.style.opacity = '1'; o._away = 0;
        }, 5000);
      }
    }[k];
    if (k.indexOf('p_') === 0) act = function() { once(o, 'hop', 450); fx(parent, cx() - 14, o.offsetTop - 22, s, 'hi'); };
    if (act) bindAction(o, act, ({dog:'Pet the dog',cat:'Visit the sleeping cat',chicken:'Greet the chicken',bird:'Let the bird fly',punch:'Hit the punching bag',swing:'Push the swing',radio:'Toggle music notes',ball:'Kick the football'})[k] || 'Say hello to the camper');
    return o;
  }

  function bindAction(o, act, label) {
    o.classList.add('tap'); o.removeAttribute('aria-hidden');
    o.setAttribute('role','button'); o.setAttribute('aria-label',label); o.title=label;
    o.tabIndex=document.querySelector('.yi.tap[tabindex="0"]') ? -1 : 0;
    if(o.dataset.kind==='radio')o.setAttribute('aria-pressed','false');
    o.addEventListener('click',function(){
      document.querySelectorAll('.yi.tap[tabindex="0"]').forEach(function(b){b.tabIndex=-1;});o.tabIndex=0;
      act(); o.dataset.activated=String(Number(o.dataset.activated||0)+1);
      if(o.dataset.kind==='radio')o.setAttribute('aria-pressed',String(!!o._on));
    });
    o.addEventListener('keydown',function(e){
      if(e.key==='Enter'||e.key===' '){e.preventDefault();o.click();}
      else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){
        e.preventDefault();var buttons=Array.from(document.querySelectorAll('.yi.tap')).filter(function(b){return b.getClientRects().length && getComputedStyle(b).visibility!=='hidden';});
        var index=buttons.indexOf(o),delta=(e.key==='ArrowLeft'||e.key==='ArrowUp')?-1:1;
        var next=buttons[(index+delta+buttons.length)%buttons.length];if(next){o.tabIndex=-1;next.tabIndex=0;next.focus();}
      }
    });
  }
  var yard = document.querySelector('.yard');
  var lastKey = '';
  function layout() {
    var vw = document.documentElement.clientWidth;
    yard.style.height = '0px'; var docH = document.documentElement.scrollHeight;
    var key = vw + 'x' + docH; if (key === lastKey) { yard.style.height=docH+'px'; return; } lastKey = key;
    document.querySelectorAll('.yi').forEach(function(o){clearInterval(o._on);clearTimeout(o._g);clearTimeout(o._t);}); yard.innerHTML = ''; yard.style.height = docH + 'px';
    document.querySelectorAll('.fence-deco').forEach(function(e) { e.remove(); });

    // ── 栅栏脚下：任何宽度都有（手机上就靠它）
    var critters = ['chicken', 'cat', 'dog', 'bird'];
    document.querySelectorAll('.yard-fence').forEach(function(fence, fi) {
      var r = rng(900 + fi), layer = document.createElement('div');
      layer.className = 'fence-deco'; layer.setAttribute('role','group');layer.setAttribute('aria-label','Camp animals and plants'); fence.appendChild(layer);
      var fwid = fence.clientWidth, s = 3;
      for (var x = 8 + r() * 60; x < fwid - 40; x += 70 + r() * 110) {
        var k = FILLERS[Math.floor(r() * FILLERS.length)];
        sprite(layer, k, Math.round(x), 48 - S[k][2] * s + 6, s, r() < 0.5, [0, fwid]);
      }
      var c = critters[fi % critters.length], cxp = Math.round(fwid * (0.12 + r() * 0.76));
      sprite(layer, c, cxp, 48 - S[c][2] * s + 4, s, r() < 0.5, [0, fwid]);
    });

    // ── 两侧草地：只有宽屏有空地
    var sec = document.querySelector('.work-section, .case-top');
    if (!sec) return;
    var sr = sec.getBoundingClientRect();
    var gutter = sr.left - 18;
    var s = gutter >= 150 ? 3 : gutter >= 100 ? 2 : 0;
    if (!s) return;
    var sy = window.scrollY;
    var blocked = [];                                   // 栅栏横条盖在院子上面，避开它们
    document.querySelectorAll('.yard-fence').forEach(function(f) {
      var b = f.getBoundingClientRect(); blocked.push([b.top + sy - 30, b.bottom + sy + 10]);
    });
    var sides = [[10, sr.left - 14], [sr.right + 14, vw - 10]];
    var order = VIGNETTES.map(function(v, n) { return n; }), r0 = rng(31);
    for (var n = order.length - 1; n > 0; n--) { var j = Math.floor(r0() * (n + 1)); var t = order[n]; order[n] = order[j]; order[j] = t; }
    // 人：固定种子打乱一次，左边取单数位、右边取双数位 → 全页每人最多一次
    var people = PEOPLE_SMALL.concat(PEOPLE_BIG), rp = rng(77);
    for (var m = people.length - 1; m > 0; m--) { var j2 = Math.floor(rp() * (m + 1)); var t2 = people[m]; people[m] = people[j2]; people[j2] = t2; }
    var pools = [people.filter(function(p, n) { return n % 2 === 0; }), people.filter(function(p, n) { return n % 2 === 1; })];
    sides.forEach(function(side, si) {
      var r = rng(31 + si * 7), pool = pools[si];
      if (si) order = order.slice().reverse();           // 右边反着取，两边不会在同一高度撞同一组
      var vi = 0, y = 150 + si * 170 + r() * 80;
      while (y < docH - 240) {
        var v = VIGNETTES[order[vi % order.length]], used = 0, items = [];
        v.forEach(function(it) {                         // 座位换成具体的人；人用完了座位就空着
          if (it[0] !== 'seat') { items.push(it); return; }
          var who = pool[used]; if (!who) return; used++;
          var k = 'p_' + who + (it[3] ? '_l' : '_r');
          items.push([k, it[1] - fw(k) / 2, it[2] - 10 - S[k][2] / 2]);
        });
        var minX = 0, vw0 = 0, vh0 = 0, top0 = 0;
        items.forEach(function(it) { minX = Math.min(minX, it[1]); vw0 = Math.max(vw0, it[1] + fw(it[0])); vh0 = Math.max(vh0, it[2] + S[it[0]][2]); top0 = Math.min(top0, it[2]); });
        var w = (vw0 - minX) * s, h = (vh0 - top0) * s, room = side[1] - side[0];
        var hit = blocked.some(function(b) { return y + h > b[0] && y < b[1]; });
        if (hit) { y += 90; continue; }
        var x0 = -9999;
        if (w <= room) {
          x0 = side[0] + r() * (room - w);
          items.forEach(function(it) { sprite(yard, it[0], Math.round(x0 + (it[1] - minX) * s), Math.round(y + (it[2] - top0) * s), s, it[3], side); });
          pool.splice(0, used);
        }
        vi++;                                            // 放不下（太宽）就换下一组，别卡在同一组上
        var fillers = 5 + Math.floor(r() * 4);           // 场景周围和下方空地撒草和花
        for (var q = 0; q < fillers; q++) {
          var k = FILLERS[Math.floor(r() * FILLERS.length)], kw = fw(k) * s;
          var fy = y - 30 + r() * (h + 260), fx0 = side[0] + r() * Math.max(0, room - kw), kh = S[k][2] * s;
          if (blocked.some(function(b) { return fy + 40 > b[0] && fy < b[1]; })) continue;
          if (fx0 < x0 + w + 4 && fx0 + kw > x0 - 4 && fy < y + h + 4 && fy + kh > y - 4) continue;   // 不长到场景物件上
          sprite(yard, k, Math.round(fx0), Math.round(fy), s, r() < 0.5, side);
        }
        y += h + 140 + r() * 140;
      }
    });
  }
  var rt; function soon() { clearTimeout(rt); rt = setTimeout(layout, 150); }
  document.addEventListener('visibilitychange',function(){if(document.hidden)document.querySelectorAll('.yi').forEach(function(o){if(o._on){clearInterval(o._on);o._on=0;o.classList.remove('bop');o.setAttribute('aria-pressed','false');}});});
  window.addEventListener('resize', soon);
  window.addEventListener('portfolio-relayout', soon);
  window.addEventListener('load', layout);
  layout();
})();
