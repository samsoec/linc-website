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
import type { FooterSection, SocialLink as SocialLinkType } from "@/types/generated";

interface FooterProps {
  logoUrl: string | null;
  logoText: string | null;
  holdingLogoUrl?: string | null;
  holdingLogoText?: string | null;
  footerLinks?: FooterSection[];
  socialLinks: SocialLinkType[];
  socialLinkText?: string;
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
  holdingLogoText,
  footerLinks = [],
  socialLinks,
  socialLinkText,
  about,
  copyright,
}: FooterProps) {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12 lg:mb-16">
          {/* Dynamic Footer Sections */}
          {footerLinks.map((section, index) => (
            section.links && section.links.length > 0 && (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-4 lg:mb-6">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <FooterLink key={linkIndex} url={link.url} text={link.text} />
                  ))}
                </ul>
              </div>
            )
          ))}
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
                  className="h-16 w-auto brightness-0 invert"
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
                <span className="text-white font-medium">{holdingLogoText}</span>
                <Image
                  src={holdingLogoUrl}
                  alt="Holding Company"
                  width={120}
                  height={40}
                  className="h-10 w-auto brightness-0 invert"
                />
              </div>
            )}
          </div>

          {/* Right Side - Social & Copyright */}
          <div className="lg:text-right">
            {/* Follow Us */}
            {socialLinks.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4">{socialLinkText || "Follow Us On"}</h4>
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
