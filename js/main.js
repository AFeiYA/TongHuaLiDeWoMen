/**
 * 童话里的我们 — Main JavaScript
 * 功能：星光粒子 · 卡片展开/收起 · 滚动淡入 · 表单提交
 */

/* ============================================
   1. 星光粒子（Hero Canvas）
   ============================================ */
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  const COUNT = 120;

  function resize() {
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
  }

  function createStars() {
    stars = [];
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    for (let i = 0; i < COUNT; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random(),
        delta: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    for (const s of stars) {
      s.alpha += s.delta;
      if (s.alpha <= 0 || s.alpha >= 1) s.delta *= -1;
      s.alpha = Math.max(0, Math.min(1, s.alpha));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${s.alpha * 0.6})`;
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
})();

/* ============================================
   2. 卡片展开 / 收起
   ============================================ */
document.querySelectorAll('.track-card__front').forEach((front) => {
  front.addEventListener('click', () => toggleCard(front));
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

  if (isOpen) {
    front.setAttribute('aria-expanded', 'false');
    detail.hidden = true;
  } else {
    front.setAttribute('aria-expanded', 'true');
    detail.hidden = false;
    setTimeout(() => {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }
}

/* ============================================
   2b. 内嵌播放器切换（Spotify / 网易云）
   ============================================ */
document.querySelectorAll('.play-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation(); // 不触发卡片展开
    const playerType = btn.dataset.player; // 'spotify' | 'netease'
    const card = btn.closest('.track-card');
    const area = card.querySelector('.track-card__player-area');
    const spotifyDiv = area.querySelector('.player-spotify');
    const neteaseDiv = area.querySelector('.player-netease');
    const isActive = btn.classList.contains('is-active');

    // 同卡片内的另一个按钮先取消激活
    card.querySelectorAll('.play-btn').forEach((b) => b.classList.remove('is-active'));

    if (isActive) {
      // 关闭当前播放器
      area.hidden = true;
      spotifyDiv.hidden = true;
      neteaseDiv.hidden = true;
    } else {
      // 打开对应播放器
      btn.classList.add('is-active');
      area.hidden = false;
      spotifyDiv.hidden = playerType !== 'spotify';
      neteaseDiv.hidden = playerType !== 'netease';

      // 同时展开歌词详情区
      const front = card.querySelector('.track-card__front');
      const detail = card.querySelector('.track-card__detail');
      if (detail && detail.hidden) {
        front.setAttribute('aria-expanded', 'true');
        detail.hidden = false;
      }
    }
  });
});

/* ============================================
   3. 滚动淡入（Intersection Observer）
   ============================================ */
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
    { threshold: 0.1 }
  );

  acts.forEach((act) => observer.observe(act));
})();

/* ============================================
   4. 互动表单提交（Formspree 或本地演示）
   ============================================ */
document.querySelectorAll('.interact-form').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const trackName = form.dataset.trackName || '';
    data.append('track', trackName);

    const btn = form.querySelector('button[type="submit"]');
    const thanks = form.querySelector('.interact-form__thanks');

    btn.disabled = true;
    btn.textContent = '提交中…';

    // TODO: 替换为实际 Formspree endpoint
    // 例如: const endpoint = 'https://formspree.io/f/YOUR_FORM_ID';
    // await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });

    // 模拟提交延迟（正式部署时替换为真实请求）
    await new Promise((r) => setTimeout(r, 800));

    form.reset();
    btn.hidden = true;
    thanks.hidden = false;

    // 5 秒后恢复
    setTimeout(() => {
      btn.hidden = false;
      btn.disabled = false;
      btn.textContent = '提交';
      thanks.hidden = true;
    }, 5000);
  });
});

/* ============================================
   5. 订阅表单
   ============================================ */
const subscribeForm = document.getElementById('subscribeForm');
if (subscribeForm) {
  subscribeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = subscribeForm.querySelector('button[type="submit"]');
    const thanks = subscribeForm.querySelector('.subscribe__thanks');

    btn.disabled = true;
    btn.textContent = '提交中…';

    // TODO: 替换为实际 Formspree endpoint
    // const data = new FormData(subscribeForm);
    // await fetch(subscribeForm.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });

    await new Promise((r) => setTimeout(r, 800));

    subscribeForm.reset();
    btn.hidden = true;
    thanks.hidden = false;

    setTimeout(() => {
      btn.hidden = false;
      btn.disabled = false;
      btn.textContent = '订阅';
      thanks.hidden = true;
    }, 6000);
  });
}

/* ============================================
   6. 平滑滚动（探索专辑按钮）
   ============================================ */
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

/* ============================================
   7. 从 TRACKS_CONFIG 自动填充链接与播放器
   ============================================ */
(function applyTracksConfig() {
  if (typeof TRACKS_CONFIG === 'undefined') return;

  const defaults = TRACKS_CONFIG.defaultLinks || {};

  TRACKS_CONFIG.tracks.forEach((track) => {
    const card = document.querySelector(`.track-card[data-track="${track.id}"]`);
    if (!card) return;

    /* --- Spotify 内嵌播放器 --- */
    const spotifyIframe = card.querySelector('.player-spotify iframe');
    if (spotifyIframe && track.spotifyId) {
      spotifyIframe.src =
        `https://open.spotify.com/embed/track/${track.spotifyId}?utm_source=generator&theme=0`;
    } else if (spotifyIframe && !track.spotifyId) {
      // 无 Spotify ID → 显示占位符
      const div = card.querySelector('.player-spotify');
      div.innerHTML = '<p class="player-placeholder">🎵 Spotify · 即将上线</p>';
    }

    /* --- 网易云内嵌播放器 --- */
    const neteaseDiv = card.querySelector('.player-netease');
    if (neteaseDiv && track.neteaseId) {
      neteaseDiv.innerHTML =
        `<iframe src="https://music.163.com/outchain/player?type=2&id=${track.neteaseId}&auto=0&height=66"
          width="100%" height="86" frameborder="0" style="border-radius:12px" loading="lazy"></iframe>`;
    }
    // 无 neteaseId 时保留默认占位符，无需操作

    /* --- 平台跳转链接 --- */
    const links = track.links || {};
    const linkMap = {
      '.platform-link--spotify': links.spotify || defaults.spotify || '',
      '.platform-link--apple':   links.appleMusic || defaults.appleMusic || '',
      '.platform-link--youtube': links.youtubeMusic || defaults.youtubeMusic || '',
      '.platform-link--netease': links.netease || defaults.netease || '',
    };

    Object.entries(linkMap).forEach(([selector, url]) => {
      const el = card.querySelector(selector);
      if (el && url) el.href = url;
    });
  });
})();
