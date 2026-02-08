"use client";
import { useSearch } from "./SearchContext";

export default function GlobalSearch() {
  const { keyword, setKeyword } = useSearch();

  return (
    <input
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      placeholder="Search device / label / value"
      className="w-full px-3 py-2 border rounded-lg mb-6"
    />
  );
}
