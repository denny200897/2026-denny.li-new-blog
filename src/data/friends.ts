import type { FriendLinkItem } from '@navfolio/mdx-components/friend-data';

/**
 * 友連清單。照下面這筆的格式往下加，每筆用 { } 包起來、逗號隔開。
 *
 * name    必填，站名
 * url     必填，網址（要含 https://）
 * bio     選填，一句簡介
 * avatar  選填，頭像圖片網址；沒填就顯示站名的第一個字
 * sticky  選填，設 true 會固定排在最前面
 */
export const friendLinks: FriendLinkItem[] = [
  {
    name: 'Cgm._.97',
    url: 'https://cgm-csie.me/',
    bio: '2.718281828459045235360287',
    avatar: 'https://cgm-csie.me/img/Profile.png',
    sticky: true,
  },
  {
    name: 'shrimpqi',
    url: 'https://blog.sianqi.uk/',
    bio: 'Dennydaddy',
    avatar: 'https://blog.sianqi.uk/assets/images/avatar.jpg',
  },
  {
    name: 'Yuan',
    url: 'https://yuan-tw.net/',
    bio: '嗨，我是 Yuan。我的主要關注領域是網路基礎設施、BGP 路由、Web Security、Linux 系統維運，以及 AI Agent、n8n 自動化與 AI 應用程式製作。除了工程實作，我也投入社群活動、技術教育與活動協作，喜歡把複雜的系統知識整理成能被更多人理解的內容。',
    avatar: 'https://yuan-tw.net/images/avatar2.png',
  },
  {
    name: 'yhw',
    url: 'https://yhw.tw/site',
    bio: '我在denny的Github裡面：））））',
    avatar: 'https://yuanhau.com/_astro/profile.DyO-m1Sr_1ItGeE.webp',
  },
];
