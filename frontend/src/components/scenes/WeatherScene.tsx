import React from 'react';
import { GeoLocation } from '../../types/location';
import { getCitySceneryType, SceneryType } from '../../utils/cityTheme';
import { getMoonPhase } from '../../utils/moonPhase';

export type ThemeType =
  | 'clear-day'
  | 'clear-night'
  | 'cloudy-day'
  | 'cloudy-night'
  | 'rain'
  | 'thunderstorm'
  | 'snow'
  | 'fog';

interface WeatherSceneProps {
  themeType: ThemeType;
  location?: GeoLocation | null;
  isDay?: boolean;
}

/* ─────────────────────────────────────────────────────────────
 * SVG FILTERS & COMMON DEFS
 * ──────────────────────────────────────────────────────────── */
const CommonDefs: React.FC = () => (
  <svg className="absolute w-0 h-0" aria-hidden="true">
    <defs>
      {/* Soft celestial halo blur */}
      <filter id="celestialGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Warm window light glow */}
      <filter id="windowGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Moon crater gradient */}
      <radialGradient id="moonSurface" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="65%" stopColor="#f3f4f6" />
        <stop offset="100%" stopColor="#e5e7eb" />
      </radialGradient>

      {/* Sun radiant gradient */}
      <radialGradient id="sunSurface" cx="45%" cy="45%" r="55%">
        <stop offset="0%" stopColor="#fffbeb" />
        <stop offset="50%" stopColor="#fde047" />
        <stop offset="100%" stopColor="#f59e0b" />
      </radialGradient>

      {/* Beam light gradient for lighthouse */}
      <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="80%">
        <stop offset="0%" stopColor="rgba(254,240,138,0.7)" />
        <stop offset="50%" stopColor="rgba(254,240,138,0.25)" />
        <stop offset="100%" stopColor="rgba(254,240,138,0)" />
      </linearGradient>
    </defs>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
 * CELESTIAL BODY (Moon or Sun)
 * Positioned on the left/mid-left as in reference design
 * ──────────────────────────────────────────────────────────── */
interface CelestialProps {
  isDay: boolean;
  location?: GeoLocation | null;
}

const CelestialBody: React.FC<CelestialProps> = ({ isDay, location }) => {
  if (isDay) {
    return (
      <div
        className="absolute pointer-events-none transition-all duration-1000"
        style={{
          left: '12%',
          top: '46%',
          width: 90,
          height: 90,
          filter: 'drop-shadow(0 0 38px rgba(251, 191, 36, 0.75))',
        }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 90 90" className="w-full h-full animate-float">
          {/* Outer Sun halo */}
          <circle cx="45" cy="45" r="42" fill="#fbbf24" opacity="0.18" filter="url(#celestialGlow)" />
          {/* Main Sun disk */}
          <circle cx="45" cy="45" r="32" fill="url(#sunSurface)" />
        </svg>
      </div>
    );
  }

  // Night: Real astronomical moon phase calculated for this location & date
  const moonInfo = getMoonPhase(location);
  const { phaseType, phaseLabel, illumination, svgPath, isSouthernHemisphere } = moonInfo;

  return (
    <div
      className="absolute pointer-events-none transition-all duration-1000"
      style={{
        left: '14%',
        top: '48%',
        width: 82,
        height: 82,
        filter: illumination > 5 ? 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.85))' : 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.25))',
      }}
      aria-hidden="true"
      title={`${phaseLabel} (${illumination}% illuminated)`}
    >
      <svg
        viewBox="0 0 82 82"
        className="w-full h-full animate-float"
        style={isSouthernHemisphere ? { transform: 'scale(-1, 1)', transformOrigin: '41px 41px' } : undefined}
      >
        <defs>
          {phaseType !== 'new' && (
            <clipPath id="moonPhaseClip">
              <path d={svgPath} />
            </clipPath>
          )}
        </defs>

        {/* 1. Unlit dark moon sphere (Earthshine silhouette) */}
        <circle
          cx="41"
          cy="41"
          r="30"
          fill="#0a1526"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="0.8"
          opacity="0.65"
        />

        {/* 2. Unlit subtle craters */}
        <circle cx="33" cy="35" r="4.5" fill="#030814" opacity="0.45" />
        <circle cx="47" cy="44" r="3.2" fill="#030814" opacity="0.35" />
        <circle cx="38" cy="48" r="2.2" fill="#030814" opacity="0.35" />

        {/* 3. Illuminated portion based on phase (Crescent / Half / Gibbous / Full) */}
        {phaseType !== 'new' && (
          <>
            {/* Soft glowing halo behind the illuminated phase */}
            <path
              d={svgPath}
              fill="#ffffff"
              opacity="0.25"
              filter="url(#celestialGlow)"
            />

            {/* Lit lunar surface */}
            <path
              d={svgPath}
              fill="url(#moonSurface)"
            />

            {/* Lit craters clipped to the illuminated crescent/phase */}
            <g clipPath="url(#moonPhaseClip)">
              <circle cx="33" cy="35" r="4.5" fill="#d1d5db" opacity="0.5" />
              <circle cx="47" cy="44" r="3.2" fill="#d1d5db" opacity="0.4" />
              <circle cx="38" cy="48" r="2.2" fill="#d1d5db" opacity="0.35" />
            </g>
          </>
        )}

        {/* Subtle rim for New Moon */}
        {phaseType === 'new' && (
          <circle
            cx="41"
            cy="41"
            r="30"
            fill="none"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="1"
            strokeDasharray="4 2"
          />
        )}
      </svg>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
 * STARS & SHOOTING STAR (Night)
 * ──────────────────────────────────────────────────────────── */
const StarsLayer: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
    <svg className="w-full h-full">
      {[
        [6, 8, 1.2, 0], [12, 14, 1.6, 0.5], [18, 6, 1.0, 1.2], [26, 18, 1.5, 0.8],
        [34, 10, 1.0, 1.7], [42, 15, 1.8, 0.2], [49, 7, 1.2, 2.1], [58, 20, 1.4, 1.4],
        [66, 9, 1.6, 0.6], [75, 14, 1.0, 1.9], [83, 7, 1.7, 0.3], [91, 16, 1.2, 1.1],
        [9, 28, 1.3, 1.6], [22, 32, 1.0, 0.7], [37, 26, 1.5, 2.3], [52, 34, 1.1, 0.4],
        [68, 28, 1.4, 1.8], [82, 32, 1.2, 0.9], [94, 25, 1.5, 1.3], [15, 42, 1.0, 2.0],
        [46, 42, 1.3, 0.5], [78, 40, 1.2, 1.5], [88, 38, 1.0, 0.8]
      ].map(([x, y, r, delay], idx) => (
        <circle
          key={idx}
          cx={`${x}%`}
          cy={`${y}%`}
          r={r}
          fill="#ffffff"
          opacity={0.7}
          style={{
            animation: `twinkle ${2.5 + (idx % 3) * 0.8}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </svg>

    {/* Occasional shooting star streak */}
    <div
      className="absolute"
      style={{
        top: '16%',
        right: '25%',
        height: '1.5px',
        background: 'linear-gradient(to left, rgba(255,255,255,0), rgba(255,255,255,0.95))',
        animation: 'shootingStar 14s ease-in-out infinite',
        animationDelay: '3s',
      }}
    />
  </div>
);

/* ─────────────────────────────────────────────────────────────
 * BIRDS IN FLIGHT (Day & Twilight & Reference image)
 * ──────────────────────────────────────────────────────────── */
const BirdsLayer: React.FC<{ isDay: boolean }> = ({ isDay }) => {
  const strokeColor = isDay ? 'rgba(30, 41, 59, 0.55)' : 'rgba(226, 232, 240, 0.65)';
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <svg className="w-full h-full">
        {[
          { y: 28, delay: '0s', dur: '24s', scale: 1 },
          { y: 34, delay: '-9s', dur: '28s', scale: 0.8 },
          { y: 25, delay: '-16s', dur: '22s', scale: 0.9 },
        ].map((b, i) => (
          <g
            key={i}
            style={{
              animation: `birdFly ${b.dur} linear infinite`,
              animationDelay: b.delay,
              transform: `translateY(${b.y}vh) scale(${b.scale})`,
            }}
          >
            <path
              d="M0,0 Q5,-5 10,0 Q15,-5 20,0"
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
 * DRIFTING CLOUDS
 * ──────────────────────────────────────────────────────────── */
const DriftingClouds: React.FC<{ isDay: boolean; opacity?: number }> = ({ isDay, opacity = 0.75 }) => {
  const cloudFill = isDay ? 'rgba(255, 255, 255, 0.85)' : 'rgba(30, 50, 85, 0.65)';
  const highlightFill = isDay ? 'rgba(255, 255, 255, 0.95)' : 'rgba(45, 70, 115, 0.6)';

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity }} aria-hidden="true">
      <svg className="w-full h-full">
        {/* Cloud Puff 1 */}
        <g style={{ animation: 'drift 34s linear infinite' }}>
          <ellipse cx="26%" cy="24%" rx="14%" ry="6%" fill={cloudFill} />
          <ellipse cx="26%" cy="23%" rx="10%" ry="4.5%" fill={highlightFill} />
        </g>
        {/* Cloud Puff 2 */}
        <g style={{ animation: 'drift 42s linear infinite', animationDelay: '-14s' }}>
          <ellipse cx="68%" cy="19%" rx="16%" ry="6.5%" fill={cloudFill} />
          <ellipse cx="68%" cy="18%" rx="11%" ry="5%" fill={highlightFill} />
        </g>
        {/* Small background puff */}
        <g style={{ animation: 'drift 50s linear infinite', animationDelay: '-26s' }}>
          <ellipse cx="88%" cy="28%" rx="10%" ry="4%" fill={cloudFill} opacity="0.6" />
        </g>
      </svg>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
 * WEATHER OVERLAYS (Rain, Snow, Lightning, Fog)
 * ──────────────────────────────────────────────────────────── */
const WeatherOverlays: React.FC<{ themeType: ThemeType }> = ({ themeType }) => {
  if (themeType === 'rain' || themeType === 'thunderstorm') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Diagonal rain streaks */}
        <svg className="w-full h-full">
          {Array.from({ length: 45 }).map((_, i) => (
            <line
              key={i}
              x1={`${(i * 2.3) % 100}%`}
              y1="-6%"
              x2={`${((i * 2.3) + 1.2) % 100}%`}
              y2="16%"
              stroke="rgba(147, 210, 255, 0.45)"
              strokeWidth="1.2"
              strokeLinecap="round"
              style={{
                animation: `rainFall ${0.65 + (i % 4) * 0.12}s linear infinite`,
                animationDelay: `${(i * 0.07) % 0.8}s`,
              }}
            />
          ))}
        </svg>

        {/* Soft, calming sheet lightning for thunderstorm (non-distracting, soothing) */}
        {themeType === 'thunderstorm' && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 60% 30%, rgba(220, 210, 255, 0.28), transparent 70%)',
              animation: 'lightning 6s ease-in-out infinite',
            }}
          />
        )}
      </div>
    );
  }

  if (themeType === 'snow') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg className="w-full h-full">
          {Array.from({ length: 36 }).map((_, i) => {
            const size = 3 + (i % 4) * 1.5;
            return (
              <circle
                key={i}
                cx={`${(i * 2.9) % 100}%`}
                cy={`${(i * 3.4) % 95}%`}
                r={size / 2}
                fill="#ffffff"
                opacity={0.6 + (i % 3) * 0.15}
                style={{
                  animation: `snowDrift ${4.5 + (i % 4)}s ease-in-out infinite`,
                  animationDelay: `${(i * 0.3) % 4}s`,
                }}
              />
            );
          })}
        </svg>
      </div>
    );
  }

  if (themeType === 'fog') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[20, 36, 52, 68].map((y, idx) => (
          <div
            key={idx}
            className="absolute left-0 w-full"
            style={{
              top: `${y}%`,
              height: '14%',
              background: 'rgba(255, 255, 255, 0.18)',
              filter: 'blur(16px)',
              animation: `drift ${18 + idx * 6}s ease-in-out infinite alternate`,
              animationDelay: `${idx * 2}s`,
            }}
          />
        ))}
      </div>
    );
  }

  return null;
};

/* ─────────────────────────────────────────────────────────────
 * SCENERY 1: WINDMILL ARCHETYPE (Bhopal / Default / Reference Image)
 * Exact match to user's uploaded screenshot:
 * - Windmill with 3 warm yellow square windows & rotating lattice sails
 * - Rolling hills silhouette
 * - Flat-top savanna/acacia trees
 * ──────────────────────────────────────────────────────────── */
const WindmillScenery: React.FC<{ isDay: boolean }> = ({ isDay }) => {
  const hillColorFar = isDay ? '#1e4d2b' : '#081729';
  const hillColorNear = isDay ? '#14361e' : '#050f1d';
  const towerColor = isDay ? '#2b2c30' : '#0b1626';
  const sailColor = isDay ? '#1f2024' : '#081220';
  const treeColor = isDay ? '#0e2615' : '#040b14';
  const windowFill = isDay ? '#fef08a' : '#facc15';

  return (
    <div className="absolute inset-x-0 bottom-0 h-[48%] pointer-events-none" aria-hidden="true">
      <svg viewBox="0 0 1000 480" preserveAspectRatio="none" className="w-full h-full">
        {/* Distant Rolling Hills */}
        <path
          d="M0,480 L0,260 Q250,140 520,240 Q760,320 1000,210 L1000,480 Z"
          fill={hillColorFar}
          opacity="0.95"
        />

        {/* Foreground Rolling Hills */}
        <path
          d="M0,480 L0,320 Q200,240 440,290 Q680,340 1000,270 L1000,480 Z"
          fill={hillColorNear}
        />

        {/* Acacia / Flat-top Savanna Trees (like reference image) */}
        {[
          { x: 120, y: 355, s: 0.9 },
          { x: 190, y: 345, s: 1.1 },
          { x: 260, y: 350, s: 0.85 },
          { x: 400, y: 335, s: 1.0 },
          { x: 470, y: 340, s: 1.25 },
          { x: 540, y: 350, s: 0.9 },
          { x: 920, y: 320, s: 1.0 },
          { x: 970, y: 330, s: 0.8 },
        ].map((t, idx) => (
          <g key={idx} transform={`translate(${t.x}, ${t.y}) scale(${t.s})`}>
            {/* Trunk with slight lean */}
            <path d="M0,0 Q-2,-20 -6,-38 L0,-38 Q2,-20 3,0 Z" fill={treeColor} />
            <path d="M-2,-22 Q-8,-32 -16,-38 L-13,-40 Q-5,-32 0,-24 Z" fill={treeColor} />
            <path d="M1,-20 Q8,-30 14,-36 L17,-34 Q9,-28 3,-20 Z" fill={treeColor} />
            {/* Flat-top Acacia Foliage Canopy */}
            <ellipse cx="-16" cy="-42" rx="18" ry="7" fill={treeColor} />
            <ellipse cx="-2" cy="-45" rx="26" ry="9" fill={treeColor} />
            <ellipse cx="14" cy="-40" rx="16" ry="6" fill={treeColor} />
          </g>
        ))}

        {/* Iconic Windmill — positioned on the right hill as in reference image */}
        <g transform="translate(760, 310)">
          {/* Base foundation */}
          <rect x="-42" y="5" width="84" height="20" rx="4" fill={towerColor} />

          {/* Tower (tapered trapezoid) */}
          <polygon points="-36,10 36,10 24,-150 -24,-150" fill={towerColor} stroke="#040912" strokeWidth="2" />

          {/* Windmill Cap / Roof */}
          <path d="M-28,-150 L28,-150 L18,-185 L-18,-185 Z" fill={sailColor} />
          <circle cx="0" cy="-186" r="3" fill={sailColor} />

          {/* 3 Stacked Warm Glowing Yellow Windows (exact match to screenshot) */}
          {[
            { y: -30, w: 16, h: 18 },
            { y: -72, w: 14, h: 16 },
            { y: -112, w: 12, h: 14 },
          ].map((win, i) => (
            <g key={i} filter="url(#windowGlow)">
              <rect
                x={-win.w / 2}
                y={win.y}
                width={win.w}
                height={win.h}
                rx="2"
                fill={windowFill}
                stroke="#d97706"
                strokeWidth="1.5"
              />
              {/* Window mullion grid */}
              <line x1={0} y1={win.y} x2={0} y2={win.y + win.h} stroke="#78350f" strokeWidth="1" />
              <line x1={-win.w / 2} y1={win.y + win.h / 2} x2={win.w / 2} y2={win.y + win.h / 2} stroke="#78350f" strokeWidth="1" />
            </g>
          ))}

          {/* Windmill Rotor Hub */}
          <circle cx="0" cy="-166" r="8" fill={sailColor} stroke="#040912" strokeWidth="2" />

          {/* Rotating Windmill Lattice Sails */}
          <g
            style={{
              transformOrigin: '0px -166px',
              animation: 'spin 18s linear infinite',
            }}
          >
            {[0, 90, 180, 270].map((angle) => (
              <g key={angle} transform={`rotate(${angle} 0 -166)`}>
                {/* Main spar beam */}
                <line x1="0" y1="-166" x2="0" y2="-285" stroke={sailColor} strokeWidth="4.5" strokeLinecap="round" />
                {/* Lattice sail fabric & bars */}
                <rect x="4" y="-278" width="22" height="100" fill={sailColor} opacity="0.88" rx="2" />
                <line x1="4" y1="-260" x2="26" y2="-260" stroke="#040912" strokeWidth="1.2" />
                <line x1="4" y1="-240" x2="26" y2="-240" stroke="#040912" strokeWidth="1.2" />
                <line x1="4" y1="-220" x2="26" y2="-220" stroke="#040912" strokeWidth="1.2" />
                <line x1="4" y1="-200" x2="26" y2="-200" stroke="#040912" strokeWidth="1.2" />
              </g>
            ))}
          </g>
          {/* Front axle cap */}
          <circle cx="0" cy="-166" r="4.5" fill="#facc15" />
        </g>
      </svg>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
 * SCENERY 2: METROPOLITAN SKYLINE (New York, Tokyo, London, Delhi...)
 * ──────────────────────────────────────────────────────────── */
const SkylineScenery: React.FC<{ isDay: boolean }> = ({ isDay }) => {
  const bgSkyline = isDay ? '#334155' : '#081424';
  const fgSkyline = isDay ? '#1e293b' : '#040b14';
  const windowColor = isDay ? '#fef08a' : '#fde047';

  return (
    <div className="absolute inset-x-0 bottom-0 h-[48%] pointer-events-none" aria-hidden="true">
      <svg viewBox="0 0 1000 480" preserveAspectRatio="none" className="w-full h-full">
        {/* Background Building Layer */}
        <g fill={bgSkyline} opacity="0.75">
          <rect x="80" y="180" width="70" height="300" />
          <rect x="170" y="140" width="85" height="340" />
          <polygon points="212,80 215,140 210,140" />
          <rect x="280" y="190" width="60" height="290" />
          <rect x="370" y="120" width="90" height="360" />
          <rect x="490" y="170" width="75" height="310" />
          <rect x="680" y="110" width="95" height="370" />
          <polygon points="727,45 730,110 725,110" />
          <rect x="800" y="160" width="80" height="320" />
          <rect x="900" y="200" width="65" height="280" />
        </g>

        {/* Foreground Building Layer with Spire & Windows */}
        <g fill={fgSkyline}>
          <rect x="20" y="240" width="80" height="240" />
          <rect x="130" y="210" width="65" height="270" />
          <rect x="220" y="160" width="90" height="320" />
          <rect x="330" y="230" width="80" height="250" />
          <rect x="440" y="190" width="85" height="290" />
          <rect x="550" y="220" width="75" height="260" />

          {/* Main Landmark Spire Tower on the Right */}
          <rect x="690" y="150" width="90" height="330" />
          <polygon points="690,150 780,150 745,100 725,100" />
          {/* Radio antenna */}
          <line x1="735" y1="100" x2="735" y2="40" stroke={fgSkyline} strokeWidth="3" />
          {/* Subtle slow blinking warning light at top */}
          <circle cx="735" cy="40" r="3.5" fill="#ef4444" className="animate-pulseGlow" />

          <rect x="810" y="220" width="75" height="260" />
          <rect x="910" y="250" width="80" height="230" />
        </g>

        {/* Warm Lit Windows Matrix in Towers */}
        <g fill={windowColor} filter="url(#windowGlow)">
          {[
            // Tower 1
            [235, 185], [255, 185], [275, 185],
            [235, 215], [275, 215],
            [255, 245], [275, 245],
            [235, 280], [255, 280],
            // Tower 2
            [460, 220], [480, 220], [500, 220],
            [460, 255], [500, 255],
            [480, 290],
            // Main Spire Tower
            [710, 180], [735, 180], [760, 180],
            [710, 215], [760, 215],
            [735, 250], [760, 250],
            [710, 290], [735, 290], [760, 290],
            [710, 330], [735, 330],
            // Far Right
            [830, 245], [860, 245],
            [830, 280], [860, 280],
          ].map(([x, y], idx) => (
            <rect key={idx} x={x} y={y} width="8" height="12" rx="1.5" opacity="0.9" />
          ))}
        </g>

        {/* Waterfront / Ground base reflection */}
        <rect x="0" y="450" width="1000" height="30" fill={isDay ? '#0f172a' : '#020617'} />
      </svg>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
 * SCENERY 3: ALPINE MOUNTAINS (Zurich, Kathmandu, Denver, Shimla...)
 * ──────────────────────────────────────────────────────────── */
const MountainScenery: React.FC<{ isDay: boolean }> = ({ isDay }) => {
  const peakFar = isDay ? '#3b556e' : '#0c1b2e';
  const peakNear = isDay ? '#203445' : '#071220';
  const groundColor = isDay ? '#172836' : '#040b14';
  const pineColor = isDay ? '#0e1c26' : '#03080e';

  return (
    <div className="absolute inset-x-0 bottom-0 h-[48%] pointer-events-none" aria-hidden="true">
      <svg viewBox="0 0 1000 480" preserveAspectRatio="none" className="w-full h-full">
        {/* Distant Mountain Peaks */}
        <polygon points="0,480 0,260 160,110 340,240 500,90 680,260 840,130 1000,240 1000,480" fill={peakFar} />
        {/* Snow caps on distant peaks */}
        <polygon points="160,110 130,140 160,135 190,140" fill="#ffffff" opacity={isDay ? '0.85' : '0.45'} />
        <polygon points="500,90 465,130 500,122 535,130" fill="#ffffff" opacity={isDay ? '0.85' : '0.45'} />
        <polygon points="840,130 810,160 840,152 870,160" fill="#ffffff" opacity={isDay ? '0.85' : '0.45'} />

        {/* Near Mountain Ridge */}
        <polygon points="0,480 0,320 220,180 420,290 640,160 860,300 1000,220 1000,480" fill={peakNear} />

        {/* Alpine Pine Trees */}
        {[
          { x: 80, y: 340, s: 1.1 }, { x: 140, y: 350, s: 0.9 }, { x: 200, y: 345, s: 1.2 },
          { x: 300, y: 355, s: 0.95 }, { x: 480, y: 340, s: 1.15 }, { x: 550, y: 350, s: 0.9 },
          { x: 880, y: 340, s: 1.1 }, { x: 940, y: 350, s: 1.25 }
        ].map((p, idx) => (
          <g key={idx} transform={`translate(${p.x}, ${p.y}) scale(${p.s})`}>
            <polygon points="0,-55 -16,-25 16,-25" fill={pineColor} />
            <polygon points="0,-35 -20,-5 20,-5" fill={pineColor} />
            <polygon points="0,-15 -24,15 24,15" fill={pineColor} />
            <rect x="-3" y="15" width="6" height="12" fill={pineColor} />
          </g>
        ))}

        {/* Cozy Alpine Chalet Cabin on the Right Ridge */}
        <g transform="translate(740, 315)">
          {/* Cabin body */}
          <rect x="-35" y="0" width="70" height="40" fill={groundColor} />
          {/* A-frame pitched roof */}
          <polygon points="-44,0 44,0 0,-32" fill="#02060b" />
          {/* Chimney */}
          <rect x="18" y="-36" width="9" height="18" fill="#02060b" />

          {/* Warm Glowing Window */}
          <g filter="url(#windowGlow)">
            <rect x="-18" y="10" width="16" height="16" rx="2" fill="#fde047" />
            <line x1="-10" y1="10" x2="-10" y2="26" stroke="#78350f" strokeWidth="1" />
            <line x1="-18" y1="18" x2="-2" y2="18" stroke="#78350f" strokeWidth="1" />
          </g>
          {/* Cabin Door */}
          <rect x="8" y="12" width="12" height="28" fill="#02060b" />
        </g>

        {/* Foreground Slope */}
        <path d="M0,480 L0,380 Q320,330 680,370 Q840,390 1000,360 L1000,480 Z" fill={groundColor} />
      </svg>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
 * SCENERY 4: COASTAL / LIGHTHOUSE (Miami, Mumbai, Goa, Sydney...)
 * ──────────────────────────────────────────────────────────── */
const CoastalScenery: React.FC<{ isDay: boolean }> = ({ isDay }) => {
  const waterFar = isDay ? '#1e4b6e' : '#081729';
  const waterNear = isDay ? '#143652' : '#050f1d';
  const cliffColor = isDay ? '#1a2733' : '#050c17';
  const lighthouseColor = isDay ? '#ffffff' : '#f1f5f9';

  return (
    <div className="absolute inset-x-0 bottom-0 h-[48%] pointer-events-none" aria-hidden="true">
      <svg viewBox="0 0 1000 480" preserveAspectRatio="none" className="w-full h-full">
        {/* Distant Sea Horizon */}
        <rect x="0" y="240" width="1000" height="100" fill={waterFar} />

        {/* Gentle Wave Bands */}
        <path d="M0,280 Q250,270 500,280 Q750,290 1000,280 L1000,480 L0,480 Z" fill={waterNear} />
        <path d="M0,320 Q280,310 560,320 Q840,330 1000,320 L1000,480 L0,480 Z" fill={waterNear} opacity="0.9" />

        {/* Coastal Palm Trees on the Left */}
        {[
          { x: 120, y: 330, s: 1.0 },
          { x: 180, y: 340, s: 1.2 },
          { x: 240, y: 350, s: 0.9 },
        ].map((palm, idx) => (
          <g key={idx} transform={`translate(${palm.x}, ${palm.y}) scale(${palm.s})`}>
            {/* Curved trunk */}
            <path d="M0,0 Q12,-35 8,-75 L4,-75 Q6,-35 -4,0 Z" fill={cliffColor} />
            {/* Palm fronds */}
            <path d="M6,-75 Q-20,-85 -40,-70 Q-15,-78 6,-75" fill={cliffColor} />
            <path d="M6,-75 Q2,-95 -12,-100 Q-2,-88 6,-75" fill={cliffColor} />
            <path d="M6,-75 Q24,-96 36,-85 Q20,-88 6,-75" fill={cliffColor} />
            <path d="M6,-75 Q38,-78 48,-62 Q28,-72 6,-75" fill={cliffColor} />
          </g>
        ))}

        {/* Rocky Promontory on the Right */}
        <path d="M620,480 L620,310 Q740,280 880,290 Q940,270 1000,300 L1000,480 Z" fill={cliffColor} />

        {/* Coastal Lighthouse on Cliff */}
        <g transform="translate(840, 285)">
          {/* Base */}
          <rect x="-24" y="-10" width="48" height="15" fill="#0f172a" rx="2" />
          {/* Tapered Tower */}
          <polygon points="-18,-10 18,-10 12,-110 -12,-110" fill={lighthouseColor} />
          {/* Red decorative bands */}
          <polygon points="-16,-40 16,-40 15,-60 -15,-60" fill="#dc2626" />
          <polygon points="-13,-85 13,-85 12,-105 -12,-105" fill="#dc2626" />

          {/* Lantern Room Platform & Cupola */}
          <rect x="-18" y="-115" width="36" height="6" fill="#0f172a" />
          <rect x="-12" y="-135" width="24" height="20" fill="#fef08a" filter="url(#windowGlow)" />
          {/* Dome roof */}
          <path d="M-15,-135 Q0,-155 15,-135 Z" fill="#0f172a" />
          <circle cx="0" cy="-155" r="2.5" fill="#fef08a" />

          {/* Sweeping Soft Beam of Light across the sky (Night only) */}
          {!isDay && (
            <polygon
              points="0,-125 -600,-350 -550,-120"
              fill="url(#beamGrad)"
              style={{
                transformOrigin: '0px -125px',
                animation: 'sweepBeam 10s ease-in-out infinite',
              }}
            />
          )}
        </g>
      </svg>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
 * SCENERY 5: DESERT / DUNES (Cairo, Dubai, Jaipur, Riyadh...)
 * ──────────────────────────────────────────────────────────── */
const DesertScenery: React.FC<{ isDay: boolean }> = ({ isDay }) => {
  const duneFar = isDay ? '#996515' : '#141426';
  const duneMid = isDay ? '#b8860b' : '#0c0f1f';
  const duneNear = isDay ? '#d2a679' : '#060712';
  const palmColor = isDay ? '#38220f' : '#030408';

  return (
    <div className="absolute inset-x-0 bottom-0 h-[48%] pointer-events-none" aria-hidden="true">
      <svg viewBox="0 0 1000 480" preserveAspectRatio="none" className="w-full h-full">
        {/* Distant Dune Horizon */}
        <path d="M0,480 L0,260 Q320,170 640,250 Q850,310 1000,230 L1000,480 Z" fill={duneFar} />

        {/* Midground Graceful Sweeping Dune */}
        <path d="M0,480 L0,320 Q280,240 560,310 Q780,360 1000,290 L1000,480 Z" fill={duneMid} />

        {/* Date Palms Oasis Cluster on the Right */}
        {[
          { x: 740, y: 320, s: 1.1 },
          { x: 790, y: 330, s: 1.3 },
          { x: 840, y: 335, s: 0.95 },
        ].map((palm, idx) => (
          <g key={idx} transform={`translate(${palm.x}, ${palm.y}) scale(${palm.s})`}>
            <path d="M0,0 Q-10,-35 -8,-75 L-4,-75 Q-6,-35 3,0 Z" fill={palmColor} />
            <path d="M-6,-75 Q-30,-88 -45,-75 Q-25,-82 -6,-75" fill={palmColor} />
            <path d="M-6,-75 Q-8,-98 -20,-102 Q-10,-90 -6,-75" fill={palmColor} />
            <path d="M-6,-75 Q16,-98 28,-88 Q14,-90 -6,-75" fill={palmColor} />
            <path d="M-6,-75 Q32,-80 42,-65 Q22,-74 -6,-75" fill={palmColor} />
          </g>
        ))}

        {/* Foreground Dune Ridge */}
        <path d="M0,480 L0,390 Q380,320 740,380 Q880,410 1000,370 L1000,480 Z" fill={duneNear} />
      </svg>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
 * SKY GRADIENTS BASED ON THEME & DAY/NIGHT
 * ──────────────────────────────────────────────────────────── */
function getSkyGradient(themeType: ThemeType, isDay: boolean): string {
  if (!isDay) {
    // Night palette: soothing midnight blues, indigo, twilight
    switch (themeType) {
      case 'clear-night':
        return 'linear-gradient(to bottom, #070f20 0%, #0d1e3d 40%, #152c52 75%, #0d192f 100%)';
      case 'cloudy-night':
        return 'linear-gradient(to bottom, #070d1a 0%, #11203b 45%, #182b4a 75%, #0f192b 100%)';
      case 'rain':
        return 'linear-gradient(to bottom, #050d18 0%, #0d1c30 45%, #13243a 75%, #0a1422 100%)';
      case 'thunderstorm':
        return 'linear-gradient(to bottom, #070617 0%, #140d2b 45%, #1c1438 75%, #0d0a20 100%)';
      case 'snow':
        return 'linear-gradient(to bottom, #091526 0%, #152945 45%, #243d61 75%, #18283d 100%)';
      case 'fog':
        return 'linear-gradient(to bottom, #0c1824 0%, #1b2d3d 45%, #2a3e4f 75%, #172430 100%)';
      default:
        return 'linear-gradient(to bottom, #070f20 0%, #0d1e3d 40%, #152c52 75%, #0d192f 100%)';
    }
  }

  // Day palette: serene, calming azure, soft gold horizon
  switch (themeType) {
    case 'clear-day':
      return 'linear-gradient(to bottom, #195f96 0%, #3d94d2 45%, #7ec2ed 75%, #f6d183 100%)';
    case 'cloudy-day':
      return 'linear-gradient(to bottom, #2d5d85 0%, #588eb8 45%, #9bc2dd 75%, #d5e4ee 100%)';
    case 'rain':
      return 'linear-gradient(to bottom, #1d3954 0%, #345878 45%, #4f7496 75%, #7695b0 100%)';
    case 'thunderstorm':
      return 'linear-gradient(to bottom, #1c1a2e 0%, #352e4f 45%, #4c4466 75%, #69607f 100%)';
    case 'snow':
      return 'linear-gradient(to bottom, #698ca8 0%, #9cb8ce 45%, #c8daf0 75%, #eef5fc 100%)';
    case 'fog':
      return 'linear-gradient(to bottom, #4f6670 0%, #76909a 45%, #a6bcc2 75%, #cdd9dc 100%)';
    default:
      return 'linear-gradient(to bottom, #195f96 0%, #3d94d2 45%, #7ec2ed 75%, #f6d183 100%)';
  }
}

/* ─────────────────────────────────────────────────────────────
 * MAIN WEATHER SCENE COMPONENT
 * Dynamically switches objects according to city & weather!
 * ──────────────────────────────────────────────────────────── */
export const WeatherScene: React.FC<WeatherSceneProps> = ({
  themeType,
  location,
  isDay = false,
}) => {
  // Determine city scenery archetype
  const sceneryType: SceneryType = getCitySceneryType(location);

  // Is night?
  const isNightTime = !isDay || themeType.includes('night');

  // Render city-specific landscape object
  const renderSceneryObject = () => {
    switch (sceneryType) {
      case 'skyline':
        return <SkylineScenery isDay={!isNightTime} />;
      case 'mountains':
        return <MountainScenery isDay={!isNightTime} />;
      case 'coastal':
        return <CoastalScenery isDay={!isNightTime} />;
      case 'desert':
        return <DesertScenery isDay={!isNightTime} />;
      case 'windmill':
      default:
        // Default / Pastoral / Countryside (matches reference screenshot of Bhopal)
        return <WindmillScenery isDay={!isNightTime} />;
    }
  };

  const skyBackground = getSkyGradient(themeType, !isNightTime);

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none transition-colors duration-1000"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* SVG Defs for glow filters & gradients */}
      <CommonDefs />

      {/* 1. Sky Gradient Base */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{ background: skyBackground }}
      />

      {/* 2. Stars & Shooting Star (if Night) */}
      {isNightTime && <StarsLayer />}

      {/* 3. Celestial Body (Moon with exact phase for city on night, Sun for day) */}
      <CelestialBody isDay={!isNightTime} location={location} />

      {/* 4. Drifting Clouds (for cloudy / rain / snow / storm) */}
      {(themeType.includes('cloud') || themeType === 'rain' || themeType === 'thunderstorm') && (
        <DriftingClouds isDay={!isNightTime} />
      )}

      {/* 5. Birds in flight across the sky */}
      <BirdsLayer isDay={!isNightTime} />

      {/* 6. Foreground City & Landscape Object (Windmill, Skyline, Mountains, Coastal, Desert) */}
      {renderSceneryObject()}

      {/* 7. Weather Overlays (Rain, Snow, Lightning, Fog) */}
      <WeatherOverlays themeType={themeType} />
    </div>
  );
};
