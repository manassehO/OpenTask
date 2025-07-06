import { useEffect, useRef, useState } from 'react';
import { debounce } from '~/lib/debounce';
import { IoIosSearch } from 'react-icons/io';

type SearchInputProps = {
  onSearch: (query: string) => void;
};

export function Search({ onSearch }: SearchInputProps) {
  const [query, setQuery] = useState('');

  const debouncedSearch = useRef(
    debounce((val: string) => {
      onSearch(val);
    }, 300),
  ).current;

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  return (
    <div className="relative w-full items-center overflow-hidden rounded-lg bg-neutral-100 px-4 shadow-sm">
      <input
        type="text"
        className="h-full w-full bg-neutral-100 py-3 pl-7 text-sm placeholder-black-50 outline-none"
        placeholder="Search Submissions"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <IoIosSearch
        size={20}
        strokeWidth={10}
        className="absolute top-1/2 -translate-y-1/2 text-grey"
      />
    </div>
  );
}
