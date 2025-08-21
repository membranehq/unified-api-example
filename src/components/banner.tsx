import { ArrowRight, X, Blocks } from "lucide-react";
import { useState } from "react";


const Banner = () => {
  const [showBanner, setShowBanner] = useState(true);

  if (!showBanner) return null;

  return (
    <div className="relative overflow-hidden bg-[var(--primary)] border-b border-[color:var(--primary)] px-3 sm:px-5">
      <button
        className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 text-white hover:text-[var(--primary-foreground)] transition-colors text-lg font-bold px-1 sm:px-2 py-1 rounded focus:outline-none"
        aria-label="Close banner"
        onClick={() => setShowBanner(false)}
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      <div className="whitespace-nowrap py-2 text-center text-xs sm:text-sm font-semibold text-white">
        <span className="inline-flex items-center">
          <Blocks className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 align-text-bottom" aria-hidden="true" />
          <span className="hidden sm:inline">Start building universal integrations with</span>
          <span className="sm:hidden">Build integrations with</span>
          {"  "}
          <a
            href="https://integration.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-[var(--primary-foreground)] transition-colors font-bold ml-1"
          >
            Membrane
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 inline" aria-hidden="true" />
          </a>{" "}
        </span>
      </div>
    </div>
  );
};

export default Banner;