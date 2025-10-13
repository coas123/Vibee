import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, X, Copy } from "lucide-react";
import { toast } from "sonner";

interface SunoAssistantProps {
  onFillPrompt: (prompt: string) => void;
}

const SunoAssistant = ({ onFillPrompt }: SunoAssistantProps) => {
  const [showButton, setShowButton] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

  const prompts = [
    "一首融合了BLACKPINK的强劲节拍和F1引擎轰鸣感的电子舞曲",
    "带有《星期三》哥特式诡异氛围的K-POP流行歌曲",
    "太空氛围的Lofi Hip-Hop，融合星际旅行的梦幻感",
    "赛博朋克风格的电子音乐，带有未来感的合成器音色",
    "融合古典钢琴和现代电子节拍的实验性流行音乐"
  ];

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      // Only show for TEXTAREA elements (not INPUT) and only calculate position once
      if (target.tagName === "TEXTAREA" && !showButton && !showPopup) {
        const rect = target.getBoundingClientRect();
        setButtonPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
        setShowButton(true);
      }
    };

    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "TEXTAREA") {
        // Delay hiding to allow clicking the button
        setTimeout(() => {
          if (!showPopup) {
            setShowButton(false);
          }
        }, 200);
      }
    };

    document.addEventListener("focusin", handleFocus);
    document.addEventListener("focusout", handleBlur);

    return () => {
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("focusout", handleBlur);
    };
  }, [showButton, showPopup]);

  const handleFillPrompt = (prompt: string) => {
    onFillPrompt(prompt);
    toast.success("提示词已填入！");
  };

  const handleClose = () => {
    setShowPopup(false);
    setShowButton(false);
  };

  return (
    <>
      {/* Floating Button */}
      {showButton && !showPopup && (
        <div
          className="fixed z-50 animate-scale-in"
          style={{
            left: `${buttonPosition.x}px`,
            top: `${buttonPosition.y}px`,
            transform: "translate(-50%, -50%)"
          }}
        >
          <button
            onClick={() => setShowPopup(true)}
            className="w-8 h-8 rounded-full bg-gradient-primary shadow-glow-primary hover:scale-110 transition-all duration-300 flex items-center justify-center animate-pulse-glow"
          >
            <Sparkles className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* Popup Window */}
      {showPopup && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
            onClick={handleClose}
          />
          
          {/* Popup Card */}
          <div className="fixed z-50 animate-scale-in left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Card className="w-96 max-w-[calc(100vw-2rem)] bg-card border-primary/50 shadow-glow-primary">
              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">AI 创作助手</h3>
                      <p className="text-sm text-muted-foreground">
                        根据您最近的音乐品味，为您生成以下 Suno 创作灵感：
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={handleClose}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Prompts List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {prompts.map((prompt, index) => (
                    <div
                      key={index}
                      className="group p-3 rounded-lg bg-muted hover:bg-muted/70 transition-colors border border-border hover:border-primary/50"
                    >
                      <p className="text-sm mb-2 leading-relaxed">{prompt}</p>
                      <Button
                        variant="hero"
                        size="sm"
                        className="w-full"
                        onClick={() => handleFillPrompt(prompt)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        一键填入
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </>
  );
};

export default SunoAssistant;
