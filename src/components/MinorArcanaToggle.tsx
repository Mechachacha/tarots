import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface MinorArcanaToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const MinorArcanaToggle = forwardRef<HTMLInputElement, MinorArcanaToggleProps>(
  ({ checked, onChange, ...props }, ref) => {
    return (
      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            id="useMinorArcana"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="w-5 h-5 text-tarot-purple border-white/30 rounded focus:ring-2 focus:ring-tarot-purple focus:ring-offset-2 focus:ring-offset-tarot-surface accent-tarot-purple"
            {...props}
          />
          <span className="text-tarot-light font-medium">小アルカナを使用する（78枚）</span>
          <span className="text-sm text-tarot-text-muted ml-auto">
            {checked ? 'ON' : 'OFF（大アルカナのみ 22枚）'}
          </span>
        </label>
        <p className="mt-2 text-sm text-tarot-text">
          チェックOFFの場合、大アルカナ22枚のみで占います
        </p>
      </div>
    );
  }
);

MinorArcanaToggle.displayName = 'MinorArcanaToggle';

export default MinorArcanaToggle;