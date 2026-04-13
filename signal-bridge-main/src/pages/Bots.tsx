import { Link } from "react-router-dom";
import { Zap, Home, ArrowLeft, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BotManager } from "@/components/BotManager";

const Bots = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 glow-primary">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient-primary">TradeRelay</h1>
              <p className="text-xs text-muted-foreground">Signal Bots</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <a href="https://signal-engine-psi.vercel.app/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Signal Engine</span>
              </Button>
            </a>
            <Link to="/">
              <Button variant="outline" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
        
        <BotManager />
      </main>
    </div>
  );
};

export default Bots;
