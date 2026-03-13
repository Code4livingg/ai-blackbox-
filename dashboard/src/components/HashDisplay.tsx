import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface HashDisplayProps {
  hash: string;
  label?: string;
  truncate?: boolean;
}

export default function HashDisplay({ hash, label, truncate = true }: HashDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayHash = truncate ? `${hash.slice(0, 16)}...${hash.slice(-8)}` : hash;

  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-slate-400 text-sm font-medium">{label}:</span>}
      <code className="bg-slate-950 px-3 py-1.5 rounded-lg text-sm text-blue-400 font-mono border border-slate-800">
        {displayHash}
      </code>
      <button
        onClick={handleCopy}
        className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
        title="Copy full hash"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-slate-400 hover:text-slate-300" />
        )}
      </button>
    </div>
  );
}
