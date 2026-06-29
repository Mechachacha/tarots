import { useState } from 'react';
import type { DrawResultItem } from '../types';
import { generatePromptText } from '../lib/promptText';

interface ShareButtonsProps {
  question: string;
  items: DrawResultItem[];
  onCopyShare: (text: string) => void;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({
  question,
  items,
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
    <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10" role="group" aria-label="シェアオプション">
      <button
        type="button"
        onClick={handleCopyShare}
        className={`btn-secondary flex-1 sm:flex-none ${copied ? 'bg-tarot-gold border-tarot-gold' : ''}`}
        aria-label={copied ? 'コピー済み' : '結果とURLをコピー'}
      >
        {copied ? 'コピー済み' : '結果＋URLをコピー'}
      </button>
    </div>
  );
};

export default ShareButtons;