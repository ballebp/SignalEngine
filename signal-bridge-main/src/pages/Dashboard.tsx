import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Zap,
  Settings,
  Bot,
  Plus,
  ChevronDown,
  ChevronRight,
  Copy,
  Trash2,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Target,
  BarChart3,
  Clock,
  RefreshCw,
  X,
  LogOut,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ConnectionStatus } from "@/components/ConnectionStatus";

// Format price with appropriate decimals based on value
const formatPrice = (price: number | null | undefined): string => {
  if (price == null) return "-";
  if (price < 0.01) return price.toFixed(6);
  if (price < 1) return price.toFixed(4);
  if (price < 100) return price.toFixed(3);
  return price.toFixed(2);
};

interface SignalBot {
  id: string;
  name: string;
  description: string | null;
  webhook_key: string;
  is_active: boolean;
  broker: string;
  created_at: string;
}

interface BotSettings {
  id: string;
  bot_id: string;
  sizing_mode: string;
  fixed_amount: number;
  percentage_value: number;
  default_leverage: number;
  max_position_size: number;
  auto_take_profit: number | null;
  auto_stop_loss: number | null;
  trading_mode: string;
  position_mode: string;
  max_positions: number;
  symbols: string[];
  primary_symbol: string;
  strategy_name: string;
  timeframe: string;
  broker?: string;
  use_testnet?: boolean;
}

interface TradeStats {
  totalTrades: number;
  winRate: number;
  totalPnl: number;
  avgTrade: number;
  bestTrade: number;
  worstTrade: number;
  totalVolume: number;
  activeBots: number;
}

interface ActivePosition {
  id: string;
  symbol: string;
  side: string;
  entry_price: number;
  quantity: number;
  leverage: number;
  margin: number;
  unrealized_pnl: number;
  current_price?: number;
  bot_id?: string | null;
  created_at: string;
}

interface TradeHistory {
  id: string;
  symbol: string;
  side: string;
  entry_price: number;
  exit_price: number;
  quantity: number;
  leverage: number;
  pnl: number;
  pnl_percentage: number;
  fee: number;
  opened_at?: string;
  closed_at: string;
  bot_id?: string | null;
}

interface BrokerBalance {
  broker: string;
  equity: number;
  availableMargin: number;
  unrealizedPnL: number;
  isDemo: boolean;
  connected: boolean;
  error?: string;
}

interface SignalLog {
  id: string;
  symbol: string;
  action: string;
  status: string;
  message: string | null;
  strategy: string | null;
  created_at: string;
  bot_id?: string | null;
}

const AVAILABLE_COINS = [
  { value: "BTC-USDT", label: "BTC" },
  { value: "ETH-USDT", label: "ETH" },
  { value: "SOL-USDT", label: "SOL" },
  { value: "XRP-USDT", label: "XRP" },
  { value: "BNB-USDT", label: "BNB" },
  { value: "ADA-USDT", label: "ADA" },
  { value: "AVAX-USDT", label: "AVAX" },
  { value: "LINK-USDT", label: "LINK" },
  { value: "DOT-USDT", label: "DOT" },
  { value: "MATIC-USDT", label: "MATIC" },
  { value: "NEAR-USDT", label: "NEAR" },
  { value: "SUI-USDT", label: "SUI" },
  { value: "APT-USDT", label: "APT" },
  { value: "ARB-USDT", label: "ARB" },
  { value: "OP-USDT", label: "OP" },
  { value: "INJ-USDT", label: "INJ" },
  { value: "FET-USDT", label: "FET" },
  { value: "RENDER-USDT", label: "RENDER" },
  { value: "FIL-USDT", label: "FIL" },
  { value: "ATOM-USDT", label: "ATOM" },
  { value: "UNI-USDT", label: "UNI" },
  { value: "LTC-USDT", label: "LTC" },
  { value: "BCH-USDT", label: "BCH" },
  { value: "ETC-USDT", label: "ETC" },
  { value: "AAVE-USDT", label: "AAVE" },
  { value: "MKR-USDT", label: "MKR" },
  { value: "CRV-USDT", label: "CRV" },
  { value: "LDO-USDT", label: "LDO" },
  { value: "TIA-USDT", label: "TIA" },
  { value: "SEI-USDT", label: "SEI" },
  { value: "JUP-USDT", label: "JUP" },
  { value: "PYTH-USDT", label: "PYTH" },
  { value: "STX-USDT", label: "STX" },
  { value: "IMX-USDT", label: "IMX" },
  { value: "ORDI-USDT", label: "ORDI" },
  { value: "WLD-USDT", label: "WLD" },
  { value: "TAO-USDT", label: "TAO" },
  { value: "ONDO-USDT", label: "ONDO" },
  { value: "PENDLE-USDT", label: "PENDLE" },
  { value: "ENA-USDT", label: "ENA" },
  { value: "WIF-USDT", label: "WIF" },
  { value: "BONK-USDT", label: "BONK" },
  { value: "DOGE-USDT", label: "DOGE" },
  { value: "SHIB-USDT", label: "SHIB" },
  { value: "PEPE-USDT", label: "PEPE" },
  { value: "FLOKI-USDT", label: "FLOKI" },
  { value: "POPCAT-USDT", label: "POPCAT" },
  { value: "MEW-USDT", label: "MEW" },
  { value: "BOME-USDT", label: "BOME" },
  { value: "BRETT-USDT", label: "BRETT" },
  { value: "NEIRO-USDT", label: "NEIRO" },
  { value: "FARTCOIN-USDT", label: "FARTCOIN" },
  { value: "TRUMP-USDT", label: "TRUMP" },
  { value: "AI16Z-USDT", label: "AI16Z" },
  { value: "VIRTUAL-USDT", label: "VIRTUAL" },
  { value: "AIXBT-USDT", label: "AIXBT" },
  { value: "GRIFFAIN-USDT", label: "GRIFFAIN" },
  { value: "ARC-USDT", label: "ARC" },
];

