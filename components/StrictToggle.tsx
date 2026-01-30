'use client';

interface StrictToggleProps {
  isStrict: boolean;
  onChange: (value: boolean) => void;
}

export default function StrictToggle({ isStrict, onChange }: StrictToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(!isStrict)}
        className={`relative w-12 h-6 rounded-full border-2 border-[var(--border)] transition-colors ${
          isStrict ? 'bg-[var(--accent)]' : 'bg-white'
        }`}
        role="switch"
        aria-checked={isStrict}
        aria-label="Strict mode"
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-[var(--border)] transition-transform ${
            isStrict ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </button>
      <div>
        <span className="font-medium text-sm">Strict mode</span>
        <p className="text-xs text-[var(--muted)]">
          {isStrict ? 'Only explicitly stated actions' : 'Includes implied actions'}
        </p>
      </div>
    </div>
  );
}
