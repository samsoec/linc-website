"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Dialog } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect, useRef, useMemo } from "react";
import Button from "./Button";
import SearchBar from "./SearchBar";
import type { Link as LinkType, ButtonLink } from "@/types/generated";
import { useNavbarTheme } from "../contexts/NavbarThemeContext";
import { fetchAPI } from "../utils/fetch-api";

/**
 * Custom hook to check if a link is active by comparing paths
 * Handles language prefix stripping for proper comparison
 */
function useActiveLink() {
  const pathname = usePathname();

  // Extract the path without the language prefix (e.g., /en/about -> /about)
  const pathWithoutLang = useMemo(() => {
    // Match patterns like /en, /id, /en-US, etc.
    const langPrefixMatch = pathname.match(/^\/[a-z]{2}(-[a-zA-Z]{2,})?/);
    if (langPrefixMatch) {
      const stripped = pathname.slice(langPrefixMatch[0].length);
      return stripped || "/";
    }
    return pathname;
  }, [pathname]);

  // Get current language from path
  const currentLang = useMemo(() => {
    const langMatch = pathname.match(/^\/([a-z]{2}(-[a-zA-Z]{2,})?)/);
    return langMatch ? langMatch[1] : null;
  }, [pathname]);

  /**
   * Check if a given URL matches the current path
   * @param url - The URL to check (without language prefix)
   * @returns boolean indicating if the link is active
   */
  const isActive = (url: string): boolean => {
    if (!url) return false;
    
    // Normalize the URL (remove trailing slash for comparison)
    const normalizedUrl = url === "/" ? "/" : url.replace(/\/$/, "");
    const normalizedPath = pathWithoutLang === "/" ? "/" : pathWithoutLang.replace(/\/$/, "");

    // Exact match
    if (normalizedUrl === normalizedPath) return true;

    // For non-root URLs, check if current path starts with the URL (for nested routes)
    if (normalizedUrl !== "/" && normalizedPath.startsWith(normalizedUrl + "/")) {
      return true;
    }

    return false;
  };

  /**
   * Check if a given language code matches the current language
   * @param langCode - The language code to check
   * @returns boolean indicating if the language is active
   */
  const isActiveLanguage = (langCode: string): boolean => {
    return currentLang === langCode;
  };

  return { isActive, isActiveLanguage, pathWithoutLang, currentLang };
}

interface Locale {
  id: number;
  name: string;
  code: string;
}

interface NavbarProps {
  links: LinkType[];
  logoUrl: string | null;
  logoText: string | null;
  button?: ButtonLink;
  enableSearch: boolean;
  enableI18n: boolean;
  currentLocale: string;
}

interface NavLinkProps extends LinkType {
  isScrolled: boolean;
}

interface MobileNavLinkProps extends LinkType {
  closeMenu: () => void;
}

interface LanguageSelectorProps {
  currentLocale: string;
  isScrolled: boolean;
}

interface MobileLanguageSelectorProps {
  currentLocale: string;
  closeMenu: () => void;
}

