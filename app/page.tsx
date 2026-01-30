'use client';

import { useState } from 'react';
import InputBox from '@/components/InputBox';
import ActionsList, { ActionGroup } from '@/components/ActionsList';
import CopyButtons from '@/components/CopyButtons';
import StrictToggle from '@/components/StrictToggle';

export default function Home() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<ActionGroup[]>([]);
  const [strictMode, setStrictMode] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);
    setGroups([]);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, strictMode })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Couldn't extract actions. Try again.");
        return;
      }

      if (data.groups && Array.isArray(data.groups)) {
        setGroups(data.groups);
      } else {
        setError("Couldn't extract clear actions. Try simplifying the text.");
      }
    } catch (err) {
      console.error(err);
      setError("Couldn't extract actions. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInput('');
    setGroups([]);
    setError(null);
  };

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Actio
          </h1>
          <p className="text-[var(--muted)]">
            Paste instructions. Get actions.
          </p>
        </header>

        {/* Input Section */}
        <div className="actio-card">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <StrictToggle isStrict={strictMode} onChange={setStrictMode} />
            </div>
            <InputBox
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>

        {/* Output Section */}
        {groups.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Your actions</h2>
              <div className="flex gap-3">
                <CopyButtons groups={groups} />
                <button
                  onClick={handleReset}
                  className="actio-button-secondary"
                >
                  Clear
                </button>
              </div>
            </div>
            <ActionsList groups={groups} />
          </div>
        )}

        {/* Privacy Notice */}
        <footer className="text-center text-sm text-[var(--muted)]">
          <p>Your text is processed and immediately discarded.</p>
        </footer>
      </div>
    </main>
  );
}
