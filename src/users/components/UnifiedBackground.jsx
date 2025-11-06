/**
 * UnifiedBackground Component
 *
 * Provides a consistent, professional background across all user-facing pages
 * in the Barangay Talipapa website. This ensures visual continuity and
 * reinforces brand identity.
 *
 * Design Philosophy:
 * - Eco-friendly theme (emerald/green representing environmental mission)
 * - Government trust (blue representing stability and governance)
 * - Community warmth (amber representing inclusivity)
 * - Professional aesthetic suitable for government portal
 */

export default function UnifiedBackground({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-slate-100 to-sky-100 relative overflow-hidden">
      {/* Dot pattern for texture - more visible */}
      <div
        className="absolute inset-0 opacity-[0.8]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(34, 197, 94, 0.25) 1.5px, transparent 1.5px)`,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Organic gradient orbs - much more visible and vibrant */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top right - growth and environmental prosperity */}
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] bg-gradient-to-br from-emerald-400/60 via-green-300/40 to-transparent rounded-full blur-3xl" />

        {/* Middle left - stability and governance */}
        <div className="absolute top-1/3 -left-32 w-[600px] h-[600px] bg-gradient-to-tr from-blue-400/55 via-sky-300/35 to-transparent rounded-full blur-3xl" />

        {/* Bottom center - community warmth and inclusivity */}
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-gradient-to-t from-amber-300/50 via-yellow-200/35 to-transparent rounded-full blur-3xl" />

        {/* Additional accent orb for depth */}
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-gradient-to-bl from-teal-300/30 via-emerald-200/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Diagonal light streaks - more pronounced */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-white/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-tr from-white/60 via-transparent to-transparent" />
      </div>

      {/* Content layer - elevated above background */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
