/**
 * 童话里的我们 / A Fairytale Called Us — Main JavaScript (Bilingual Refactored Version)
 * 功能：星光粒子 · 3D封面倾斜 · 展开折叠与隐藏后台自动播放 · 双语切换 (CN/EN) · 本地储存 · 星图星象绘制 · 双语海报 Canvas 导出
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
  const COUNT = 150;
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
        r: Math.random() * 1.6 + 0.4,
        alpha: Math.random(),
        delta: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      });
      stars[i].x = stars[i].baseX;
      stars[i].y = stars[i].baseY;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

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
        const targetX = s.baseX - Math.cos(angle) * force * 30;
        const targetY = s.baseY - Math.sin(angle) * force * 30;
        s.x += (targetX - s.x) * 0.1;
        s.y += (targetY - s.y) * 0.1;
      } else {
        s.x += (s.baseX - s.x) * 0.05;
        s.y += (s.baseY - s.y) * 0.05;
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${s.alpha * 0.65})`;
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

    const tiltX = -(dy / (window.innerHeight / 2)) * 25;
    const tiltY = (dx / (window.innerWidth / 2)) * 25;

    card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });

  hero.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
})();

/* ==========================================================================
   3. 双语语言翻译映射 (CN / EN)
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
    act1Subtitle: "Lost in the Woods",
    act2Num: "Act II",
    act2Title: "寻找",
    act2Subtitle: "Search in the Caves",
    act3Num: "Act III",
    act3Title: "觉醒",
    act3Subtitle: "Awakening of the Self",
    act4Num: "Act IV",
    act4Title: "回归",
    act4Subtitle: "Return to the Daily Life",
    soulMapTitle: "星光灵魂地图",
    soulMapDesc: "您的探索之旅已点亮 <span id='litCount'>0</span> / 12 首歌曲的心声。当点亮所有歌曲后，即可生成您的「童话分身人格卡」。",
    generateBtnText: "生成专属人格卡",
    posterTipText: "长按或右键图片即可保存卡片 🌌",
    subscribeTitle: "订阅我们",
    subscribeDesc: "我们会在童话的下一章与你相见。输入邮箱，订阅《童话里的我们》最新动态与周边资讯。",
    subscribeBtn: "订阅",
    nicknamePlaceholder: "你的昵称",
    emailPlaceholder: "你的邮箱",
    msgPlaceholder: "想对我们说的话（选填）",
    subscribeThanks: "感谢你的关注！我们会在童话的下一章与你相见 ✨",
    
    // 曲目内部动态词条
    listenLabel: "🔗 在其他平台收听",
    lyricsLabel: "歌词",
    interactTitle: "💬 互动：这首歌唱的是谁？",
    questionWho: "你觉得这首歌唱的是谁？",
    questionWhy: "为什么？",
    questionSelf: "你在这首歌里看见了自己的哪一部分？",
    placeholderWho: "你的答案…",
    placeholderWhy: "说说你的理由…",
    placeholderSelf: "如果愿意，写下来…",
    submitBtn: "提交",
    updateBtn: "更新答案",
    savedTag: "已保存到本地星图 🌌",
    thanksMsg: "谢谢你的分享 ✨",
    mapUs: "我们",
    
    // 星图配置
    archetypes: [
      { id: 1, name: "稻草人", song: "我没有大脑" },
      { id: 2, name: "铁皮人", song: "生锈的心" },
      { id: 3, name: "胆小狮子", song: "害怕的人" },
      { id: 4, name: "爱丽丝", song: "兔子洞" },
      { id: 5, name: "匹诺曹", song: "说谎的木偶" },
      { id: 6, name: "小红帽", song: "森林" },
      { id: 7, name: "睡美人", song: "沉睡的时间" },
      { id: 8, name: "小王子", song: "编号B-612的告别" },
      { id: 9, name: "人鱼公主", song: "声音" },
      { id: 10, name: "奥兹", song: "魔法师" },
      { id: 11, name: "多萝西", song: "回家的路" },
      { id: 12, name: "我们", song: "我们" }
    ],
    
    // 海报文本
    posterHeader: "THE US IN FAIRYTALES",
    posterTitle: "童话里的我们",
    posterSubtitle: "—— 专属童话人格星图分身 ——",
    posterReportTitle: "—— 觉醒之境与灵魂拼图 ——",
    posterCountPrefix: "已拼接 ",
    posterCountSuffix: " / 12 片散落的灵魂碎片",
    posterQuote: "“在这个荒诞的宇宙里补全证据，原来我们就是童话的本身”",
    posterCopyright: "© 2026 童话里的我们 · The Us In Fairytales"
  },
  en: {
    heroTitle: "A Fairytale Called Us",
    heroSubtitle: "A Fairytale Called Us",
    heroDesc: "This is a concept album about 'becoming oneself'.<br />12 songs are like 12 doors: behind each door lies a familiar yet hard-to-name state of mind.<br />You will hear how lack breeds doubt, how defense locks the heartbeat, and how fear is forged into courage;<br />you will fall into weightlessness, feel the pain of mask and reality tangled, and step into the fog to say goodbye to innocence.",
    scrollHint: "Explore Downward",
    act1Num: "Act I",
    act1Title: "Lost",
    act1Subtitle: "Lost in the Woods",
    act2Num: "Act II",
    act2Title: "Search",
    act2Subtitle: "Search in the Caves",
    act3Num: "Act III",
    act3Title: "Awakening",
    act3Subtitle: "Awakening of the Self",
    act4Num: "Act IV",
    act4Title: "Return",
    act4Subtitle: "Return to the Daily Life",
    soulMapTitle: "Starlight Soul Map",
    soulMapDesc: "Your journey has unlocked <span id='litCount'>0</span> / 12 song insights. Light up all nodes to generate your 'Fairytale Persona Card'.",
    generateBtnText: "Generate Persona Card",
    posterTipText: "Long press or right-click to save your card 🌌",
    subscribeTitle: "Subscribe",
    subscribeDesc: "We will meet in the next chapter of the fairytale. Enter your email for the latest updates and merch.",
    subscribeBtn: "Subscribe",
    nicknamePlaceholder: "Your Nickname",
    emailPlaceholder: "Your Email",
    msgPlaceholder: "What you want to say to us (optional)",
    subscribeThanks: "Thank you for subscribing! We will meet in the next chapter ✨",
    
    listenLabel: "🔗 Listen on other platforms",
    lyricsLabel: "Lyrics",
    interactTitle: "💬 Interaction: Who is this song about?",
    questionWho: "Who do you think this song represents?",
    questionWhy: "Why do you feel this way?",
    questionSelf: "What part of yourself did you see in this song?",
    placeholderWho: "Your answer...",
    placeholderWhy: "Your thoughts...",
    placeholderSelf: "Write down your reflections if you wish...",
    submitBtn: "Submit",
    updateBtn: "Update Answer",
    savedTag: "Saved to your Starlight Map 🌌",
    thanksMsg: "Thank you for sharing ✨",
    mapUs: "Us",
    
    archetypes: [
      { id: 1, name: "Scarecrow", song: "The Hollow" },
      { id: 2, name: "Tin Woodman", song: "The Rust" },
      { id: 3, name: "Cowardly Lion", song: "The Coward" },
      { id: 4, name: "Alice", song: "The Fall" },
      { id: 5, name: "Pinocchio", song: "The Marionette" },
      { id: 6, name: "Little Red Riding Hood", song: "The Forest" },
      { id: 7, name: "Sleeping Beauty", song: "The Amber" },
      { id: 8, name: "The Little Prince", song: "The Rose" },
      { id: 9, name: "Little Mermaid", song: "The Silence" },
      { id: 10, name: "Wizard of Oz", song: "The Curtain" },
      { id: 11, name: "Dorothy", song: "The Return" },
      { id: 12, name: "Us", song: "We Are the Fairytale" }
    ],
    
    posterHeader: "A FAIRYTALE CALLED US",
    posterTitle: "A Fairytale Called Us",
    posterSubtitle: "—— Custom Fairytale Persona Star Map ——",
    posterReportTitle: "—— Domain of Awakening & Soul Pieces ——",
    posterCountPrefix: "Assembled ",
    posterCountSuffix: " / 12 scattered soul fragments",
    posterQuote: "“In this absurd universe, we are the very evidence of fairytales.”",
    posterCopyright: "© 2026 A Fairytale Called Us"
  }
};

/* ==========================================================================
   4. 双语页面渲染逻辑与卡片数据切换
   ========================================================================== */
