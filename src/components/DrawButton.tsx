import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface DrawButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'disabled'> {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const DrawButton = forwardRef<HTMLButtonElement, DrawButtonProps>(
  ({ onClick, disabled = false, isLoading = false, children = '占う', ...props }, ref) => {
    return (
      <div className="flex justify-center mt-6">
        <button
          ref={ref}
          type="button"
          onClick={onClick}
          disabled={disabled || isLoading}
          className="btn-primary w-full sm:w-64 lg:w-80 text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          {...props}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              占い中...
            </span>
          ) : (
            children
          )}
        </button>
      </div>
    );
  }
);

DrawButton.displayName = 'DrawButton';

export default DrawButton;