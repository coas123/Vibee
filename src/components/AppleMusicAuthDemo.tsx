import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Music, Loader2, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AppleMusicAuthDemoProps {
  onAuthSuccess: (token: string, user: { id: string; name: string; email?: string }) => void;
}

export function AppleMusicAuthDemo({ onAuthSuccess }: AppleMusicAuthDemoProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handleDemoAuth = async () => {
    setIsConnecting(true);
    toast.info("演示模式：模拟 Apple Music 授权...");
    
    // 模拟授权延迟
    setTimeout(() => {
      const mockToken = "demo_apple_music_token_" + Date.now();
      const mockUser = {
        id: "demo_user_123",
        name: "演示用户",
        email: "demo@example.com"
      };
      
      onAuthSuccess(mockToken, mockUser);
      setIsConnecting(false);
      toast.success("演示授权成功！");
    }, 2000);
  };

  if (showDemo) {
    return (
      <Card className="w-full max-w-md border-border shadow-glow-primary">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center animate-pulse-glow">
            <Music className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl">演示模式</CardTitle>
          <CardDescription className="text-base">
            使用模拟数据进行 Apple Music 授权演示
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              这是演示模式，不会连接真实的 Apple Music API
            </AlertDescription>
          </Alert>

          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <p>模拟用户授权流程</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <p>生成模拟的访问令牌</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <p>继续后续的音乐分析流程</p>
            </div>
          </div>

          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={handleDemoAuth}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 animate-spin" />
                模拟授权中...
              </>
            ) : (
              <>
                <Music className="mr-2" />
                开始演示
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setShowDemo(false)}
            disabled={isConnecting}
          >
            返回真实授权
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-border shadow-glow-primary">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center animate-pulse-glow">
          <Music className="w-10 h-10 text-white" />
        </div>
        <CardTitle className="text-3xl">Apple Music 授权</CardTitle>
        <CardDescription className="text-base">
          需要配置 Apple Music API 才能使用真实授权
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            未检测到 Apple Music API 配置。请查看 APPLE_MUSIC_SETUP.md 文件了解配置方法。
          </AlertDescription>
        </Alert>

        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
            <p>需要 Apple Developer 账号</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
            <p>配置 MusicKit 应用</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
            <p>设置环境变量</p>
          </div>
        </div>

        <Button
          variant="hero"
          size="lg"
          className="w-full"
          onClick={() => setShowDemo(true)}
        >
          <Music className="mr-2" />
          使用演示模式
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => window.open('https://developer.apple.com/musickit/', '_blank')}
        >
          查看 Apple Music API 文档
        </Button>
      </CardContent>
    </Card>
  );
}