const Dashboard = () => {
  const [bots, setBots] = useState<SignalBot[]>([]);
  const [botSettings, setBotSettings] = useState<Record<string, BotSettings>>({});
  const [expandedBot, setExpandedBot] = useState<string | null>(null);
  const [stats, setStats] = useState<TradeStats>({
    totalTrades: 0,
    winRate: 0,
    totalPnl: 0,
    avgTrade: 0,
    bestTrade: 0,
    worstTrade: 0,
    totalVolume: 0,
    activeBots: 0,
  });
  const [positions, setPositions] = useState<ActivePosition[]>([]);
  const [history, setHistory] = useState<TradeHistory[]>([]);
  const [signalLogs, setSignalLogs] = useState<SignalLog[]>([]);
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({});
  const [brokerBalances, setBrokerBalances] = useState<BrokerBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newBotName, setNewBotName] = useState("");
  const { toast } = useToast();
  const { signOut } = useAuth();
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  // Fetch broker account balances
  const fetchBrokerBalances = async () => {
    const brokers = ["bingx", "binance", "bybit"];
    const balances: BrokerBalance[] = [];
    
    for (const broker of brokers) {
      try {
        const res = await fetch(`${supabaseUrl}/functions/v1/test-${broker}`, {
          method: "GET",
        });
        const data = await res.json();
        
        if (data.connected) {
          balances.push({
            broker: broker.charAt(0).toUpperCase() + broker.slice(1),
            equity: data.account?.equity || 0,
            availableMargin: data.account?.availableMargin || 0,
            unrealizedPnL: data.account?.unrealizedPnL || 0,
            isDemo: data.isDemo || false,
            connected: true,
          });
        }
      } catch (e) {
        // Broker not configured - skip silently
      }
    }
    
    setBrokerBalances(balances);
  };

  // Refresh only prices and positions (not settings - to avoid overwriting edits)
  const refreshPrices = async () => {
    const { data: posData } = await supabase
      .from("active_positions")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (posData && posData.length > 0) {
      const symbols = [...new Set(posData.map((p: any) => p.symbol))];
      try {
        const pricePromises = symbols.map(async (symbol: string) => {
          const res = await fetch(`https://fapi.binance.com/fapi/v1/ticker/price?symbol=${symbol}`);
          const data = await res.json();
          return { symbol, price: parseFloat(data.price) };
        });
        const prices = await Promise.all(pricePromises);
        const priceMap: Record<string, number> = {};
        prices.forEach(p => { priceMap[p.symbol] = p.price; });
        setCurrentPrices(priceMap);
        
        const positionsWithPnl = posData.map((pos: any) => {
          const currentPrice = priceMap[pos.symbol] || pos.entry_price;
          const priceDiff = currentPrice - pos.entry_price;
          const unrealized_pnl = pos.side === "LONG" 
            ? priceDiff * pos.quantity 
            : -priceDiff * pos.quantity;
          return { ...pos, unrealized_pnl, current_price: currentPrice };
        });
        setPositions(positionsWithPnl as unknown as ActivePosition[]);
      } catch (e) {
        console.error("Failed to fetch prices:", e);
      }
    }
  };

  const fetchData = async () => {
    // Fetch bots
    const { data: botsData } = await supabase
      .from("signal_bots")
      .select("*")
      .order("created_at", { ascending: true });
    
    if (botsData) {
      setBots(botsData as SignalBot[]);
      
      // Fetch settings for each bot
      const settingsMap: Record<string, BotSettings> = {};
      for (const bot of botsData) {
        const { data: settings } = await supabase
          .from("bot_settings")
          .select("*")
          .eq("bot_id", bot.id)
          .single();
        if (settings) {
          settingsMap[bot.id] = settings as BotSettings;
        }
      }
      setBotSettings(settingsMap);
    }

    // Fetch positions
    const { data: posData } = await supabase
      .from("active_positions")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (posData && posData.length > 0) {
      // Get unique symbols from positions
      const symbols = [...new Set(posData.map((p: any) => p.symbol))];
      
      // Fetch current prices from Binance
      try {
        const pricePromises = symbols.map(async (symbol) => {
          const res = await fetch(`https://fapi.binance.com/fapi/v1/ticker/price?symbol=${symbol}`);
          const data = await res.json();
          return { symbol, price: parseFloat(data.price) };
        });
        const prices = await Promise.all(pricePromises);
        const priceMap: Record<string, number> = {};
        prices.forEach(p => { priceMap[p.symbol] = p.price; });
        setCurrentPrices(priceMap);
        
        // Calculate unrealized PnL for each position
        const positionsWithPnl = posData.map((pos: any) => {
          const currentPrice = priceMap[pos.symbol] || pos.entry_price;
          const priceDiff = currentPrice - pos.entry_price;
          const unrealized_pnl = pos.side === "LONG" 
            ? priceDiff * pos.quantity 
            : -priceDiff * pos.quantity;
          return { ...pos, unrealized_pnl, current_price: currentPrice };
        });
        setPositions(positionsWithPnl as unknown as ActivePosition[]);
      } catch (e) {
        console.error("Failed to fetch prices:", e);
        setPositions(posData as unknown as ActivePosition[]);
      }
    } else {
      setPositions([]);
    }

    // Fetch trade history (all trades, no limit for proper pagination)
    const { data: histData } = await supabase
      .from("trade_history")
      .select("*")
      .order("closed_at", { ascending: false });
    if (histData) {
      setHistory(histData as unknown as TradeHistory[]);
      
      // Calculate stats
      const wins = histData.filter((t: any) => t.pnl > 0).length;
      const totalPnl = histData.reduce((sum: number, t: any) => sum + (t.pnl || 0), 0);
      const pnls = histData.map((t: any) => t.pnl || 0);
      
      setStats({
        totalTrades: histData.length,
        winRate: histData.length > 0 ? (wins / histData.length) * 100 : 0,
        totalPnl,
        avgTrade: histData.length > 0 ? totalPnl / histData.length : 0,
        bestTrade: pnls.length > 0 ? Math.max(...pnls) : 0,
        worstTrade: pnls.length > 0 ? Math.min(...pnls) : 0,
        totalVolume: histData.reduce((sum: number, t: any) => sum + (t.quantity * t.entry_price || 0), 0),
        activeBots: botsData?.filter((b: any) => b.is_active).length || 0,
      });
    }

    // Fetch signal logs (last 100)
    const { data: logsData, error: logsError } = await supabase
      .from("trade_alerts")
      .select("id, symbol, action, status, message, strategy, created_at, bot_id")
      .order("created_at", { ascending: false })
      .limit(100);
    
    console.log("Signal logs fetch result:", { logsData, logsError, count: logsData?.length });
    
    if (logsError) {
      console.error("Error fetching signal logs:", logsError);
    }
    if (logsData) {
      setSignalLogs(logsData as unknown as SignalLog[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    fetchBrokerBalances();
    
    // Refresh prices every 5 seconds for live PnL (NOT full fetchData to preserve edits)
    const priceInterval = setInterval(refreshPrices, 5000);
    
    // Refresh broker balances every 30 seconds
    const balanceInterval = setInterval(fetchBrokerBalances, 30000);
    
    // Subscribe to realtime updates for positions/history only
    const channel = supabase
      .channel("dashboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "active_positions" }, refreshPrices)
      .on("postgres_changes", { event: "*", schema: "public", table: "trade_history" }, fetchData)
      .subscribe();
    
    return () => { 
      clearInterval(priceInterval);
      clearInterval(balanceInterval);
      supabase.removeChannel(channel); 
    };
  }, []);

  const createBot = async () => {
    if (!newBotName.trim()) return;
    
    const { data, error } = await supabase
      .from("signal_bots")
      .insert({ name: newBotName })
      .select()
      .single();
    
    if (error) {
      toast({ title: "Error", description: "Failed to create bot", variant: "destructive" });
      return;
    }
    
    // Create default settings
    if (data) {
      const { data: newSettings } = await supabase
        .from("bot_settings")
        .insert({ bot_id: data.id })
        .select()
        .single();
      
      // Add new bot settings to local state immediately
      if (newSettings) {
        setBotSettings(prev => ({
          ...prev,
          [data.id]: newSettings as BotSettings
        }));
      }
      
      // Auto-expand the new bot
      setExpandedBot(data.id);
    }
    
    toast({ title: "Bot Created", description: `${newBotName} is ready` });
    setNewBotName("");
    setShowCreateDialog(false);
    fetchData();
  };

  const deleteBot = async (botId: string) => {
    if (!confirm("Delete this bot?")) return;
    await supabase.from("signal_bots").delete().eq("id", botId);
    toast({ title: "Bot Deleted" });
    fetchData();
  };

  const toggleBot = async (bot: SignalBot) => {
    await supabase.from("signal_bots").update({ is_active: !bot.is_active }).eq("id", bot.id);
    fetchData();
  };

  const closePosition = async (position: ActivePosition, exitPrice?: number) => {
    // Calculate PnL if exit price provided
    const pnl = exitPrice 
      ? (position.side === "LONG" 
          ? (exitPrice - position.entry_price) * position.quantity 
          : (position.entry_price - exitPrice) * position.quantity)
      : position.unrealized_pnl || 0;
    
    // Raw price change % (without leverage) - like TradingView shows
    const priceDiff = exitPrice
      ? (position.side === "LONG" ? exitPrice - position.entry_price : position.entry_price - exitPrice)
      : 0;
    const pnlPercentage = exitPrice ? (priceDiff / position.entry_price) * 100 : 0;

    // Move to trade history
    await supabase.from("trade_history").insert({
      position_id: position.id,
      symbol: position.symbol,
      side: position.side,
      entry_price: position.entry_price,
      exit_price: exitPrice || position.entry_price,
      quantity: position.quantity,
      leverage: position.leverage,
      pnl: pnl,
      pnl_percentage: pnlPercentage,
      strategy: "manual",
      duration_seconds: Math.floor((Date.now() - new Date(position.created_at).getTime()) / 1000),
      opened_at: position.created_at,
      closed_at: new Date().toISOString(),
      bot_id: position.bot_id || null,
    });

    // Remove from active positions
    await supabase.from("active_positions").delete().eq("id", position.id);
    
    toast({ title: "Position Closed", description: `${position.symbol} marked as closed` });
    fetchData();
  };

  const saveSettings = async (botId: string) => {
    const settings = botSettings[botId];
    if (!settings) return;
    
    const { error } = await supabase
      .from("bot_settings")
      .update({
        sizing_mode: settings.sizing_mode,
        fixed_amount: settings.fixed_amount,
        percentage_value: settings.percentage_value,
        default_leverage: settings.default_leverage,
        auto_take_profit: settings.auto_take_profit,
        auto_stop_loss: settings.auto_stop_loss,
        trading_mode: settings.trading_mode,
        position_mode: settings.position_mode,
        primary_symbol: settings.primary_symbol,
        strategy_name: settings.strategy_name,
        timeframe: settings.timeframe,
        broker: settings.broker,
        use_testnet: settings.use_testnet,
      })
      .eq("bot_id", botId);
    
    if (error) {
      console.error("Save error:", error);
      toast({ title: "Error", description: "Failed to save: " + error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Settings updated" });
      fetchData(); // Refresh to confirm save
    }
  };

  const updateBotSettings = (botId: string, updates: Partial<BotSettings>) => {
    setBotSettings(prev => ({
      ...prev,
      [botId]: { ...prev[botId], ...updates }
    }));
  };

  const getIndicatorString = (bot: SignalBot) => {
    const settings = botSettings[bot.id];
    if (!settings) return bot.webhook_key;
    const broker = (settings.broker || "binance").charAt(0).toUpperCase() + (settings.broker || "binance").slice(1);
    const account = settings.use_testnet ? "Demo" : "Real";
    return `${broker}_${account}_${settings.primary_symbol || "BTC-USDT"}_${settings.strategy_name || "H9S"}_${settings.timeframe || "3M"}_${bot.webhook_key}`;
  };

  const copyIndicatorString = (bot: SignalBot) => {
    navigator.clipboard.writeText(getIndicatorString(bot));
    toast({ title: "Copied!", description: "Paste in TradingView indicator settings" });
  };

  const getBotPositions = (botId: string) => positions.filter(p => p.bot_id === botId);
  const getBotHistory = (botId: string) => {
    const filtered = history.filter(h => h.bot_id === botId);
    return filtered;
  };
  const getBotLogs = (botId: string) => {
    // Only show logs that have this exact bot_id
    // Old logs without bot_id won't show (they're from before per-bot tracking)
    return signalLogs.filter(l => l.bot_id === botId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-primary">TradeRelay</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">TradingView → Broker</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <ConnectionStatus service="TradingView" connected={true} />
                <ConnectionStatus service="Broker" connected={stats.activeBots > 0} />
              </div>
              <a href="https://signal-engine-psi.vercel.app/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-3">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Signal Engine</span>
                </Button>
              </a>
              <Link to="/settings">
                <Button variant="outline" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-3">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Configure</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={signOut} className="gap-1 text-muted-foreground hover:text-destructive px-2">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
          <StatCard icon={Bot} label="Bots" value={stats.activeBots} />
          <StatCard icon={Activity} label="Trades" value={stats.totalTrades} />
          <StatCard icon={Target} label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} positive={stats.winRate >= 50} />
          <StatCard icon={DollarSign} label="PnL" value={`$${stats.totalPnl.toFixed(2)}`} positive={stats.totalPnl >= 0} />
          <StatCard icon={BarChart3} label="Avg" value={`$${stats.avgTrade.toFixed(2)}`} positive={stats.avgTrade >= 0} />
          <StatCard icon={TrendingUp} label="Best" value={`$${stats.bestTrade.toFixed(2)}`} positive />
          <StatCard icon={TrendingDown} label="Worst" value={`$${stats.worstTrade.toFixed(2)}`} positive={false} />
          <StatCard icon={Clock} label="Open" value={positions.length} />
        </div>

        {/* Broker Balances */}
        {brokerBalances.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {brokerBalances.map((balance) => (
              <Card key={balance.broker} className="bg-card/50">
                <CardContent className="pt-4 pb-3 px-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-primary/10">
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium text-sm">{balance.broker}</span>
                      {balance.isDemo && (
                        <Badge variant="outline" className="text-xs px-1.5 py-0">Demo</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`h-2 w-2 rounded-full ${balance.connected ? 'bg-green-500' : 'bg-red-500'}`} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Equity</p>
                      <p className="text-sm font-semibold">${balance.equity.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Available</p>
                      <p className="text-sm font-semibold">${balance.availableMargin.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">uPnL</p>
                      <p className={`text-sm font-semibold ${balance.unrealizedPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ${balance.unrealizedPnL.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Bots Section */}
        <Card>
          <CardHeader className="py-2 sm:py-3 px-3 sm:px-6 flex flex-row items-center justify-between">
            <CardTitle className="text-base sm:text-lg flex items-center gap-1.5 sm:gap-2">
              <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Signal Bots</span>
              <span className="sm:hidden">Bots</span>
            </CardTitle>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1 h-7 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm">
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> 
                  <span className="hidden sm:inline">New Bot</span>
                  <span className="sm:hidden">New</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Bot</DialogTitle>
                  <DialogDescription>Give your bot a name</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="e.g., SOL Scalper, BTC Swing"
                    value={newBotName}
                    onChange={(e) => setNewBotName(e.target.value)}
                  />
                  <Button onClick={createBot} className="w-full">Create</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="p-0">
            {bots.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bot className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p>No bots yet. Create your first bot!</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {bots.map((bot) => (
                  <BotRow
                    key={bot.id}
                    bot={bot}
                    settings={botSettings[bot.id]}
                    expanded={expandedBot === bot.id}
                    onToggleExpand={() => setExpandedBot(expandedBot === bot.id ? null : bot.id)}
                    onToggleActive={() => toggleBot(bot)}
                    onDelete={() => deleteBot(bot.id)}
                    onCopy={() => copyIndicatorString(bot)}
                    onSave={() => saveSettings(bot.id)}
                    onUpdateSettings={(updates) => updateBotSettings(bot.id, updates)}
                    indicatorString={getIndicatorString(bot)}
                    positions={getBotPositions(bot.id)}
                    history={getBotHistory(bot.id)}
                    logs={getBotLogs(bot.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Positions */}
        {positions.length > 0 && (
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base sm:text-lg">Active Positions</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="grid gap-2">
                {positions.map((pos) => (
                  <div key={pos.id} className="p-2 sm:p-3 rounded-lg bg-muted/30 group">
                    {/* Mobile: Stack layout */}
                    <div className="flex items-center justify-between mb-2 sm:mb-0">
                      <div className="flex items-center gap-2">
                        <Badge variant={pos.side === "LONG" ? "default" : "destructive"} className="text-xs">
                          {pos.side}
                        </Badge>
                        <span className="font-mono font-medium text-sm">{pos.symbol}</span>
                        <span className="text-xs text-muted-foreground">{pos.leverage}x</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-sm ${(pos.unrealized_pnl || 0) >= 0 ? "text-green-500" : "text-red-500"}`}>
                          ${(pos.unrealized_pnl || 0).toFixed(2)}
                          <span className="text-xs ml-1">
                            ({((pos.unrealized_pnl || 0) / (pos.entry_price * pos.quantity) * 100).toFixed(1)}%)
                          </span>
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 sm:h-7 sm:w-7 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            const exitPrice = prompt(`Enter exit price for ${pos.symbol} (or leave empty):`);
                            closePosition(pos, exitPrice ? parseFloat(exitPrice) : undefined);
                          }}
                            title="Mark as closed (closed manually on broker)"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {/* Price details row */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>Entry: ${formatPrice(pos.entry_price)}</span>
                      <span className="text-primary">Now: ${formatPrice(pos.current_price || pos.entry_price)}</span>
                      <span>Qty: {pos.quantity}</span>
                      <span className="hidden sm:inline">
                        {new Date(pos.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Trades History */}
        <Card className="border-border bg-card/50">
          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">All Trade History</span>
              <span className="sm:hidden">History</span>
              <span className="text-muted-foreground text-xs sm:text-sm font-normal">({history.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            {history.length === 0 ? (
              <p className="text-xs sm:text-sm text-muted-foreground text-center py-4">No trades yet</p>
            ) : (
              <HistoryList history={history} />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

// History List Component with Pagination
function HistoryList({ history }: { history: TradeHistory[] }) {
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const totalPages = Math.ceil(history.length / pageSize);
  const paginatedHistory = history.slice(page * pageSize, (page + 1) * pageSize);
  
  return (
    <div className="space-y-2">
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {paginatedHistory.map(trade => (
          <div key={trade.id} className="p-2 rounded bg-muted/30 text-xs sm:text-sm">
            {/* Top row: side, symbol, P/L */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Badge variant={trade.side === "LONG" ? "default" : "destructive"} className="text-[10px] sm:text-xs px-1.5 sm:px-2">
                  {trade.side}
                </Badge>
                <span className="text-muted-foreground text-xs sm:text-sm">{trade.symbol}</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">x{trade.leverage || 10}</span>
              </div>
              {(() => {
                // Calculate raw price % from entry/exit (like TradingView)
                const priceDiff = trade.side === "LONG"
                  ? (trade.exit_price || 0) - (trade.entry_price || 0)
                  : (trade.entry_price || 0) - (trade.exit_price || 0);
                const pct = trade.entry_price ? (priceDiff / trade.entry_price) * 100 : 0;
                return (
                  <span className={`text-xs sm:text-sm font-medium ${trade.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                    ${trade.pnl?.toFixed(2) || "0.00"}
                    <span className="text-[10px] sm:text-xs ml-0.5">({pct.toFixed(1)}%)</span>
                  </span>
                );
              })()}
            </div>
            {/* Details row - wraps on mobile */}
            <div className="flex flex-wrap gap-x-2 sm:gap-x-3 gap-y-0.5 mt-1 text-[10px] sm:text-xs text-muted-foreground">
              <span>Entry: ${formatPrice(trade.entry_price)}</span>
              <span>Exit: ${formatPrice(trade.exit_price)}</span>
              <span className="hidden sm:inline">Qty: {trade.quantity?.toFixed(4) || "-"}</span>
              {(trade.fee ?? 0) > 0 && <span className="text-orange-400">Fee: ${trade.fee?.toFixed(4)}</span>}
            </div>
            {/* Time row - stacks on mobile */}
            <div className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-0.5">
              {trade.opened_at && new Date(trade.opened_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}
              <span className="mx-1">→</span>
              {new Date(trade.closed_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
          </div>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground">
            Page {page + 1} of {totalPages} ({history.length} trades)
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              ← Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              Next →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Stat Card Component
function StatCard({ icon: Icon, label, value, positive }: { 
  icon: any; 
  label: string; 
  value: string | number;
  positive?: boolean;
}) {
  return (
    <div className="p-2 sm:p-3 rounded-lg bg-muted/30 border border-border">
      <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
        <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        <span className="text-[10px] sm:text-xs text-muted-foreground truncate">{label}</span>
      </div>
      <div className={`text-sm sm:text-lg font-bold truncate ${positive === true ? "text-green-500" : positive === false ? "text-red-500" : ""}`}>
        {value}
      </div>
    </div>
  );
}

// Bot Row Component
function BotRow({
  bot,
  settings,
  expanded,
  onToggleExpand,
  onToggleActive,
  onDelete,
  onCopy,
  onSave,
  onUpdateSettings,
  indicatorString,
  positions,
  history,
  logs,
}: {
  bot: SignalBot;
  settings: BotSettings | undefined;
  expanded: boolean;
  onToggleExpand: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
  onCopy: () => void;
  onSave: () => void;
  onUpdateSettings: (updates: Partial<BotSettings>) => void;
  indicatorString: string;
  positions: ActivePosition[];
  history: TradeHistory[];
  logs: SignalLog[];
}) {
  const wins = history.filter(h => h.pnl > 0).length;
  const pnl = history.reduce((sum, h) => sum + h.pnl, 0);
  
  return (
    <Collapsible open={expanded} onOpenChange={onToggleExpand}>
      <div className="px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between hover:bg-muted/20">
        <CollapsibleTrigger className="flex items-center gap-1.5 sm:gap-3 flex-1 min-w-0">
          {expanded ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
          <Bot className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 ${bot.is_active ? "text-primary" : "text-muted-foreground"}`} />
          <span className="font-medium text-sm sm:text-base truncate">{bot.name}</span>
          <Badge variant={bot.is_active ? "default" : "secondary"} className="text-[10px] sm:text-xs shrink-0 hidden xs:inline-flex">
            {bot.is_active ? "Active" : "Paused"}
          </Badge>
        </CollapsibleTrigger>
        
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="hidden md:flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">{settings?.primary_symbol || "BTC-USDT"}</span>
            <span>{positions.length} pos</span>
            <span className={pnl >= 0 ? "text-green-500" : "text-red-500"}>${pnl.toFixed(2)}</span>
            <span className="text-muted-foreground">{wins}/{history.length} W</span>
          </div>
          {/* Show compact stats on mobile */}
          <span className={`md:hidden text-xs font-medium ${pnl >= 0 ? "text-green-500" : "text-red-500"}`}>${pnl.toFixed(0)}</span>
          <Switch checked={bot.is_active} onCheckedChange={onToggleActive} />
        </div>
      </div>
      
      <CollapsibleContent>
        <div className="px-2 sm:px-4 pb-3 sm:pb-4 pt-2 border-t border-border bg-muted/10">
          {/* TradingView Setup Info */}
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 rounded-lg bg-primary/5 border border-primary/30 space-y-3">
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Your indicator sends: <code className="text-primary">ENTER-LONG_{"{webhookCode}"}</code>
            </p>
            
            {/* Step 1: Webhook Code for Indicator */}
            <div>
              <Label className="text-[10px] sm:text-xs text-primary mb-1 block">
                1. Indicator "Webhook" Input (paste in H9S indicator settings)
              </Label>
              <div className="flex gap-2">
                <code className="flex-1 p-1.5 sm:p-2 rounded bg-background text-[10px] sm:text-sm font-mono break-all">
                  {indicatorString}
                </code>
                <Button variant="default" size="icon" onClick={onCopy} className="h-8 w-8 sm:h-10 sm:w-10 shrink-0">
                  <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
            
            {/* Step 2: Webhook URL */}
            <div>
              <Label className="text-[10px] sm:text-xs text-primary mb-1 block">
                2. Webhook URL (paste in TradingView alert settings)
              </Label>
              <div className="flex gap-2">
                <code className="flex-1 p-1.5 sm:p-2 rounded bg-background text-[10px] sm:text-sm font-mono break-all">
                  {`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/bot-webhook/${bot.webhook_key}`}
                </code>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => {
                    navigator.clipboard.writeText(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/bot-webhook/${bot.webhook_key}`);
                  }} 
                  className="h-8 w-8 sm:h-10 sm:w-10 shrink-0"
                >
                  <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
            
            {/* Step 3: Message */}
            <div>
              <Label className="text-[10px] sm:text-xs text-muted-foreground mb-1 block">
                3. Message (in TradingView alert)
              </Label>
              <code className="block p-1.5 sm:p-2 rounded bg-background text-[10px] sm:text-sm font-mono">
                {`{{message}}`}
              </code>
            </div>
          </div>

          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid w-full grid-cols-5 h-8 sm:h-10">
              <TabsTrigger value="settings" className="text-[10px] sm:text-sm px-1 sm:px-3">Settings</TabsTrigger>
              <TabsTrigger value="positions" className="text-[10px] sm:text-sm px-1 sm:px-3">Pos ({positions.length})</TabsTrigger>
              <TabsTrigger value="history" className="text-[10px] sm:text-sm px-1 sm:px-3">History</TabsTrigger>
              <TabsTrigger value="logs" className="text-[10px] sm:text-sm px-1 sm:px-3">Logs ({logs.length})</TabsTrigger>
              <TabsTrigger value="performance" className="text-[10px] sm:text-sm px-1 sm:px-3">Stats</TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings" className="pt-3 sm:pt-4">
              {settings && (
                <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    {/* Broker Selection */}
                    <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                      <div>
                        <Label className="text-xs">Broker</Label>
                        <Select
                          value={settings.broker || "binance"}
                          onValueChange={(v) => onUpdateSettings({ broker: v })}
                        >
                          <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="binance">Binance</SelectItem>
                            <SelectItem value="bingx">BingX</SelectItem>
                            <SelectItem value="bybit">Bybit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Account</Label>
                        <Select
                          value={settings.use_testnet ? "demo" : "real"}
                          onValueChange={(v) => onUpdateSettings({ use_testnet: v === "demo" })}
                        >
                          <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="real">🟢 Real</SelectItem>
                            <SelectItem value="demo">🟡 Demo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                      <div>
                        <Label className="text-xs">Coin</Label>
                        <Select
                          value={settings.primary_symbol || "BTC-USDT"}
                          onValueChange={(v) => onUpdateSettings({ primary_symbol: v })}
                        >
                          <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {AVAILABLE_COINS.map(c => (
                              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Strategy</Label>
                        <Input
                          className="h-8"
                          value={settings.strategy_name || "H9S"}
                          onChange={(e) => onUpdateSettings({ strategy_name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Timeframe</Label>
                        <Select
                          value={settings.timeframe || "3M"}
                          onValueChange={(v) => onUpdateSettings({ timeframe: v })}
                        >
                          <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {["1M", "3M", "5M", "15M", "30M", "45M", "1H", "2H", "3H", "4H", "1D", "1W"].map(tf => (
                              <SelectItem key={tf} value={tf}>{tf}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <Label className="text-xs">Position Size</Label>
                        <div className="flex gap-1">
                          <Button
                            variant={settings.sizing_mode === "fixed" ? "default" : "outline"}
                            size="sm"
                            className="h-5 px-2 text-xs"
                            onClick={() => onUpdateSettings({ sizing_mode: "fixed" })}
                          >
                            USD
                          </Button>
                          <Button
                            variant={settings.sizing_mode === "percentage" ? "default" : "outline"}
                            size="sm"
                            className="h-5 px-2 text-xs"
                            onClick={() => onUpdateSettings({ sizing_mode: "percentage" })}
                          >
                            % Capital
                          </Button>
                        </div>
                      </div>
                      {settings.sizing_mode === "percentage" ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            className="h-8"
                            value={settings.percentage_value || 5}
                            onChange={(e) => onUpdateSettings({ percentage_value: Number(e.target.value) })}
                          />
                          <span className="text-xs text-muted-foreground">%</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            className="h-8"
                            value={settings.fixed_amount || 150}
                            onChange={(e) => onUpdateSettings({ fixed_amount: Number(e.target.value) })}
                          />
                          <span className="text-xs text-muted-foreground">USD</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex justify-between">
                        <Label className="text-xs">Leverage</Label>
                        <span className="text-xs text-primary">{settings.default_leverage || 10}x</span>
                      </div>
                      <Slider
                        value={[settings.default_leverage || 10]}
                        onValueChange={([v]) => onUpdateSettings({ default_leverage: v })}
                        min={1}
                        max={50}
                        step={1}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Take Profit (%)</Label>
                      <Input
                        type="number"
                        className="h-8"
                        placeholder="Auto TP"
                        value={settings.auto_take_profit || ""}
                        onChange={(e) => onUpdateSettings({ auto_take_profit: e.target.value ? Number(e.target.value) : null })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Stop Loss (%)</Label>
                      <Input
                        type="number"
                        className="h-8"
                        placeholder="Auto SL"
                        value={settings.auto_stop_loss || ""}
                        onChange={(e) => onUpdateSettings({ auto_stop_loss: e.target.value ? Number(e.target.value) : null })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Mode</Label>
                      <Select
                        value={settings.position_mode || "single"}
                        onValueChange={(v) => onUpdateSettings({ position_mode: v })}
                      >
                        <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single Position</SelectItem>
                          <SelectItem value="multi">Multi Position</SelectItem>
                          <SelectItem value="swing">Swing (Reversal)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <Button onClick={onSave} className="flex-1">Save Settings</Button>
                <Button variant="destructive" size="icon" onClick={onDelete}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="positions" className="pt-3 sm:pt-4">
              {positions.length === 0 ? (
                <p className="text-xs sm:text-sm text-muted-foreground text-center py-4">No active positions</p>
              ) : (
                <div className="space-y-2">
                  {positions.map(pos => (
                    <div key={pos.id} className="p-2 rounded bg-muted/30 text-xs sm:text-sm">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Badge variant={pos.side === "LONG" ? "default" : "destructive"} className="text-[10px] sm:text-xs px-1.5">
                            {pos.side}
                          </Badge>
                          <span>${formatPrice(pos.entry_price)}</span>
                          <span className="text-muted-foreground">x{pos.leverage}</span>
                        </div>
                        <span className={pos.unrealized_pnl >= 0 ? "text-green-500" : "text-red-500"}>
                          ${pos.unrealized_pnl?.toFixed(2) || "0.00"}
                          <span className="text-[10px] sm:text-xs ml-0.5">
                            ({((pos.unrealized_pnl || 0) / (pos.entry_price * pos.quantity) * 100).toFixed(1)}%)
                          </span>
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        {new Date(pos.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="pt-3 sm:pt-4">
              {history.length === 0 ? (
                <p className="text-xs sm:text-sm text-muted-foreground text-center py-4">
                  No trade history for this bot
                  <br />
                  <span className="text-[10px] sm:text-xs">Bot ID: {bot.id.slice(0, 8)}...</span>
                </p>
              ) : (
                <HistoryList history={history} />
              )}
            </TabsContent>

            <TabsContent value="logs" className="pt-3 sm:pt-4">
              {logs.length === 0 ? (
                <p className="text-xs sm:text-sm text-muted-foreground text-center py-4">
                  No signal logs for this bot yet
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {logs.map(log => (
                    <div 
                      key={log.id} 
                      className={`p-2 rounded text-xs sm:text-sm ${
                        log.status === 'error' || log.status === 'failed' 
                          ? 'bg-destructive/10 border border-destructive/30' 
                          : log.status === 'success' || log.status === 'sent'
                            ? 'bg-green-500/10 border border-green-500/30'
                            : 'bg-muted/30'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex flex-col gap-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge 
                              variant={
                                log.status === 'success' || log.status === 'sent' ? 'default' : 
                                log.status === 'error' || log.status === 'failed' ? 'destructive' : 
                                'secondary'
                              }
                              className="text-[10px] sm:text-xs"
                            >
                              {log.status?.toUpperCase() || 'UNKNOWN'}
                            </Badge>
                            {log.action && (
                              <span className="text-xs font-medium">
                                {log.action}
                              </span>
                            )}
                            {log.symbol && (
                              <span className="text-xs text-muted-foreground">
                                {log.symbol}
                              </span>
                            )}
                          </div>
                          {log.message && (
                            <p className={`text-xs break-words ${log.status === 'error' || log.status === 'failed' ? 'text-destructive' : 'text-muted-foreground'}`}>
                              {log.message}
                            </p>
                          )}
                        </div>
                        <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString([], { 
                            month: 'short', 
                            day: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="performance" className="pt-3 sm:pt-4">
              {(() => {
                const pnlPercentages = history.map(h => h.pnl_percentage || 0);
                const avgPct = pnlPercentages.length > 0 ? pnlPercentages.reduce((a, b) => a + b, 0) / pnlPercentages.length : 0;
                const bestPct = pnlPercentages.length > 0 ? Math.max(...pnlPercentages) : 0;
                const worstPct = pnlPercentages.length > 0 ? Math.min(...pnlPercentages) : 0;
                return (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    <div className="p-2 sm:p-3 rounded bg-muted/30 text-center">
                      <div className="text-xl sm:text-2xl font-bold">{history.length}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">Trades</div>
                    </div>
                    <div className="p-2 sm:p-3 rounded bg-muted/30 text-center">
                      <div className={`text-xl sm:text-2xl font-bold ${wins / history.length >= 0.5 ? "text-green-500" : "text-red-500"}`}>
                        {history.length > 0 ? ((wins / history.length) * 100).toFixed(0) : 0}%
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">Win Rate</div>
                    </div>
                    <div className="p-2 sm:p-3 rounded bg-muted/30 text-center">
                      <div className={`text-xl sm:text-2xl font-bold ${pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                        ${pnl.toFixed(2)}
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">Total PnL</div>
                    </div>
                    <div className="p-2 sm:p-3 rounded bg-muted/30 text-center">
                      <div className="text-xl sm:text-2xl font-bold">{wins}/{history.length - wins}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">W/L</div>
                    </div>
                    <div className="p-2 sm:p-3 rounded bg-muted/30 text-center">
                      <div className={`text-xl sm:text-2xl font-bold ${avgPct >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {avgPct.toFixed(1)}%
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">Avg Move</div>
                    </div>
                    <div className="p-2 sm:p-3 rounded bg-muted/30 text-center">
                      <div className="text-xl sm:text-2xl font-bold text-green-500">
                        {bestPct.toFixed(1)}%
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">Best</div>
                    </div>
                    <div className="p-2 sm:p-3 rounded bg-muted/30 text-center">
                      <div className="text-xl sm:text-2xl font-bold text-red-500">
                        {worstPct.toFixed(1)}%
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">Worst</div>
                    </div>
                    <div className="p-2 sm:p-3 rounded bg-muted/30 text-center">
                      <div className={`text-xl sm:text-2xl font-bold ${pnl / history.length >= 0 ? "text-green-500" : "text-red-500"}`}>
                        ${history.length > 0 ? (pnl / history.length).toFixed(2) : "0.00"}
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">Avg PnL</div>
                    </div>
                  </div>
                );
              })()}
            </TabsContent>
          </Tabs>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default Dashboard;
