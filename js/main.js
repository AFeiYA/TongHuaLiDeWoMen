/**
 * 童话里的我们 / A Fairytale Called Us — Main JavaScript (Editorial Magazine Edition)
 * 功能：星光粒子 · 3D 封面 · 滚动收听与进度同步 (Scroll-linked Autoplay) · 浮动星图雷达导航 · 双语化 (CN/EN) · 杂志海报 Canvas 导出
 */

/* ==========================================================================
   1. 星光粒子与鼠标排斥 (Hero Canvas)
   ========================================================================== */
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const hero = document.getElementById('hero');
  let stars = [];
  const COUNT = 120;
  let mouse = { x: -1000, y: -1000 };

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
  }

  function createStars() {
    stars = [];
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    for (let i = 0; i < COUNT; i++) {
      stars.push({
        baseX: Math.random() * w,
        baseY: Math.random() * h,
        x: 0,
        y: 0,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random(),
        delta: (Math.random() * 0.01 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
      });
      stars[i].x = stars[i].baseX;
      stars[i].y = stars[i].baseY;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    for (const s of stars) {
      s.alpha += s.delta;
      if (s.alpha <= 0 || s.alpha >= 1) s.delta *= -1;
      s.alpha = Math.max(0, Math.min(1, s.alpha));

      const dx = mouse.x - s.baseX;
      const dy = mouse.y - s.baseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const limit = 120;
      
      if (dist < limit) {
        const force = (limit - dist) / limit;
        const angle = Math.atan2(dy, dx);
        const targetX = s.baseX - Math.cos(angle) * force * 25;
        const targetY = s.baseY - Math.sin(angle) * force * 25;
        s.x += (targetX - s.x) * 0.1;
        s.y += (targetY - s.y) * 0.1;
      } else {
        s.x += (s.baseX - s.x) * 0.05;
        s.y += (s.baseY - s.y) * 0.05;
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${s.alpha * 0.55})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  resize();
  createStars();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createStars();
  });

  hero.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  hero.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });
})();

/* ==========================================================================
   2. 封面 3D Parallax 倾斜效果
   ========================================================================== */
(function initCoverParallax() {
  const card = document.getElementById('heroCoverCard');
  const hero = document.getElementById('hero');
  if (!card || !hero) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cardX = rect.left + rect.width / 2;
    const cardY = rect.top + rect.height / 2;
    const dx = e.clientX - cardX;
    const dy = e.clientY - cardY;

    const tiltX = -(dy / (window.innerHeight / 2)) * 20;
    const tiltY = (dx / (window.innerWidth / 2)) * 20;

    card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });

  hero.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
})();

/* ==========================================================================
   3. 双语配置字典 (Bilingual i18n & Typographic Quotes)
   ========================================================================== */
let currentLang = 'zh';

