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
import { useState, useEffect, useRef } from "react";
import Button from "./Button";
import type { Link as LinkType, ButtonLink } from "@/types/generated";
import { useNavbarTheme } from "../contexts/NavbarThemeContext";

interface NavbarProps {
  links: LinkType[];
  logoUrl: string | null;
  logoText: string | null;
  button?: ButtonLink;
  enableSearch: boolean;
  enableI18n: boolean;
}

interface NavLinkProps extends LinkType {
  isScrolled: boolean;
}

interface MobileNavLinkProps extends LinkType {
  closeMenu: () => void;
}

function NavLink({ url, text, children, isScrolled }: NavLinkProps) {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const hasChildren = children && children.length > 0;
  const { theme } = useNavbarTheme();
  const isWhiteMode = theme === "white" || (theme === "default" && isScrolled);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (hasChildren) {
    return (
      <li ref={dropdownRef} className="relative flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-300 ${
            isWhiteMode ? "text-gray-900 hover:text-gray-600" : "text-white hover:text-gray-200"
          }`}
        >
          {text}
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black/5 z-50">
            <div className="py-2">
              {children.map((child) => (
                <Link
                  key={child.id}
                  href={child.url}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
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
        className={`px-3 py-2 text-sm font-medium transition-colors duration-300 ${
          isWhiteMode
            ? `text-gray-900 hover:text-gray-600 ${path === url ? "text-gray-900 font-semibold" : ""}`
            : `text-white hover:text-gray-200 ${path === url ? "text-white font-semibold" : ""}`
        }`}
      >
        {text}
      </Link>
    </li>
  );
}

function MobileNavLink({ url, text, children, closeMenu }: MobileNavLinkProps) {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = children && children.length > 0;

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-100 ${
            path === url ? "bg-gray-100" : ""
          }`}
        >
          {text}
          <ChevronDownIcon
            className={`h-5 w-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
        {isOpen && (
          <div className="ml-4 space-y-1">
            {children.map((child) => (
              <Link
                key={child.id}
                href={child.url}
                onClick={closeMenu}
                className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
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
      className={`block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-100 ${
        path === url ? "bg-gray-100" : ""
      }`}
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
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme } = useNavbarTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              {logoUrl && (
                <Image
                  src={logoUrl}
                  alt={logoText || "Logo"}
                  width={100}
                  height={40}
                  className={`h-8 w-auto`}
                />
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            <ul className="flex items-center gap-1">
              {links.map((item) => (
                <NavLink key={item.id} {...item} isScrolled={isScrolled} />
              ))}
            </ul>
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            {/* Language Selector */}
            {enableI18n && (
              <button
                className={`flex items-center gap-1 text-sm font-medium transition-colors duration-300 ${
                  isWhiteMode ? "text-gray-900" : "text-white"
                }`}
              >
                <ChevronDownIcon className="h-4 w-4" />
                EN
              </button>
            )}

            {/* Search */}
            {enableSearch && (
              <button
                className={`flex items-center gap-1 p-2 transition-colors duration-300 ${
                  isWhiteMode
                    ? "text-gray-900 hover:text-gray-600"
                    : "text-white hover:text-gray-200"
                }`}
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Search</span>
              </button>
            )}

            {/* CTA Button */}
            {button && (
              <Button
                as="link"
                href={button.url || "#"}
                target={button.newTab ? "_blank" : undefined}
                type={button.type}
                color={isWhiteMode ? "primary" : "secondary"}
                size="md"
                className="shadow-sm"
              >
                {button.text}
              </Button>
            )}
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
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5" onClick={closeMenu}>
              <span className="sr-only">{logoText || "Home"}</span>
              {logoUrl && (
                <Image
                  src={logoUrl}
                  alt={logoText || "Logo"}
                  width={100}
                  height={40}
                  className="h-8 w-auto"
                />
              )}
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={closeMenu}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-200">
              {/* Navigation Links */}
              <div className="space-y-1 py-6">
                {links.map((item) => (
                  <MobileNavLink key={item.id} closeMenu={closeMenu} {...item} />
                ))}
              </div>

              {/* Language & Search */}
              <div className="py-6 space-y-4">
                {enableI18n && (
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-100">
                    <ChevronDownIcon className="h-5 w-5" />
                    EN - English
                  </button>
                )}
                {enableSearch && (
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-100">
                    <MagnifyingGlassIcon className="h-5 w-5" />
                    Search
                  </button>
                )}
              </div>

              {/* CTA Button */}
              {button && (
                <div className="py-6">
                  <Button
                    as="link"
                    href={button.url || "#"}
                    target={button.newTab ? "_blank" : undefined}
                    onClick={closeMenu}
                    type={button.type}
                    color="primary"
                    size="lg"
                    fullWidth
                    className="shadow-sm"
                  >
                    {button.text}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
