export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-[#050B14] flex flex-col items-center justify-center">

      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050B14] via-[#071522] to-[#050B14]" />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-emerald-400/60 animate-pulse"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Aurora glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center">

        <div className="text-7xl mb-4 animate-pulse">
          🌱
        </div>

        <h1 className="text-5xl font-bold">
          <span className="text-white">Health</span>
          <span className="text-emerald-400">Mate</span>
        </h1>

        <p className="mt-2 text-emerald-300 tracking-widest">
          YOUR AI HEALTH COMPANION
        </p>

      </div>

      {/* Energy Portal */}
      <div className="relative mt-12 z-10">

        <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-3xl" />

        <div
          className="
          w-44 h-44
          rounded-full
          border-t-4 border-r-4
          border-emerald-300
          animate-spin
          "
          style={{
            animationDuration: "2.2s"
          }}
        />

        <div
          className="
          absolute inset-3
          rounded-full
          border border-emerald-400/40
          animate-pulse
          "
        />

        <div
          className="
          absolute inset-6
          rounded-full
          border border-emerald-300/20
          "
        />

      </div>

      {/* Loading Text */}
      <div className="relative z-10 mt-12 text-center">

        <p className="text-2xl text-white">
          Loading your
        </p>

        <p className="text-4xl italic text-emerald-400 mt-2">
          wellness journey...
        </p>

      </div>

      {/* Bottom Features */}
      <div className="relative z-10 mt-16 grid grid-cols-4 gap-8 text-center">

        <div>
          <div className="text-3xl">❤️</div>
          <p className="text-emerald-300 text-sm mt-2">
            Health
          </p>
        </div>

        <div>
          <div className="text-3xl">🏃</div>
          <p className="text-emerald-300 text-sm mt-2">
            Activity
          </p>
        </div>

        <div>
          <div className="text-3xl">🧘</div>
          <p className="text-emerald-300 text-sm mt-2">
            Mindset
          </p>
        </div>

        <div>
          <div className="text-3xl">📈</div>
          <p className="text-emerald-300 text-sm mt-2">
            Progress
          </p>
        </div>

      </div>

      {/* Footer */}
      <p className="relative z-10 mt-12 text-emerald-300 text-lg tracking-wide">
        Better Health, Better You
      </p>

    </div>
  );
}