// Apple Music API 数据获取工具函数

import { AppleMusicToken } from './apple-music';

export interface AppleMusicTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  genre: string;
  duration: number;
  playCount?: number;
  isLoved?: boolean;
  addedDate?: string;
}

export interface AppleMusicPlaylist {
  id: string;
  name: string;
  description?: string;
  trackCount: number;
  tracks: AppleMusicTrack[];
}

export interface AppleMusicLibrary {
  recentlyPlayed: AppleMusicTrack[];
  lovedTracks: AppleMusicTrack[];
  playlists: AppleMusicPlaylist[];
  topGenres: { genre: string; count: number }[];
  listeningStats: {
    totalTracks: number;
    totalPlayTime: number;
    averageSessionLength: number;
  };
}

/**
 * 获取用户最近播放的音乐
 */
export async function fetchRecentlyPlayed(
  accessToken: string,
  limit: number = 50
): Promise<AppleMusicTrack[]> {
  try {
    const response = await fetch(
      `https://api.music.apple.com/v1/me/recent/played/tracks?limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch recently played: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.map((item: any) => ({
      id: item.id,
      name: item.attributes.name,
      artist: item.attributes.artistName,
      album: item.attributes.albumName,
      genre: item.attributes.genreNames?.[0] || 'Unknown',
      duration: item.attributes.durationInMillis,
      playCount: item.attributes.playCount,
      addedDate: item.attributes.dateAdded,
    }));
  } catch (error) {
    console.error('Error fetching recently played:', error);
    throw error;
  }
}

/**
 * 获取用户喜欢的音乐
 */
export async function fetchLovedTracks(
  accessToken: string,
  limit: number = 50
): Promise<AppleMusicTrack[]> {
  try {
    const response = await fetch(
      `https://api.music.apple.com/v1/me/library/songs?include=artists,albums&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch loved tracks: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data
      .filter((item: any) => item.attributes.playCount > 0)
      .map((item: any) => ({
        id: item.id,
        name: item.attributes.name,
        artist: item.attributes.artistName,
        album: item.attributes.albumName,
        genre: item.attributes.genreNames?.[0] || 'Unknown',
        duration: item.attributes.durationInMillis,
        playCount: item.attributes.playCount,
        isLoved: true,
        addedDate: item.attributes.dateAdded,
      }));
  } catch (error) {
    console.error('Error fetching loved tracks:', error);
    throw error;
  }
}

/**
 * 获取用户的播放列表
 */
export async function fetchUserPlaylists(
  accessToken: string,
  limit: number = 20
): Promise<AppleMusicPlaylist[]> {
  try {
    const response = await fetch(
      `https://api.music.apple.com/v1/me/library/playlists?include=tracks&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch playlists: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.map((playlist: any) => ({
      id: playlist.id,
      name: playlist.attributes.name,
      description: playlist.attributes.description?.standard,
      trackCount: playlist.attributes.trackCount,
      tracks: playlist.relationships?.tracks?.data?.map((track: any) => ({
        id: track.id,
        name: track.attributes.name,
        artist: track.attributes.artistName,
        album: track.attributes.albumName,
        genre: track.attributes.genreNames?.[0] || 'Unknown',
        duration: track.attributes.durationInMillis,
      })) || [],
    }));
  } catch (error) {
    console.error('Error fetching playlists:', error);
    throw error;
  }
}

/**
 * 分析音乐数据并生成统计信息
 */
export function analyzeMusicData(tracks: AppleMusicTrack[]): {
  topGenres: { genre: string; count: number }[];
  listeningStats: {
    totalTracks: number;
    totalPlayTime: number;
    averageSessionLength: number;
  };
} {
  // 统计流派
  const genreCount: { [key: string]: number } = {};
  let totalPlayTime = 0;
  let totalPlayCount = 0;

  tracks.forEach(track => {
    // 统计流派
    if (track.genre) {
      genreCount[track.genre] = (genreCount[track.genre] || 0) + 1;
    }

    // 统计播放时间
    if (track.duration) {
      totalPlayTime += track.duration;
    }

    // 统计播放次数
    if (track.playCount) {
      totalPlayCount += track.playCount;
    }
  });

  // 排序并获取前10个流派
  const topGenres = Object.entries(genreCount)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // 计算平均会话长度（假设每次播放平均3-4首歌）
  const averageSessionLength = totalPlayCount > 0 
    ? (totalPlayTime / totalPlayCount) * 3.5 
    : 0;

  return {
    topGenres,
    listeningStats: {
      totalTracks: tracks.length,
      totalPlayTime,
      averageSessionLength,
    },
  };
}

/**
 * 获取完整的用户音乐库数据
 */
export async function fetchUserMusicLibrary(
  accessToken: string
): Promise<AppleMusicLibrary> {
  try {
    // 并行获取所有数据
    const [recentlyPlayed, lovedTracks, playlists] = await Promise.all([
      fetchRecentlyPlayed(accessToken, 100),
      fetchLovedTracks(accessToken, 100),
      fetchUserPlaylists(accessToken, 20),
    ]);

    // 合并所有曲目进行分析
    const allTracks = [...recentlyPlayed, ...lovedTracks];
    const analysis = analyzeMusicData(allTracks);

    return {
      recentlyPlayed,
      lovedTracks,
      playlists,
      topGenres: analysis.topGenres,
      listeningStats: analysis.listeningStats,
    };
  } catch (error) {
    console.error('Error fetching user music library:', error);
    throw error;
  }
}

/**
 * 生成音乐人格分析提示词
 */
export function generateMusicPersonaPrompt(library: AppleMusicLibrary): string {
  const { topGenres, listeningStats, recentlyPlayed, lovedTracks } = library;
  
  const topGenresText = topGenres.slice(0, 5).map(g => g.genre).join('、');
  const totalHours = Math.round(listeningStats.totalPlayTime / (1000 * 60 * 60));
  const avgSessionMinutes = Math.round(listeningStats.averageSessionLength / (1000 * 60));

  return `基于以下音乐数据生成音乐人格分析：

**音乐偏好：**
- 主要流派：${topGenresText}
- 总听歌时长：约 ${totalHours} 小时
- 平均听歌时长：约 ${avgSessionMinutes} 分钟
- 收藏歌曲数：${lovedTracks.length} 首
- 最近播放：${recentlyPlayed.length} 首

**最近喜欢的歌曲：**
${recentlyPlayed.slice(0, 10).map(track => `- ${track.name} - ${track.artist}`).join('\n')}

**收藏的歌曲：**
${lovedTracks.slice(0, 10).map(track => `- ${track.name} - ${track.artist}`).join('\n')}

请分析这个用户的音乐品味特点，包括：
1. 音乐风格偏好
2. 情感倾向
3. 创作灵感方向
4. 适合的音乐类型建议
5. 为 Suno 创作提供的提示词建议`;
}
