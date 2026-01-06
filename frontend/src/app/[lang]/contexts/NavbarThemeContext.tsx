"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type NavbarTheme = "default" | "white" | "transparent";

interface NavbarThemeContextType {
  theme: NavbarTheme;
  setTheme: (theme: NavbarTheme) => void;
}

const NavbarThemeContext = createContext<NavbarThemeContextType | undefined>(undefined);

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
  if (context === undefined) {
    throw new Error("useNavbarTheme must be used within a NavbarThemeProvider");
  }
  return context;
}
