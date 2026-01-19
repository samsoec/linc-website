"use client";

import { createContext, useContext } from "react";
import type { Dictionary, DictionaryPath } from "@/types/dictionary";
import { getNestedValue } from "@/types/dictionary";

interface DictionaryContextType {
  dict: Dictionary;
  lang: string;
}

const DictionaryContext = createContext<DictionaryContextType | undefined>(undefined);

export function DictionaryProvider({
  children,
  dict,
  lang,
}: {
  children: React.ReactNode;
  dict: Dictionary;
  lang: string;
}) {
  return (
    <DictionaryContext.Provider value={{ dict, lang }}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const context = useContext(DictionaryContext);
  
  if (!context) {
    throw new Error("useDictionary must be used within DictionaryProvider");
  }

  const t = (path: DictionaryPath): string => {
    const value = getNestedValue(context.dict, path as string);
    
    if (typeof value !== 'string') {
      console.warn(`Translation not found for path: ${path}`);
      return path as string;
    }
    
    return value;
  };

  return { t, lang: context.lang };
}
