import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Share2, Music, Sparkles, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import personaIcon from "@/assets/persona-icon.png";

const Persona = () => {
  const navigate = useNavigate();
  const musicPersona = "Cosmic Lofi Rapper";
  const prompt = "dreamy space electronic with rap elements, ethereal synth textures, punchy hip-hop drums, atmospheric pads, slow tempo, immersive spatial feel";
  const genres = ["Lofi Hip-Hop", "电子", "说唱", "太空音乐"];
  const mood = "梦幻 • 放松 • 沉浸";

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    toast.success("提示词已复制！", {
      description: "现在可以在 Suno 中使用这个提示词创作音乐了"
    });
  };

  const sharePersona = () => {
    const shareText = `我的音乐人格是：${musicPersona}\n\n${prompt}`;
    navigator.clipboard.writeText(shareText);
    toast.success("分享内容已复制！");
  };

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
                {musicPersona}
              </h1>
              <p className="text-xl text-muted-foreground">{mood}</p>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 justify-center">
              {genres.map((genre) => (
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
              {prompt}
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
