import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Music, ArrowLeft, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppleMusicAuth } from "@/hooks/use-apple-music-auth";
import { generateDemoMusicLibrary, generateDemoPersonaAnalysis } from "@/lib/demo-data";

const TestAuth = () => {
  const navigate = useNavigate();
  const { 
    isAuthenticated, 
    isLoading, 
    userToken,
    storefront,
    error, 
    isConfigured,
    startAuth, 
    logout 
  } = useAppleMusicAuth();

  const [demoData, setDemoData] = useState<any>(null);
  const [personaAnalysis, setPersonaAnalysis] = useState<any>(null);

  const handleGenerateDemoData = () => {
    const library = generateDemoMusicLibrary();
    const analysis = generateDemoPersonaAnalysis();
    
    setDemoData(library);
    setPersonaAnalysis(analysis);
    
    toast.success("演示数据生成成功！");
  };

  const handleClearDemoData = () => {
    setDemoData(null);
    setPersonaAnalysis(null);
    toast.info("演示数据已清除");
  };

  return (
    <div className="min-h-screen p-4">
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>

      <div className="max-w-4xl mx-auto pt-16">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-primary bg-clip-text text-transparent">
          Apple Music 授权测试页面
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* 授权状态卡片 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="w-5 h-5" />
                授权状态
              </CardTitle>
              <CardDescription>
                当前 Apple Music 授权状态和 MusicKit 配置信息
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {isConfigured ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                  )}
                  <span className="text-sm">MusicKit 配置: {isConfigured ? '已配置' : '未配置'}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {isAuthenticated ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm">
                    授权状态: {isAuthenticated ? '已授权' : '未授权'}
                  </span>
                </div>

                {isLoading && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">加载中...</span>
                  </div>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {storefront && (
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">环境信息</h4>
                  <p className="text-sm">Storefront: {storefront}</p>
                </div>
              )}

              {userToken && (
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">令牌信息</h4>
                  <p className="text-sm break-all">User Token: {userToken.substring(0, 24)}...</p>
                </div>
              )}

              <div className="flex gap-2">
                {!isAuthenticated ? (
                  <Button 
                    onClick={startAuth} 
                    disabled={isLoading || !isConfigured}
                    className="flex-1"
                  >
                    {isConfigured ? '开始授权' : '需要配置 MusicKit'}
                  </Button>
                ) : (
                  <Button 
                    onClick={logout} 
                    variant="outline"
                    className="flex-1"
                  >
                    退出登录
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 演示数据卡片 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                演示数据
              </CardTitle>
              <CardDescription>
                生成模拟的音乐数据和人格分析
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  onClick={handleGenerateDemoData}
                  variant="outline"
                  className="flex-1"
                >
                  生成演示数据
                </Button>
                <Button 
                  onClick={handleClearDemoData}
                  variant="ghost"
                  disabled={!demoData}
                >
                  清除
                </Button>
              </div>

              {demoData && (
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">音乐库统计</h4>
                    <p className="text-sm">总曲目: {demoData.listeningStats.totalTracks}</p>
                    <p className="text-sm">总播放时长: {Math.round(demoData.listeningStats.totalPlayTime / (1000 * 60 * 60))} 小时</p>
                    <p className="text-sm">最近播放: {demoData.recentlyPlayed.length} 首</p>
                    <p className="text-sm">收藏歌曲: {demoData.lovedTracks.length} 首</p>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">热门流派</h4>
                    <div className="space-y-1">
                      {demoData.topGenres.slice(0, 5).map((genre: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{genre.genre}</span>
                          <span>{genre.count} 首</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {personaAnalysis && (
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">人格分析</h4>
                  <p className="text-sm mb-2">音乐风格: {personaAnalysis.musicStyle}</p>
                  <p className="text-sm mb-2">情感倾向: {personaAnalysis.emotionalTendency}</p>
                  <p className="text-sm">创作方向: {personaAnalysis.creativeDirection}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 配置说明 */}
        <Card>
          <CardHeader>
            <CardTitle>配置说明</CardTitle>
            <CardDescription>
              如何配置 Apple Music API 以启用真实授权功能
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  要启用真实的 Apple Music 授权，请按照以下步骤配置：
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2 text-sm">
                <p>1. 访问 <a href="https://developer.apple.com/account/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Apple Developer Console</a></p>
                <p>2. 创建或选择你的 App ID</p>
                <p>3. 启用 "MusicKit" 功能</p>
                <p>4. 创建 MusicKit 密钥</p>
                <p>5. 在项目根目录创建 <code className="bg-muted px-1 rounded">.env.local</code> 文件</p>
                <p>6. 添加配置：</p>
                <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
{`VITE_APPLE_MUSIC_CLIENT_ID=your-client-id
VITE_APPLE_MUSIC_REDIRECT_URI=http://localhost:8080/connect/callback`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestAuth;
