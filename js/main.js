/**
 * 童话里的我们 / A Fairytale Called Us — Main JavaScript (Editorial Magazine Edition)
 * 功能：星光粒子 · 3D 封面 · 滚动足迹记录 · 点击式后台播放 · 浮动星图雷达导航 · 双语化 (CN/EN) · 叙事折叠展开 · 杂志海报 Canvas 导出
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
    listenLabel: "🔗 在其他平台收听",
    
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
    mapUs: "我们",
    
    // 角色分身标签
    arch1: "稻草人 ｜ Scarecrow",
    arch2: "铁皮人 ｜ Tin Woodman",
    arch3: "胆小狮子 ｜ Cowardly Lion",
    arch4: "爱丽丝 ｜ Alice",
    arch5: "匹诺曹 ｜ Pinocchio",
    arch6: "小红帽 ｜ Little Red Riding Hood",
    arch7: "睡美人 ｜ Sleeping Beauty",
    arch8: "小王子 ｜ The Little Prince",
    arch9: "人鱼公主 ｜ Little Mermaid",
    arch10: "奥兹 ｜ Wizard of Oz",
    arch11: "多萝西 ｜ Dorothy",
    arch12: "我们 ｜ Us",

    archetypes: [
      { 
        id: 1, name: "稻草人", song: "我没有大脑", 
        short: "泥土承载着干燥的纤维，在秋风的边缘丈量虚无。",
        full: "当我们试图用繁复的逻辑与精确的度量来确认自我的刻度，却不知理性本身即是深渊的投影。在思维停止喧嚣的缝隙里，那句无声的叹息，是否才是我们唯一的立足之地？<br/><br/>✨ <i>愿你接纳脑海中所有的杂音，在每一个感到迷茫的深夜里，都能拥抱那个虽然笨拙、却始终真诚起舞的自己。</i>",
        quote: "“我不想要什么大脑，如果它只会制造烦恼。可我为何，感到了思考？”" 
      },
      { 
        id: 2, name: "铁皮人", song: "生锈的心", 
        short: "坚硬是时间的妥协，冷冰冰的秩序包裹着拒绝。",
        full: "为了防范风暴的侵蚀，我们用铁锈修筑起最牢固的城池，却在绝对的安全中走向了麻木。这不仅是金属的呻吟，更是在寂静的深处，那场以防备为名的漫长自我流放。<br/><br/>✨ <i>愿你总能遇见那个让你放下防备、卸下盔甲的人，在一缕温柔的日光下，重新感受心脏温热的跳动。</i>",
        quote: "“我有一颗生锈的心，它跳动时有刺耳的声音。但当你在人群中叫我，它开始剧烈震颤。”" 
      },
      { 
        id: 3, name: "胆小狮子", song: "害怕的人", 
        short: "王座的阴影里，颤抖与冠冕同在。",
        full: "金色的鬃毛从不是为了征服，而是为了在虚张声势的咆哮中，掩盖那份无法消解的脆弱。当神话剥离，真正的觉醒在于直面膝盖的冰冷，带着摇摇欲坠的自我，一步步走向风暴。<br/><br/>✨ <i>愿你在黑夜的风暴里抱紧自己，别怕颤抖的每一步，你那带着恐惧前行的背影，比任何战歌都更加英勇。</i>",
        quote: "“勇气不是从不畏惧，而是带着浑身的恐惧，依然向那片深渊迈出最后一步。”" 
      },
      { 
        id: 4, name: "爱丽丝", song: "兔子洞", 
        short: "在重力坍塌的象限，常识与逻辑摔碎成斑斓的尘埃。",
        full: "这并非是一次迷失的坠落，而是坐标系重建的必然。当世界在眼前颠倒，唯有接纳失重的眩晕，在无底的深渊中，重新定义何为真实的呼吸。<br/><br/>✨ <i>愿你在失重与跌落的瞬间找到降落伞，明白每一次认知的坍塌，都是为了在废墟上重建一间更明亮的屋子。</i>",
        quote: "“天花板在脚下，地板在云端抽离。在这里，疯子才是清醒的唯一。”" 
      },
      { 
        id: 5, name: "匹诺曹", song: "说谎的木偶", 
        short: "提线在虚空中纵横，编织着最为得体的姿态。",
        full: "在应酬与合群的宏大博弈中，我们用精致的木头零件堆砌成讨喜的假象。那突兀伸长的并非鼻子，而是被扭曲的本真。当线绳剪断，迎来的究竟是自由，还是虚无的坠地？<br/><br/>✨ <i>愿你终能挣脱无形的引线，在虚妄的世界里勇敢地摘下面具，坦然享受只属于你自己的真实与呼吸。</i>",
        quote: "“跳舞吧说谎的木偶，反正这世界也是一座巨大的木偶秀。”" 
      },
      { 
        id: 6, name: "小红帽", song: "森林", 
        short: "边界在大雾中隐去，红色的衣角被荆棘撕扯成岁月的碎片。",
        full: "森林中没有避风的温室，只有在野兽的吐息与阴影的试探中，逐渐与危险融为一体的骨骼。走出这片绿意的人，已在无声的蜕变里告别了最初的镜中人。<br/><br/>✨ <i>愿你独自穿过迷雾重重的荆棘时，不被黑暗吞噬。当你走出这片森林，会长出坚硬的骨骼，却依然怀揣着温热的心。</i>",
        quote: "“穿过这片森林，脱掉红色的梦境。森林深处没有外婆，只有长大的我。”" 
      },
      { 
        id: 7, name: "睡美人", song: "沉睡的时间", 
        short: "时间在静止的城堡中凝固，成为一滴淡金色的琥珀。",
        full: "外界疯狂地索求着答案与果实，而我只想在此刻将自我封存。有些迷局越是挣扎越是深陷，不如在漫长的沉默中等待喧嚣退潮，让静止本身成为最宽容的救赎。<br/><br/>✨ <i>愿你在无人问津的时光里安心沉淀，不急不躁。请相信，那些在绝对静止中积蓄的能量，终会化作你破茧而出的双翼。</i>",
        quote: "“等这一场雨淋透了贪婪的渴求，时间是默契的好友，也是宽容的出口。”" 
      },
      { 
        id: 8, name: "小王子", song: "编号B-612的告别", 
        short: "孤星上的火山如此微小，却承载着宇宙中唯一的羁绊。",
        full: "远方的繁星不过是冰冷的坐标，而我们明知爱的代价是脆弱、分离与虚无，依然选择褪去沉重的躯壳，回归到那朵在风中渐渐凋零的牵挂里。<br/><br/>✨ <i>愿在漫天繁星的笑声中，你总能望见属于你的那一朵花；愿你付出的每一份热忱与守护，都能在这个宇宙里得到温柔的回响。</i>",
        quote: "“我的玫瑰正在银河某个角落枯萎，我却在这陌生的星球慢慢掉泪。”" 
      },
      { 
        id: 9, name: "人鱼公主", song: "声音", 
        short: "拥有平息风暴的歌喉，却甘愿在沙滩的烈日下走向无声。",
        full: "当双脚每一次踩在刀尖上，残缺的觉醒便伴随着剧痛生长。这是一场关于代价的默剧：当外界的声响归于寂灭，灵魂深处的共鸣才开始真正显形。<br/><br/>✨ <i>愿你脚踏刀尖奔向光亮时，能被这世界温柔相待；愿你所有的残缺与付出，最终都能在爱与和解里得到最圆满的包容。</i>",
        quote: "“爱是一种自愿的残缺，觉醒是一场华丽的自虐。哪怕结局是幻灭，我不后悔游向这个世界。”" 
      },
      { 
        id: 10, name: "奥兹", song: "魔法师", 
        short: "幕布拉开，巨大的神迹不过是杠杆与烟雾的把戏。",
        full: "我们心底的恐惧，曾为无数个虚无的偶像加冕。推倒那堵隔绝真实的墙，解构高高在上的幻觉。你所渴望的力量与热度，从来不需要神明的恩赐，它本就流淌在你的血管里。<br/><br/>✨ <i>愿你解构所有的偶像与权威，认清自己才是唯一的救世主。愿你站在广阔的大地上，坦然接纳并深爱那个本就完整的自己。</i>",
        quote: "“你给不了大脑，也给不了心。因为那些滚烫的东西，从不需要由你恩赐。”" 
      },
      { 
        id: 11, name: "多萝西", song: "回家的路", 
        short: "磨破的红舞鞋落在泥土中，翡翠城的繁华如碎影般褪去。",
        full: "所有向外寻求的远行，终会变成一次向内的返航。平凡非但不是平庸，反而是最奢侈的开悟。当你不再试图从自我的身边逃离，每一步所踏之处，皆是终点。<br/><br/>✨ <i>愿你结束所有的流浪与向外寻求，踩在坚实卑微的土地上时能感到安宁。愿每一次向内回头，都是你最好的抵达。</i>",
        quote: "“这就是回家的路，平凡才是我最奢侈的天赋。当我不再逃离，每一步都算抵达。”" 
      },
      { 
        id: 12, name: "我们", song: "我们", 
        short: "炉火中灰烬明灭，所有的角色在星轨的交汇处和解重逢。",
        full: "我们并非支离破碎的片段，而是包容了怀疑、防御、伪装与残缺的完整织锦。在这个看似荒诞冷酷的宇宙里，我们本身，就是那首未完的终极童话。<br/><br/>✨ <i>愿你拥抱自己所有的残缺、脆弱与面具，在这浩瀚的星轨下，与每一个阶段的自己握手言和。你就是最美的童话。</i>" 
      }
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
    listenLabel: "🔗 Listen on other platforms",
    
    soulMapTitle: "Starlight Constellation Map",
    soulMapDesc: "Your footprint has lit up <span id='litCount'>0</span> / 12 nodes. Explore all sections to generate your 'Fairytale Poster Card' 🌟",
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
    
    arch1: "Scarecrow",
    arch2: "Tin Woodman",
    arch3: "Cowardly Lion",
    arch4: "Alice",
    arch5: "Pinocchio",
    arch6: "Little Red Riding Hood",
    arch7: "Sleeping Beauty",
    arch8: "The Little Prince",
    arch9: "Little Mermaid",
    arch10: "Wizard of Oz",
    arch11: "Dorothy",
    arch12: "Us",

    archetypes: [
      { 
        id: 1, name: "Scarecrow", song: "The Hollow", 
        short: "Dry fibers mapping the void at the edge of autumn wind.",
        full: "When we seek to measure our existence with intricate logic, we forget that reason itself is a projection of the abyss. In the silent gap where thought ceases, does the wordless sigh become our only ground?<br/><br/>✨ <i>May you find peace in the noise of your mind, and in every wandering night, embrace the raw, beautiful self that never stops dancing.</i>",
        quote: "“I don't want a brain if it only makes trouble. Yet why do I feel the echo of thought?”" 
      },
      { 
        id: 2, name: "Tin Woodman", song: "The Rust", 
        short: "Hardness is time's compromise, wrapping a cold refusal in perfect order.",
        full: "To guard against the storm, we build fortresses of rust, only to fade into numbness within absolute safety. A quiet sigh of self-exile under the guise of protection.<br/><br/>✨ <i>May you meet someone who gently coaxes you out of your armor, and feel your heart beat warm and free under a ray of tender sunlight.</i>",
        quote: "“I have a rusty heart with a screeching beat. Yet when you call my name, it echoes deep.”" 
      },
      { 
        id: 3, name: "Cowardly Lion", song: "The Coward", 
        short: "Shadows beneath the crown, where trembling and majesty coexist.",
        full: "The golden mane is not for conquest, but to mask an unresolvable fragility with a thunderous roar. Awakening begins when we face the chill of our knees and walk forward, fragile and undivided.<br/><br/>✨ <i>May you hold yourself close through the storm. Never fear the shaking steps, for your courage in trembling is more heroic than any battle cry.</i>",
        quote: "“Courage is not the absence of fear, but taking that final step despite trembling knees.”" 
      },
      { 
        id: 4, name: "Alice", song: "The Fall", 
        short: "In the quadrant where gravity collapses, common sense shatters into colorful dust.",
        full: "This is not a lost fall, but the birth of a new coordinate system. When the world stands on its head, we must embrace the vertigo of weightlessness to redefine what it means to breathe.<br/><br/>✨ <i>May you catch yourself in moments of vertigo, and realize that every shattering belief is but a clearing to build a brighter home.</i>",
        quote: "“The ceiling is below, the floor drifts in the clouds. Here, only the mad remain sane.”" 
      },
      { 
        id: 5, name: "Pinocchio", song: "The Marionette", 
        short: "Strings cross in the void, weaving the most polite gestures.",
        full: "In the grand play of belonging, we assemble wood and paint to simulate warmth. But what elongates is not a nose, it is the distorted truth. When the strings snap, do we meet freedom or empty air?<br/><br/>✨ <i>May you snap the invisible threads of compromise, shed your mask under the neon, and breathe the pure air of your own untamed truth.</i>",
        quote: "“Dance, lying marionette, for the world itself is but a grand puppet show.”" 
      },
      { 
        id: 6, name: "Little Red Riding Hood", song: "The Forest", 
        short: "Boundaries dissolve in the fog; a splash of red torn by thorns.",
        full: "There is no sanctuary in the deep woods, only bones that gradually learn to blend with the shadows. The one who emerges from the green has already said goodbye to the reflection in the mirror.<br/><br/>✨ <i>May you walk through the thick brush unharmed. When you emerge from the deep woods, may your bones be strong and your heart remain warm.</i>",
        quote: "“Through this forest, shed the crimson dream. Deep inside, there is no grandmother, only a grown-up me.”" 
      },
      { 
        id: 7, name: "Sleeping Beauty", song: "The Amber", 
        short: "Time freezes in the silent castle, suspended as a drop of gold amber.",
        full: "While the world demands answers, we choose the preservation of the self. Some mazes tighten the more we struggle; let quietness build its own forgiving exit.<br/><br/>✨ <i>May you rest easy in the quiet amber of waiting. Trust that the strength gathered in stillness will one day become the wings of your awakening.</i>",
        quote: "“Let the rain soak the greedy thirst. Time is a silent friend and a forgiving escape.”" 
      },
      { 
        id: 8, name: "The Little Prince", song: "The Rose", 
        short: "Volcanic dust on a solitary sphere, holding the only anchor in the galaxy.",
        full: "The distant stars are but cold coordinates; though we know the cost of caring is loss, we choose to shed our heavy shells and return to the fading rose in the wind.<br/><br/>✨ <i>May you always hear the laughter of your own flower among the stars, and find that every ounce of your devotion echoes gently in the void.</i>",
        quote: "“My rose is fading in some corner of the galaxy, while I weep on this foreign star.”" 
      },
      { 
        id: 9, name: "Little Mermaid", song: "The Silence", 
        short: "Traded the voice that ruled the waves to walk on hot sands, feeling the blade's edge with every stride.",
        full: "A tragic pop monologue of trade-offs: when the external voice falls silent, the true self begins to resonate in the quiet.<br/><br/>✨ <i>May the world treat your bare steps with kindness as you run toward the light, and may every wound you carry find home in love.</i>",
        quote: "“Love is a voluntary flaw; awakening is a beautiful self-infliction. I do not regret swimming to this world.”" 
      },
      { 
        id: 10, name: "Wizard of Oz", song: "The Curtain", 
        short: "The curtain parts, reducing grand miracles to levers and smoke.",
        full: "It is our own fear that crowns the idols we fear. Tear down the wall of illusion; the burning pulse you seek was never a gift to be granted, it flows in your own veins.<br/><br/>✨ <i>May you see through all false gods and recognize your own sovereign strength. Stand tall on the open ground, complete and deeply loved.</i>",
        quote: "“You cannot give a brain, nor a heart. For those burning wonders need no gift from you.”" 
      },
      { 
        id: 11, name: "Dorothy", song: "The Return", 
        short: "Worn slippers sinking into the loam; the emerald neon fades like a broken dream.",
        full: "The outward journey returns inward. Ordinary life is not compromise, but the ultimate awakening. When you stop running from yourself, every step is arrival.<br/><br/>✨ <i>May your long travels end in the peace of the ordinary soil. Every time you turn inward, may you feel the quiet comfort of being home.</i>",
        quote: "“This is the road home, where the ordinary is my most luxurious gift. When I stop running, every step is arrival.”" 
      },
      { 
        id: 12, name: "Us", song: "We Are the Fairytale", 
        short: "Ash glows in the hearth as split shadows reconcile under the starry sky.",
        full: "We are not fragments, but a whole tapestry weaving doubt, defense, and awakening. In this cold universe, our existence is the final, wordless fairytale.<br/><br/>✨ <i>May you weave your wounds, masks, and dreams into a single beautiful tapestry. Under the starlight, be at peace with every version of you.</i>",
        quote: "“Completing the evidence in this absurd universe, we are the fairytale itself.”" 
      }
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
   4. 歌词排版美化引擎：自动转化结构为金句斜体类标签
   ========================================================================== */
