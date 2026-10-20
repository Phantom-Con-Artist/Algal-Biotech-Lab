import type { CSSProperties } from 'react';
import { cn } from '../../utils/cn';
import { CENTER, DEPTH_WIDTH, growTrunks, VIEW } from './organism/tendrils';

/**
 * A culture under stress, drawn as a metaball organism. The body is circles merged by an SVG "goo" filter, with a
 * specular pass for a wet, gel-like sheen; its lobes strain apart and snap back. From it, branching proboscides grow
 * out in every direction and retract, each revealed by its own expanding mask. Colours follow the pigments the lab
 * studies: chlorophyll at the body, phycocyanin teal along the branches, carotenoid gold at the tips.
 * Transforms only; held half-grown under reduced motion.
 */
const BODY = [
  { cx: 474, cy: 488, r: 76, anim: 'lobe-a' },
  { cx: 530, cy: 516, r: 70, anim: 'lobe-b' },
  { cx: 500, cy: 500, r: 52, anim: 'lobe-c' },
  { cx: 438, cy: 552, r: 34, anim: 'lobe-d' },
  { cx: 566, cy: 446, r: 30, anim: 'lobe-e' },
];

const TRUNKS = growTrunks();

/** Each trunk grows, holds and retracts on its own clock, so something is always reaching out. */
const timing = (i: number): CSSProperties => ({
  animationDuration: `${11 + (i % 4) * 1.5}s`,
  animationDelay: `${-((i * 3.7) % 13).toFixed(1)}s`,
});

export function LiquidBlobs({ className }: { className?: string }) {
  return (
    <svg viewBox={`0 0 ${VIEW} ${VIEW}`} aria-hidden="true" focusable="false" className={cn('liquid pointer-events-none select-none', className)}>
      <defs>
        <filter id="slime" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 34 -14" result="goo" />
          <feGaussianBlur in="goo" stdDeviation="5" result="bump" />
          <feSpecularLighting in="bump" surfaceScale="6" specularConstant="0.85" specularExponent="26" lightingColor="#f4fbe9" result="spec">
            <fePointLight x="400" y="330" z="200" />
          </feSpecularLighting>
          <feComposite in="spec" in2="goo" operator="in" result="sheen" />
          <feComposite in="goo" in2="sheen" operator="arithmetic" k1="0" k2="1" k3="0.6" k4="0" />
        </filter>

        <radialGradient id="chlorophyll" gradientUnits="userSpaceOnUse" cx={CENTER} cy={CENTER} r="140" fx="470" fy="460">
          <stop offset="0" stopColor="#175a3a" />
          <stop offset="0.45" stopColor="#2f8a52" />
          <stop offset="0.8" stopColor="#5aa86a" />
          <stop offset="1" stopColor="#3f9a96" />
        </radialGradient>

        <radialGradient id="branch" gradientUnits="userSpaceOnUse" cx={CENTER} cy={CENTER} r={CENTER}>
          <stop offset="0.08" stopColor="#24774c" />
          <stop offset="0.3" stopColor="#3a9a86" />
          <stop offset="0.55" stopColor="#7fb8a8" />
          <stop offset="0.8" stopColor="#c6c98a" />
          <stop offset="1" stopColor="#e2b443" />
        </radialGradient>

        {/* Soft-edged disc: as it scales up, it uncovers a trunk from the body outward, like a growth front. */}
        <radialGradient id="growth-front">
          <stop offset="0.82" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        {TRUNKS.map((_, i) => (
          <mask key={i} id={`reach-${i}`} maskUnits="userSpaceOnUse" x="0" y="0" width={VIEW} height={VIEW}>
            <circle cx={CENTER} cy={CENTER} r={CENTER} fill="url(#growth-front)" className="evert" style={timing(i)} />
          </mask>
        ))}
      </defs>

      <g fill="none" stroke="url(#branch)" strokeLinecap="round" strokeLinejoin="round">
        {TRUNKS.map((trunk, i) => (
          <g key={i} mask={`url(#reach-${i})`}>
            <g className="sway" style={{ animationDelay: `${-i * 1.3}s` }}>
              {trunk.paths.map((d, depth) => d && <path key={depth} d={d} strokeWidth={DEPTH_WIDTH[depth]} />)}
            </g>
          </g>
        ))}
      </g>

      <g filter="url(#slime)" fill="url(#chlorophyll)">
        {BODY.map((b) => (
          <circle key={b.anim} cx={b.cx} cy={b.cy} r={b.r} className={`liquid-blob ${b.anim}`} />
        ))}
      </g>
    </svg>
  );
}
