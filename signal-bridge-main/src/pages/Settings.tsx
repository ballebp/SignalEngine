import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Key, TestTube, CheckCircle, XCircle, Loader2, Wallet, TrendingUp, Webhook, Play, Copy, Zap, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BrokerTestResult {
  connected: boolean;
  broker?: string;
  isTestnet?: boolean;
  isDemo?: boolean;
  mode?: string;
  error?: string;
  code?: number;
  account?: {
    equity: number;
    availableMargin: number;
    walletBalance?: number;
    usedMargin?: number;
    unrealizedPnL: number;
    usdtBalance?: number;
  };
  positions?: Array<{
    symbol: string;
    side: string;
    size: number;
    entryPrice: number;
    unrealizedPnL: number;
    leverage: number;
    takeProfit?: number | null;
    stopLoss?: number | null;
  }>;
  btcPrice?: number;
  apiKeyPreview?: string;
}

export default function Settings() {
  const [activeBroker, setActiveBroker] = useState<"binance" | "bybit" | "bingx">("binance");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<BrokerTestResult | null>(null);
  const { toast } = useToast();
  
  // Webhook test state
  const [testKey, setTestKey] = useState("");
  const [testAction, setTestAction] = useState("ENTER-LONG");
  const [testSymbol, setTestSymbol] = useState("SOL-USDT");
  const [testStrategy, setTestStrategy] = useState("H9S");
  const [testTimeframe, setTestTimeframe] = useState("3M");
  const [webhookTesting, setWebhookTesting] = useState(false);
  const [webhookResult, setWebhookResult] = useState<any>(null);
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://pkwrzdfyqfhtolvhbmvh.supabase.co";
  // Use bot-webhook with key for per-bot routing
  const getWebhookUrl = (key: string) => `${supabaseUrl}/functions/v1/bot-webhook/${key}`;
  const webhookUrl = testKey ? getWebhookUrl(testKey) : `${supabaseUrl}/functions/v1/bot-webhook/<key>`;

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast({ title: "Copied!", description: "Webhook URL copied to clipboard" });
  };

  const testWebhook = async () => {
    if (!testKey) {
      toast({ title: "Error", description: "Enter a webhook key", variant: "destructive" });
      return;
    }
    setWebhookTesting(true);
    setWebhookResult(null);
    // Format: ACTION_STRATEGY_SYMBOL (e.g., ENTER-LONG_H9S_SOLUSDT)
    const symbolFormatted = testSymbol.replace("-", "");
    const alertMessage = `${testAction}_${testStrategy}_${symbolFormatted}`;
    try {
      const response = await fetch(getWebhookUrl(testKey), {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: alertMessage,
      });
      const data = await response.json();
      setWebhookResult({ success: response.ok, data });
      if (response.ok && data.success) {
        toast({ title: "Success!", description: "Trade signal sent" });
      } else {
        toast({ title: "Failed", description: data.error || "Test failed", variant: "destructive" });
      }
    } catch (err: any) {
      setWebhookResult({ success: false, data: { error: err.message } });
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setWebhookTesting(false);
  };

  const getAlertPreview = () => `${testAction}_${testStrategy}_${testSymbol.replace("-", "")}`;

  // Test broker connection
  const testConnection = async (broker: "binance" | "bybit" | "bingx") => {
    setTesting(true);
    setTestResult(null);

    try {
      const functionName = broker === "binance" ? "test-binance" : broker === "bybit" ? "test-bybit" : "test-bingx";
      const brokerName = broker === "binance" ? "Binance" : broker === "bybit" ? "Bybit" : "BingX";
      const { data, error } = await supabase.functions.invoke(functionName);

      if (error) throw error;

      setTestResult(data);

      if (data.connected) {
        const balance = data.account?.equity || data.account?.usdtBalance || 0;
        toast({
          title: "Connection Successful",
          description: `Connected to ${brokerName} (${data.mode}). Balance: $${balance.toLocaleString()}`,
        });
      } else {
        toast({
          title: "Connection Failed",
          description: data.error || `Could not connect to ${brokerName}`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Test error:", error);
      setTestResult({
        connected: false,
        error: error.message || "Failed to test connection",
      });
      toast({
        title: "Error",
        description: "Failed to test connection",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Settings</h1>
              <p className="text-sm text-muted-foreground">Configure broker connection</p>
            </div>
          </div>
          <a href="https://signal-engine-psi.vercel.app/" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-2 px-2 sm:px-3">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Signal Engine</span>
            </Button>
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Webhook Setup - NEW SECTION */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5 text-primary" />
                Webhook URL
              </CardTitle>
              <CardDescription>
                Use this URL in TradingView's webhook field
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input value={webhookUrl} readOnly className="font-mono text-xs" />
                <Button onClick={copyWebhookUrl} variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs">
                <p className="font-medium text-blue-500 mb-2">TradingView Setup:</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Create an alert on your chart</li>
                  <li>Enable webhook in alert settings</li>
                  <li>Paste the URL above</li>
                  <li>Set message to: <code className="bg-background px-1 rounded">{"{{strategy.order.alert_message}}"}</code></li>
                </ol>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />
                Test Webhook
              </CardTitle>
              <CardDescription>
                Send a test signal to verify your setup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Action</Label>
                  <Select value={testAction} onValueChange={setTestAction}>
                    <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ENTER-LONG">ENTER-LONG</SelectItem>
                      <SelectItem value="ENTER-SHORT">ENTER-SHORT</SelectItem>
                      <SelectItem value="EXIT-LONG">EXIT-LONG</SelectItem>
                      <SelectItem value="EXIT-SHORT">EXIT-SHORT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Symbol</Label>
                  <Select value={testSymbol} onValueChange={setTestSymbol}>
                    <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BTC-USDT">BTC-USDT</SelectItem>
                      <SelectItem value="ETH-USDT">ETH-USDT</SelectItem>
                      <SelectItem value="SOL-USDT">SOL-USDT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-xs">Webhook Key (from your bot)</Label>
                <Input 
                  className="h-8" 
                  value={testKey} 
                  onChange={(e) => setTestKey(e.target.value)}
                  placeholder="Paste from Dashboard bot"
                />
              </div>
              <div className="p-2 rounded bg-muted text-xs font-mono break-all">
                {getAlertPreview()}
              </div>
              <Button 
                onClick={testWebhook} 
                disabled={webhookTesting || !testKey}
                className="w-full gap-2"
                size="sm"
              >
                {webhookTesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                Send Test Signal
              </Button>
              {webhookResult && (
                <div className={`p-2 rounded text-xs ${webhookResult.success ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"}`}>
                  <Badge variant={webhookResult.success ? "default" : "destructive"} className="mb-1">
                    {webhookResult.success ? "Success" : "Failed"}
                  </Badge>
                  <pre className="overflow-auto max-h-24 text-[10px]">
                    {JSON.stringify(webhookResult.data, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Broker Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Broker Configuration
            </CardTitle>
            <CardDescription>
              Configure API keys for your preferred broker. Bybit testnet is recommended for safe testing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeBroker}
              onValueChange={(v) => {
                setActiveBroker(v as "binance" | "bybit" | "bingx");
                setTestResult(null);
              }}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="binance" className="gap-2">
                  Binance
                  <Badge variant="outline" className="ml-1 text-xs">Testnet ✓</Badge>
                </TabsTrigger>
                <TabsTrigger value="bybit" className="gap-2">
                  Bybit
                  <Badge variant="outline" className="ml-1 text-xs">Testnet ✓</Badge>
                </TabsTrigger>
                <TabsTrigger value="bingx">BingX</TabsTrigger>
              </TabsList>

              {/* Binance Configuration */}
              <TabsContent value="binance" className="space-y-4 mt-4">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    ✓ Binance Futures Testnet Available
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Practice trading with virtual funds on the most popular exchange!
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-3">
                  <p className="text-sm font-medium">Setup Instructions:</p>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>
                      Go to{" "}
                      <a
                        href="https://testnet.binancefuture.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        Binance Futures Testnet
                      </a>
                    </li>
                    <li>Login with GitHub (recommended) or Email</li>
                    <li>Go to API Management (bottom of sidebar) → Create API Key</li>
                    <li>
                      Add secrets to Supabase (Edge Functions → Secrets):
                      <ul className="ml-6 mt-1 space-y-1">
                        <li>
                          <code className="text-primary">BINANCE_API_KEY</code> - Your API key
                        </li>
                        <li>
                          <code className="text-primary">BINANCE_SECRET_KEY</code> - Your secret key
                        </li>
                        <li>
                          <code className="text-primary">BINANCE_USE_TESTNET</code> - Set to{" "}
                          <code className="text-primary">true</code> (default)
                        </li>
                      </ul>
                    </li>
                    <li>You get 10,000 USDT automatically on testnet</li>
                  </ol>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => testConnection("binance")} disabled={testing} className="gap-2">
                    {testing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <TestTube className="h-4 w-4" />
                    )}
                    Test Binance Connection
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open("https://testnet.binancefuture.com", "_blank")}
                  >
                    Open Testnet
                  </Button>
                </div>
              </TabsContent>

              {/* Bybit Configuration */}
              <TabsContent value="bybit" className="space-y-4 mt-4">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    ✓ Bybit Testnet Available
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Practice trading with virtual funds - no real money at risk!
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-3">
                  <p className="text-sm font-medium">Setup Instructions:</p>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>
                      Go to{" "}
                      <a
                        href="https://testnet.bybit.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        Bybit Testnet
                      </a>{" "}
                      and create an account
                    </li>
                    <li>Navigate to API Management and create new API keys</li>
                    <li>
                      Add secrets to Supabase (Edge Functions → Secrets):
                      <ul className="ml-6 mt-1 space-y-1">
                        <li>
                          <code className="text-primary">BYBIT_API_KEY</code> - Your Bybit API key
                        </li>
                        <li>
                          <code className="text-primary">BYBIT_SECRET_KEY</code> - Your Bybit secret key
                        </li>
                        <li>
                          <code className="text-primary">BYBIT_USE_TESTNET</code> - Set to{" "}
                          <code className="text-primary">true</code> (default)
                        </li>
                      </ul>
                    </li>
                    <li>Get testnet funds from the faucet on the testnet site</li>
                  </ol>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => testConnection("bybit")} disabled={testing} className="gap-2">
                    {testing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <TestTube className="h-4 w-4" />
                    )}
                    Test Bybit Connection
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open("https://testnet.bybit.com", "_blank")}
                  >
                    Open Testnet
                  </Button>
                </div>
              </TabsContent>

              {/* BingX Configuration */}
              <TabsContent value="bingx" className="space-y-4 mt-4">
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                    ⚠ BingX Demo Not Publicly Available
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    BingX demo/testnet is only available for broker partners. Use with real funds or switch to Bybit for testing.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-3">
                  <p className="text-sm font-medium">Setup Instructions:</p>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Go to your Supabase project dashboard</li>
                    <li>Navigate to Edge Functions → Secrets</li>
                    <li>
                      Add the following secrets:
                      <ul className="ml-6 mt-1 space-y-1">
                        <li>
                          <code className="text-primary">BINGX_API_KEY</code> - Your BingX API key
                        </li>
                        <li>
                          <code className="text-primary">BINGX_SECRET_KEY</code> - Your BingX secret key
                        </li>
                      </ul>
                    </li>
                  </ol>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => testConnection("bingx")} disabled={testing} className="gap-2">
                    {testing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <TestTube className="h-4 w-4" />
                    )}
                    Test BingX Connection
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open("https://bingx.com/en-us/account/api/", "_blank")}
                  >
                    Get API Keys
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Connection Status */}
        {testResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {testResult.connected ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                Connection Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={testResult.connected ? "default" : "destructive"}>
                  {testResult.connected ? "Connected" : "Disconnected"}
                </Badge>
                {testResult.broker && (
                  <Badge variant="secondary">{testResult.broker}</Badge>
                )}
                {testResult.mode && (
                  <Badge variant={testResult.isTestnet || testResult.isDemo ? "outline" : "default"}>
                    {testResult.mode}
                  </Badge>
                )}
                {testResult.apiKeyPreview && (
                  <span className="text-xs text-muted-foreground font-mono">
                    {testResult.apiKeyPreview}
                  </span>
                )}
              </div>

              {testResult.error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-500">
                  {testResult.error}
                  {testResult.code && <span className="ml-2 text-xs">(Code: {testResult.code})</span>}
                </div>
              )}

              {testResult.connected && testResult.account && (
                <>
                  {/* Account Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Wallet className="h-4 w-4" />
                        {testResult.account.usdtBalance !== undefined ? "USDT Balance" : "Equity"}
                      </div>
                      <div className="text-xl font-bold">
                        $
                        {(
                          testResult.account.usdtBalance ||
                          testResult.account.equity ||
                          0
                        ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <TrendingUp className="h-4 w-4" />
                        Available
                      </div>
                      <div className="text-xl font-bold">
                        $
                        {testResult.account.availableMargin.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Unrealized PnL */}
                  {testResult.account.unrealizedPnL !== 0 && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">Unrealized P&L</span>
                      <span
                        className={`font-mono font-bold ${
                          testResult.account.unrealizedPnL >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {testResult.account.unrealizedPnL >= 0 ? "+" : ""}$
                        {testResult.account.unrealizedPnL.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}

                  {/* BTC Price */}
                  {testResult.btcPrice && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">BTC/USDT Price</span>
                      <span className="font-mono font-bold">
                        ${testResult.btcPrice.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Open Positions */}
                  {testResult.positions && testResult.positions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">
                        Open Positions ({testResult.positions.length})
                      </h4>
                      <div className="space-y-2">
                        {testResult.positions.map((pos, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                          >
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  pos.side.toUpperCase().includes("LONG") || pos.side === "Buy"
                                    ? "default"
                                    : "destructive"
                                }
                                className="text-xs"
                              >
                                {pos.side}
                              </Badge>
                              <span className="font-mono text-sm">{pos.symbol}</span>
                              <span className="text-xs text-muted-foreground">{pos.leverage}x</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-mono">{pos.size}</div>
                              <div
                                className={`text-xs font-mono ${
                                  pos.unrealizedPnL >= 0 ? "text-green-500" : "text-red-500"
                                }`}
                              >
                                {pos.unrealizedPnL >= 0 ? "+" : ""}
                                {pos.unrealizedPnL.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {testResult.positions && testResult.positions.length === 0 && (
                    <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground text-center">
                      No open positions
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* API Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>Required API Permissions</CardTitle>
            <CardDescription>
              Make sure your API key has these permissions enabled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Read Account Info</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Perpetual Futures Trading (Contract Trading)</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <XCircle className="h-4 w-4" />
                <span className="text-sm">Withdrawals (not needed - never enable this)</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              For security, never enable withdrawal permissions on trading API keys. Also consider IP
              whitelisting if available.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
