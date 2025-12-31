"use client";

import { useState } from "react";
import { Button } from "@ggprompts/ui";
import { AlertTriangle, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function CrisisButton() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCrisis = async () => {
    setIsGenerating(true);

    // Pretend to do something for dramatic effect
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsGenerating(false);

    // Show the satirical toast
    toast.success("Crisis averted!", {
      description: "There was no crisis. We just wanted you to feel productive.",
      icon: <Check className="h-4 w-4" />,
      duration: 5000,
    });
  };

  return (
    <Button
      variant="outline"
      onClick={handleGenerateCrisis}
      disabled={isGenerating}
      className="glass border-yellow-400/30 hover:border-yellow-400/50 hover:bg-yellow-400/10 text-yellow-400"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Generating Crisis...
        </>
      ) : (
        <>
          <AlertTriangle className="h-4 w-4 mr-2" />
          Generate Random Crisis
        </>
      )}
    </Button>
  );
}