function formatLyrics(rawLyrics) {
  let formatted = rawLyrics;
  // 将 [...] 替换为 <span class="lyric-cue">...</span>
  formatted = formatted.replace(/\[([\s\S]+?)\]/g, '<span class="lyric-cue">$1</span>');
  // 将 (...) 替换为 <span class="lyric-annotation">...</span>
  formatted = formatted.replace(/\(([\s\S]+?)\)/g, '<span class="lyric-annotation">$1</span>');
  return formatted;
}

/* ==========================================================================
   5. 双语页面渲染逻辑与卡片数据切换
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

  // 3. 动态刷新歌词版块名称与主题 (带格式转换)
  if (typeof TRACKS_CONFIG !== 'undefined') {
    const tracksList = (lang === 'zh') ? TRACKS_CONFIG.tracks : TRACKS_CONFIG.tracks_en;
    
    tracksList.forEach((t) => {
      const section = document.getElementById(`track-${t.id}`);
      if (!section) return;

      const titleEl = section.querySelector('.track-song-name');
      const themeEl = section.querySelector('.track-section-theme');
      const lyricsPre = section.querySelector('.track-lyrics-col pre');
      const linksLabel = section.querySelector('.links-label');
      
      if (titleEl) titleEl.textContent = t.name;
      
      // 读取对应的中英文详细叙事与简短格言
      const archData = tr.archetypes.find(a => a.id === t.id);
      if (themeEl && archData) {
        const shortSpan = themeEl.querySelector('.theme-short');
        const moreSpan = themeEl.querySelector('.theme-more');
        const moreBtn = themeEl.querySelector('.btn-read-more');
        if (shortSpan && moreSpan && moreBtn) {
          shortSpan.innerHTML = archData.short;
          moreSpan.innerHTML = archData.full;
          
          const isExpanded = moreSpan.classList.contains('expanded');
          if (isExpanded) {
            moreSpan.style.display = "inline";
            moreBtn.textContent = (currentLang === 'zh') ? "收起 －" : "Collapse －";
          } else {
            moreSpan.style.display = "none";
            moreBtn.textContent = (currentLang === 'zh') ? "展开叙事 ＋" : "Read Narrative ＋";
          }
        }
      }
      
      if (lyricsPre) {
        // 使用 formatLyrics 格式化解析歌词
        lyricsPre.innerHTML = formatLyrics(t.lyrics);
      }
      if (linksLabel) linksLabel.textContent = tr.listenLabel;
    });
  }

  // 刷新所有播放控制按钮的文本与状态
  updateIndicators();

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
   6. 浮动 Constellation 雷达星图展示控制
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
   7. 进度记录 (localStorage 足迹管理)
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
   8. 滚动监听：仅做背景行高高亮与点亮星轨足迹 (Intersection Observer)
   ========================================================================== */
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

        // 2. 动态读取当前 Section 的幕/曲目个性化主题色变量，修改 body 背景虚光
        const computedStyle = getComputedStyle(entry.target);
        const themeColorGlow = computedStyle.getPropertyValue('--theme-color-glow');
        if (themeColorGlow) {
          document.body.style.setProperty('--body-theme-glow', themeColorGlow.trim());
        }

        // 3. 自动标记该曲目足迹为“已探索点亮”
        saveLitTrack(trackId);
      }
    });
  }, {
    rootMargin: '-30% 0px -30% 0px',
    threshold: 0.1
  });

  sections.forEach((sec) => observer.observe(sec));
})();

