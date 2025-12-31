'use client';

import { useState } from 'react';
import { ComponentDefinition } from '@/lib/component-registry';
import { Customization } from '@/types/customization';
import { generateClaudePrompt } from '@/lib/ai-targets/claude';
import { Button } from '@/components/ui/button';
import {
  Wand2,
  Copy,
  Check,
  Download,
  ExternalLink,
} from 'lucide-react';

type ExportMenuProps = {
  component: ComponentDefinition | null;
  customization: Customization;
};

export function ExportMenu({ component, customization }: ExportMenuProps) {
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!component) return;
    const prompt = generateClaudePrompt(component, customization);
    setGeneratedPrompt(prompt);
  };

  const handleCopy = async () => {
    if (!generatedPrompt) return;
    await navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedPrompt || !component) return;
    const blob = new Blob([generatedPrompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${component.id}-prompt.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900/50 border-t border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div>
          <h3 className="font-bold">Generate Prompt</h3>
          <p className="text-xs text-white/60">
            Export to Claude or other AI assistants
          </p>
        </div>
        <Button
          onClick={handleGenerate}
          disabled={!component}
          className="gap-2 bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-emerald-500/50"
        >
          <Wand2 className="w-4 h-4" />
          Generate
        </Button>
      </div>

      {/* Generated Prompt */}
      {generatedPrompt ? (
        <div className="flex-1 flex flex-col p-4">
          {/* Actions */}
          <div className="flex gap-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-2 border-white/20 bg-transparent text-white hover:text-white hover:bg-white/10"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="gap-2 border-white/20 bg-transparent text-white hover:text-white hover:bg-white/10"
            >
              <Download className="w-3 h-3" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://claude.ai/new', '_blank')}
              className="gap-2 border-white/20 bg-transparent text-white hover:text-white hover:bg-white/10"
            >
              <ExternalLink className="w-3 h-3" />
              Open Claude
            </Button>
          </div>

          {/* Prompt Preview */}
          <div className="flex-1 overflow-auto">
            <pre className="p-4 rounded-lg bg-white/5 border border-white/10 text-xs font-mono whitespace-pre-wrap text-white/80">
              {generatedPrompt}
            </pre>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-white/40">
          <div className="text-center">
            <Wand2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">
              {component
                ? 'Click Generate to create your prompt'
                : 'Select a component first'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