function LanguageSelector({ currentLocale, isScrolled }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [locales, setLocales] = useState<Locale[]>([]);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const { theme } = useNavbarTheme();
  const { isActiveLanguage, pathWithoutLang } = useActiveLink();
  const isWhiteMode = theme === "white" || (theme === "default" && isScrolled);

  useEffect(() => {
    async function fetchLocales() {
      try {
        const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
        const options = { headers: { Authorization: `Bearer ${token}` } };
        const response = await fetchAPI("/i18n/locales", {}, options);
        setLocales(response || []);
      } catch (error) {
        console.error("Error fetching locales:", error);
      }
    }
    fetchLocales();
  }, []);

  const currentLocaleData = locales.find((locale) => locale.code === currentLocale);
  const otherLocales = locales.filter((locale) => locale.code !== currentLocale);

  if (locales.length === 0 || otherLocales.length === 0) return null;

  return (
    <li
      ref={dropdownRef}
      className="relative flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={`flex items-center gap-1 p-2 text-sm font-medium transition-colors duration-300 ${
          isWhiteMode ? "text-accent" : "text-white hover:text-gray-200"
        }`}
      >
        {currentLocaleData?.code.toUpperCase() || currentLocale.toUpperCase()}
        <ChevronDownIcon
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 pt-2 w-48 z-50">
          <div className="rounded-lg bg-white shadow-lg ring-1 ring-black/5 py-2">
            {locales.map((locale) => (
              <Link
                key={locale.id}
                href={`/${locale.code}${pathWithoutLang}`}
                className={`block px-4 py-2 text-sm hover:bg-gray-100 hover:text-accent ${
                  isActiveLanguage(locale.code) ? "text-accent font-semibold" : "text-gray-700"
                }`}
              >
                {locale.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </li>
  );
}

function MobileLanguageSelector({ closeMenu }: MobileLanguageSelectorProps) {
  const [locales, setLocales] = useState<Locale[]>([]);
  const { isActiveLanguage, pathWithoutLang } = useActiveLink();

  useEffect(() => {
    async function fetchLocales() {
      try {
        const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
        const options = { headers: { Authorization: `Bearer ${token}` } };
        const response = await fetchAPI("/i18n/locales", {}, options);
        setLocales(response || []);
      } catch (error) {
        console.error("Error fetching locales:", error);
      }
    }
    fetchLocales();
  }, []);

  if (locales.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-4 py-4">
      {locales.map((locale) => (
        <Link
          key={locale.id}
          href={`/${locale.code}${pathWithoutLang}`}
          onClick={closeMenu}
          className={`text-xs font-medium transition-colors ${
            isActiveLanguage(locale.code)
              ? "text-accent bg-white px-2 py-1 rounded"
              : "text-white/60 hover:text-white"
          }`}
        >
          {locale.name}
        </Link>
      ))}
    </div>
  );
}

function NavLink({ url, text, children, isScrolled }: NavLinkProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const hasChildren = children && children.length > 0;
  const { theme } = useNavbarTheme();
  const { isActive } = useActiveLink();
  const isWhiteMode = theme === "white" || (theme === "default" && isScrolled);
  const active = isActive(url);

  // Determine link styles based on mode and active state
  const getLinkClasses = (isActiveLink: boolean) => {
    if (isWhiteMode) {
      // White background: active = accent color
      return isActiveLink
        ? "text-accent font-semibold"
        : "text-gray-900 hover:text-accent";
    }
    // Transparent background: no active state styling
    return "text-white hover:text-gray-200";
  };

  if (hasChildren) {
    return (
      <li
        ref={dropdownRef}
        className="relative flex items-center"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Link
          href={url}
          className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-300 ${getLinkClasses(active)}`}
        >
          {text}
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </Link>
        {isOpen && (
          <div className="absolute top-full left-0 pt-2 w-48 z-50">
            <div className="rounded-lg bg-white shadow-lg ring-1 ring-black/5 py-2">
              {children.map((child) => (
                <Link
                  key={child.id}
                  href={child.url}
                  className={`block px-4 py-2 text-sm hover:bg-gray-100 hover:text-accent ${
                    isActive(child.url) ? "text-accent font-semibold" : "text-gray-700"
                  }`}
                >
                  {child.text}
                </Link>
              ))}
            </div>
          </div>
        )}
      </li>
    );
  }

  return (
    <li className="flex items-center">
      <Link
        href={url}
        className={`px-3 py-2 text-sm font-medium transition-colors duration-300 ${getLinkClasses(active)}`}
      >
        {text}
      </Link>
    </li>
  );
}

