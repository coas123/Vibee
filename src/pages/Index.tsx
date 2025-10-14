import { Button } from "@/components/ui/button";
import { Music, Sparkles, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-cosmic opacity-80" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="animate-float">
            <Music className="w-20 h-20 mx-auto mb-6 text-primary" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
            发现你的音乐人格
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            通过 AI 分析你的音乐品味，生成独特的创作灵感，帮助你在 Suno 等平台创作属于自己的音乐
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => navigate('/connect')}
              className="group"
            >
              <Music className="mr-2 group-hover:animate-pulse" />
              连接 Apple Music
            </Button>
            
            <Button 
              variant="cosmic" 
              size="lg"
              onClick={() => navigate('/suno-demo')}
            >
              <Sparkles className="mr-2" />
              Suno 演示
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/demo')}
            >
              查看示例
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-primary bg-clip-text text-transparent">
            如何使用
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon={<Music className="w-12 h-12" />}
              title="1. 连接账号"
              description="授权访问你的 Apple Music，让 AI 了解你的音乐喜好"
            />
            
            <FeatureCard
              icon={<Sparkles className="w-12 h-12" />}
              title="2. AI 分析"
              description="大模型分析你的听歌习惯，生成专属音乐人格和创作提示词"
            />
            
            <FeatureCard
              icon={<Share2 className="w-12 h-12" />}
              title="3. 创作分享"
              description="一键复制提示词到 Suno，创作你的专属音乐并分享给朋友"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary transition-all duration-300 hover:shadow-glow-primary group">
      <div className="text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;
