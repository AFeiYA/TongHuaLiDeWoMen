/**
 * ═══════════════════════════════════════════════════
 *  📀 歌曲链接配置文件
 *  《童话里的我们》 — The Us In Fairytales
 * ═══════════════════════════════════════════════════
 *
 *  ✏️ 使用说明：
 *  1. 在下方找到对应歌曲编号（01-12）
 *  2. 填入各平台的 ID 或链接
 *  3. 保存文件，刷新页面即可生效
 *
 *  ⚠️ 留空 "" 表示使用默认链接（HyperFollow）
 *  ⚠️ neteaseId 留空则显示"即将上线"占位符
 * ═══════════════════════════════════════════════════
 */

const TRACKS_CONFIG = {

  /* ──────────────────────────────────────
     默认链接（当某首歌没有单独链接时使用）
     ────────────────────────────────────── */
  defaultLinks: {
    spotify:      "https://distrokid.com/hyperfollow/lucazhou/ci-ke-zheng-hao",
    appleMusic:   "https://distrokid.com/hyperfollow/lucazhou/ci-ke-zheng-hao",
    youtubeMusic: "https://distrokid.com/hyperfollow/lucazhou/ci-ke-zheng-hao",
    netease:      "https://distrokid.com/hyperfollow/lucazhou/ci-ke-zheng-hao",
  },

  /* ──────────────────────────────────────
     12 首歌曲配置
     ────────────────────────────────────── */
  tracks: [

    // ═══ 第一幕：迷失 ═══

    { // 01 我没有大脑
      id: 1,
      spotifyId:  "6rEW6ZgerMLvhMKom2Je6u",   // ← Spotify 歌曲 ID（从 Spotify 链接中复制）
      neteaseId:  "3364676325",                           // ← 网易云歌曲 ID（例如 "2060797177"）
      links: {
        spotify:      "",                       // ← 单曲 Spotify 链接（留空用默认）
        appleMusic:   "",                       // ← 单曲 Apple Music 链接
        youtubeMusic: "",                       // ← 单曲 YouTube Music 链接
        netease:      "",                       // ← 单曲网易云链接
      }
    },

    { // 02 生锈的心
      id: 2,
      spotifyId:  "",
      neteaseId:  "",
      links: {
        spotify:      "",
        appleMusic:   "",
        youtubeMusic: "",
        netease:      "",
      }
    },

    { // 03 害怕的人
      id: 3,
      spotifyId:  "",
      neteaseId:  "",
      links: {
        spotify:      "",
        appleMusic:   "",
        youtubeMusic: "",
        netease:      "",
      }
    },

    // ═══ 第二幕：寻找 ═══

    { // 04 兔子洞
      id: 4,
      spotifyId:  "",
      neteaseId:  "",
      links: {
        spotify:      "",
        appleMusic:   "",
        youtubeMusic: "",
        netease:      "",
      }
    },

    { // 05 说谎的木偶
      id: 5,
      spotifyId:  "",
      neteaseId:  "",
      links: {
        spotify:      "",
        appleMusic:   "",
        youtubeMusic: "",
        netease:      "",
      }
    },

    { // 06 森林
      id: 6,
      spotifyId:  "",
      neteaseId:  "",
      links: {
        spotify:      "",
        appleMusic:   "",
        youtubeMusic: "",
        netease:      "",
      }
    },

    // ═══ 第三幕：觉醒 ═══

    { // 07 沉睡的时间
      id: 7,
      spotifyId:  "",
      neteaseId:  "",
      links: {
        spotify:      "",
        appleMusic:   "",
        youtubeMusic: "",
        netease:      "",
      }
    },

    { // 08 编号B-612的告别
      id: 8,
      spotifyId:  "",
      neteaseId:  "",
      links: {
        spotify:      "",
        appleMusic:   "",
        youtubeMusic: "",
        netease:      "",
      }
    },

    { // 09 声音
      id: 9,
      spotifyId:  "",
      neteaseId:  "",
      links: {
        spotify:      "",
        appleMusic:   "",
        youtubeMusic: "",
        netease:      "",
      }
    },

    // ═══ 第四幕：回归 ═══

    { // 10 魔法师
      id: 10,
      spotifyId:  "",
      neteaseId:  "",
      links: {
        spotify:      "",
        appleMusic:   "",
        youtubeMusic: "",
        netease:      "",
      }
    },

    { // 11 回家的路
      id: 11,
      spotifyId:  "",
      neteaseId:  "",
      links: {
        spotify:      "",
        appleMusic:   "",
        youtubeMusic: "",
        netease:      "",
      }
    },

    { // 12 我们
      id: 12,
      spotifyId:  "",
      neteaseId:  "",
      links: {
        spotify:      "",
        appleMusic:   "",
        youtubeMusic: "",
        netease:      "",
      }
    },

  ] // /tracks
}; // /TRACKS_CONFIG
