'use client';

import { useState } from 'react';
import { ActionGroup } from './ActionsList';

interface CopyButtonsProps {
  groups: ActionGroup[];
}

export default function CopyButtons({ groups }: CopyButtonsProps) {
  const [copied, setCopied] = useState<'text' | 'markdown' | null>(null);

  const generatePlainText = () => {
    return groups.map(group => {
      const header = group.title ? `${group.title.toUpperCase()}\n` : '';
      const items = group.items.map(item => `☐ ${item.text}`).join('\n');
      return header + items;
    }).join('\n\n');
  };

  const generateMarkdown = () => {
    return groups.map(group => {
      const header = group.title ? `## ${group.title}\n` : '';
      const items = group.items.map(item => `- [ ] ${item.text}`).join('\n');
      return header + items;
    }).join('\n\n');
  };

  const copyToClipboard = async (type: 'text' | 'markdown') => {
    const content = type === 'text' ? generatePlainText() : generateMarkdown();
    try {
      await navigator.clipboard.writeText(content);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (groups.length === 0) return null;

  return (
    <div className="flex gap-3 flex-wrap">
      <button
        onClick={() => copyToClipboard('text')}
        className="actio-button-secondary"
      >
        {copied === 'text' ? 'Copied!' : 'Copy as text'}
      </button>
      <button
        onClick={() => copyToClipboard('markdown')}
        className="actio-button-secondary"
      >
        {copied === 'markdown' ? 'Copied!' : 'Copy as Markdown'}
      </button>
    </div>
  );
}
