/**
 * 童话里的我们 — Main JavaScript (Premium Refactored Version)
 * 功能：星光交互粒子 · 3D封面倾斜 · 卡片渐变聚光灯 · 悬浮播放器控制 · 本地存储与星图 constellation 绘制 · 个性海报卡片 Canvas 生成
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
      // 闪烁
      s.alpha += s.delta;
      if (s.alpha <= 0 || s.alpha >= 1) s.delta *= -1;
      s.alpha = Math.max(0, Math.min(1, s.alpha));

      // 鼠标排斥计算
      const dx = mouse.x - s.baseX;
      const dy = mouse.y - s.baseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const limit = 120; // 鼠标排斥范围
      
      if (dist < limit) {
        const force = (limit - dist) / limit; // 0 (边界) 到 1 (中心)
        const angle = Math.atan2(dy, dx);
        // 推开目标位置
        const targetX = s.baseX - Math.cos(angle) * force * 30;
        const targetY = s.baseY - Math.sin(angle) * force * 30;
        // 弹性趋近
        s.x += (targetX - s.x) * 0.1;
        s.y += (targetY - s.y) * 0.1;
      } else {
        // 恢复原位
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

    // 旋转角度限制在 25 度内
    const tiltX = -(dy / (window.innerHeight / 2)) * 25;
    const tiltY = (dx / (window.innerWidth / 2)) * 25;

    card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });

  hero.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
})();

/* ==========================================================================
   3. 卡片交互：渐变聚光灯与展开收起
   ========================================================================== */
