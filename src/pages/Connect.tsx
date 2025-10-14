import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Music, Loader2, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppleMusicAuth } from "@/hooks/use-apple-music-auth";
import { APPLE_MUSIC_CONFIG } from "@/lib/apple-music";

const Connect = () => {
  const navigate = useNavigate();
  const { 
    isAuthenticated, 
    isLoading, 
    userToken,
    error, 
    isConfigured,
    startAuth, 
    handleAuthCallback 
  } = useAppleMusicAuth();

  // 处理授权回调
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('code') || urlParams.get('error')) {
      handleAuthCallback();
    }
  }, [handleAuthCallback]);

  // 授权成功后自动跳转
  useEffect(() => {
    if (isAuthenticated && userToken) {
      toast.success('Apple Music 授权成功！开始分析你的音乐品味...');
      setTimeout(() => {
        navigate('/persona');
      }, 2000);
    }
  }, [isAuthenticated, userToken, navigate]);

  const handleConnect = () => {
    if (isConfigured) {
      startAuth();
    } else {
      toast.error('MusicKit 未配置开发者令牌，请查看配置文档');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>
      
      <Card className="w-full max-w-md border-border shadow-glow-primary">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center animate-pulse-glow">
            <Music className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl">连接 Apple Music</CardTitle>
          <CardDescription className="text-base">
            授权访问你的音乐库，让 AI 分析你独特的音乐品味
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* 错误提示 */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* 授权成功状态 */}
          {isAuthenticated && userToken ? (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-600">授权成功！</h3>
                <p className="text-sm text-muted-foreground">
                  正在分析你的音乐品味...
                </p>
              </div>
              <div className="flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <p>我们只会读取你的播放历史和喜欢的歌曲</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <p>所有数据仅用于生成你的音乐人格分析</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <p>你可以随时撤销授权</p>
                </div>
              </div>

              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={handleConnect}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" />
                    处理中...
                  </>
                ) : (
                  <>
                    <Music className="mr-2" />
                    授权并继续
                  </>
                )}
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => navigate('/')}
            disabled={isLoading}
          >
            返回首页
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Connect;
