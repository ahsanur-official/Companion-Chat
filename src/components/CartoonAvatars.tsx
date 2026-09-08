import React from 'react';

interface CartoonAvatarProps {
  type: 'boy_cool' | 'boy_cap' | 'girl_sweet' | 'girl_cat';
  size?: number;
  className?: string;
}

export const CartoonAvatar: React.FC<CartoonAvatarProps> = ({
  type,
  size = 96,
  className = '',
}) => {
  if (type === 'boy_cool') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`drop-shadow-md ${className}`}
      >
        <defs>
          <linearGradient id="bg-boy-1" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" />
            <stop offset="1" stopColor="#6366F1" />
          </linearGradient>
          <linearGradient id="hair-boy" x1="20" y1="10" x2="100" y2="70" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1E293B" />
            <stop offset="1" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="hoodie-boy" x1="30" y1="80" x2="90" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0284C7" />
            <stop offset="1" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>

        {/* Circular Cartoon Background */}
        <circle cx="60" cy="60" r="56" fill="url(#bg-boy-1)" />

        {/* Hoodie / Shoulders */}
        <path
          d="M24 116C24 96 38 86 60 86C82 86 96 96 96 116"
          fill="url(#hoodie-boy)"
        />
        {/* Hoodie collar & strings */}
        <path d="M48 90L54 104M72 90L66 104" stroke="#E0F2FE" strokeWidth="3" strokeLinecap="round" />
        <circle cx="54" cy="105" r="2.5" fill="#E0F2FE" />
        <circle cx="66" cy="105" r="2.5" fill="#E0F2FE" />
        <path d="M50 86C55 92 65 92 70 86" stroke="#0369A1" strokeWidth="2.5" fill="none" />

        {/* Neck */}
        <rect x="52" y="74" width="16" height="15" rx="5" fill="#FDE047" opacity="0.9" />

        {/* Face */}
        <rect x="34" y="32" width="52" height="48" rx="24" fill="#FEF08A" />

        {/* Ears */}
        <circle cx="33" cy="56" r="7" fill="#FEF08A" />
        <circle cx="33" cy="56" r="4" fill="#FDE047" />
        <circle cx="87" cy="56" r="7" fill="#FEF08A" />
        <circle cx="87" cy="56" r="4" fill="#FDE047" />

        {/* Big Cartoon Eyes */}
        {/* Left Eye */}
        <ellipse cx="48" cy="54" rx="6.5" ry="8.5" fill="#0F172A" />
        <circle cx="46" cy="51" r="2.8" fill="#FFFFFF" />
        <circle cx="50.5" cy="56.5" r="1.4" fill="#38BDF8" />
        {/* Right Eye */}
        <ellipse cx="72" cy="54" rx="6.5" ry="8.5" fill="#0F172A" />
        <circle cx="70" cy="51" r="2.8" fill="#FFFFFF" />
        <circle cx="74.5" cy="56.5" r="1.4" fill="#38BDF8" />

        {/* Eyebrows */}
        <path d="M42 43C45 41 51 42 53 44" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M78 43C75 41 69 42 67 44" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />

        {/* Cute Blushing Cheeks */}
        <ellipse cx="42" cy="62" rx="4.5" ry="2.5" fill="#F87171" opacity="0.6" />
        <ellipse cx="78" cy="62" rx="4.5" ry="2.5" fill="#F87171" opacity="0.6" />

        {/* Smiling Mouth */}
        <path d="M54 63C56 68 64 68 66 63" stroke="#991B1B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M56 64C58 66 62 66 64 64" fill="#EF4444" />

        {/* Anime Spiky Styled Hair */}
        <path
          d="M32 40C32 25 45 15 60 15C76 15 88 25 88 40C88 43 86 46 84 48C81 44 80 36 76 34C72 32 68 36 64 33C60 30 55 35 48 34C43 33 40 42 36 47C33 45 32 43 32 40Z"
          fill="url(#hair-boy)"
        />
        {/* Side Bangs */}
        <path d="M34 38L38 48L44 42L48 50L53 43" stroke="url(#hair-boy)" strokeWidth="4" strokeLinejoin="round" />
        {/* Hair shine / highlight */}
        <path d="M48 22C54 20 66 20 72 23" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

        {/* Sparkles */}
        <path d="M18 30L21 33L18 36L15 33Z" fill="#FDE047" />
        <path d="M102 44L104 46L102 48L100 46Z" fill="#FDE047" />
      </svg>
    );
  }

  if (type === 'boy_cap') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`drop-shadow-md ${className}`}
      >
        <defs>
          <linearGradient id="bg-boy-2" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0EA5E9" />
            <stop offset="1" stopColor="#2563EB" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="56" fill="url(#bg-boy-2)" />
        {/* Shoulders */}
        <path d="M24 116C24 96 40 88 60 88C80 88 96 96 96 116" fill="#1E293B" />
        {/* Face */}
        <rect x="34" y="38" width="52" height="46" rx="23" fill="#FED7AA" />
        {/* Ears */}
        <circle cx="33" cy="58" r="6" fill="#FDBA74" />
        <circle cx="87" cy="58" r="6" fill="#FDBA74" />
        {/* Big Cartoon Eyes Wink */}
        <ellipse cx="48" cy="56" rx="6" ry="8" fill="#0F172A" />
        <circle cx="46" cy="53" r="2.5" fill="#FFFFFF" />
        {/* Wink Right Eye */}
        <path d="M68 56C71 52 77 52 80 56" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
        {/* Blush */}
        <ellipse cx="42" cy="64" rx="4" ry="2" fill="#F87171" opacity="0.6" />
        <ellipse cx="78" cy="64" rx="4" ry="2" fill="#F87171" opacity="0.6" />
        {/* Grin Mouth */}
        <path d="M53 66C56 72 64 72 67 66" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M55 67C57 70 63 70 65 67" fill="#EF4444" />
        {/* Backwards Cool Cap */}
        <path d="M30 36C30 20 44 14 60 14C76 14 90 20 90 36H30Z" fill="#DC2626" />
        <path d="M24 36C24 33 34 33 96 33C100 33 102 36 96 38H26C24 38 24 36 24 36Z" fill="#B91C1C" />
        <circle cx="60" cy="14" r="3.5" fill="#EF4444" />
      </svg>
    );
  }

  if (type === 'girl_sweet') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`drop-shadow-md ${className}`}
      >
        <defs>
          <linearGradient id="bg-girl-1" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F43F5E" />
            <stop offset="1" stopColor="#EC4899" />
          </linearGradient>
          <linearGradient id="hair-girl" x1="20" y1="10" x2="100" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#831843" />
            <stop offset="1" stopColor="#4C0519" />
          </linearGradient>
          <linearGradient id="dress-girl" x1="30" y1="80" x2="90" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FB7185" />
            <stop offset="1" stopColor="#F43F5E" />
          </linearGradient>
        </defs>

        {/* Circular Cartoon Background */}
        <circle cx="60" cy="60" r="56" fill="url(#bg-girl-1)" />

        {/* Pigtails / Twin Bun Tufts */}
        <circle cx="28" cy="38" r="14" fill="url(#hair-girl)" />
        <circle cx="92" cy="38" r="14" fill="url(#hair-girl)" />
        {/* Ribbon Bows */}
        <path d="M26 34L18 28M26 34L20 42" stroke="#FDE047" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="26" cy="34" r="3.5" fill="#FACC15" />
        <path d="M94 34L102 28M94 34L100 42" stroke="#FDE047" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="94" cy="34" r="3.5" fill="#FACC15" />

        {/* Cute Pastel Hoodie/Dress */}
        <path
          d="M24 116C24 94 38 84 60 84C82 84 96 94 96 116"
          fill="url(#dress-girl)"
        />
        {/* Little Heart Badge on hoodie */}
        <path
          d="M60 98C60 98 55 93 52 96C49 99 53 104 60 108C67 104 71 99 68 96C65 93 60 98 60 98Z"
          fill="#FFF"
        />

        {/* Neck */}
        <rect x="53" y="74" width="14" height="14" rx="4" fill="#FEF08A" />

        {/* Face */}
        <rect x="34" y="32" width="52" height="48" rx="24" fill="#FEF08A" />

        {/* Ears */}
        <circle cx="33" cy="56" r="6" fill="#FDE047" />
        <circle cx="87" cy="56" r="6" fill="#FDE047" />

        {/* Big Sparkling Anime Eyes */}
        {/* Left Eye */}
        <ellipse cx="48" cy="54" rx="7" ry="9" fill="#0F172A" />
        <circle cx="46" cy="50.5" r="3.2" fill="#FFFFFF" />
        <circle cx="51" cy="57" r="1.6" fill="#FB7185" />
        {/* Right Eye */}
        <ellipse cx="72" cy="54" rx="7" ry="9" fill="#0F172A" />
        <circle cx="70" cy="50.5" r="3.2" fill="#FFFFFF" />
        <circle cx="75" cy="57" r="1.6" fill="#FB7185" />

        {/* Cute Anime Eyelashes */}
        <path d="M42 47L40 44M54 47L56 44" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M66 47L64 44M78 47L80 44" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" />

        {/* Eyebrows */}
        <path d="M43 42C46 40 51 41 53 43" stroke="#831843" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M77 42C74 40 69 41 67 43" stroke="#831843" strokeWidth="2.2" strokeLinecap="round" />

        {/* Rosy Pink Cheeks */}
        <ellipse cx="41" cy="63" rx="5.5" ry="3" fill="#FB7185" opacity="0.7" />
        <ellipse cx="79" cy="63" rx="5.5" ry="3" fill="#FB7185" opacity="0.7" />
        {/* Cheek sparkles */}
        <line x1="39" y1="63" x2="43" y2="63" stroke="#FFF" strokeWidth="1" strokeLinecap="round" />
        <line x1="77" y1="63" x2="81" y2="63" stroke="#FFF" strokeWidth="1" strokeLinecap="round" />

        {/* Sweet Smile */}
        <path d="M54 64C56 69 64 69 66 64" stroke="#9F1239" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M56 65C58 68 62 68 64 65" fill="#F43F5E" />

        {/* Sweet Bangs Hair */}
        <path
          d="M32 38C32 24 45 15 60 15C75 15 88 24 88 38C88 42 85 45 83 45C80 39 76 34 70 36C64 38 60 33 55 35C50 37 46 34 40 37C36 39 34 42 32 38Z"
          fill="url(#hair-girl)"
        />
        {/* Side Strands */}
        <path d="M33 38C34 50 37 56 38 60" stroke="url(#hair-girl)" strokeWidth="4" strokeLinecap="round" />
        <path d="M87 38C86 50 83 56 82 60" stroke="url(#hair-girl)" strokeWidth="4" strokeLinecap="round" />

        {/* Star Hairpin */}
        <path d="M40 26L42 30L46 30L43 33L44 37L40 34L36 37L37 33L34 30L38 30Z" fill="#FDE047" />

        {/* Floating Heart / Sparkle */}
        <path d="M16 28L18 30L16 32L14 30Z" fill="#FFF" />
        <path d="M104 40L106 42L104 44L102 42Z" fill="#FFF" />
      </svg>
    );
  }

  // girl_cat / princess
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-md ${className}`}
    >
      <defs>
        <linearGradient id="bg-girl-2" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A855F7" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="hair-cat" x1="30" y1="10" x2="90" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#581C87" />
          <stop offset="1" stopColor="#3B0764" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#bg-girl-2)" />
      {/* Cat Ears */}
      <path d="M34 36L28 16L48 26Z" fill="#3B0764" />
      <path d="M34 32L30 20L44 26Z" fill="#F472B6" />
      <path d="M86 36L92 16L72 26Z" fill="#3B0764" />
      <path d="M86 32L90 20L76 26Z" fill="#F472B6" />
      {/* Shoulders */}
      <path d="M24 116C24 94 38 84 60 84C82 84 96 94 96 116" fill="#7E22CE" />
      {/* Face */}
      <rect x="34" y="32" width="52" height="48" rx="24" fill="#FED7AA" />
      {/* Eyes with wink */}
      <ellipse cx="48" cy="54" rx="6.5" ry="8.5" fill="#0F172A" />
      <circle cx="46" cy="51" r="2.8" fill="#FFFFFF" />
      <path d="M66 54C69 50 75 50 78 54" stroke="#0F172A" strokeWidth="2.8" strokeLinecap="round" />
      {/* Blush */}
      <ellipse cx="41" cy="63" rx="5" ry="2.5" fill="#F43F5E" opacity="0.7" />
      <ellipse cx="79" cy="63" rx="5" ry="2.5" fill="#F43F5E" opacity="0.7" />
      {/* Smile with cute cat tongue */}
      <path d="M54 64C56 68 64 68 66 64" stroke="#701A75" strokeWidth="2.5" strokeLinecap="round" />
      {/* Hair */}
      <path
        d="M32 38C32 24 45 18 60 18C75 18 88 24 88 38C88 42 85 45 83 45C80 39 76 34 70 36C64 38 60 33 55 35C50 37 46 34 40 37C36 39 34 42 32 38Z"
        fill="url(#hair-cat)"
      />
    </svg>
  );
};
