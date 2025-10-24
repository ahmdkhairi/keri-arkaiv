import { Button } from "@/components/ui/button";
import { Music2 } from "lucide-react";
import { useLocation } from "wouter";
import heroImage from "@assets/generated_images/Vinyl_records_music_collection_hero_6f78ee9f.png";

export default function Welcome() {
  const [, setLocation] = useLocation();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Icon */}
        <div className="mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
            <Music2 className="w-10 h-10 md:w-12 md:h-12 text-primary-foreground" />
          </div>
        </div>

        {/* Main Title */}
        <h1 className="font-serif font-bold text-6xl md:text-7xl lg:text-8xl text-white mb-4 md:mb-6">
          My CD Library
        </h1>

        {/* Tagline */}
        <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-12 md:mb-16 max-w-2xl">
          Your personal collection of timeless albums, beautifully organized
        </p>

        {/* CTA Button */}
        <Button
          size="lg"
          onClick={() => setLocation("/library")}
          className="px-12 py-6 text-lg rounded-full backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          data-testid="button-enter-library"
        >
          Enter Library
        </Button>
      </div>
    </div>
  );
}
