"use client";
import Link from "next/link";
import Image from "next/image";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaTiktok,
  FaTwitter,
  FaGlobe,
} from "react-icons/fa";
import type { ChildLink, SocialLink as SocialLinkType, Category, Service } from "@/types/generated";

interface FooterProps {
  logoUrl: string | null;
  logoText: string | null;
  holdingLogoUrl?: string | null;
  menuLinks: ChildLink[];
  aboutLinks?: ChildLink[];
  services?: Service[];
  categoryLinks?: Category[];
  socialLinks: SocialLinkType[];
  about?: string;
  copyright?: string;
}

function FooterLink({ url, text }: { url: string; text: string }) {
  return (
    <li>
      <Link href={url} className="text-gray-300 hover:text-white transition-colors duration-200">
        {text}
      </Link>
    </li>
  );
}

function RenderSocialIcon({ social }: { social: string | undefined }) {
  const iconClass = "w-5 h-5";
  switch (social) {
    case "INSTAGRAM":
      return <FaInstagram className={iconClass} />;
    case "FACEBOOK":
      return <FaFacebookF className={iconClass} />;
    case "LINKEDIN":
      return <FaLinkedinIn className={iconClass} />;
    case "YOUTUBE":
      return <FaYoutube className={iconClass} />;
    case "TIKTOK":
      return <FaTiktok className={iconClass} />;
    case "TWITTER":
      return <FaTwitter className={iconClass} />;
    default:
      return <FaGlobe className={iconClass} />;
  }
}

export default function Footer({
  logoUrl,
  logoText,
  holdingLogoUrl,
  menuLinks,
  aboutLinks = [],
  services = [],
  categoryLinks = [],
  socialLinks,
  about,
  copyright,
}: FooterProps) {
  // Build the "Updates" links from categories (News, Events, CSR, etc.)
  const updatesLinks = categoryLinks.map((cat) => ({
    text: cat.name,
    url: `/blog/${cat.slug}`,
  }));

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12 lg:mb-16">
          {/* Column 1: Linc Group / Main Menu */}
          {menuLinks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 lg:mb-6">Linc Group</h3>
              <ul className="space-y-3">
                {menuLinks.map((link, index) => (
                  <FooterLink key={index} url={link.url} text={link.text} />
                ))}
              </ul>
            </div>
          )}

          {/* Column 2: Services */}
          {services.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 lg:mb-6">Services</h3>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <FooterLink
                    key={index}
                    url={`/services/${service.name.toLowerCase().replace(/\s+/g, "-")}`}
                    text={service.name}
                  />
                ))}
              </ul>
            </div>
          )}

          {/* Column 3: About */}
          {aboutLinks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 lg:mb-6">About</h3>
              <ul className="space-y-3">
                {aboutLinks.map((link, index) => (
                  <FooterLink key={index} url={link.url} text={link.text} />
                ))}
              </ul>
            </div>
          )}

          {/* Column 4: Updates */}
          {updatesLinks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 lg:mb-6">Updates</h3>
              <ul className="space-y-3">
                {updatesLinks.map((link, index) => (
                  <FooterLink key={index} url={link.url} text={link.text || ""} />
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - Logo and Description */}
          <div>
            {/* Logo */}
            {logoUrl && (
              <div className="mb-6">
                <Image
                  src={logoUrl}
                  alt={logoText || "Linc Group"}
                  width={140}
                  height={50}
                  className="h-12 w-auto"
                />
              </div>
            )}

            {/* Description */}
            {about && (
              <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-lg">{about}</p>
            )}

            {/* Part Of Section */}
            {holdingLogoUrl && (
              <div className="flex items-center gap-4">
                <span className="text-white font-medium">Part Of</span>
                <div className="p-0.5 bg-white rounded-sm">
                  <Image
                    src={holdingLogoUrl}
                    alt="Holding Company"
                    width={120}
                    height={40}
                    className="h-10 w-auto"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Social & Copyright */}
          <div className="lg:text-right">
            {/* Follow Us */}
            {socialLinks.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4">Follow Us On</h4>
                <div className="flex gap-3 lg:justify-end">
                  {socialLinks.map((link) => (
                    <a
                      key={link.id}
                      rel="noopener noreferrer"
                      href={link.url}
                      title={link.text}
                      target={link.newTab ? "_blank" : "_self"}
                      className="flex items-center justify-center w-10 h-10 rounded-md bg-accent-dark text-white hover:bg-accent transition-colors duration-200"
                    >
                      <RenderSocialIcon social={link.social} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Copyright */}
            {copyright && <p className="text-gray-500 text-sm">{copyright}</p>}
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 pt-8 border-t border-dashed border-gray-700" />
      </div>
    </footer>
  );
}