function setLanguage(lang) {
  currentLang = lang;
  
  // 更新切换按钮高亮
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  const tr = TRANSLATIONS[lang];

  // 1. 翻译普通 i18n 元素
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (tr[key]) {
      el.innerHTML = tr[key];
    }
  });

  // 2. 翻译 Placeholder 元素
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (tr[key]) {
      el.placeholder = tr[key];
    }
  });

  // 3. 动态更新歌曲卡片内容
  if (typeof TRACKS_CONFIG !== 'undefined') {
    const tracksList = (lang === 'zh') ? TRACKS_CONFIG.tracks : TRACKS_CONFIG.tracks_en;
    
    tracksList.forEach((t) => {
      const card = document.querySelector(`.track-card[data-track="${t.id}"]`);
      if (!card) return;

      // 更新歌名与主题
      const songNameEl = card.querySelector('.track-card__song');
      const themeEl = card.querySelector('.track-card__theme');
      if (songNameEl) songNameEl.textContent = (lang === 'zh') ? `《${t.name}》` : t.name;
      if (themeEl) themeEl.textContent = t.theme;

      // 更新内部链接标签与歌词标签
      const linksLabel = card.querySelector('.track-card__links-label');
      const lyricsLabel = card.querySelector('.track-card__lyrics h4');
      const lyricsPre = card.querySelector('.track-card__lyrics pre');
      
      if (linksLabel) linksLabel.textContent = tr.listenLabel;
      if (lyricsLabel) lyricsLabel.textContent = tr.lyricsLabel;
      if (lyricsPre) lyricsPre.textContent = t.lyrics;

      // 更新表单 labels, placeholders & values
      const interactForm = card.querySelector('.interact-form');
      if (interactForm) {
        interactForm.dataset.trackName = `${String(t.id).padStart(2, '0')} ${t.name}`;
        
        const labels = interactForm.querySelectorAll('label');
        if (labels.length >= 3) {
          labels[0].firstChild.textContent = tr.questionWho;
          labels[1].firstChild.textContent = tr.questionWhy;
          labels[2].firstChild.textContent = tr.questionSelf;
        }

        const inputs = interactForm.querySelectorAll('input, textarea');
        if (inputs.length >= 3) {
          inputs[0].placeholder = tr.placeholderWho;
          inputs[1].placeholder = tr.placeholderWhy;
          inputs[2].placeholder = tr.placeholderSelf;
        }

        const submitBtn = interactForm.querySelector('button[type="submit"]');
        const statusTag = interactForm.querySelector('.interact-form__status-tag');
        const thanksAlert = interactForm.querySelector('.interact-form__thanks');
        
        // 读取对应的已存答案并重新加载
        const answers = loadAnswersForLang(lang);
        const savedAnswer = answers[interactForm.dataset.trackName];
        
        if (submitBtn) submitBtn.textContent = savedAnswer ? tr.updateBtn : tr.submitBtn;
        if (statusTag) {
          statusTag.textContent = tr.savedTag;
          statusTag.hidden = !savedAnswer;
        }
        if (thanksAlert) thanksAlert.textContent = tr.thanksMsg;

        if (inputs.length >= 3) {
          inputs[0].value = savedAnswer ? (savedAnswer.who || '') : '';
          inputs[1].value = savedAnswer ? (savedAnswer.why || '') : '';
          inputs[2].value = savedAnswer ? (savedAnswer.self || '') : '';
        }
      }
    });
  }

  // 刷新进度、灵魂星图与海报
  updateSoulProgress();
  drawSoulMap();
  
  // 如果海报正在显示，则重新绘制海报以实现多语言海报导出
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
   5. 卡片交互：展开折叠与隐藏后台自动播放
   ========================================================================== */
