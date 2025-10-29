import React from 'react';
import { Search } from 'lucide-react';

interface Props {
  query: string;
  onChange: (v: string) => void;
}

export default function SearchBar({ query, onChange }: Props) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search programs and items..."
            value={query}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:border-[#1b4c2e] focus:ring-2 focus:ring-[#1b4c2e]/20 outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );
}
