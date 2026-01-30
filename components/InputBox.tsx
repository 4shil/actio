'use client';

import { useState, useEffect } from 'react';

interface InputBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string | null;
}

const MAX_CHARS = 6000;

export default function InputBox({ value, onChange, onSubmit, isLoading, error }: InputBoxProps) {
  const [charCount, setCharCount] = useState(0);
  
  useEffect(() => {
    setCharCount(value.length);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_CHARS) {
      onChange(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && value.trim() && !isLoading) {
      onSubmit();
    }
  };

  const isOverLimit = charCount > MAX_CHARS * 0.95;
  const isEmpty = value.trim().length === 0;

  return (
    <div className="space-y-3">
      <textarea
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Paste instructions here... (email, notice, form, webpage text)"
        className="actio-input min-h-[200px] md:min-h-[250px]"
        disabled={isLoading}
        aria-label="Instructions input"
      />
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className={`${isOverLimit ? 'actio-error' : 'text-[var(--muted)]'}`}>
            {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
          </span>
          {isOverLimit && (
            <span className="actio-error">Text too long. Please shorten it.</span>
          )}
        </div>
        <span className="text-[var(--muted)] hidden md:block">
          Ctrl+Enter to submit
        </span>
      </div>

      {error && (
        <p className="actio-error text-sm">{error}</p>
      )}

      <button
        onClick={onSubmit}
        disabled={isEmpty || isLoading || isOverLimit}
        className="actio-button w-full"
        aria-busy={isLoading}
      >
        {isLoading ? 'Extracting actions...' : 'Make actions'}
      </button>

      {isEmpty && !error && (
        <p className="text-[var(--muted)] text-sm text-center">
          Paste instructions to continue.
        </p>
      )}
    </div>
  );
}
