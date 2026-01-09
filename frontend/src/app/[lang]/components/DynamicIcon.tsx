import * as HIcons from '@heroicons/react/24/solid';
import * as HIconsOutline from '@heroicons/react/24/outline';

export type KeyIcon = keyof typeof HIcons;

interface DynamicHeroIconProps {
  iconName: keyof typeof HIcons;
  className?: string;
  variant?: 'solid' | 'outline';
}

export const DynamicHeroIcon = ({ iconName, variant = 'outline', ...props }: DynamicHeroIconProps) => {
  const TheIcon = variant === 'outline' ? HIconsOutline[iconName] : HIcons[iconName];
  if (!TheIcon) return null;
  return <TheIcon {...props} />;
};