const TRANSLATIONS = {
  zh: {
    heroTitle: "童话里的我们",
    heroSubtitle: "The Us In Fairytales",
    heroDesc: "这是一张关于「人成为自己」的概念专辑。<br />12 首歌像 12 扇门：每一扇门后都有一种我们熟悉却难以命名的心理状态。<br />你会听见缺失感如何长出怀疑，防御如何把心跳锁住，恐惧如何被炼成勇气；<br />也会坠入荒诞的失重，体验面具与真实缠在一起的疼痛，走进雾里告别天真。",
    scrollHint: "向下探索",
    act1Num: "Act I",
    act1Title: "迷失",
    act1Subtitle: "第一幕 / Lost",
    act2Num: "Act II",
    act2Title: "寻找",
    act2Subtitle: "第二幕 / Search",
    act3Num: "Act III",
    act3Title: "觉醒",
    act3Subtitle: "第三幕 / Awakening",
    act4Num: "Act IV",
    act4Title: "回归",
    act4Subtitle: "第四幕 / Return",
    nowPlaying: "正在阅读与收听",
    listenLabel: "🔗 收听此曲目其它平台源",
    
    // 星图配置
    soulMapTitle: "星光轨迹灵魂星图",
    soulMapDesc: "您的阅读与收听足迹已点亮 <span id='litCount'>0</span> / 12 首歌曲的星轨。点亮所有星轨以生成您的「童话分身海报」🌟",
    generateBtnText: "生成专属童话海报",
    posterTipText: "长按或右键图片即可保存卡片 🌌",
    subscribeTitle: "加入我们的故事",
    subscribeDesc: "留下你的联系方式，第一时间获取专辑动态、演出信息与幕后故事。",
    subscribeBtn: "订阅",
    nicknamePlaceholder: "你的昵称",
    emailPlaceholder: "你的邮箱",
    msgPlaceholder: "想对我们说的话（选填）",
    subscribeThanks: "感谢你的关注！我们会在童话的下一章与你相见 ✨",
    mapUs: "我们",
    
    archetypes: [
      { id: 1, name: "稻草人", song: "我没有大脑", quote: "“我不想要什么大脑，如果它只会制造烦恼。可我为何，感到了思考？”" },
      { id: 2, name: "铁皮人", song: "生锈的心", quote: "“我有一颗生锈的心，它跳动时有刺耳的声音。但当你在人群中叫我，它开始剧烈震颤。”" },
      { id: 3, name: "胆小狮子", song: "害怕的人", quote: "“勇气不是从不畏惧，而是带着浑身的恐惧，依然向那片深渊迈出最后一步。”" },
      { id: 4, name: "爱丽丝", song: "兔子洞", quote: "“天花板在脚下，地板在云端抽离。在这里，疯子才是清醒的唯一。”" },
      { id: 5, name: "匹诺曹", song: "说谎的木偶", quote: "“跳舞吧说谎的木偶，反正这世界也是一座巨大的木偶秀。”" },
      { id: 6, name: "小红帽", song: "森林", quote: "“穿过这片森林，脱掉红色的梦境。森林深处没有外婆，只有长大的我。”" },
      { id: 7, name: "睡美人", song: "沉睡的时间", quote: "“等这一场雨淋透了贪婪的渴求，时间是默契的好友，也是宽容的出口。”" },
      { id: 8, name: "小王子", song: "编号B-612的告别", quote: "“我的玫瑰正在银河某个角落枯萎，我却在这陌生的星球慢慢掉泪。”" },
      { id: 9, name: "人鱼公主", song: "声音", quote: "“爱是一种自愿的残缺，觉醒是一场华丽的自虐。哪怕结局是幻灭，我不后悔游向这个世界。”" },
      { id: 10, name: "奥兹", song: "魔法师", quote: "“你给不了大脑，也给不了心。因为那些滚烫的东西，从不需要由你恩赐。”" },
      { id: 11, name: "多萝西", song: "回家的路", quote: "“这就是回家的路，平凡才是我最奢侈的天赋。当我不再逃离，每一步都算抵达。”" },
      { id: 12, name: "我们", song: "我们", quote: "“在这个荒诞的宇宙里补全证据，原来我们就是童话的本身。”" }
    ],
    
    // 海报导出词条
    posterHeader: "THE US IN FAIRYTALES",
    posterTitle: "童话里的我们",
    posterSubtitle: "—— 专属童话人格星轨画报 ——",
    posterQuoteTitle: "—— 灵魂回响与觉醒印记 ——",
    posterCountPrefix: "已拼接 ",
    posterCountSuffix: " / 12 片散落的灵魂碎片",
    posterCopyright: "© 2026 童话里的我们 · The Us In Fairytales"
  },
  en: {
    heroTitle: "A Fairytale Called Us",
    heroSubtitle: "A Fairytale Called Us",
    heroDesc: "This is a concept album about 'becoming oneself'.<br />12 songs are like 12 doors: behind each door lies a familiar yet hard-to-name state of mind.<br />You will hear how lack breeds doubt, how defense locks the heartbeat, and how fear is forged into courage;<br />you will fall into weightlessness, feel the pain of mask and reality tangled, and step into the fog to say goodbye to innocence.",
    scrollHint: "Scroll Down",
    act1Num: "Act I",
    act1Title: "Lost",
    act1Subtitle: "Act I / Lost",
    act2Num: "Act II",
    act2Title: "Search",
    act2Subtitle: "Act II / Search",
    act3Num: "Act III",
    act3Title: "Awakening",
    act3Subtitle: "Act III / Awakening",
    act4Num: "Act IV",
    act4Title: "Return",
    act4Subtitle: "Act IV / Return",
    nowPlaying: "Now Reading & Listening",
    listenLabel: "🔗 Listen on other platforms",
    
    soulMapTitle: "Starlight Constellation Map",
    soulMapDesc: "Your reading and listening footprint has lit up <span id='litCount'>0</span> / 12 nodes. Explore all sections to generate your 'Fairytale Poster Card' 🌟",
    generateBtnText: "Generate Fairytale Poster",
    posterTipText: "Long press or right-click to save your card 🌌",
    subscribeTitle: "Join Our Story",
    subscribeDesc: "Leave your contact to get the latest updates, performance schedules, and behind-the-scenes stories.",
    subscribeBtn: "Subscribe",
    nicknamePlaceholder: "Nickname",
    emailPlaceholder: "Email",
    msgPlaceholder: "Message (optional)",
    subscribeThanks: "Thank you for subscribing! We will meet in the next chapter of the fairytale ✨",
    mapUs: "Us",
    
    archetypes: [
      { id: 1, name: "Scarecrow", song: "The Hollow", quote: "“I don't want a brain if it only makes trouble. Yet why do I feel the echo of thought?”" },
      { id: 2, name: "Tin Woodman", song: "The Rust", quote: "“I have a rusty heart with a screeching beat. Yet when you call my name, it echoes deep.”" },
      { id: 3, name: "Cowardly Lion", song: "The Coward", quote: "“Courage is not the absence of fear, but taking that final step despite trembling knees.”" },
      { id: 4, name: "Alice", song: "The Fall", quote: "“The ceiling is below, the floor drifts in the clouds. Here, only the mad remain sane.”" },
      { id: 5, name: "Pinocchio", song: "The Marionette", quote: "“Dance, lying marionette, for the world itself is but a grand puppet show.”" },
      { id: 6, name: "Little Red Riding Hood", song: "The Forest", quote: "“Through this forest, shed the crimson dream. Deep inside, there is no grandmother, only a grown-up me.”" },
      { id: 7, name: "Sleeping Beauty", song: "The Amber", quote: "“Let the rain soak the greedy thirst. Time is a silent friend and a forgiving escape.”" },
      { id: 8, name: "The Little Prince", song: "The Rose", quote: "“My rose is fading in some corner of the galaxy, while I weep on this foreign star.”" },
      { id: 9, name: "Little Mermaid", song: "The Silence", quote: "“Love is a voluntary flaw; awakening is a beautiful self-infliction. I do not regret swimming to this world.”" },
      { id: 10, name: "Wizard of Oz", song: "The Curtain", quote: "“You cannot give a brain, nor a heart. For those burning wonders need no gift from you.”" },
      { id: 11, name: "Dorothy", song: "The Return", quote: "“This is the road home, where the ordinary is my most luxurious gift. When I stop running, every step is arrival.”" },
      { id: 12, name: "Us", song: "We Are the Fairytale", quote: "“Completing the evidence in this absurd universe, we are the fairytale itself.”" }
    ],
    
    posterHeader: "A FAIRYTALE CALLED US",
    posterTitle: "A Fairytale Called Us",
    posterSubtitle: "—— Custom Fairytale Persona Card ——",
    posterQuoteTitle: "—— Domain of Awakening & Soul Echoes ——",
    posterCountPrefix: "Assembled ",
    posterCountSuffix: " / 12 scattered soul fragments",
    posterCopyright: "© 2026 A Fairytale Called Us"
  }
};

