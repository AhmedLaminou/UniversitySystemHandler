import { Marquee } from "@/components/Marquee";
import microsoft from "@/assets/microsoft.jpg";
import google from "@/assets/google.jpg";
import nvidia from "@/assets/nvidia.jpg";
import toyota from "@/assets/toyota.png";
import mit from "@/assets/mit.png";

const partners = [
  { name: "Microsoft", logo: microsoft },
  { name: "Google", logo: google },
  { name: "NVIDIA", logo: nvidia },
  { name: "Toyota", logo: toyota },
  { name: "MIT", logo: mit },
];

export const PartnersSection = () => {
  return (
    <section className="py-16 bg-muted/50 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-muted-foreground font-medium">Nos partenaires de confiance</p>
        </div>
        
        <Marquee>
          {partners.map((partner) => (
            <div 
              key={partner.name}
              className="flex items-center justify-center px-8 py-4 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
            >
              <img 
                src={partner.logo}
                alt={partner.name}
                className="h-10 w-auto object-contain"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};
