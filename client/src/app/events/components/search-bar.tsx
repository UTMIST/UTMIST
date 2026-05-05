interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search for events" }: SearchBarProps) {
  return (
    <div className="relative">
      {/* Search input */}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 pr-10 rounded-lg border-2 border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:border-blue-500 focus:outline-none placeholder:text-[var(--muted-foreground)]"
      />
      {/* Search icon */}
      <svg
        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
} 
