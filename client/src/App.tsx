import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme-context";
import NotFound from "@/pages/not-found";
import Welcome from "@/pages/welcome";
import Library from "@/pages/library";
import Admin from "@/pages/admin";
import Playlists from "@/pages/playlists";
import PlaylistDetail from "@/pages/playlist-detail";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/library" component={Library} />
      <Route path="/admin" component={Admin} />
      <Route path="/playlists" component={Playlists} />
      <Route path="/playlists/:id" component={PlaylistDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
