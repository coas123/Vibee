// 演示数据生成器

import { AppleMusicLibrary, AppleMusicTrack, AppleMusicPlaylist } from './apple-music-api';

// 模拟音乐数据
const DEMO_TRACKS: AppleMusicTrack[] = [
  {
    id: '1',
    name: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    genre: 'Pop',
    duration: 200000,
    playCount: 45,
    isLoved: true,
    addedDate: '2023-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    genre: 'Pop',
    duration: 203000,
    playCount: 38,
    isLoved: true,
    addedDate: '2023-02-20T14:15:00Z',
  },
  {
    id: '3',
    name: 'Good 4 U',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    genre: 'Pop Rock',
    duration: 178000,
    playCount: 52,
    isLoved: true,
    addedDate: '2023-03-10T09:45:00Z',
  },
  {
    id: '4',
    name: 'Heat Waves',
    artist: 'Glass Animals',
    album: 'Dreamland',
    genre: 'Indie Pop',
    duration: 238000,
    playCount: 29,
    isLoved: false,
    addedDate: '2023-01-25T16:20:00Z',
  },
  {
    id: '5',
    name: 'Stay',
    artist: 'The Kid LAROI & Justin Bieber',
    album: 'F*CK LOVE 3',
    genre: 'Pop',
    duration: 141000,
    playCount: 67,
    isLoved: true,
    addedDate: '2023-02-05T11:30:00Z',
  },
  {
    id: '6',
    name: 'Industry Baby',
    artist: 'Lil Nas X ft. Jack Harlow',
    album: 'MONTERO',
    genre: 'Hip Hop',
    duration: 212000,
    playCount: 41,
    isLoved: true,
    addedDate: '2023-03-15T13:45:00Z',
  },
  {
    id: '7',
    name: 'Peaches',
    artist: 'Justin Bieber ft. Daniel Caesar & Giveon',
    album: 'Justice',
    genre: 'R&B',
    duration: 198000,
    playCount: 33,
    isLoved: false,
    addedDate: '2023-01-30T08:15:00Z',
  },
  {
    id: '8',
    name: 'Kiss Me More',
    artist: 'Doja Cat ft. SZA',
    album: 'Planet Her',
    genre: 'Pop',
    duration: 208000,
    playCount: 48,
    isLoved: true,
    addedDate: '2023-02-12T15:30:00Z',
  },
  {
    id: '9',
    name: 'Montero',
    artist: 'Lil Nas X',
    album: 'MONTERO',
    genre: 'Hip Hop',
    duration: 137000,
    playCount: 55,
    isLoved: true,
    addedDate: '2023-03-20T12:00:00Z',
  },
  {
    id: '10',
    name: 'Watermelon Sugar',
    artist: 'Harry Styles',
    album: 'Fine Line',
    genre: 'Pop Rock',
    duration: 174000,
    playCount: 36,
    isLoved: false,
    addedDate: '2023-01-18T17:45:00Z',
  },
  {
    id: '11',
    name: 'Positions',
    artist: 'Ariana Grande',
    album: 'Positions',
    genre: 'R&B',
    duration: 172000,
    playCount: 42,
    isLoved: true,
    addedDate: '2023-02-28T10:20:00Z',
  },
  {
    id: '12',
    name: 'Dynamite',
    artist: 'BTS',
    album: 'BE',
    genre: 'K-Pop',
    duration: 199000,
    playCount: 39,
    isLoved: true,
    addedDate: '2023-03-05T14:10:00Z',
  },
  {
    id: '13',
    name: 'Mood',
    artist: '24kGoldn ft. iann dior',
    album: 'El Dorado',
    genre: 'Hip Hop',
    duration: 140000,
    playCount: 31,
    isLoved: false,
    addedDate: '2023-01-22T19:30:00Z',
  },
  {
    id: '14',
    name: 'Therefore I Am',
    artist: 'Billie Eilish',
    album: 'Therefore I Am',
    genre: 'Alternative',
    duration: 174000,
    playCount: 44,
    isLoved: true,
    addedDate: '2023-02-15T11:45:00Z',
  },
  {
    id: '15',
    name: 'Savage',
    artist: 'Megan Thee Stallion',
    album: 'Suga',
    genre: 'Hip Hop',
    duration: 160000,
    playCount: 37,
    isLoved: false,
    addedDate: '2023-03-12T16:25:00Z',
  },
];

