import { useState } from 'react';
import type { DrawResultItem } from '../types';
import { generatePromptText } from '../lib/promptText';

interface ShareButtonsProps {
  question: string;
  items: DrawResultItem[];
  onShareTwitter: (text: string) => void;
  onCopyShare: (text: string) => void;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({
  question,
  items,
  onShareTwitter,
}) => {
  const [copied, setCopied] = useState(false);

  const promptText = generatePromptText(question, items);

  const handleCopyShare = async () => {
    const url = window.location.href;
    const shareText = `${promptText}\n\n${url}`;
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="flex flex-wrap gap-3 pt-4 border-t border-tarot-dark/10" role="group" aria-label="シェアオプション">
      <button
        type="button"
        onClick={handleCopyShare}
        className={`btn-secondary flex-1 sm:flex-none ${copied ? 'bg-tarot-gold border-tarot-gold' : ''}`}
        aria-label={copied ? 'コピー済み' : '結果とURLをコピー'}
      >
        {copied ? 'コピー済み' : '結果＋URLをコピー'}
      </button>
      <button
        type="button"
        onClick={() => onShareTwitter(promptText)}
        className="btn bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90 flex-1 sm:flex-none"
        aria-label="X(Twitter)でシェア"
      >
        <svg className="w-5 h-5 inline-block mr-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
        </svg>
        Xでシェア
      </button>
    </div>
  );
};

export default ShareButtons;