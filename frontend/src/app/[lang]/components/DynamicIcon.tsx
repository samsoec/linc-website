import * as HIcons from "@heroicons/react/24/solid";
import * as HIconsOutline from "@heroicons/react/24/outline";
import * as FaIcons from "react-icons/fa";

export type KeyIcon = keyof typeof HIcons | keyof typeof FaIcons;

interface DynamicHeroIconProps {
  iconName: string;
  className?: string;
  variant?: "solid" | "outline";
  library?: "hero" | "fa";
}

export const DynamicHeroIcon = ({
  iconName,
  variant = "outline",
  library = "hero",
  ...props
}: DynamicHeroIconProps) => {
  if (library === "fa") {
    const TheIcon = FaIcons[iconName as keyof typeof FaIcons];
    if (!TheIcon) return null;
    return <TheIcon {...props} />;
  }

  // Default to Heroicons
  const TheIcon =
    variant === "outline"
      ? HIconsOutline[iconName as keyof typeof HIconsOutline]
      : HIcons[iconName as keyof typeof HIcons];
  if (!TheIcon) return null;
  return <TheIcon {...props} />;
};