const DEMO_PLAYLISTS: AppleMusicPlaylist[] = [
  {
    id: 'playlist-1',
    name: '我的最爱',
    description: '我最喜欢的歌曲合集',
    trackCount: 8,
    tracks: DEMO_TRACKS.filter(track => track.isLoved).slice(0, 8),
  },
  {
    id: 'playlist-2',
    name: '流行金曲',
    description: '当前最流行的歌曲',
    trackCount: 12,
    tracks: DEMO_TRACKS.filter(track => track.genre === 'Pop').slice(0, 12),
  },
  {
    id: 'playlist-3',
    name: '说唱精选',
    description: 'Hip Hop 和说唱音乐',
    trackCount: 5,
    tracks: DEMO_TRACKS.filter(track => track.genre === 'Hip Hop').slice(0, 5),
  },
  {
    id: 'playlist-4',
    name: '放松时光',
    description: '适合放松时听的音乐',
    trackCount: 6,
    tracks: DEMO_TRACKS.filter(track => 
      track.genre === 'R&B' || track.genre === 'Indie Pop'
    ).slice(0, 6),
  },
];

/**
 * 生成演示音乐库数据
 */
export function generateDemoMusicLibrary(): AppleMusicLibrary {
  // 随机选择最近播放的歌曲
  const recentlyPlayed = [...DEMO_TRACKS]
    .sort(() => Math.random() - 0.5)
    .slice(0, 15);

  // 获取喜欢的歌曲
  const lovedTracks = DEMO_TRACKS.filter(track => track.isLoved);

  // 分析数据
  const allTracks = [...recentlyPlayed, ...lovedTracks];
  const genreCount: { [key: string]: number } = {};
  let totalPlayTime = 0;
  let totalPlayCount = 0;

  allTracks.forEach(track => {
    if (track.genre) {
      genreCount[track.genre] = (genreCount[track.genre] || 0) + 1;
    }
    if (track.duration) {
      totalPlayTime += track.duration;
    }
    if (track.playCount) {
      totalPlayCount += track.playCount;
    }
  });

  const topGenres = Object.entries(genreCount)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const totalHours = Math.round(totalPlayTime / (1000 * 60 * 60));
  const averageSessionLength = totalPlayCount > 0 
    ? (totalPlayTime / totalPlayCount) * 3.5 
    : 0;

  return {
    recentlyPlayed,
    lovedTracks,
    playlists: DEMO_PLAYLISTS,
    topGenres,
    listeningStats: {
      totalTracks: allTracks.length,
      totalPlayTime,
      averageSessionLength,
    },
  };
}

/**
 * 生成音乐人格分析结果
 */
export function generateDemoPersonaAnalysis() {
  return {
    musicStyle: '现代流行音乐爱好者',
    emotionalTendency: '积极向上，喜欢节奏感强的音乐',
    creativeDirection: '适合创作流行、说唱和 R&B 风格的音乐',
    recommendations: [
      '继续探索不同流派的音乐',
      '尝试一些独立音乐和另类音乐',
      '关注新兴艺术家的作品',
    ],
    sunoPrompts: [
      'Create a modern pop song with catchy hooks and upbeat rhythm',
      'Generate a hip-hop track with smooth beats and confident lyrics',
      'Make an R&B song with soulful vocals and emotional depth',
      'Produce an indie pop track with dreamy atmosphere and unique sound',
    ],
  };
}
