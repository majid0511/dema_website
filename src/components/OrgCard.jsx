import BorderGlow from './BorderGlow';
import MemberCard from './MemberCard';
import { siteConfig } from '../config/siteConfig';

/**
 * OrgCard Component
 * Wraps MemberCard with BorderGlow effect
 * Colors are configurable via siteConfig.borderGlow
 */
export default function OrgCard({ member, variant = 'default' }) {
  const glowConfig = siteConfig.borderGlow;
  const config = glowConfig.variants[variant] || glowConfig.variants.default;

  return (
    <BorderGlow
      className="h-full"
      edgeSensitivity={config.edgeSensitivity}
      glowColor={config.glowColor}
      backgroundColor={config.backgroundColor}
      borderRadius={config.borderRadius}
      glowRadius={config.glowRadius}
      glowIntensity={config.glowIntensity}
      coneSpread={config.coneSpread}
      animated={config.animated}
      colors={config.colors}
      fillOpacity={config.fillOpacity}
    >
      <MemberCard member={member} />
    </BorderGlow>
  );
}
