"use client";
import { createContext, useContext, useState } from "react";

type SearchCtx = {
  keyword: string;
  setKeyword: (v: string) => void;
};

const SearchContext = createContext<SearchCtx | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [keyword, setKeyword] = useState("");
  return (
    <SearchContext.Provider value={{ keyword, setKeyword }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be inside SearchProvider");
  return ctx;
}
