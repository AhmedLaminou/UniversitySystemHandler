import { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  speed?: number;
  pauseOnHover?: boolean;
}

export const Marquee = ({ children, pauseOnHover = true }: MarqueeProps) => {
  return (
    <div className="relative overflow-hidden">
      <div 
        className={`flex gap-12 marquee ${pauseOnHover ? "hover:[animation-play-state:paused]" : ""}`}
      >
        {children}
        {children}
      </div>
    </div>
  );
};
