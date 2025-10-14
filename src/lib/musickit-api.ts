// MusicKit 原生函数调用方式获取用户音乐数据

export interface MusicKitTrack {
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

export interface MusicKitPlaylist {
  id: string;
  name: string;
  description?: string;
  trackCount: number;
  tracks: MusicKitTrack[];
}

export interface MusicKitAlbum {
  id: string;
  name: string;
  artist: string;
  releaseDate: string;
  trackCount: number;
  genre: string;
  artwork?: string;
  tracks: MusicKitTrack[];
}

export interface MusicKitLibrary {
  recentlyPlayed: MusicKitTrack[];
  lovedTracks: MusicKitTrack[];
  playlists: MusicKitPlaylist[];
  albums: MusicKitAlbum[];
  topGenres: { genre: string; count: number }[];
  listeningStats: {
    totalTracks: number;
    totalPlayTime: number;
    averageSessionLength: number;
  };
}

/**
 * 获取 MusicKit 实例
 */
function getMusicKitInstance() {
  const musicKit = (window as any).MusicKit?.getInstance();
  if (!musicKit) {
    throw new Error('MusicKit 实例未初始化');
  }
  return musicKit;
}

/**
 * 使用 MusicKit 获取用户最近播放的音乐
 * 根据官方文档：https://js-cdn.music.apple.com/musickit/v3/docs/index.html
 */
export async function fetchRecentlyPlayedWithMusicKit(limit: number = 50): Promise<MusicKitTrack[]> {
  try {
    const musicKit = getMusicKitInstance();
    
    // 使用 MusicKit 的 API 获取最近播放 - 正确的API调用方式
    
    const queryParameters = { l: 'en-us' };
    const response = await musicKit.api.music('/v1/me/recent/played', queryParameters);
    
    console.log('🎵 MusicKit 最近播放数据:', response);
    
    return response.data.map((item: any) => ({
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
    console.error('❌ MusicKit 获取最近播放失败:', error);
    throw error;
  }
}

/**
 * 使用 MusicKit 获取用户库中的歌曲
 * 根据官方文档：https://js-cdn.music.apple.com/musickit/v3/docs/index.html
 */
export async function fetchLovedTracksWithMusicKit(limit: number = 50): Promise<MusicKitTrack[]> {
  try {
    const musicKit = getMusicKitInstance();
    
    // 使用 MusicKit 的 API 获取用户库中的歌曲 - 正确的API调用方式
    const queryParameters = { limit: limit.toString() };
    const response = await musicKit.api.music('/v1/me/library/songs', queryParameters);
    
    console.log('❤️ MusicKit 用户库歌曲数据:', response);
    
    return response.data
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
    console.error('❌ MusicKit 获取用户库歌曲失败:', error);
    throw error;
  }
}

/**
 * 使用 MusicKit 获取用户的播放列表
 * 根据官方文档：https://js-cdn.music.apple.com/musickit/v3/docs/index.html
 */
export async function fetchUserPlaylistsWithMusicKit(limit: number = 20): Promise<MusicKitPlaylist[]> {
  try {
    const musicKit = getMusicKitInstance();
    
    // 使用 MusicKit 的 API 获取用户播放列表 - 正确的API调用方式
    const queryParameters = { limit: limit.toString() };
    const response = await musicKit.api.music('/v1/me/library/playlists', queryParameters);
    
    console.log('📋 MusicKit 播放列表数据:', response);
    
    return response.data.map((playlist: any) => ({
      id: playlist.id,
      name: playlist.attributes.name,
      description: playlist.attributes.description?.standard,
      trackCount: playlist.attributes.trackCount,
      tracks: [], // 播放列表的曲目需要单独获取
    }));
  } catch (error) {
    console.error('❌ MusicKit 获取播放列表失败:', error);
    throw error;
  }
}

/**
 * 使用 MusicKit 获取用户的重播列表
 * 根据官方文档：https://js-cdn.music.apple.com/musickit/v3/docs/index.html
 */
export async function fetchHeavyRotationWithMusicKit(): Promise<MusicKitTrack[]> {
  try {
    const musicKit = getMusicKitInstance();
    
    // 使用 MusicKit 的 API 获取重播列表 - 正确的API调用方式
    const queryParameters = { l: 'en-us' };
    const response = await musicKit.api.music('/v1/me/history/heavy-rotation', queryParameters);
    
    console.log('🔄 MusicKit 重播列表数据:', response);
    
    return response.data.map((item: any) => ({
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
    console.error('❌ MusicKit 获取重播列表失败:', error);
    // 重播列表获取失败不应该影响整个流程
    return [];
  }
}

/**
 * 使用 MusicKit 获取用户的历史播放记录
 * 根据官方文档：https://js-cdn.music.apple.com/musickit/v3/docs/index.html
 */
export async function fetchHistoryWithMusicKit(limit: number = 50): Promise<MusicKitTrack[]> {
  try {
    const musicKit = getMusicKitInstance();
    
    // 使用 MusicKit 的 API 获取历史播放 - 正确的API调用方式
    const queryParameters = { limit: limit.toString() };
    const response = await musicKit.api.music('/v1/me/history/tracks', queryParameters);
    
    console.log('📜 MusicKit 历史播放数据:', response);
    
    return response.data.map((item: any) => ({
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
    console.error('❌ MusicKit 获取历史播放失败:', error);
    return [];
  }
}

/**
 * 使用 MusicKit 获取用户的推荐音乐
 * 根据官方文档：https://js-cdn.music.apple.com/musickit/v3/docs/index.html
 */
export async function fetchRecommendationsWithMusicKit(limit: number = 20): Promise<MusicKitTrack[]> {
  try {
    const musicKit = getMusicKitInstance();
    
    // 使用 MusicKit 的 API 获取推荐音乐 - 正确的API调用方式
    const queryParameters = { limit: limit.toString() };
    const response = await musicKit.api.music('/v1/me/recommendations', queryParameters);
    
    console.log('🎯 MusicKit 推荐音乐数据:', response);
    
    return response.data.map((item: any) => ({
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
    console.error('❌ MusicKit 获取推荐音乐失败:', error);
    return [];
  }
}

/**
 * 使用 MusicKit 获取用户的所有音乐专辑信息
 * 根据官方文档：https://js-cdn.music.apple.com/musickit/v3/docs/index.html
 */
export async function fetchUserAlbumsWithMusicKit(limit: number = 50): Promise<MusicKitAlbum[]> {
  try {
    const musicKit = getMusicKitInstance();
    
    // 使用 MusicKit 的 API 获取用户专辑信息 - 正确的API调用方式
    const queryParameters = { l: 'en-us' };
    const response = await musicKit.api.music('/v1/me/library/albums', queryParameters);
    
    console.log('💿 MusicKit 用户专辑数据:', response);
    
    return response.data.map((album: any) => ({
      id: album.id,
      name: album.attributes.name,
      artist: album.attributes.artistName,
      releaseDate: album.attributes.releaseDate,
      trackCount: album.attributes.trackCount,
      genre: album.attributes.genreNames?.[0] || 'Unknown',
      artwork: album.attributes.artwork?.url,
      tracks: [], // 专辑的曲目需要单独获取
    }));
  } catch (error) {
    console.error('❌ MusicKit 获取用户专辑失败:', error);
    throw error;
  }
}

/**
 * 分析音乐数据并生成统计信息
 */
export function analyzeMusicKitData(tracks: MusicKitTrack[]): {
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
 * 使用 MusicKit 获取完整的用户音乐库数据
 * 根据官方文档：https://js-cdn.music.apple.com/musickit/v3/docs/index.html
 */
export async function fetchUserMusicLibraryWithMusicKit(): Promise<MusicKitLibrary> {
  try {
    console.log('🎵 开始使用 MusicKit 获取用户音乐数据...');
    
    // 并行获取所有数据 - 根据官方文档使用正确的API方法
    const [recentlyPlayed, history, heavyRotation, lovedTracks, playlists, albums, recommendations] = await Promise.allSettled([
      fetchRecentlyPlayedWithMusicKit(100),
      fetchHistoryWithMusicKit(100),
      fetchHeavyRotationWithMusicKit(),
      fetchLovedTracksWithMusicKit(100),
      fetchUserPlaylistsWithMusicKit(20),
      fetchUserAlbumsWithMusicKit(50),
      fetchRecommendationsWithMusicKit(20),
    ]);

    // 处理结果，即使某些请求失败也要继续
    const recentlyPlayedData = recentlyPlayed.status === 'fulfilled' ? recentlyPlayed.value : [];
    const historyData = history.status === 'fulfilled' ? history.value : [];
    const heavyRotationData = heavyRotation.status === 'fulfilled' ? heavyRotation.value : [];
    const lovedTracksData = lovedTracks.status === 'fulfilled' ? lovedTracks.value : [];
    const playlistsData = playlists.status === 'fulfilled' ? playlists.value : [];
    const albumsData = albums.status === 'fulfilled' ? albums.value : [];
    const recommendationsData = recommendations.status === 'fulfilled' ? recommendations.value : [];

    // 合并所有播放数据，去重
    const allRecentTracks = [...recentlyPlayedData, ...historyData, ...heavyRotationData];
    const uniqueRecentTracks = allRecentTracks.filter((track, index, self) => 
      index === self.findIndex(t => t.id === track.id)
    );

    // 合并所有曲目进行分析（包括推荐音乐）
    const allTracks = [...uniqueRecentTracks, ...lovedTracksData, ...recommendationsData];
    const analysis = analyzeMusicKitData(allTracks);

    const result = {
      recentlyPlayed: uniqueRecentTracks,
      lovedTracks: lovedTracksData,
      playlists: playlistsData,
      albums: albumsData,
      topGenres: analysis.topGenres,
      listeningStats: analysis.listeningStats,
    };

    console.log('✅ MusicKit 音乐库数据获取完成:', result);
    console.log('📊 数据统计:', {
      最近播放: uniqueRecentTracks.length,
      收藏歌曲: lovedTracksData.length,
      播放列表: playlistsData.length,
      专辑数量: albumsData.length,
      推荐音乐: recommendationsData.length,
      总曲目: allTracks.length
    });
    
    return result;
  } catch (error) {
    console.error('❌ MusicKit 获取音乐库数据失败:', error);
    throw error;
  }
}

/**
 * 生成音乐人格分析提示词
 */
export function generateMusicKitPersonaPrompt(library: MusicKitLibrary): string {
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