let currentPlayingId = null;
const hiddenPlayer = document.getElementById('hiddenPlayerContainer');

document.querySelectorAll('.track-card__front').forEach((front) => {
  front.addEventListener('click', () => {
    toggleCard(front);
  });
  
  front.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleCard(front);
    }
  });
});

function toggleCard(front) {
  const card = front.closest('.track-card');
  const detail = card.querySelector('.track-card__detail');
  const isOpen = front.getAttribute('aria-expanded') === 'true';
  const trackId = parseInt(card.dataset.track, 10);

  // 关闭其他卡片
  document.querySelectorAll('.track-card__front[aria-expanded="true"]').forEach((otherFront) => {
    if (otherFront !== front) {
      otherFront.setAttribute('aria-expanded', 'false');
      otherFront.closest('.track-card').querySelector('.track-card__detail').hidden = true;
    }
  });

  if (isOpen) {
    front.setAttribute('aria-expanded', 'false');
    detail.hidden = true;
    
    // 收起当前卡片时，停止后台播放
    if (currentPlayingId === trackId) {
      if (hiddenPlayer) hiddenPlayer.innerHTML = '';
      currentPlayingId = null;
    }
  } else {
    front.setAttribute('aria-expanded', 'true');
    detail.hidden = false;

    // 展开新卡片时，如果不是当前在播的歌，就启动后台自动播放（网易云音乐外链）
    if (currentPlayingId !== trackId) {
      if (hiddenPlayer && typeof TRACKS_CONFIG !== 'undefined') {
        const tracksList = (currentLang === 'zh') ? TRACKS_CONFIG.tracks : TRACKS_CONFIG.tracks_en;
        const trackData = tracksList.find((t) => t.id === trackId);
        
        if (trackData && trackData.neteaseId) {
          hiddenPlayer.innerHTML = `<iframe src="https://music.163.com/outchain/player?type=2&id=${trackData.neteaseId}&auto=1&height=66" width="300" height="80" frameborder="no" border="0" marginwidth="0" marginheight="0" allow="autoplay"></iframe>`;
          currentPlayingId = trackId;
        } else {
          // 如果没有网易云 ID，则清空播放器，停止之前的音乐
          hiddenPlayer.innerHTML = '';
          currentPlayingId = null;
        }
      }
    }

    setTimeout(() => {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  }
}

/* ==========================================================================
   6. 滚动淡入 (Intersection Observer)
   ========================================================================== */
(function initScrollReveal() {
  const acts = document.querySelectorAll('.act');
  if (!acts.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  acts.forEach((act) => observer.observe(act));
})();

/* ==========================================================================
   7. 互动数据 localStorage 持久化与分语言读取
   ========================================================================== */
function loadAnswersForLang(lang) {
  const key = (lang === 'zh') ? 'soul_answers' : 'soul_answers_en';
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return {};
    }
  }
  return {};
}

function saveAnswersForLang(lang, answers) {
  const key = (lang === 'zh') ? 'soul_answers' : 'soul_answers_en';
  localStorage.setItem(key, JSON.stringify(answers));
}

function updateSoulProgress() {
  const answers = loadAnswersForLang(currentLang);
  const answeredCount = Object.keys(answers).length;
  
  const countSpan = document.getElementById('litCount');
  if (countSpan) countSpan.textContent = answeredCount;

  const generateBtn = document.getElementById('generateCardBtn');
  if (generateBtn) {
    if (answeredCount >= 1) {
      generateBtn.disabled = false;
      generateBtn.classList.remove('btn--disabled');
    } else {
      generateBtn.disabled = true;
      generateBtn.classList.add('btn--disabled');
    }
  }
}

// 绑定所有的互动问答表单提交
document.querySelectorAll('.interact-form').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const trackName = form.dataset.trackName;
    const who = form.elements['who'].value;
    const why = form.elements['why'].value;
    const self = form.elements['self'].value;

    const btn = form.querySelector('button[type="submit"]');
    const statusTag = form.querySelector('.interact-form__status-tag');
    const thanks = form.querySelector('.interact-form__thanks');

    btn.disabled = true;
    btn.textContent = (currentLang === 'zh') ? '保存中…' : 'Saving...';

    const answers = loadAnswersForLang(currentLang);
    answers[trackName] = { who, why, self };
    saveAnswersForLang(currentLang, answers);

    await new Promise((r) => setTimeout(r, 500));

    btn.disabled = false;
    btn.textContent = TRANSLATIONS[currentLang].updateBtn;
    
    if (statusTag) {
      statusTag.textContent = TRANSLATIONS[currentLang].savedTag;
      statusTag.hidden = false;
    }
    if (thanks) {
      thanks.textContent = TRANSLATIONS[currentLang].thanksMsg;
      thanks.hidden = false;
      setTimeout(() => thanks.hidden = true, 3000);
    }

    updateSoulProgress();
    drawSoulMap();
  });
});