function MobileNavLink({ url, text, children, closeMenu }: MobileNavLinkProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = children && children.length > 0;
  const { isActive } = useActiveLink();
  const active = isActive(url);

  // Mobile menu has accent background, so active = white bg with accent text
  const getMobileLinkClasses = (isActiveLink: boolean) => {
    return isActiveLink
      ? "bg-white/20 text-white"
      : "text-white hover:bg-white/10";
  };

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <div className={`flex w-full items-center justify-between rounded-lg ${active ? "bg-white/20" : ""}`}>
          <Link
            href={url}
            onClick={closeMenu}
            className="flex-1 px-3 py-2 text-base font-semibold text-white"
          >
            {text}
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-2"
            aria-label={`Toggle ${text} submenu`}
          >
            <ChevronDownIcon
              className={`h-5 w-5 transition-transform duration-200 text-white ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
        {isOpen && (
          <div className="ml-4 space-y-1">
            {children.map((child) => (
              <Link
                key={child.id}
                href={child.url}
                onClick={closeMenu}
                className={`block rounded-lg px-3 py-2 text-sm ${
                  isActive(child.url)
                    ? "bg-white/20 text-white font-semibold"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {child.text}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={url}
      onClick={closeMenu}
      className={`block rounded-lg px-3 py-2 text-base font-semibold ${getMobileLinkClasses(active)}`}
    >
      {text}
    </Link>
  );
}

export default function Navbar({
  links,
  logoUrl,
  logoText,
  button,
  enableSearch,
  enableI18n,
  currentLocale,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { theme } = useNavbarTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchOpen]);

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  // Determine colors based on theme and scroll state
  const isWhiteMode = theme === "white" || (theme === "default" && isScrolled);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isWhiteMode ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:justify-normal lg:h-20 lg:gap-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              {logoUrl && (
                <Image
                  src={logoUrl}
                  alt={logoText || "Logo"}
                  width={100}
                  height={40}
                  className={`h-16 w-auto transition-all duration-300 ${
                    isWhiteMode ? "" : "brightness-0 invert"
                  }`}
                />
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1 lg:flex-1">
            <ul className="flex items-center gap-1">
              {links.map((item) => (
                <NavLink key={item.id} {...item} isScrolled={isScrolled} />
              ))}
            </ul>
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden lg:flex lg:items-center lg:gap-2">
            {/* Search */}
            {enableSearch && (
              <div ref={searchRef} className="relative">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={`flex items-center gap-1 p-2 transition-colors duration-300 ${
                    isWhiteMode
                      ? "text-gray-900 hover:text-accent"
                      : "text-white hover:text-gray-200"
                  }`}
                  aria-label="Search"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Search</span>
                </button>
                {searchOpen && (
                  <div className="absolute top-full right-0 pt-2 w-80 z-50">
                    <div className="rounded-lg bg-white shadow-lg ring-1 ring-black/5 p-4">
                      <SearchBar size="small" navigateTo="/blog" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CTA Button */}
            {button && (
              <Button
                as="link"
                href={button.url || "#"}
                target={button.newTab ? "_blank" : undefined}
                type={button.type}
                color={isWhiteMode ? "accent" : "secondary"}
                size="md"
                className="shadow-sm"
              >
                {button.text}
              </Button>
            )}

            {/* Language Selector */}
            <ul className="flex items-center">
              {enableI18n && (
                <LanguageSelector currentLocale={currentLocale} isScrolled={isScrolled} />
              )}
            </ul>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className={`lg:hidden p-2 rounded-md transition-all duration-300 text-gray-900 ${
              isWhiteMode ? "text-gray-900" : "text-gray-900 bg-white rounded-md"
            }`}
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" />
        <Dialog.Panel className="fixed flex flex-col inset-y-0 right-0 z-50 w-full h-svh overflow-y-auto bg-accent px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5" onClick={closeMenu}>
              <span className="sr-only">{logoText || "Home"}</span>
              {logoUrl && (
                <Image
                  src={logoUrl}
                  alt={logoText || "Logo"}
                  width={100}
                  height={40}
                  className="h-12 w-auto invert brightness-0"
                />
              )}
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-900 bg-white"
              onClick={closeMenu}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 flex flex-col justify-between flex-1">
            <div>
              <div className="py-6 space-y-4">
                {enableSearch && <SearchBar size="small" navigateTo="/blog" />}
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                {links.map((item) => (
                  <MobileNavLink key={item.id} closeMenu={closeMenu} {...item} />
                ))}
              </div>
            </div>

            <div>
              {/* CTA Button */}
              {button && (
                <Button
                  as="link"
                  href={button.url || "#"}
                  target={button.newTab ? "_blank" : undefined}
                  onClick={closeMenu}
                  type={button.type}
                  color="secondary"
                  size="lg"
                  fullWidth
                  className="shadow-sm"
                >
                  {button.text}
                </Button>
              )}
              {/* Language & Search */}
              <div className="space-y-4 pt-4">
                {enableI18n && (
                  <MobileLanguageSelector currentLocale={currentLocale} closeMenu={closeMenu} />
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
