"use client";

interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "hero-solid" | "hero-outline" | "black" | "white" | "transparent";
  withWave?: boolean; 
  children: React.ReactNode;
  className?: string;
}

export default function LiquidButton({ 
  variant = "black", 
  withWave = true, 
  children, 
  className = "", 
  ...props 
}: LiquidButtonProps) {
  
  const styles = {
    "hero-solid": {
      container: "bg-black text-white border border-white hover:bg-white hover:text-black hover:border-black transition-all duration-300",
      textHover: "", 
      wave: "",
    },
    "hero-outline": {
      container: "bg-transparent text-white border border-white hover:bg-white hover:text-black hover:border-black transition-all duration-300",
      textHover: "", 
      wave: "",
    },
    white: {
      container: "bg-white text-black border border-white hover:border-black hover:bg-black hover:[transition:background-color_500ms_ease_300ms,border-color_500ms_ease_0ms]",
      textHover: "group-hover:text-white", 
      wave: "bg-black",
    },
    transparent: {
      container: "bg-transparent text-white border border-white/60 hover:border-white hover:bg-white hover:[transition:background-color_500ms_ease_300ms,border-color_500ms_ease_0ms]",
      textHover: "group-hover:text-black",
      wave: "bg-white",
    },
    black: {
      container: "bg-transparent text-black border border-black hover:border-black transition-colors duration-500",
      textHover: "group-hover:text-white",
      wave: "bg-black",
    }
  };

  const selected = styles[variant];

  return (
    <button 
      className={`relative overflow-hidden px-8 py-2.5 text-[10px] md:text-xs font-medium tracking-[0.15em] uppercase group pointer-events-auto ${selected.container} ${className}`}
      {...props}
    >
      <span className={`relative z-10 transition-colors duration-500 ease-in-out ${selected.textHover}`}>
        {children}
      </span>
      
      {withWave && (
        <div 
          className={`absolute left-1/2 top-[120%] h-[200px] w-[200px] -translate-x-1/2 rounded-[40%] transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:top-[-50px] animate-[spin_4s_linear_infinite] ${selected.wave}`} 
        />
      )}
    </button>
  );
}