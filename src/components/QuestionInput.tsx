import type { TextareaHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface QuestionInputProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const QuestionInput = forwardRef<HTMLTextAreaElement, QuestionInputProps>(
  ({ value, onChange, placeholder = '占いたいことを入力してください（任意）', ...props }, ref) => {
    return (
      <div className="mb-6">
        <label htmlFor="question" className="label">
          質問 <span className="text-tarot-dark/40 text-sm font-normal">（任意）</span>
        </label>
        <textarea
          ref={ref}
          id="question"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="input resize-none"
          {...props}
        />
      </div>
    );
  }
);

QuestionInput.displayName = 'QuestionInput';

export default QuestionInput;