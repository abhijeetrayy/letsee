"use client";
import React, { createContext, useState, useContext } from "react";

interface SearchContextType {
  isSearchLoading: boolean;
  setIsSearchLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  return (
    <SearchContext.Provider value={{ isSearchLoading, setIsSearchLoading }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch(): SearchContextType {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
