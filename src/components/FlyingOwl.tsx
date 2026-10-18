import React from 'react';

interface FlyingOwlProps {
  className?: string;
  size?: number; // size in px
  blueEyes?: boolean;
}

export const FlyingOwl: React.FC<FlyingOwlProps> = ({ className = '', size = 280, blueEyes = true }) => {
  return (
    <div
      className={`relative select-none pointer-events-none ${className}`}
      style={{
        width: `${size}px`,
        height: `${size * 0.72}px`,
        perspective: '1200px',
      }}
    >
      <style>{`
        @keyframes owlFlapLeft {
          0%, 100% {
            transform: rotate(-18deg) rotateY(-10deg) skewY(-4deg);
          }
          35% {
            transform: rotate(38deg) rotateY(15deg) skewY(8deg) scaleY(1.08);
          }
          50% {
            transform: rotate(20deg) rotateY(8deg) skewY(3deg);
          }
          80% {
            transform: rotate(-32deg) rotateY(-18deg) skewY(-8deg) scaleY(0.92);
          }
        }

        @keyframes owlFlapRight {
          0%, 100% {
            transform: rotate(18deg) rotateY(10deg) skewY(4deg);
          }
          35% {
            transform: rotate(-38deg) rotateY(-15deg) skewY(-8deg) scaleY(1.08);
          }
          50% {
            transform: rotate(-20deg) rotateY(-8deg) skewY(-3deg);
          }
          80% {
            transform: rotate(32deg) rotateY(18deg) skewY(8deg) scaleY(0.92);
          }
        }

        @keyframes owlBodyBob {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          35% {
            transform: translateY(-8px) rotate(-1deg);
          }
          80% {
            transform: translateY(6px) rotate(1deg);
          }
        }

        @keyframes owlTicketSway {
          0%, 100% {
            transform: rotate(-3deg) translateY(0px);
          }
          50% {
            transform: rotate(4deg) translateY(3px);
          }
        }

        @keyframes featherGlow {
          0%, 100% {
            filter: drop-shadow(0 0 14px rgba(254, 240, 138, 0.45)) drop-shadow(0 0 26px rgba(96, 165, 250, 0.35));
          }
          50% {
            filter: drop-shadow(0 0 28px rgba(251, 191, 36, 0.85)) drop-shadow(0 0 35px rgba(59, 130, 246, 0.55));
          }
        }

        .owl-wing-left {
          transform-origin: 92px 75px;
          animation: owlFlapLeft 0.52s ease-in-out infinite;
        }

        .owl-wing-right {
          transform-origin: 148px 75px;
          animation: owlFlapRight 0.52s ease-in-out infinite;
        }

        .owl-body-group {
          animation: owlBodyBob 0.52s ease-in-out infinite;
        }

        .owl-ticket-group {
          transform-origin: 120px 145px;
          animation: owlTicketSway 1.04s ease-in-out infinite;
        }

        .owl-glow-filter {
          animation: featherGlow 2s ease-in-out infinite;
        }
      `}</style>

      <svg
        viewBox="0 0 240 175"
        className="w-full h-full owl-glow-filter overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients for snowy owl feathers */}
          <linearGradient id="owlWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f3f4f6" />
            <stop offset="85%" stopColor="#e5e7eb" />
            <stop offset="100%" stopColor="#9ca3af" />
          </linearGradient>

          <linearGradient id="owlBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f9fafb" />
            <stop offset="100%" stopColor="#e5e7eb" />
          </linearGradient>

          <linearGradient id="goldTicketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="30%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Deep Crystal Blue Eyes for the blue-eyed bunny */}
          <radialGradient id="owlEyeBlueGrad" cx="38%" cy="38%" r="62%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="40%" stopColor="#38bdf8" />
            <stop offset="75%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0c4a6e" />
          </radialGradient>

          <radialGradient id="owlEyeGoldGrad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="60%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#854d0e" />
          </radialGradient>

          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* ================= LEFT WING (Flapping) ================= */}
        <g className="owl-wing-left">
          {/* Main Wing Body */}
          <path
            d="M92 75 C70 50, 30 40, 5 55 C-5 62, 5 78, 20 85 C40 95, 65 105, 90 92 Z"
            fill="url(#owlWingGrad)"
            stroke="#d1d5db"
            strokeWidth="1.2"
          />
          {/* Primary Feathers Layer 1 */}
          <path
            d="M5 55 C-12 65, -8 85, 8 92 C-4 98, 8 112, 22 108 C15 116, 28 122, 42 115 C38 124, 52 126, 68 118 C80 112, 88 100, 92 88"
            fill="#f9fafb"
            stroke="#9ca3af"
            strokeWidth="0.9"
          />
          {/* Wing feather bars (speckles characteristic of Snowy Owl / Hedwig) */}
          <path
            d="M25 70 Q35 72 45 68 M15 82 Q30 84 45 80 M35 95 Q50 96 65 90 M55 106 Q70 105 80 98"
            stroke="#4b5563"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.65"
          />
          {/* Secondary Feather Highlights */}
          <path
            d="M40 60 C55 58, 70 65, 85 75"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* ================= RIGHT WING (Flapping) ================= */}
        <g className="owl-wing-right">
          {/* Main Wing Body */}
          <path
            d="M148 75 C170 50, 210 40, 235 55 C245 62, 235 78, 220 85 C200 95, 175 105, 150 92 Z"
            fill="url(#owlWingGrad)"
            stroke="#d1d5db"
            strokeWidth="1.2"
          />
          {/* Primary Feathers Layer 1 */}
          <path
            d="M235 55 C252 65, 248 85, 232 92 C244 98, 232 112, 218 108 C225 116, 212 122, 198 115 C202 124, 188 126, 172 118 C160 112, 152 100, 148 88"
            fill="#f9fafb"
            stroke="#9ca3af"
            strokeWidth="0.9"
          />
          {/* Wing feather bars (Snowy owl markings) */}
          <path
            d="M215 70 Q205 72 195 68 M225 82 Q210 84 195 80 M205 95 Q190 96 175 90 M185 106 Q170 105 160 98"
            stroke="#4b5563"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.65"
          />
          {/* Secondary Feather Highlights */}
          <path
            d="M200 60 C185 58, 170 65, 155 75"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* ================= OWL BODY & HEAD ================= */}
        <g className="owl-body-group">
          {/* Tail Feathers */}
          <path
            d="M110 135 L105 162 C115 165, 125 165, 135 162 L130 135 Z"
            fill="#f3f4f6"
            stroke="#9ca3af"
            strokeWidth="1"
          />
          <path
            d="M112 152 Q120 155 128 152"
            stroke="#4b5563"
            strokeWidth="1.5"
            opacity="0.6"
          />

          {/* Torso / Chest */}
          <ellipse
            cx="120"
            cy="102"
            rx="32"
            ry="40"
            fill="url(#owlBodyGrad)"
            stroke="#e5e7eb"
            strokeWidth="1"
            filter="url(#softShadow)"
          />

          {/* Chest Feather Chevrons (Snowy Owl speckles) */}
          <g stroke="#374151" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" fill="none">
            <path d="M112 90 L115 93 L118 90" />
            <path d="M122 90 L125 93 L128 90" />
            <path d="M106 102 L110 106 L114 102" />
            <path d="M118 103 L122 107 L126 103" />
            <path d="M130 102 L134 106 L138 102" />
            <path d="M112 116 L116 120 L120 116" />
            <path d="M124 116 L128 120 L132 116" />
          </g>

          {/* Head */}
          <circle
            cx="120"
            cy="62"
            r="26"
            fill="#ffffff"
            stroke="#e5e7eb"
            strokeWidth="1"
          />

          {/* Facial Discs */}
          <ellipse cx="110" cy="62" rx="10" ry="12" fill="#fdfdfd" stroke="#e5e7eb" strokeWidth="0.8" />
          <ellipse cx="130" cy="62" rx="10" ry="12" fill="#fdfdfd" stroke="#e5e7eb" strokeWidth="0.8" />

          {/* Eyes (Radiant Eyes: Gorgeous Crystal Blue or Golden) */}
          <circle
            cx="110"
            cy="61"
            r="6"
            fill={blueEyes ? 'url(#owlEyeBlueGrad)' : 'url(#owlEyeGoldGrad)'}
            stroke={blueEyes ? '#0369a1' : '#713f12'}
            strokeWidth="0.9"
          />
          <circle
            cx="130"
            cy="61"
            r="6"
            fill={blueEyes ? 'url(#owlEyeBlueGrad)' : 'url(#owlEyeGoldGrad)'}
            stroke={blueEyes ? '#0369a1' : '#713f12'}
            strokeWidth="0.9"
          />

          {/* Pupils */}
          <circle cx="110" cy="61" r="3.2" fill="#090d16" />
          <circle cx="130" cy="61" r="3.2" fill="#090d16" />

          {/* Sparkling Eye Highlights */}
          <circle cx="108.5" cy="59.2" r="1.5" fill="#ffffff" />
          <circle cx="128.5" cy="59.2" r="1.5" fill="#ffffff" />
          <circle cx="111.5" cy="62.5" r="0.8" fill="#bae6fd" />
          <circle cx="131.5" cy="62.5" r="0.8" fill="#bae6fd" />

          {/* Beak */}
          <polygon points="117,66 123,66 120,74" fill="#1f2937" />

          {/* Talons clutched forward */}
          <g fill="#ca8a04" stroke="#713f12" strokeWidth="0.8">
            <ellipse cx="110" cy="138" rx="4" ry="7" />
            <ellipse cx="115" cy="140" rx="3.5" ry="7" />
            <ellipse cx="125" cy="140" rx="3.5" ry="7" />
            <ellipse cx="130" cy="138" rx="4" ry="7" />
          </g>

          {/* ================= GOLDEN TICKET CARRIED IN TALONS ================= */}
          <g className="owl-ticket-group">
            {/* Golden Ticket Parchment */}
            <rect
              x="66"
              y="136"
              width="108"
              height="42"
              rx="5"
              fill="url(#goldTicketGrad)"
              stroke="#b45309"
              strokeWidth="1.2"
              filter="url(#softShadow)"
            />
            {/* Ornate inner border */}
            <rect
              x="69"
              y="139"
              width="102"
              height="36"
              rx="3.5"
              fill="none"
              stroke="#fef08a"
              strokeWidth="0.8"
              strokeDasharray="2,1"
            />
            {/* Ticket Text */}
            <text
              x="120"
              y="148"
              textAnchor="middle"
              fontSize="4.5"
              fontFamily="Cinzel, Georgia, serif"
              fontWeight="bold"
              fill="#78350f"
              letterSpacing="0.4"
            >
              11 ЧИСЛО • 03:00 НОЧИ
            </text>
            <text
              x="120"
              y="156"
              textAnchor="middle"
              fontSize="3.9"
              fontFamily="system-ui, -apple-system, sans-serif"
              fill="#92400e"
              fontWeight="700"
            >
              Я ТЕБЯ ОЧЕНЬ ЛЮБЛЮ 💙
            </text>

            {/* Red Wax Seal on Ticket */}
            <circle cx="120" cy="166" r="4.5" fill="#dc2626" stroke="#991b1b" strokeWidth="0.8" />
            <polygon
              points="120,163.5 121.2,165.8 123.5,166 121.8,167.5 122.3,169.8 120,168.5 117.7,169.8 118.2,167.5 116.5,166 118.8,165.8"
              fill="#fef08a"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};