/* ==========================================================================
   8. 绘制 Constellation 双语星星地图
   ========================================================================== */
function drawSoulMap() {
  const canvas = document.getElementById('soulCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.parentElement.offsetWidth;
  const h = canvas.parentElement.offsetHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);

  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.35;

  ctx.clearRect(0, 0, w, h);

  // 1. 绘制网格微弱星轨
  ctx.strokeStyle = 'rgba(201, 168, 76, 0.04)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
  ctx.stroke();

  // 2. 映射当前语言的节点
  const archetypes = TRANSLATIONS[currentLang].archetypes;
  const answers = loadAnswersForLang(currentLang);
  
  let activeCoords = [];
  archetypes.forEach((arch, i) => {
    const angle = i * (Math.PI * 2 / 12) - Math.PI / 2;
    const sx = cx + r * Math.cos(angle);
    const sy = cy + r * Math.sin(angle);
    
    const songKey = `${String(arch.id).padStart(2, '0')} ${arch.song}`;
    const isLit = !!answers[songKey];
    activeCoords.push({ x: sx, y: sy, lit: isLit, name: arch.name, num: arch.id });
  });

  // 连线已点亮星座
  ctx.lineWidth = 1.5;
  activeCoords.forEach((p, i) => {
    const next = activeCoords[(i + 1) % 12];
    if (p.lit && next.lit) {
      const grad = ctx.createLinearGradient(p.x, p.y, next.x, next.y);
      grad.addColorStop(0, 'rgba(201, 168, 76, 0.65)');
      grad.addColorStop(1, 'rgba(201, 168, 76, 0.65)');
      ctx.strokeStyle = grad;
      ctx.shadowColor = 'rgba(201, 168, 76, 0.5)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(next.x, next.y);
      ctx.stroke();
      ctx.shadowBlur = 0;
    } else {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(next.x, next.y);
      ctx.stroke();
    }

    if (p.lit) {
      ctx.strokeStyle = 'rgba(201, 168, 76, 0.2)';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  });

  // 核心发光星系
  const answeredCount = Object.keys(answers).length;
  const coreRadius = 15 + answeredCount * 1.5;
  
  const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, coreRadius * 2.5);
  coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  coreGrad.addColorStop(0.3, 'rgba(201, 168, 76, 0.8)');
  coreGrad.addColorStop(1, 'rgba(201, 168, 76, 0)');
  
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, coreRadius * 2.5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fill();

  // 点亮星点与绘制标题
  activeCoords.forEach((p) => {
    if (p.lit) {
      ctx.shadowColor = 'rgba(201, 168, 76, 0.8)';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = 'rgba(201, 168, 76, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 9, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      const offsetDir = (p.y - cy) > 0 ? 20 : -16;
      ctx.fillText(p.name, p.x, p.y + offsetDir);
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // 圆心内核标志
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(TRANSLATIONS[currentLang].mapUs, cx, cy - 22);
}

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
  const answers = loadAnswersForLang(currentLang);
  const answeredCount = Object.keys(answers).length;

  // 1. 渐变背景
  const bgGrad = ctx.createRadialGradient(w/2, h/2, 50, w/2, h/2, w);
  bgGrad.addColorStop(0, '#0a1226');
  bgGrad.addColorStop(1, '#02050c');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // 散落繁星
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  for (let i = 0; i < 80; i++) {
    const sx = Math.random() * w;
    const sy = Math.random() * h;
    const r = Math.random() * 1.5;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. 双重描金外框
  ctx.strokeStyle = 'rgba(201, 168, 76, 0.6)';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, w - 40, h - 40);
  
  ctx.strokeStyle = 'rgba(201, 168, 76, 0.2)';
  ctx.lineWidth = 1;
  ctx.strokeRect(26, 26, w - 52, h - 52);

  // 3. 海报标题与元数据
  ctx.textAlign = 'center';
  ctx.fillStyle = '#c9a84c';
  ctx.font = 'normal 13px Georgia, serif';
  ctx.letterSpacing = '4px';
  ctx.fillText(tr.posterHeader, w/2, 70);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText(tr.posterTitle, w/2, 120);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = 'normal 12px sans-serif';
  ctx.fillText(tr.posterSubtitle, w/2, 155);

  // 4. 星图 Constellation 坐标计算与连线
  const cx = w / 2;
  const cy = 380;
  const r = 130;

  ctx.strokeStyle = 'rgba(201, 168, 76, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  let activeCoords = [];
  tr.archetypes.forEach((arch, i) => {
    const angle = i * (Math.PI * 2 / 12) - Math.PI / 2;
    const sx = cx + r * Math.cos(angle);
    const sy = cy + r * Math.sin(angle);
    const songKey = `${String(arch.id).padStart(2, '0')} ${arch.song}`;
    const isLit = !!answers[songKey];
    activeCoords.push({ x: sx, y: sy, lit: isLit, name: arch.name, song: arch.song });
  });

  activeCoords.forEach((p, i) => {
    const next = activeCoords[(i + 1) % 12];
    if (p.lit && next.lit) {
      ctx.strokeStyle = 'rgba(201, 168, 76, 0.7)';
      ctx.lineWidth = 2;
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
      ctx.strokeStyle = 'rgba(201, 168, 76, 0.2)';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  });

  // 核心发光星团
  const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 40);
  coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  coreGrad.addColorStop(0.4, 'rgba(201, 168, 76, 0.5)');
  coreGrad.addColorStop(1, 'rgba(201, 168, 76, 0)');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 40, 0, Math.PI * 2);
  ctx.fill();

  activeCoords.forEach((p) => {
    if (p.lit) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#c9a84c';
      ctx.strokeRect(p.x - 7, p.y - 7, 14, 14);

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

  // 5. 个人问答分身报告模块
  const textStartY = 580;
  ctx.fillStyle = '#c9a84c';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(tr.posterReportTitle, w/2, textStartY);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.font = 'normal 14px sans-serif';
  ctx.textAlign = 'left';

  const litSongs = activeCoords.filter(p => p.lit);
  let lineCount = 0;
  const lineGap = 28;

  if (litSongs.length === 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText('No fairytale nodes unlocked yet.', w/2, textStartY + 60);
  } else {
    // 渲染最多 6 条回答
    litSongs.slice(0, 6).forEach((songData) => {
      const songKey = `${String(songData.num).padStart(2, '0')} ${songData.song}`;
      const ans = answers[songKey];
      
      if (ans && ans.who) {
        const textX = currentLang === 'zh' ? 65 : 45;
        const textY = textStartY + 45 + lineCount * lineGap;
        
        ctx.fillStyle = '#c9a84c';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`【${songData.name}】`, textX, textY);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.font = 'normal 13px sans-serif';
        
        let whoText = ans.who;
        const maxLength = currentLang === 'zh' ? 20 : 35;
        if (whoText.length > maxLength) whoText = whoText.substring(0, maxLength) + '...';
        
        const labelText = currentLang === 'zh' ? '唤醒了我的：' : 'Awoke my: ';
        ctx.fillText(`${labelText}${whoText}`, textX + (currentLang === 'zh' ? 80 : 100), textY);
        lineCount++;
      }
    });
  }

  // 6. 页脚与微缩语录
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = 'normal 11px sans-serif';
  ctx.fillText(`${tr.posterCountPrefix}${answeredCount}${tr.posterCountSuffix}`, w/2, 810);
  
  ctx.font = 'italic 11px sans-serif';
  ctx.fillText(tr.posterQuote, w/2, 830);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.font = 'normal 11px sans-serif';
  ctx.fillText(tr.posterCopyright, w/2, 860);

  // 7. 输出到页面预览中
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

/* ==========================================================================
   10. 页脚订阅与初始化
   ========================================================================== */
const scrollHint = document.getElementById('scrollHint');
if (scrollHint) {
  scrollHint.addEventListener('click', () => {
    const target = document.getElementById('tracklist');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
}

// 页面载入初始化
window.addEventListener('DOMContentLoaded', () => {
  setLanguage('zh'); // 默认展示中文页面
});
