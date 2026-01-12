"use client";

import { useEffect } from "react";
import { useNavbarTheme, type NavbarTheme } from "../contexts/NavbarThemeContext";

interface NavbarThemeSetterProps {
  theme: NavbarTheme;
}

export default function NavbarThemeSetter({ theme }: NavbarThemeSetterProps) {
  const { setTheme } = useNavbarTheme();

  useEffect(() => {
    setTheme(theme);

    console.log(`Navbar theme set to: ${theme}`);

    // Reset to default when component unmounts
    return () => setTheme("default");
  }, [theme, setTheme]);

  return null;
}
