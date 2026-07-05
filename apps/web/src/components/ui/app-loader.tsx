import { ShieldCheck } from "lucide-react";

export default function AppLoader() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">

        {/* Grid */}
        <div className="dashboard-grid absolute inset-0" />

        {/* Cyan Glow */}
        <div
          className="
            absolute
            -left-52
            -top-40
            h-[500px]
            w-[500px]
            rounded-full
            bg-cyan-400/18
            blur-3xl
          "
        />

        {/* Pink Glow */}
        <div
          className="
            absolute
            -right-52
            -top-20
            h-[450px]
            w-[450px]
            rounded-full
            bg-pink-500/16
            blur-3xl
          "
        />

      </div>


      {/* Loader Card */}

      <div
        className="
          glass-panel
          glass-panel-strong
          relative
          z-10
          flex
          w-[360px]
          flex-col
          items-center
          gap-6
          p-10
          text-center
        "
      >

        {/* Icon */}

        <div className="relative">

          {/* Pulse */}
          <div
            className="
              absolute
              inset-0
              animate-ping
              rounded-full
              bg-primary/30
            "
          />

          <div
            className="
              relative
              flex
              size-20
              items-center
              justify-center
              rounded-full
              border
              border-primary/30
              bg-primary/10
              shadow-lg
              shadow-primary/20
            "
          >
            <ShieldCheck className="size-10 text-primary" />
          </div>

        </div>


        {/* Text */}

        <div>
          <h2
            className="
              bg-linear-to-r
              from-primary
              via-brand
              to-pink-600
              bg-clip-text
              text-3xl
              font-black
              text-transparent
            "
          >
            IncidentCenter
          </h2>

          <p className="mt-3 text-sm text-muted-foreground">
            Initializing reliability command center
          </p>
        </div>


        {/* Loading Bar */}

        <div
          className="
            h-1.5
            w-full
            overflow-hidden
            rounded-full
            bg-muted
          "
        >
          <div
            className="
              h-full
              w-1/2
              animate-[loading_1.2s_ease-in-out_infinite]
              rounded-full
              bg-linear-to-r
              from-primary
              to-pink-500
            "
          />
        </div>

      </div>

    </div>
  );
}