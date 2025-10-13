import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Music, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Demo = () => {
  const navigate = useNavigate();

  const examples = [
    {
      name: "Cosmic Lofi Rapper",
      genres: ["Lofi Hip-Hop", "电子", "说唱"],
      prompt: "dreamy space electronic with rap elements, ethereal synth textures, punchy hip-hop drums",
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "K-Pop Fusion Artist",
      genres: ["K-POP", "流行", "电子"],
      prompt: "energetic K-pop with electronic drops, strong beats, catchy hooks, blend of BLACKPINK and futuristic sounds",
      color: "from-pink-500 to-rose-500"
    },
    {
      name: "Gothic Indie Dreamer",
      genres: ["独立", "哥特", "氛围"],
      prompt: "dark indie pop with Wednesday atmosphere, haunting vocals, moody instrumentals, mysterious vibe",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>
      
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            音乐人格示例
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            看看其他人的音乐人格是什么样的
          </p>
        </div>

        {/* Examples Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {examples.map((example, index) => (
            <Card 
              key={index}
              className="bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-glow-primary overflow-hidden group cursor-pointer"
              onClick={() => navigate('/persona')}
            >
              <div className={`h-32 bg-gradient-to-br ${example.color} relative`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-4">
                  <Music className="w-8 h-8 text-white opacity-80" />
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                  {example.name}
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {example.genres.map((genre) => (
                    <Badge key={genre} variant="secondary" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-3 font-mono">
                  {example.prompt}
                </p>
                
                <Button 
                  variant="ghost" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                >
                  查看详情
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-primary p-8 md:p-12 text-center border-none">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            准备好发现你的音乐人格了吗？
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            连接你的 Apple Music，让 AI 为你生成独一无二的音乐创作灵感
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/connect')}
            className="bg-white text-purple-600 hover:bg-white/90 hover:scale-105 font-semibold"
          >
            <Music className="mr-2" />
            开始分析
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Demo;
