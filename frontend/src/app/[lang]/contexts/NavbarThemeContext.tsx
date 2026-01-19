"use client";

import React, { createContext, useContext, useState } from "react";

export type NavbarTheme = "default" | "white" | "transparent";

interface NavbarThemeContextType {
  theme: NavbarTheme;
  setTheme: (theme: NavbarTheme) => void;
}

// Create context with a default value to handle SSR/SSG
const defaultContextValue: NavbarThemeContextType = {
  theme: "default",
  setTheme: () => {}, // No-op during SSR
};

const NavbarThemeContext = createContext<NavbarThemeContextType>(defaultContextValue);

export function NavbarThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<NavbarTheme>("default");

  return (
    <NavbarThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </NavbarThemeContext.Provider>
  );
}

export function useNavbarTheme() {
  const context = useContext(NavbarThemeContext);
  return context;
}