document.querySelectorAll('.track-card').forEach((card) => {
  // 鼠标移动更新聚光灯位置
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

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

    // 展开新卡片时，如果不是当前在播的歌，就启动后台自动播放（默认网易云音乐）
    if (currentPlayingId !== trackId) {
      if (hiddenPlayer && typeof TRACKS_CONFIG !== 'undefined') {
        const trackData = TRACKS_CONFIG.tracks.find((t) => t.id === trackId);
        if (trackData && trackData.neteaseId) {
          hiddenPlayer.innerHTML = `<iframe src="https://music.163.com/outchain/player?type=2&id=${trackData.neteaseId}&auto=1&height=66" width="0" height="0" frameborder="no" border="0" marginwidth="0" marginheight="0"></iframe>`;
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
   5. 滚动淡入 (Intersection Observer)
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
   6. 互动数据 localStorage 持久化与星光地图绘制
   ========================================================================== */
const ARCHETYPES = [
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
];

let soulAnswers = {};

function initLocalStorageAndMap() {
  const stored = localStorage.getItem('soul_answers');
  if (stored) {
    try {
      soulAnswers = JSON.parse(stored);
    } catch (e) {
      soulAnswers = {};
    }
  }

  // 填回表单
  document.querySelectorAll('.interact-form').forEach((form) => {
    const trackName = form.dataset.trackName;
    if (soulAnswers[trackName]) {
      const ans = soulAnswers[trackName];
      if (form.elements['who']) form.elements['who'].value = ans.who || '';
      if (form.elements['why']) form.elements['why'].value = ans.why || '';
      if (form.elements['self']) form.elements['self'].value = ans.self || '';
      
      const tag = form.querySelector('.interact-form__status-tag');
      if (tag) tag.hidden = false;
    }
  });

  updateSoulProgress();
  drawSoulMap();
}

function updateSoulProgress() {
  const answeredCount = Object.keys(soulAnswers).length;
  const countSpan = document.getElementById('litCount');
  if (countSpan) countSpan.textContent = answeredCount;

  const generateBtn = document.getElementById('generateCardBtn');
  if (generateBtn) {
    if (answeredCount >= 1) { // 只要填了一个，就允许生成，方便体验；原本需要12首
      generateBtn.disabled = false;
      generateBtn.classList.remove('btn--disabled');
    } else {
      generateBtn.disabled = true;
      generateBtn.classList.add('btn--disabled');
    }
  }
}

// 绑定互动表单提交事件
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
    btn.textContent = '保存中…';

    // 写入 localStorage
    soulAnswers[trackName] = { who, why, self };
    localStorage.setItem('soul_answers', JSON.stringify(soulAnswers));

    await new Promise((r) => setTimeout(r, 600));

    btn.textContent = '已保存';
    if (statusTag) statusTag.hidden = false;
    if (thanks) {
      thanks.hidden = false;
      setTimeout(() => thanks.hidden = true, 3000);
    }
    btn.disabled = false;
    btn.textContent = '更新答案';

    updateSoulProgress();
    drawSoulMap();
  });
});

/* ---------- 绘制 Constellation 星星地图 ---------- */
function drawSoulMap() {
  const canvas = document.getElementById('soulCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // 处理高清 DPR
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.parentElement.offsetWidth;
  const h = canvas.parentElement.offsetHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);

  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.35; // 星环半径

  ctx.clearRect(0, 0, w, h);

  // 1. 绘制背景微弱星轨网
  ctx.strokeStyle = 'rgba(201, 168, 76, 0.04)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
  ctx.stroke();

  // 2. 绘制星环之间的网格连线 (Constellation Lines)
  let activeCoords = [];
  ARCHETYPES.forEach((arch, i) => {
    const angle = i * (Math.PI * 2 / 12) - Math.PI / 2;
    const sx = cx + r * Math.cos(angle);
    const sy = cy + r * Math.sin(angle);
    
    const isLit = !!soulAnswers[arch.song];
    activeCoords.push({ x: sx, y: sy, lit: isLit, name: arch.name, num: arch.id });
  });

  // 连接已点亮的连线
  ctx.lineWidth = 1.5;
  activeCoords.forEach((p, i) => {
    const next = activeCoords[(i + 1) % 12];
    if (p.lit && next.lit) {
      // 创建渐变连线
      const grad = ctx.createLinearGradient(p.x, p.y, next.x, next.y);
      grad.addColorStop(0, 'rgba(201, 168, 76, 0.6)');
      grad.addColorStop(1, 'rgba(201, 168, 76, 0.6)');
      ctx.strokeStyle = grad;
      ctx.shadowColor = 'rgba(201, 168, 76, 0.5)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(next.x, next.y);
      ctx.stroke();
      ctx.shadowBlur = 0; // 重置阴影
    } else {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(next.x, next.y);
      ctx.stroke();
    }

    // 连线到核心我们
    if (p.lit) {
      ctx.strokeStyle = 'rgba(201, 168, 76, 0.2)';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  });

  // 3. 绘制核心
  const answeredCount = Object.keys(soulAnswers).length;
  const coreRadius = 15 + answeredCount * 1.5;
  
  const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, coreRadius * 2.5);
  coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  coreGrad.addColorStop(0.3, 'rgba(201, 168, 76, 0.8)');
  coreGrad.addColorStop(1, 'rgba(201, 168, 76, 0)');
  
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, coreRadius * 2.5, 0, Math.PI * 2);
  ctx.fill();
  
  // 核心小圆点
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fill();

  // 4. 绘制星环节点
  activeCoords.forEach((p) => {
    if (p.lit) {
      // 点亮的星：亮金色，带光晕与外圈环
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

      // 文字
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      const offsetDir = (p.y - cy) > 0 ? 20 : -16;
      ctx.fillText(p.name, p.x, p.y + offsetDir);
    } else {
      // 未点亮的星：灰暗小点
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // 绘制圆心处字“我们”
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("我们", cx, cy - 22);
}

/* ==========================================================================
   7. 海报卡片 Canvas 生成器 (Poster Generator)
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
  const w = posterCanvas.width;   // 600
  const h = posterCanvas.height;  // 900

  // 1. 背景：渐变星空
  const bgGrad = ctx.createRadialGradient(w/2, h/2, 50, w/2, h/2, w);
  bgGrad.addColorStop(0, '#0a1226');
  bgGrad.addColorStop(1, '#02050c');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // 绘制繁星
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  for (let i = 0; i < 80; i++) {
    const sx = Math.random() * w;
    const sy = Math.random() * h;
    const r = Math.random() * 1.5;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. 金色框线与边框装饰
  ctx.strokeStyle = 'rgba(201, 168, 76, 0.6)';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, w - 40, h - 40);
  
  ctx.strokeStyle = 'rgba(201, 168, 76, 0.2)';
  ctx.lineWidth = 1;
  ctx.strokeRect(26, 26, w - 52, h - 52);

  // 3. 头部标题
  ctx.textAlign = 'center';
  ctx.fillStyle = '#c9a84c';
  ctx.font = 'normal 13px Georgia, serif';
  ctx.letterSpacing = '5px';
  ctx.fillText('THE US IN FAIRYTALES', w/2, 70);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText('童话里的我们', w/2, 120);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = 'normal 12px sans-serif';
  ctx.fillText('—— 专属童话人格星图分身 ——', w/2, 155);

  // 4. 绘制 Constellation 星星地图
  const cx = w / 2;
  const cy = 380;
  const r = 130;

  // 轨道环
  ctx.strokeStyle = 'rgba(201, 168, 76, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  let activeCoords = [];
  ARCHETYPES.forEach((arch, i) => {
    const angle = i * (Math.PI * 2 / 12) - Math.PI / 2;
    const sx = cx + r * Math.cos(angle);
    const sy = cy + r * Math.sin(angle);
    const isLit = !!soulAnswers[arch.song];
    activeCoords.push({ x: sx, y: sy, lit: isLit, name: arch.name, song: arch.song });
  });

  // 连线
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

  // 核心放射光晕
  const answeredCount = Object.keys(soulAnswers).length;
  const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 40);
  coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  coreGrad.addColorStop(0.4, 'rgba(201, 168, 76, 0.5)');
  coreGrad.addColorStop(1, 'rgba(201, 168, 76, 0)');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 40, 0, Math.PI * 2);
  ctx.fill();

  // 星点
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

  // “我们”核心
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText("我们", cx, cy - 25);

  // 5. 展示个人人格报告
  const textStartY = 580;
  ctx.fillStyle = '#c9a84c';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('—— 觉醒之境与灵魂拼图 ——', w/2, textStartY);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.font = 'normal 14px sans-serif';
  ctx.textAlign = 'left';

  // 筛选出已点亮的歌曲及回答
  const litSongs = activeCoords.filter(p => p.lit);
  let lineCount = 0;
  const lineGap = 28;

  if (litSongs.length === 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText('您尚未点亮任何童话分身，快去上方卡片提交心声吧', w/2, textStartY + 60);
  } else {
    // 渲染最多前 6 个回答作为文本展示
    litSongs.slice(0, 6).forEach((songData) => {
      const ans = soulAnswers[songData.song];
      if (ans && ans.who) {
        const textX = 65;
        const textY = textStartY + 45 + lineCount * lineGap;
        
        ctx.fillStyle = '#c9a84c';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`【${songData.name}】`, textX, textY);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.font = 'normal 13px sans-serif';
        
        // 限制长度截断
        let whoText = ans.who;
        if (whoText.length > 20) whoText = whoText.substring(0, 20) + '...';
        ctx.fillText(`唤醒了我的：${whoText}`, textX + 80, textY);
        lineCount++;
      }
    });
  }

  // 6. 页脚与统计信息
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = 'normal 11px sans-serif';
  ctx.fillText(`已拼接 ${answeredCount} / 12 片散落的灵魂碎片`, w/2, 810);
  ctx.fillText('“在这个荒诞的宇宙里补全证据，原来我们就是童话的本身”', w/2, 830);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillText('© 2026 童话里的我们 · The Us In Fairytales', w/2, 860);

  // 7. 导出到 preview
  try {
    const dataUrl = posterCanvas.toDataURL('image/png');
    posterPreview.src = dataUrl;
    cardResultWrap.hidden = false;
    setTimeout(() => {
      cardResultWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  } catch (e) {
    console.error("生成海报出错：", e);
  }
}

/* ==========================================================================
   8. 订阅与平滑滚动初始化
   ========================================================================== */
const exploreBtn = document.getElementById('exploreBtn');
if (exploreBtn) {
  exploreBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById('tracklist');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

const scrollHint = document.getElementById('scrollHint');
if (scrollHint) {
  scrollHint.addEventListener('click', () => {
    const target = document.getElementById('tracklist');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// 页面载入初始化
window.addEventListener('DOMContentLoaded', () => {
  initLocalStorageAndMap();
});
