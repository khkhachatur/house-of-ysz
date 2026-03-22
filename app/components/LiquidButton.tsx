"use client";

interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "hero-solid" | "hero-outline" | "black" | "white" | "transparent";
  withWave?: boolean; 
  children: React.ReactNode;
  className?: string;
}

export default function LiquidButton({ 
  variant = "black", 
  withWave, 
  children, 
  className = "", 
  ...props 
}: LiquidButtonProps) {
  
  const styles = {
    "hero-solid": {
      container: "bg-black text-white border border-white hover:border-white",
      textHover: "group-hover:text-black", 
      fill: "bg-white",
    },
    "hero-outline": {
      container: "bg-transparent text-white border border-white hover:border-white",
      textHover: "group-hover:text-black", 
      fill: "bg-white",
    },
    white: {
      container: "bg-white text-black border border-white hover:border-black",
      textHover: "group-hover:text-white", 
      fill: "bg-black",
    },
    transparent: {
      container: "bg-transparent text-white border border-white/60 hover:border-white",
      textHover: "group-hover:text-black",
      fill: "bg-white",
    },
    black: {
      container: "bg-transparent text-black border border-black hover:border-black",
      textHover: "group-hover:text-white",
      fill: "bg-black",
    }
  };

  const selected = styles[variant];

  return (
    <button 
      className={`relative overflow-hidden px-8 py-2.5 text-[10px] md:text-xs font-medium tracking-[0.15em] uppercase group pointer-events-auto transition-colors duration-500 ${selected.container} ${className}`}
      {...props}
    >
      <span className={`relative z-10 transition-colors duration-500 ease-in-out ${selected.textHover}`}>
        {children}
      </span>
      
      <div 
        className={`absolute bottom-0 left-0 w-full h-full origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-0 ${selected.fill}`} 
      />
    </button>
  );
}