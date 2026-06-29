import { useState, useRef } from 'react';
import type { DrawResultItem } from '../types';
import { generatePromptText } from '../lib/promptText';

interface AiPromptBoxProps {
  question: string;
  items: DrawResultItem[];
  onCopy: (text: string) => void;
}

const AiPromptBox: React.FC<AiPromptBoxProps> = ({ question, items, onCopy }) => {
  const [isOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const promptText = generatePromptText(question, items);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      onCopy(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      if (textareaRef.current) {
        textareaRef.current.select();
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <details className="mb-6 group" open={isOpen}>
      <summary className="flex items-center justify-between cursor-pointer p-4 bg-white/5 rounded-lg list-none">
        <span className="font-medium text-tarot-light flex items-center gap-2">
          <svg className="w-5 h-5 text-tarot-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          AIに聞くプロンプト
        </span>
        <svg
          className={`w-5 h-5 text-tarot-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="mt-4 p-4 bg-white/5 rounded-lg animate-fade-in">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={promptText}
            readOnly
            className="input font-mono text-sm h-48"
            aria-label="AIプロンプトテキスト"
          />
          <button
            type="button"
            onClick={handleCopy}
            className={`absolute top-2 right-2 px-3 py-1 text-xs rounded transition-all ${
              copied
                ? 'bg-tarot-gold text-tarot-dark'
                : 'bg-tarot-purple text-white hover:bg-tarot-purple/90'
            }`}
            aria-label={copied ? 'コピー済み' : 'クリップボードにコピー'}
          >
            {copied ? 'コピー済み' : 'コピー'}
          </button>
        </div>
        <p className="text-xs text-tarot-text-muted mt-2">
          このテキストをコピーして、ChatGPTやClaudeなどのAIに貼り付けて解釈を聞いてみましょう
        </p>
      </div>
    </details>
  );
};

export default AiPromptBox;