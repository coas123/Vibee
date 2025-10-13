import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Music, Wand2, ArrowLeft, History, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SunoAssistant from "@/components/SunoAssistant";

const SunoDemo = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [promptHistory, setPromptHistory] = useState<string[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("promptHistory");
    if (saved) {
      setPromptHistory(JSON.parse(saved));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("promptHistory", JSON.stringify(promptHistory));
  }, [promptHistory]);

  const handleFillPrompt = (newPrompt: string) => {
    setPrompt(newPrompt);
    // Add to history if not already there
    if (newPrompt.trim() && !promptHistory.includes(newPrompt)) {
      setPromptHistory([newPrompt, ...promptHistory]);
    }
  };

  const handleDeleteHistory = (index: number) => {
    setPromptHistory(promptHistory.filter((_, i) => i !== index));
  };

  const handleClearHistory = () => {
    setPromptHistory([]);
  };

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

      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-primary text-white">
            <Music className="w-5 h-5" />
            <span className="font-semibold">Suno AI 创作演示</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            开始创作你的音乐
          </h1>
          <p className="text-xl text-muted-foreground">
            点击输入框，AI 助手将帮你生成创作灵感
          </p>
        </div>

        {/* Main Creation Card */}
        <Card className="bg-card border-border p-8 mb-8">
          <div className="space-y-6">
            {/* Song Title */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Music className="w-4 h-4 text-primary" />
                歌曲标题
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="给你的歌曲起个名字..."
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            {/* Prompt Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-primary" />
                创作提示词
                <span className="text-xs text-muted-foreground font-normal">
                  (点击输入框唤起 AI 助手)
                </span>
              </label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="描述你想要创作的音乐风格、情绪、乐器等..."
                className="min-h-[150px] resize-none bg-muted border-border focus:border-primary"
              />
            </div>

            {/* Generate Button */}
            <Button
              variant="hero"
              size="lg"
              className="w-full"
              disabled={!prompt.trim()}
            >
              <Wand2 className="w-5 h-5 mr-2" />
              生成音乐
            </Button>
          </div>
        </Card>

        {/* Tips Card */}
        <Card className="bg-card/50 border-border p-6 mb-8">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary" />
            创作小贴士
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>使用具体的音乐风格描述，如 "Lofi Hip-Hop" 或 "电子舞曲"</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>描述情绪和氛围，如 "梦幻"、"放松"、"激昂"</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>提及具体乐器，如 "钢琴"、"合成器"、"鼓点"</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>点击输入框时，AI 助手会根据你的音乐品味推荐提示词</span>
            </li>
          </ul>
        </Card>

        {/* Prompt History */}
        {promptHistory.length > 0 && (
          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                提示词历史记录
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearHistory}
                className="text-muted-foreground hover:text-destructive"
              >
                清空全部
              </Button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {promptHistory.map((historyPrompt, index) => (
                <div
                  key={index}
                  className="group flex items-start gap-3 p-3 rounded-lg bg-muted hover:bg-muted/70 transition-colors"
                >
                  <p className="flex-1 text-sm leading-relaxed">{historyPrompt}</p>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFillPrompt(historyPrompt)}
                      className="h-8 text-xs"
                    >
                      使用
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteHistory(index)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* AI Assistant Component */}
      <SunoAssistant onFillPrompt={handleFillPrompt} />
    </div>
  );
};

export default SunoDemo;