/* ==========================================================================
   4. 双语页面渲染逻辑与卡片数据切换
   ========================================================================== */
function setLanguage(lang) {
  currentLang = lang;
  
  // 更新语言按钮高亮状态
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  const tr = TRANSLATIONS[lang];

  // 1. 翻译带 data-i18n 的静态 DOM
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (tr[key]) {
      el.innerHTML = tr[key];
    }
  });

  // 2. 翻译带 Placeholders 的元素
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (tr[key]) {
      el.placeholder = tr[key];
    }
  });

  // 3. 动态刷新歌词版块名称与主题
  if (typeof TRACKS_CONFIG !== 'undefined') {
    const tracksList = (lang === 'zh') ? TRACKS_CONFIG.tracks : TRACKS_CONFIG.tracks_en;
    
    tracksList.forEach((t) => {
      const section = document.getElementById(`track-${t.id}`);
      if (!section) return;

      const titleEl = section.querySelector('.track-song-name');
      const themeEl = section.querySelector('.track-section-theme');
      const lyricsPre = section.querySelector('.track-lyrics-col pre');
      
      if (titleEl) titleEl.textContent = (lang === 'zh') ? `《${t.name}》` : t.name;
      if (themeEl) themeEl.textContent = t.theme;
      if (lyricsPre) lyricsPre.textContent = t.lyrics;
    });
  }

  // 重新绘制双星轨 Canvas (浮动雷达与底部画册)
  drawRadarMap();
  drawSoulMap();

  // 如果海报处于生成状态，重新渲染海报以匹配当前语言
  const cardResultWrap = document.getElementById('cardResultWrap');
  if (cardResultWrap && !cardResultWrap.hidden) {
    generatePoster();
  }
}

