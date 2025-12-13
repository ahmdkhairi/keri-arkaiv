import { Button } from "@/components/ui/button";
import { Music2 } from "lucide-react";
import { useLocation } from "wouter";
import background from '/public/front-bg.jpg'
export default function Welcome() {
  const [, setLocation] = useLocation();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full">
            <img src="../../cd_008.gif" className="w-20 h-20 md:w-24 md:h-24 " />
          </div>
        </div>

        <h1 className="font-serif font-bold text-6xl md:text-7xl lg:text-8xl text-white mb-4 md:mb-6">
          keri-arkaiv
        </h1>

        <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-12 md:mb-16 max-w-2xl">
          fav kept offline
        </p>

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
