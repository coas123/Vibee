import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Share2, Music, Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import personaIcon from "@/assets/persona-icon.png";
import { useAppleMusicAuth } from "@/hooks/use-apple-music-auth";
import { fetchUserMusicLibraryWithMusicKit, generateMusicKitPersonaPrompt, MusicKitLibrary } from "@/lib/musickit-api";

interface PersonaData {
  musicPersona: string;
  prompt: string;
  genres: string[];
  mood: string;
}

const Persona = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userToken, isLoading: authLoading } = useAppleMusicAuth();
  
  const [personaData, setPersonaData] = useState<PersonaData | null>(null);
  const [musicLibrary, setMusicLibrary] = useState<MusicKitLibrary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 检查用户认证状态
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("请先连接 Apple Music");
      navigate('/connect');
      return;
    }
  }, [isAuthenticated, authLoading, navigate]);

  // 获取用户音乐数据
  useEffect(() => {
    const fetchMusicData = async () => {
      if (!isAuthenticated || !userToken) return;

      setIsLoading(true);
      setError(null);

      try {
        console.log('🎵 开始使用 MusicKit 获取用户音乐数据...');
        console.log('📱 用户Token:', userToken);
        
        // 使用 MusicKit 获取用户音乐库数据
        const library = await fetchUserMusicLibraryWithMusicKit();
        console.log('📊 MusicKit 音乐库数据:', library);
        setMusicLibrary(library);

        // 生成音乐人格分析提示词
        const prompt = generateMusicKitPersonaPrompt(library);
        console.log('🎨 生成的提示词:', prompt);
        
        // 基于数据生成人格信息
        const persona = generatePersonaFromData(library);
        console.log('👤 生成的人格:', persona);
        
        setPersonaData(persona);
        
        toast.success("音乐人格分析完成！");
      } catch (error) {
        console.error('❌ 获取音乐数据失败:', error);
        const errorMessage = error instanceof Error ? error.message : '获取音乐数据失败';
        setError(errorMessage);
        toast.error(`获取音乐数据失败: ${errorMessage}`);
        
        // 如果获取失败，使用默认数据
        setPersonaData({
          musicPersona: "音乐探索者",
          prompt: "diverse musical styles, eclectic mix, experimental sounds, creative exploration",
          genres: ["流行", "电子", "摇滚"],
          mood: "多样 • 开放 • 好奇"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMusicData();
  }, [isAuthenticated, userToken]);

  // 基于音乐数据生成人格信息的函数
  const generatePersonaFromData = (library: MusicKitLibrary): PersonaData => {
    const { topGenres, listeningStats } = library;
    
    // 根据主要流派生成人格
    const primaryGenres = topGenres.slice(0, 3).map(g => g.genre);
    const totalHours = Math.round(listeningStats.totalPlayTime / (1000 * 60 * 60));
    
    // 基于真实数据生成人格
    let musicPersona = "音乐探索者";
    let mood = "多样 • 开放 • 好奇";
    let prompt = "diverse musical styles, eclectic mix, experimental sounds, creative exploration";

    if (primaryGenres.some(g => g.toLowerCase().includes('hip') || g.toLowerCase().includes('rap'))) {
      musicPersona = "街头音乐诗人";
      mood = "节奏 • 力量 • 表达";
      prompt = "urban hip-hop beats, rhythmic flow, street poetry, powerful vocals, modern production";
    } else if (primaryGenres.some(g => g.toLowerCase().includes('electronic') || g.toLowerCase().includes('edm'))) {
      musicPersona = "电子音乐先锋";
      mood = "未来 • 科技 • 律动";
      prompt = "electronic synthesis, futuristic sounds, dance beats, digital textures, high energy";
    } else if (primaryGenres.some(g => g.toLowerCase().includes('rock') || g.toLowerCase().includes('alternative'))) {
      musicPersona = "摇滚精神传承者";
      mood = "激情 • 反叛 • 真实";
      prompt = "electric guitars, powerful drums, raw vocals, energetic performance, authentic expression";
    } else if (primaryGenres.some(g => g.toLowerCase().includes('pop'))) {
      musicPersona = "流行音乐爱好者";
      mood = "活力 • 时尚 • 流行";
      prompt = "catchy melodies, modern pop production, upbeat tempo, commercial appeal, mainstream sound";
    } else if (primaryGenres.some(g => g.toLowerCase().includes('jazz') || g.toLowerCase().includes('blues'))) {
      musicPersona = "爵士蓝调灵魂";
      mood = "优雅 • 深沉 • 即兴";
      prompt = "smooth jazz harmonies, bluesy guitar licks, soulful vocals, improvisational solos, sophisticated arrangements";
    } else if (primaryGenres.some(g => g.toLowerCase().includes('classical') || g.toLowerCase().includes('orchestral'))) {
      musicPersona = "古典音乐鉴赏家";
      mood = "优雅 • 深邃 • 经典";
      prompt = "orchestral arrangements, classical instruments, dramatic crescendos, timeless melodies, sophisticated composition";
    }

    return {
      musicPersona,
      prompt,
      genres: primaryGenres,
      mood
    };
  };

  const copyPrompt = () => {
    if (!personaData) return;
    navigator.clipboard.writeText(personaData.prompt);
    toast.success("提示词已复制！", {
      description: "现在可以在 Suno 中使用这个提示词创作音乐了"
    });
  };

  const sharePersona = () => {
    if (!personaData) return;
    const shareText = `我的音乐人格是：${personaData.musicPersona}\n\n${personaData.prompt}`;
    navigator.clipboard.writeText(shareText);
    toast.success("分享内容已复制！");
  };

  // 如果正在加载认证状态，显示加载中
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">正在验证授权状态...</p>
        </div>
      </div>
    );
  }

  // 如果正在加载音乐数据，显示加载中
  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={() => navigate('/connect')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
              <h2 className="text-2xl font-semibold">正在分析你的音乐品味...</h2>
              <p className="text-muted-foreground">
                我们正在获取你的音乐数据并生成个性化的人格分析
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 如果没有数据，显示错误或默认状态
  if (!personaData) {
    return (
      <div className="min-h-screen py-12 px-4">
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={() => navigate('/connect')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-red-600">获取音乐数据失败</h2>
              <p className="text-muted-foreground">
                {error || "无法获取你的音乐数据，请重试"}
              </p>
              <Button onClick={() => window.location.reload()}>
                重新加载
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50"
        onClick={() => navigate('/connect')}
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>
      
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-float">
          <Badge className="mb-4 bg-gradient-primary border-none text-lg px-4 py-1">
            <Sparkles className="w-4 h-4 mr-2" />
            你的音乐人格
          </Badge>
        </div>

        {/* Main Persona Card */}
        <Card className="bg-card/80 backdrop-blur-sm border-primary/30 shadow-glow-primary p-8 md:p-12 mb-8">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Avatar */}
            <div className="relative">
              <img 
                src={personaIcon} 
                alt="Music Persona" 
                className="w-48 h-48 rounded-full animate-pulse-glow"
              />
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                <Music className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Persona Name */}
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {personaData.musicPersona}
              </h1>
              <p className="text-xl text-muted-foreground">{personaData.mood}</p>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 justify-center">
              {personaData.genres.map((genre) => (
                <Badge key={genre} variant="secondary" className="text-sm px-3 py-1">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Prompt Card */}
        <Card className="bg-card border-border mb-8 overflow-hidden">
          <div className="bg-gradient-primary p-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI 音乐创作提示词
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-foreground leading-relaxed text-lg font-mono bg-muted p-4 rounded-lg">
              {personaData.prompt}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="hero"
                className="flex-1"
                onClick={copyPrompt}
              >
                <Copy className="mr-2" />
                复制提示词
              </Button>
              
              <Button
                variant="outline"
                className="flex-1"
                onClick={sharePersona}
              >
                <Share2 className="mr-2" />
                分享我的人格
              </Button>
            </div>
          </div>
        </Card>

        {/* Music Statistics */}
        {musicLibrary && (
          <Card className="bg-card border-border mb-8">
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Music className="w-5 h-5 text-primary" />
                你的音乐数据
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {musicLibrary.listeningStats.totalTracks}
                  </div>
                  <div className="text-sm text-muted-foreground">分析歌曲数</div>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(musicLibrary.listeningStats.totalPlayTime / (1000 * 60 * 60))}h
                  </div>
                  <div className="text-sm text-muted-foreground">总听歌时长</div>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {musicLibrary.librarySongs.length}
                  </div>
                  <div className="text-sm text-muted-foreground">库中歌曲</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {musicLibrary.libraryArtists.length}
                  </div>
                  <div className="text-sm text-muted-foreground">库中艺术家</div>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {musicLibrary.libraryAlbums.length}
                  </div>
                  <div className="text-sm text-muted-foreground">库中专辑</div>
                </div>
              </div>

              {musicLibrary.topGenres.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">主要音乐流派</h4>
                  <div className="flex flex-wrap gap-2">
                    {musicLibrary.topGenres.slice(0, 5).map((genre, index) => (
                      <Badge key={genre.genre} variant="outline" className="text-xs">
                        {genre.genre} ({genre.count})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {musicLibrary.recentlyPlayed.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">最近播放</h4>
                  <div className="space-y-1">
                    {musicLibrary.recentlyPlayed.slice(0, 3).map((track) => (
                      <div key={track.id} className="text-sm text-muted-foreground">
                        {track.name} - {track.artist}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {musicLibrary.heavyRotation.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">热门轮播</h4>
                  <div className="space-y-1">
                    {musicLibrary.heavyRotation.slice(0, 3).map((track) => (
                      <div key={track.id} className="text-sm text-muted-foreground">
                        {track.name} - {track.artist} ({track.playCount || 0} 次播放)
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* How to Use */}
        <Card className="bg-card border-border">
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Music className="w-5 h-5 text-primary" />
              如何使用这个提示词
            </h3>
            
            <ol className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
                  1
                </span>
                <span>访问 <a href="https://suno.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Suno.ai</a> 或其他 AI 音乐创作平台</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
                  2
                </span>
                <span>将上面的提示词粘贴到创作界面</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
                  3
                </span>
                <span>点击生成，等待你的专属音乐诞生！</span>
              </li>
            </ol>

            <Button
              variant="cosmic"
              className="w-full mt-4"
              onClick={() => window.open('https://suno.ai', '_blank')}
            >
              <Music className="mr-2" />
              前往 Suno 创作
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Persona;