// 绑定语言切换按钮事件
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    if (lang !== currentLang) {
      setLanguage(lang);
    }
  });
});

/* ==========================================================================
   5. 浮动 Constellation 雷达星图展示控制
   ========================================================================== */
const floatingRadar = document.getElementById('floatingRadar');
if (floatingRadar) {
  // 点击雷达图标，展开/收起浮动雷达容器
  floatingRadar.addEventListener('click', (e) => {
    if (e.target.closest('#radarContainer')) return; // 防止点击 Canvas 时触发折叠
    floatingRadar.classList.toggle('expanded');
    if (floatingRadar.classList.contains('expanded')) {
      setTimeout(drawRadarMap, 50); // 延时重绘防宽度坍缩
    }
  });

  // 点击外部关闭雷达
  document.addEventListener('click', (e) => {
    if (!floatingRadar.contains(e.target)) {
      floatingRadar.classList.remove('expanded');
    }
  });
}

/* ==========================================================================
   6. 进度记录 (localStorage 足迹管理)
   ========================================================================== */
function loadLitTracks() {
  const key = `soul_explored_${currentLang}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { return {}; }
  }
  return {};
}

function saveLitTrack(trackId) {
  const key = `soul_explored_${currentLang}`;
  const explored = loadLitTracks();
  if (!explored[trackId]) {
    explored[trackId] = true;
    localStorage.setItem(key, JSON.stringify(explored));
    
    // 更新指示进度
    updateProgressUI();
    drawRadarMap();
    drawSoulMap();
  }
}

function updateProgressUI() {
  const explored = loadLitTracks();
  const litCount = Object.keys(explored).length;
  
  const countSpan = document.getElementById('litCount');
  if (countSpan) countSpan.textContent = litCount;

  // 激活生成海报卡按钮条件：至少阅读收听了 1 首
  const generateBtn = document.getElementById('generateCardBtn');
  if (generateBtn) {
    if (litCount >= 1) {
      generateBtn.disabled = false;
      generateBtn.classList.remove('btn--disabled');
    } else {
      generateBtn.disabled = true;
      generateBtn.classList.add('btn--disabled');
    }
  }
}

/* ==========================================================================
   7. 滚动监听：自动播放、激活高亮、点亮星图 (Intersection Observer)
   ========================================================================== */
let currentPlayingId = null;
const hiddenPlayer = document.getElementById('hiddenPlayerContainer');

(function initScrollObserver() {
  const sections = document.querySelectorAll('.track-section');
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const trackId = parseInt(entry.target.dataset.track, 10);
        
        // 1. 给当前激活的版式添加高亮状态类 (触发大留白渐入、小脉冲呼吸点显示)
        sections.forEach(s => s.classList.remove('active'));
        entry.target.classList.add('active');

        // 2. 自动标记该曲目足迹为“已探索点亮”
        saveLitTrack(trackId);

        // 3. 自动触发隐藏式后台静默切歌播放
        if (currentPlayingId !== trackId) {
          if (hiddenPlayer && typeof TRACKS_CONFIG !== 'undefined') {
            const tracksList = (currentLang === 'zh') ? TRACKS_CONFIG.tracks : TRACKS_CONFIG.tracks_en;
            const trackData = tracksList.find((t) => t.id === trackId);
            
            if (trackData && trackData.neteaseId) {
              hiddenPlayer.innerHTML = `<iframe src="https://music.163.com/outchain/player?type=2&id=${trackData.neteaseId}&auto=1&height=66" width="300" height="80" frameborder="no" border="0" marginwidth="0" marginheight="0" allow="autoplay"></iframe>`;
              currentPlayingId = trackId;
            } else {
              hiddenPlayer.innerHTML = '';
              currentPlayingId = null;
            }
          }
        }
      }
    });
  }, {
    // 监听当曲目部分占屏幕视口高度至少 30% 且在中心附近时的触发
    rootMargin: '-25% 0px -25% 0px',
    threshold: 0.1
  });

  sections.forEach((sec) => observer.observe(sec));
})();

/* ==========================================================================
   8. 绘制与控制 Constellation 星轨地图 (抽象连线与点击导航逻辑)
   ========================================================================== */

function getConstellationCoords(cx, cy, r) {
  const coords = [];
  const tr = TRANSLATIONS[currentLang];
  const explored = loadLitTracks();

  tr.archetypes.forEach((arch, i) => {
    const angle = i * (Math.PI * 2 / 12) - Math.PI / 2;
    const sx = cx + r * Math.cos(angle);
    const sy = cy + r * Math.sin(angle);
    const isLit = !!explored[arch.id];
    coords.push({ id: arch.id, x: sx, y: sy, lit: isLit, name: arch.name });
  });
  return coords;
}

// 绘制主星图或雷达星图
function drawGraph(canvas, isRadar = false) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // 响应式画布 DPR 放大防止糊字
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.parentElement.offsetWidth || 300;
  const h = canvas.parentElement.offsetHeight || 300;
  
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);

  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * (isRadar ? 0.36 : 0.38);

  ctx.clearRect(0, 0, w, h);

  // 1. 绘制网格弱星轨轨道
  ctx.strokeStyle = 'rgba(201, 168, 76, 0.05)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
  ctx.stroke();

  // 2. 计算坐标
  const coords = getConstellationCoords(cx, cy, r);

  // 3. 连线点亮的星座节点
  coords.forEach((p, i) => {
    const next = coords[(i + 1) % 12];
    if (p.lit && next.lit) {
      ctx.strokeStyle = 'rgba(201, 168, 76, 0.7)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(next.x, next.y);
      ctx.stroke();
    } else {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(next.x, next.y);
      ctx.stroke();
    }

    if (p.lit) {
      ctx.strokeStyle = 'rgba(201, 168, 76, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  });

  // 绘制星空核心微光
  const explored = loadLitTracks();
  const litCount = Object.keys(explored).length;
  const coreR = (isRadar ? 10 : 15) + litCount * 1.2;
  const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, coreR * 2.2);
  coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  coreGrad.addColorStop(0.3, 'rgba(201, 168, 76, 0.75)');
  coreGrad.addColorStop(1, 'rgba(201, 168, 76, 0)');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, coreR * 2.2, 0, Math.PI * 2);
  ctx.fill();

  // 绘制中央圆心
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fill();

  // 4. 绘制星点星芒
  coords.forEach((p) => {
    if (p.lit) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, isRadar ? 4.5 : 5, 0, Math.PI * 2);
      ctx.fill();

      // 描金星芒方圈
      ctx.strokeStyle = 'rgba(201, 168, 76, 0.8)';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(p.x - (isRadar ? 6 : 7), p.y - (isRadar ? 6 : 7), isRadar ? 12 : 14, isRadar ? 12 : 14);

      // 字号绘制
      ctx.fillStyle = '#ffffff';
      ctx.font = isRadar ? 'bold 9px sans-serif' : 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      const offsetDir = (p.y - cy) > 0 ? (isRadar ? 18 : 22) : (isRadar ? -13 : -16);
      ctx.fillText(p.name, p.x, p.y + offsetDir);
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, isRadar ? 2.5 : 3, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // 圆心文字
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.font = isRadar ? 'bold 9px sans-serif' : 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(TRANSLATIONS[currentLang].mapUs, cx, cy - (isRadar ? 16 : 22));
}

// 星图交互点击：点击星星平滑滚动到歌曲
function bindCanvasClick(canvas, isRadar = false) {
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) * (isRadar ? 0.36 : 0.38);

    const coords = getConstellationCoords(cx, cy, r);
    
    // 检测是否点击到某个节点 (允许 18 像素误差范围)
    for (const p of coords) {
      const dx = x - p.x;
      const dy = y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= 18) {
        const targetSection = document.getElementById(`track-${p.id}`);
        if (targetSection) {
          // 如果是浮动雷达，滚动前自动收拢
          if (isRadar) {
            floatingRadar.classList.remove('expanded');
          }
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        break;
      }
    }
  });
}

function drawRadarMap() {
  const canvas = document.getElementById('radarCanvas');
  if (canvas) {
    drawGraph(canvas, true);
  }
}

function drawSoulMap() {
  const canvas = document.getElementById('soulCanvas');
  if (canvas) {
    drawGraph(canvas, false);
  }
}

// 绑定星图的点击导航
window.addEventListener('DOMContentLoaded', () => {
  const radarCanvas = document.getElementById('radarCanvas');
  const soulCanvas = document.getElementById('soulCanvas');
  if (radarCanvas) bindCanvasClick(radarCanvas, true);
  if (soulCanvas) bindCanvasClick(soulCanvas, false);
});

/* ==========================================================================
   9. 双语海报卡片 Canvas 生成器 (Poster Generator)
   ========================================================================== */
const generateCardBtn = document.getElementById('generateCardBtn');
const cardResultWrap = document.getElementById('cardResultWrap');
const posterCanvas = document.getElementById('posterCanvas');
const posterPreview = document.getElementById('posterPreview');

if (generateCardBtn) {
  generateCardBtn.addEventListener('click', generatePoster);
}

function generatePoster() {
  if (!posterCanvas) return;
  const ctx = posterCanvas.getContext('2d');
  const w = posterCanvas.width;
  const h = posterCanvas.height;

  const tr = TRANSLATIONS[currentLang];
  const explored = loadLitTracks();
  const litCount = Object.keys(explored).length;

  // 1. 暗夜星光微粒渐变背景
  const bgGrad = ctx.createRadialGradient(w/2, h/2, 50, w/2, h/2, w);
  bgGrad.addColorStop(0, '#0a1226');
  bgGrad.addColorStop(1, '#02050c');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // 绘制星光噪点
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  for (let i = 0; i < 90; i++) {
    const sx = Math.random() * w;
    const sy = Math.random() * h;
    const r = Math.random() * 1.5;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. 双重华丽金框
  ctx.strokeStyle = 'rgba(201, 168, 76, 0.65)';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, w - 40, h - 40);
  
  ctx.strokeStyle = 'rgba(201, 168, 76, 0.2)';
  ctx.lineWidth = 1;
  ctx.strokeRect(26, 26, w - 52, h - 52);

  // 3. 头部标题
  ctx.textAlign = 'center';
  ctx.fillStyle = '#c9a84c';
  ctx.font = 'normal 13px Georgia, serif';
  ctx.letterSpacing = '4px';
  ctx.fillText(tr.posterHeader, w/2, 75);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText(tr.posterTitle, w/2, 125);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = 'normal 12px sans-serif';
  ctx.fillText(tr.posterSubtitle, w/2, 160);

  // 4. 在海报中央绘制微型星图
  const cx = w / 2;
  const cy = 370;
  const r = 125;

  ctx.strokeStyle = 'rgba(201, 168, 76, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  const coords = getConstellationCoords(cx, cy, r);

  coords.forEach((p, i) => {
    const next = coords[(i + 1) % 12];
    if (p.lit && next.lit) {
      ctx.strokeStyle = 'rgba(201, 168, 76, 0.75)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(next.x, next.y);
      ctx.stroke();
    } else {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(next.x, next.y);
      ctx.stroke();
    }
    
    if (p.lit) {
      ctx.strokeStyle = 'rgba(201, 168, 76, 0.15)';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  });

  const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 35);
  coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
  coreGrad.addColorStop(0.4, 'rgba(201, 168, 76, 0.55)');
  coreGrad.addColorStop(1, 'rgba(201, 168, 76, 0)');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 35, 0, Math.PI * 2);
  ctx.fill();

  coords.forEach((p) => {
    if (p.lit) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#c9a84c';
      ctx.strokeRect(p.x - 6.5, p.y - 6.5, 13, 13);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      const offsetDir = (p.y - cy) > 0 ? 22 : -16;
      ctx.fillText(p.name, p.x, p.y + offsetDir);
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText(tr.mapUs, cx, cy - 25);

  // 5. 灵魂印记：精选歌词段落渲染模块 (杂志人文排版核心)
  const textStartY = 560;
  ctx.fillStyle = '#c9a84c';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(tr.posterQuoteTitle, w/2, textStartY);

  // 精选一句用户探索到的经典歌词进行渲染
  let selectedQuote = "";
  const litSongs = coords.filter(p => p.lit);
  if (litSongs.length > 0) {
    // 随机选择一句已点亮歌曲的金句歌词
    const randomSong = litSongs[Math.floor(Math.random() * litSongs.length)];
    const archData = tr.archetypes.find(a => a.id === randomSong.id);
    if (archData) selectedQuote = archData.quote;
  } else {
    selectedQuote = tr.archetypes[0].quote;
  }

  // 自动换行包住引言
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = 'italic 15px Georgia, serif';
  ctx.textAlign = 'center';
  
  // 拆分多行渲染
  wrapText(ctx, selectedQuote, w / 2, textStartY + 45, 460, 26);

  // 6. 页脚
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = 'normal 11px sans-serif';
  ctx.fillText(`${tr.posterCountPrefix}${litCount}${tr.posterCountSuffix}`, w/2, 805);
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.font = 'normal 11px sans-serif';
  ctx.fillText(tr.posterCopyright, w/2, 845);

  // 7. 导出 Base64 png 图片
  try {
    const dataUrl = posterCanvas.toDataURL('image/png');
    posterPreview.src = dataUrl;
    cardResultWrap.hidden = false;
    setTimeout(() => {
      cardResultWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  } catch (e) {
    console.error("Failed to generate poster:", e);
  }
}

// 辅助方法：给 Canvas 文本自动按宽度折行
function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split('');
  let line = '';
  let testY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n];
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, testY);
      line = words[n];
      testY += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, testY);
}

/* ==========================================================================
   10. 基础绑定与初始化
   ========================================================================== */
const scrollHint = document.getElementById('scrollHint');
if (scrollHint) {
  scrollHint.addEventListener('click', () => {
    const target = document.getElementById('tracklist');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
}

// 默认中文加载
window.addEventListener('DOMContentLoaded', () => {
  setLanguage('zh');
  updateProgressUI();
});