/* ==========================================================================
   9. 点击切歌与收听控制 (Bespoke Play/Pause Toggles)
   ========================================================================== */
let currentPlayingId = null;
const hiddenPlayer = document.getElementById('hiddenPlayerContainer');

function initPlayControls() {
  document.querySelectorAll('.track-section').forEach(section => {
    const trackId = parseInt(section.dataset.track, 10);
    const indicator = section.querySelector('.track-indicator');
    
    if (indicator) {
      indicator.addEventListener('click', () => {
        togglePlay(trackId);
      });
      
      indicator.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          togglePlay(trackId);
        }
      });
    }
  });
}

function togglePlay(trackId) {
  if (currentPlayingId === trackId) {
    // 已经处于在播状态，再次点击为暂停销毁
    if (hiddenPlayer) hiddenPlayer.innerHTML = '';
    currentPlayingId = null;
  } else {
    // 未在播，进行切歌播放
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

  // 刷新所有控制条的指示文本
  updateIndicators();
}

function updateIndicators() {
  document.querySelectorAll('.track-section').forEach(section => {
    const trackId = parseInt(section.dataset.track, 10);
    const indicator = section.querySelector('.track-indicator');
    const dot = section.querySelector('.pulse-dot');
    const textEl = section.querySelector('.indicator-text');
    if (!indicator || !textEl) return;

    const isPlaying = (currentPlayingId === trackId);
    
    // 切换控制条的外观样式类
    indicator.classList.toggle('playing', isPlaying);
    
    if (dot) {
      if (isPlaying) {
        dot.textContent = ''; // 播放中显示无文字脉冲星圈
      } else {
        dot.textContent = '▶'; // 未播放显示三角形播放图标
      }
    }

    if (currentLang === 'zh') {
      textEl.textContent = isPlaying ? "正在收听" : "点击收听";
    } else {
      textEl.textContent = isPlaying ? "Now Listening" : "Click to Listen";
    }
  });
}

/* ==========================================================================
   10. 极简风情折叠逻辑绑定 (Description Expand/Collapse)
   ========================================================================== */
function initAccordion() {
  document.querySelectorAll('.track-section-theme').forEach(themeEl => {
    const moreSpan = themeEl.querySelector('.theme-more');
    const btn = themeEl.querySelector('.btn-read-more');
    if (moreSpan && btn) {
      btn.addEventListener('click', () => {
        const isExpanded = moreSpan.classList.contains('expanded');
        if (isExpanded) {
          moreSpan.classList.remove('expanded');
          moreSpan.style.display = "none";
          btn.textContent = (currentLang === 'zh') ? "展开叙事 ＋" : "Read Narrative ＋";
        } else {
          moreSpan.classList.add('expanded');
          moreSpan.style.display = "inline";
          btn.textContent = (currentLang === 'zh') ? "收起 －" : "Collapse －";
        }
      });
    }
  });
}

/* ==========================================================================
   11. 绘制与控制 Constellation 星轨地图 (抽象连线与点击导航逻辑)
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
   12. 双语海报卡片 Canvas 生成器 (Poster Generator)
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
   13. 基础绑定与初始化
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
  setLanguage('zh');
  updateProgressUI();
  initPlayControls();
  initAccordion();
});
