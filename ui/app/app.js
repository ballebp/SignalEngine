const state = {
  selectedBotId: 'ad1-prod',
  selectedScenarioId: 'scenario-prod',
  bots: [
    {
      id: 'ad1-prod',
      name: 'AD1 / Binance_Dem',
      symbol: 'FARTCOINUSDT.P',
      timeframe: '5m',
      webhookKey: 'Binance_Dem',
      tradeRelayUrl: '',
      tradeRelayWebhookCode: '',
      status: 'Running',
      winRate: 84.44,
      netPl: 30.0,
      drawdown: 23.55,
      trades: 90,
      tp: 1.5,
      sl: 6.0,
      threshold: 90,
      source1: 'BINANCE:BTCUSDT',
      source2: 'COINBASE:BTCUSD',
      source3: 'KRAKEN:BTCUSD',
      source4: 'BITSTAMP:BTCUSD',
    },
    {
      id: 'ad1-btc-15m',
      name: 'AD1 / BTC Sweep Lane',
      symbol: 'BTCUSDT',
      timeframe: '15m',
      webhookKey: 'BTC_Sweep',
      tradeRelayUrl: '',
      tradeRelayWebhookCode: '',
      status: 'Replay',
      winRate: 61.2,
      netPl: -2.4,
      drawdown: 11.8,
      trades: 37,
      tp: 1.2,
      sl: 4.0,
      threshold: 92,
      source1: 'BINANCE:BTCUSDT',
      source2: 'COINBASE:BTCUSD',
      source3: 'KRAKEN:BTCUSD',
      source4: 'BITSTAMP:BTCUSD',
    },
    {
      id: 'h9s-btc-15m',
      name: 'H9S / BTC',
      symbol: 'BTCUSDT',
      timeframe: '15m',
      strategy: 'h9s',
      tpType: 'dynamic',
      bosConfType: 'close',
      slippage: 0.05,
      webhookKey: 'H9S_BTC',
      tradeRelayUrl: '',
      tradeRelayWebhookCode: '',
      status: 'Replay',
      winRate: 0,
      netPl: 0,
      drawdown: 0,
      trades: 0,
      tp: 1.0,
      sl: 1.0,
      threshold: 25,
      source1: 'BINANCE:BTCUSDT',
      source2: 'COINBASE:BTCUSD',
      source3: 'KRAKEN:BTCUSD',
      source4: 'BITSTAMP:BTCUSD',
    },
    {
      id: 'b5s-btc-15m',
      name: 'B5S / B1',
      symbol: 'BTCUSDT',
      timeframe: '15m',
      strategy: 'b5s',
      tpType: 'dynamic',
      bosConfType: 'close',
      maxTrades: 3,
      webhookKey: 'B5S_BTC',
      tradeRelayUrl: '',
      tradeRelayWebhookCode: '',
      status: 'Replay',
      winRate: 0,
      netPl: 0,
      drawdown: 0,
      trades: 0,
      tp: 1.0,
      sl: 1.0,
      threshold: 25,
    },
    // ── AI-native strategies ─────────────────────────────────────────────────
    {
      id: 'ai1-eth-1h',
      name: 'AI1 / EMA+RSI Trend',
      symbol: 'ETHUSDT',
      timeframe: '1h',
      strategy: 'ai1',
      webhookKey: 'AI1_ETH',
      tradeRelayUrl: '',
      tradeRelayWebhookCode: '',
      status: 'Replay',
      winRate: 0,
      netPl: 0,
      drawdown: 0,
      trades: 0,
      tp: 2.5,      // ATR multiplier for take-profit (2.5 × ATR)
      sl: 1.2,      // ATR multiplier for stop-loss  (1.2 × ATR  → ~2:1 R/R)
      threshold: 14, // RSI lookback period
    },
    {
      id: 'ai2-sol-15m',
      name: 'AI2 / BB Squeeze Breakout',
      symbol: 'SOLUSDT',
      timeframe: '15m',
      strategy: 'ai2',
      webhookKey: 'AI2_SOL',
      tradeRelayUrl: '',
      tradeRelayWebhookCode: '',
      status: 'Replay',
      winRate: 0,
      netPl: 0,
      drawdown: 0,
      trades: 0,
      tp: 2.0,      // ATR multiplier for take-profit
      sl: 1.0,      // ATR multiplier for stop-loss
      threshold: 25, // squeeze percentile — fires when BB bandwidth < this percentile
    },
    {
      id: 'ai3-btc-4h',
      name: 'AI3 / MACD+Stoch Confluence',
      symbol: 'BTCUSDT',
      timeframe: '4h',
      strategy: 'ai3',
      webhookKey: 'AI3_BTC',
      tradeRelayUrl: '',
      tradeRelayWebhookCode: '',
      status: 'Replay',
      winRate: 0,
      netPl: 0,
      drawdown: 0,
      trades: 0,
      tp: 2.5,      // ATR multiplier for take-profit
      sl: 1.5,      // ATR multiplier for stop-loss
      threshold: 14, // Stochastic K lookback period
    },
    // ── Creative / structural strategies ────────────────────────────────────
    {
      id: 'vw1-xrp-5m',
      name: 'VW1 / VWAP Reversion',
      symbol: 'XRPUSDT',
      timeframe: '5m',
      strategy: 'vw1',
      webhookKey: 'VW1_XRP',
      tradeRelayUrl: '',
      tradeRelayWebhookCode: '',
      status: 'Replay',
      winRate: 0, netPl: 0, drawdown: 0, trades: 0,
      tp: 1.8,       // ATR × multiplier to TP (target the VWAP centre)
      sl: 0.9,       // ATR × multiplier to SL
      threshold: 20, // deviation percentile: fire when price > this pct from VWAP
    },
    {
      id: 'kc1-bnb-1h',
      name: 'KC1 / Keltner Breakout',
      symbol: 'BNBUSDT',
      timeframe: '1h',
      strategy: 'kc1',
      webhookKey: 'KC1_BNB',
      tradeRelayUrl: '',
      tradeRelayWebhookCode: '',
      status: 'Replay',
      winRate: 0, netPl: 0, drawdown: 0, trades: 0,
      tp: 2.2,       // ATR multiplier for TP
      sl: 1.1,       // ATR multiplier for SL
      threshold: 20, // EMA period for Keltner centre line
    },
    {
      id: 'dv1-doge-15m',
      name: 'DV1 / Donchian Velocity',
      symbol: 'DOGEUSDT',
      timeframe: '15m',
      strategy: 'dv1',
      webhookKey: 'DV1_DOGE',
      tradeRelayUrl: '',
      tradeRelayWebhookCode: '',
      status: 'Replay',
      winRate: 0, netPl: 0, drawdown: 0, trades: 0,
      tp: 2.0,       // ATR multiplier for TP
      sl: 1.0,       // ATR multiplier for SL
      threshold: 20, // Donchian channel period
    },
    {
      id: 'rs1-avax-1h',
      name: 'RS1 / ROC Divergence',
      symbol: 'AVAXUSDT',
      timeframe: '1h',
      strategy: 'rs1',
      webhookKey: 'RS1_AVAX',
      tradeRelayUrl: '',
      tradeRelayWebhookCode: '',
      status: 'Replay',
      winRate: 0, netPl: 0, drawdown: 0, trades: 0,
      tp: 2.5,       // ATR multiplier for TP
      sl: 1.3,       // ATR multiplier for SL
      threshold: 14, // ROC lookback period
    },
    {
      id: 'e3-ltc-30m',
      name: 'E3 / Range Breakout',
      symbol: 'LTCUSDT',
      timeframe: '30m',
      strategy: 'e3',
      webhookKey: 'E3_LTC',
      tradeRelayUrl: '',
      tradeRelayWebhookCode: '',
      status: 'Replay',
      winRate: 0, netPl: 0, drawdown: 0, trades: 0,
      tp: 2.2,       // ATR multiplier for TP
      sl: 1.0,       // ATR multiplier for SL
      threshold: 20, // range detection period (N bars)
    },
    {
      id: 'cv1-ada-1h',
      name: 'CV1 / Volume Delta',
      symbol: 'ADAUSDT',
      timeframe: '1h',
      strategy: 'cv1',
      webhookKey: 'CV1_ADA',
      tradeRelayUrl: '',
      tradeRelayWebhookCode: '',
      status: 'Replay',
      winRate: 0, netPl: 0, drawdown: 0, trades: 0,
      tp: 2.5,       // ATR multiplier for TP
      sl: 1.2,       // ATR multiplier for SL
      threshold: 20, // CVD rolling window (bars)
    },
    {
      id: 'ch1-dot-4h',
      name: 'CH1 / CHoCH Structure',
      symbol: 'DOTUSDT',
      timeframe: '4h',
      strategy: 'ch1',
      webhookKey: 'CH1_DOT',
      tradeRelayUrl: '',
      tradeRelayWebhookCode: '',
      status: 'Replay',
      winRate: 0, netPl: 0, drawdown: 0, trades: 0,
      tp: 3.0,       // ATR multiplier for TP
      sl: 1.5,       // ATR multiplier for SL
      threshold: 10, // swing detection half-window (bars)
    },
    {
      id: 'pm1-link-2h',
      name: 'PM1 / RSI Pivot Momentum',
      symbol: 'LINKUSDT',
      timeframe: '2h',
      strategy: 'pm1',
      webhookKey: 'PM1_LINK',
      tradeRelayUrl: '',
      tradeRelayWebhookCode: '',
      status: 'Replay',
      winRate: 0, netPl: 0, drawdown: 0, trades: 0,
      tp: 2.0,       // ATR multiplier for TP
      sl: 1.0,       // ATR multiplier for SL
      threshold: 14, // RSI period
    },
    {
      id: 'ob1-sol-4h',
      name: 'OB1 / Order Block Retest',
      symbol: 'SOLUSDT',
      timeframe: '4h',
      strategy: 'ob1',
      webhookKey: 'OB1_SOL',
      tradeRelayUrl: '',
      tradeRelayWebhookCode: '',
      status: 'Replay',
      winRate: 0, netPl: 0, drawdown: 0, trades: 0,
      tp: 2.5,       // ATR multiplier for TP
      sl: 1.2,       // ATR multiplier for SL
      threshold: 9,  // ZigZag pivot half-window (bars each side)
    },
    {
      id: 'fg1-btc-4h',
      name: 'FG1 / CVD + FVG Retracement',
      symbol: 'BTCUSDT',
      timeframe: '4h',
      strategy: 'fg1',
      webhookKey: 'FG1_BTC',
      tradeRelayUrl: '',
      tradeRelayWebhookCode: '',
      status: 'Replay',
      winRate: 0, netPl: 0, drawdown: 0, trades: 0,
      tp: 2.0,       // ATR multiplier for TP
      sl: 1.5,       // ATR multiplier for SL
      threshold: 20, // CVD rolling window (bars)
    },
    {
      id: 'sm1-eth-2h',
      name: 'SM1 / Smart Money BOS',
      symbol: 'ETHUSDT',
      timeframe: '2h',
      strategy: 'sm1',
      webhookKey: 'SM1_ETH',
      tradeRelayUrl: '',
      tradeRelayWebhookCode: '',
      status: 'Replay',
      winRate: 0, netPl: 0, drawdown: 0, trades: 0,
      tp: 2.0,       // dist multiplier for TP (dist = breakout-leg range / 3)
      sl: 1.0,       // dist multiplier for SL
      threshold: 25, // swing pivot window (bars each side)
    },
    {
      id: 'mn1-bnb-2h',
      name: 'MN1 / MSBO Level Retest',
      symbol: 'BNBUSDT',
      timeframe: '2h',
      strategy: 'mn1',
      webhookKey: 'MN1_BNB',
      tradeRelayUrl: '',
      tradeRelayWebhookCode: '',
      status: 'Replay',
      winRate: 0, netPl: 0, drawdown: 0, trades: 0,
      tp: 2.0,       // dist multiplier for TP (dist = breakout-leg range / 3)
      sl: 1.0,       // dist multiplier for SL
      threshold: 25, // swing pivot window (bars each side)
    },
    {
      id: 'st1-near-4h',
      name: 'ST1 / SuperTrend Flip',
      symbol: 'NEARUSDT',
      timeframe: '4h',
      strategy: 'st1',
      webhookKey: 'ST1_NEAR',
      tradeRelayUrl: '',
      tradeRelayWebhookCode: '',
      status: 'Replay',
      winRate: 0, netPl: 0, drawdown: 0, trades: 0,
      tp: 2.0,       // RR ratio (TP = entry ± ATR×sl×tp)
      sl: 1.4,       // ATR factor for SL/dist sizing
      threshold: 14, // SuperTrend ATR period
    },
    {
      id: 'sb1-sol-2h',
      name: 'SB1 / Smart BOS Flip',
      symbol: 'SOLUSDT',
      timeframe: '2h',
      strategy: 'sb1',
      webhookKey: 'SB1_SOL',
      tradeRelayUrl: '',
      tradeRelayWebhookCode: '',
      status: 'Replay',
      winRate: 0, netPl: 0, drawdown: 0, trades: 0,
      tp: 2.0,       // dist multiplier for TP (dist = breakout-leg range / 3)
      sl: 1.0,       // dist multiplier for SL
      threshold: 25, // swing pivot window (bars each side)
    },
  ],
  scenarios: [
    {
      id: 'scenario-prod',
      name: 'AD1 / Production Profile',
      winRate: 84.44,
      netPl: 30.0,
      trades: 90,
      wins: 76,
      losses: 14,
      drawdown: 23.55,
      endingEquity: 130.0,
      openPosition: 'Flat',
      equityBars: [20, 24, 25, 29, 34, 39, 50, 52, 57, 66, 63, 70],
    },
    {
      id: 'scenario-tight-sl',
      name: 'AD1 / Tight Stop Test',
      winRate: 67.1,
      netPl: 8.4,
      trades: 112,
      wins: 75,
      losses: 37,
      drawdown: 18.8,
      endingEquity: 108.4,
      openPosition: 'Long',
      equityBars: [18, 22, 26, 28, 30, 38, 36, 41, 47, 45, 49, 54],
    },
    {
      id: 'scenario-btc-15m',
      name: 'AD1 / BTC 15m Sweep',
      winRate: 61.2,
      netPl: -2.4,
      trades: 37,
      wins: 22,
      losses: 15,
      drawdown: 11.8,
      endingEquity: 97.6,
      openPosition: 'Flat',
      equityBars: [28, 27, 26, 23, 22, 25, 24, 23, 22, 21, 18, 17],
    },
  ],
  signals: [
    {
      timestamp: '2026-04-12 12:45 UTC',
      bot: 'AD1 / Binance_Dem',
      symbol: 'FARTCOINUSDT.P',
      event: 'ENTER_LONG',
      message: 'ENTER-LONG_Binance_Dem',
      status: 'Sent',
    },
    {
      timestamp: '2026-04-12 12:50 UTC',
      bot: 'AD1 / Binance_Dem',
      symbol: 'FARTCOINUSDT.P',
      event: 'EXIT_ALL',
      message: 'EXIT-ALL_Binance_Dem',
      status: 'Sent',
    },
    {
      timestamp: '2026-04-12 13:05 UTC',
      bot: 'AD1 / BTC Sweep Lane',
      symbol: 'BTCUSDT',
      event: 'ENTER_SHORT',
      message: 'ENTER-SHORT_BTC_Sweep',
      status: 'Dry Run',
    },
  ],
};

const metricGrid = document.getElementById('metric-grid');
const botList = document.getElementById('bot-list');
const scenarioList = document.getElementById('scenario-list');
const backtestSummary = document.getElementById('backtest-summary');
const equityStrip = document.getElementById('equity-strip');
const signalTable = document.getElementById('signal-table');
const configForm = document.getElementById('config-form');
const configPreview = document.getElementById('config-preview');
const heroSummary = document.getElementById('hero-summary');
const dashboardSignalLog = document.getElementById('dashboard-signal-log');
const scenarioTitle = document.getElementById('scenario-title');
const viewTitle = document.getElementById('view-title');

document.querySelectorAll('.nav-item').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');

    const view = button.dataset.view;
    const navDropdown = document.getElementById('nav-dropdown');
    if (navDropdown) navDropdown.value = view;
    document.querySelectorAll('.view').forEach((panel) => panel.classList.remove('is-visible'));
    document.getElementById(`view-${view}`).classList.add('is-visible');
    const navText = button.querySelector('.nav-text');
    viewTitle.textContent = navText ? navText.textContent : button.textContent;
    if (view === 'chart') {
      requestAnimationFrame(() => {
        void initChart(chartState.currentBotId || state.selectedBotId);
      });
    } else {
      stopReplay();
      stopLive();
    }
  });
});

document.getElementById('nav-dropdown')?.addEventListener('change', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLSelectElement)) return;
  const view = target.value;
  const button = document.querySelector(`.nav-item[data-view="${view}"]`);
  if (button instanceof HTMLElement) {
    button.click();
  }
});

document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
  document.body.classList.toggle('menu-collapsed');
});

function setupTradeLogCollapse() {
  const panel = document.getElementById('trade-log-panel');
  const toggle = document.getElementById('toggle-trade-log');
  if (!panel || !toggle) return;

  const sync = () => {
    const isCollapsed = panel.classList.contains('is-collapsed');
    toggle.textContent = isCollapsed ? 'Expand' : 'Collapse';
    toggle.setAttribute('aria-expanded', String(!isCollapsed));
  };

  toggle.addEventListener('click', () => {
    panel.classList.toggle('is-collapsed');
    sync();
  });

  sync();
}

document.getElementById('run-backtest-button')?.addEventListener('click', () => {
  const chartBtn = document.querySelector('.nav-item[data-view="chart"]');
  if (chartBtn instanceof HTMLElement) chartBtn.click();
});

function getSelectedBot() {
  return state.bots.find((bot) => bot.id === state.selectedBotId) || state.bots[0];
}

function getSelectedScenario() {
  return state.scenarios.find((scenario) => scenario.id === state.selectedScenarioId) || state.scenarios[0];
}

function formatPercent(value) {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function metricClass(value) {
  if (value > 0) return 'is-positive';
  if (value < 0) return 'is-negative';
  return '';
}

function renderMetrics() {
  const activeBot = getSelectedBot();
  const scenario = getSelectedScenario();
  const metrics = [
    { label: 'Indicators', value: '1', subvalue: 'AD1 migrated' },
    { label: 'Active Bots', value: String(state.bots.length), subvalue: 'runtime-configurable deployments' },
    { label: 'Win Rate', value: `${scenario.winRate.toFixed(2)}%`, subvalue: activeBot.name, tone: metricClass(scenario.winRate - 50) },
    { label: 'Net P/L', value: formatPercent(scenario.netPl), subvalue: `${scenario.trades} replay trades`, tone: metricClass(scenario.netPl) },
  ];

  metricGrid.innerHTML = metrics
    .map(
      (metric) => `
        <article class="metric-card">
          <div class="metric-label">${metric.label}</div>
          <div class="metric-value ${metric.tone || ''}">${metric.value}</div>
          <div class="metric-subvalue">${metric.subvalue}</div>
        </article>
      `
    )
    .join('');
}

function renderHero() {
  const bot = getSelectedBot();
  document.getElementById('hero-bot-name').textContent = bot.name;
  document.getElementById('hero-symbol').textContent = bot.symbol;
  document.getElementById('hero-timeframe').textContent = bot.timeframe;
  document.getElementById('hero-webhook').textContent = bot.webhookKey;

  const heroItems = [
    ['Win Rate', `${bot.winRate.toFixed(2)}%`, metricClass(bot.winRate - 50)],
    ['Net P/L', formatPercent(bot.netPl), metricClass(bot.netPl)],
    ['Max Drawdown', `${bot.drawdown.toFixed(2)}%`, 'is-negative'],
    ['Total Trades', String(bot.trades), ''],
  ];

  heroSummary.innerHTML = heroItems
    .map(
      ([label, value, tone]) => `
        <div class="summary-item">
          <span class="mini-label">${label}</span>
          <strong class="${tone}">${value}</strong>
        </div>
      `
    )
    .join('');
}

function renderDashboardSignals() {
  dashboardSignalLog.innerHTML = state.signals
    .slice(0, 2)
    .map(
      (signal) => `
        <article class="log-item">
          <div class="log-top">
            <strong>${signal.event}</strong>
            <span class="section-kicker">${signal.timestamp}</span>
          </div>
          <div class="log-code">${signal.message}</div>
        </article>
      `
    )
    .join('');
}

function renderBots() {
  if (!botList) return;
  botList.innerHTML = state.bots
    .map(
      (bot) => {
        const isLiveActive = !!chartState.autoSignalByBot[bot.id];
        return `
        <article class="bot-item ${bot.id === state.selectedBotId ? 'is-selected' : ''}" data-bot-id="${bot.id}">
          <div>
            <div class="bot-title">${bot.name}${isLiveActive ? ' <span class="bot-live-badge">● LIVE</span>' : ''}</div>
            <div class="bot-subtitle">${bot.symbol} • ${bot.timeframe} • ${bot.webhookKey}</div>
          </div>
          <div class="bot-metric">
            <strong class="${metricClass(bot.winRate - 50)}">${bot.winRate.toFixed(2)}%</strong>
            <span>win rate</span>
          </div>
          <div class="bot-metric">
            <strong class="${metricClass(bot.netPl)}">${formatPercent(bot.netPl)}</strong>
            <span>net P/L</span>
          </div>
          <div class="bot-metric">
            <strong>${bot.trades}</strong>
            <span>trades</span>
          </div>
          <div class="toggle-pill" aria-hidden="true"></div>
        </article>
      `;
      }
    )
    .join('');

  if (!botList) return;
  botList.querySelectorAll('[data-bot-id]').forEach((item) => {
    item.addEventListener('click', () => {
      state.selectedBotId = item.dataset.botId;
      renderAll();
    });
  });
}

function renderScenarios() {
  scenarioList.innerHTML = state.scenarios
    .map(
      (scenario) => `
        <article class="scenario-item ${scenario.id === state.selectedScenarioId ? 'is-selected' : ''}" data-scenario-id="${scenario.id}">
          <div>
            <div class="bot-title">${scenario.name}</div>
            <div class="scenario-subtitle">${scenario.trades} trades • ${scenario.wins} wins • ${scenario.losses} losses</div>
          </div>
          <div class="scenario-metric">
            <strong class="${metricClass(scenario.netPl)}">${formatPercent(scenario.netPl)}</strong>
            <span>net P/L</span>
          </div>
        </article>
      `
    )
    .join('');

  scenarioList.querySelectorAll('[data-scenario-id]').forEach((item) => {
    item.addEventListener('click', () => {
      state.selectedScenarioId = item.dataset.scenarioId;
      renderAll();
    });
  });
}

function renderBacktestSummary() {
  const scenario = getSelectedScenario();
  scenarioTitle.textContent = scenario.name;

  const items = [
    ['Trades', String(scenario.trades), ''],
    ['Wins', String(scenario.wins), 'is-positive'],
    ['Losses', String(scenario.losses), 'is-negative'],
    ['Win Rate', `${scenario.winRate.toFixed(2)}%`, metricClass(scenario.winRate - 50)],
    ['Net P/L', formatPercent(scenario.netPl), metricClass(scenario.netPl)],
    ['Max Drawdown', `${scenario.drawdown.toFixed(2)}%`, 'is-negative'],
    ['Ending Equity', scenario.endingEquity.toFixed(2), ''],
    ['Open Position', scenario.openPosition, ''],
  ];

  backtestSummary.innerHTML = items
    .map(
      ([label, value, tone]) => `
        <div class="summary-item">
          <span class="mini-label">${label}</span>
          <strong class="${tone}">${value}</strong>
        </div>
      `
    )
    .join('');

  equityStrip.innerHTML = scenario.equityBars
    .map((height) => `<div class="equity-bar" style="height:${height * 1.3}px"></div>`)
    .join('');
}

async function renderSignalTable() {
  signalTable.innerHTML = '<div class="table-loading">Loading…</div>';
  let rows = [];
  try {
    const { data, error } = await db
      .from('signal_log')
      .select('created_at, bot_name, symbol, event, message, status')
      .order('created_at', { ascending: false })
      .limit(50);
    if (!error && Array.isArray(data)) rows = data;
  } catch { /* offline — show empty */ }

  if (!rows.length) {
    signalTable.innerHTML = '<div class="table-loading">No signals fired yet.</div>';
    return;
  }

  signalTable.innerHTML = `
    <div class="table-header">
      <div>Timestamp</div>
      <div>Bot</div>
      <div>Symbol</div>
      <div>Event</div>
      <div>Message</div>
      <div>Status</div>
    </div>
    ${rows.map((r) => {
      const ts = r.created_at ? new Date(r.created_at).toLocaleString('en-GB', { timeZone: 'UTC', hour12: false }).replace(',', '') + ' UTC' : '—';
      return `
        <div class="table-row">
          <div class="table-cell"><strong>${ts}</strong></div>
          <div class="table-cell"><strong>${r.bot_name || '—'}</strong></div>
          <div class="table-cell"><strong>${r.symbol || '—'}</strong></div>
          <div class="table-cell"><strong>${r.event || '—'}</strong></div>
          <div class="table-cell"><strong>${r.message || '—'}</strong></div>
          <div class="table-cell"><strong class="${r.status === 'sent' ? 'is-positive' : r.status === 'failed' || r.status === 'error' ? 'is-negative' : ''}">${r.status || '—'}</strong></div>
        </div>`;
    }).join('')}
  `;
}

function renderConfigForm() {
  const bot = getSelectedBot();
  const isH9S = bot.strategy === 'h9s';
  const isB5S = bot.strategy === 'b5s';
  const isBOS = isH9S || isB5S;
  const bosFixed = isBOS && (bot.tpType || 'dynamic') === 'fixed';
  const fields = [
    ['name', 'Bot Name', bot.name],
    ['symbol', 'Symbol', bot.symbol],
    ['timeframe', 'Timeframe', bot.timeframe],
    ['webhookKey', 'Webhook Key', bot.webhookKey],
    ['tradeRelayUrl', 'TradeRelay Bot URL', bot.tradeRelayUrl || ''],
    ['tradeRelayWebhookCode', 'TradeRelay Webhook Code (step 1 from bot settings)', bot.tradeRelayWebhookCode || ''],
    ['threshold', isBOS ? 'Swing Size' : 'Threshold', bot.threshold],
    ...(isBOS ? [
      ['bosConfType', 'BOS Confirmation', bot.bosConfType || 'close'],
      ['tpType', 'TP Type', bot.tpType || 'dynamic'],
    ] : []),
    ...(!isBOS || bosFixed ? [
      ['tp', 'Take Profit %', bot.tp],
      ['sl', 'Stop Loss %', bot.sl],
    ] : []),
    ...(isH9S ? [
      ['slippage', 'Slippage %', bot.slippage ?? 0.05],
    ] : []),
    ...(isB5S ? [
      ['maxTrades', 'Max Concurrent Trades', bot.maxTrades ?? 3],
    ] : []),
    ...(!isBOS ? [
      ['source1', 'Source 1', bot.source1],
      ['source2', 'Source 2', bot.source2],
      ['source3', 'Source 3', bot.source3],
      ['source4', 'Source 4', bot.source4],
    ] : []),
  ];

  const TF_OPTIONS = ['1m','3m','5m','15m','30m','1h','4h','1d','1w'];

  if (!configForm) return;
  configForm.innerHTML = fields
    .map(([key, label, value]) => {
      const wide = key === 'tradeRelayUrl' || key === 'tradeRelayWebhookCode' || key.startsWith('source');
      const SELECT_OPTIONS = {
        timeframe: TF_OPTIONS,
        bosConfType: ['close', 'wicks'],
        tpType: ['dynamic', 'fixed'],
      };
      if (SELECT_OPTIONS[key]) {
        const options = SELECT_OPTIONS[key].map((opt) =>
          `<option value="${opt}"${opt === String(value) ? ' selected' : ''}>${opt}</option>`
        ).join('');
        return `<div class="field"><label for="field-${key}">${label}</label><select id="field-${key}" name="${key}">${options}</select></div>`;
      }
      return `<div class="field${wide ? ' field-wide' : ''}"><label for="field-${key}">${label}</label><input id="field-${key}" name="${key}" value="${value}"></div>`;
    })
    .join('');

  configForm.querySelectorAll('input, select').forEach((el) => {
    el.addEventListener('change', () => {
      const currentBot = getSelectedBot();
      const parsedValue = ['tp', 'sl', 'threshold', 'slippage', 'maxTrades'].includes(el.name) ? Number(el.value || 0) : el.value;
      currentBot[el.name] = parsedValue;
      renderConfigPreview();
      renderHero();
      renderBots();
      refreshTradeRelayPanel();
      if (el.name === 'tpType') {
        renderConfigForm();
        return;
      }
      if (el.name === 'timeframe') {
        setupTimeframePills(currentBot);
        const chartTfSelect = document.getElementById('chart-param-timeframe');
        if (chartTfSelect) chartTfSelect.value = el.value;
        const topbarTfSelect = document.getElementById('chart-tf-select');
        if (topbarTfSelect) topbarTfSelect.value = el.value;
        void initChart(currentBot.id);
      }
    });
    if (el.tagName !== 'SELECT') {
      el.addEventListener('input', () => {
        const currentBot = getSelectedBot();
        const parsedValue = ['tp', 'sl', 'threshold', 'slippage', 'maxTrades'].includes(el.name) ? Number(el.value || 0) : el.value;
        currentBot[el.name] = parsedValue;
        renderConfigPreview();
        renderHero();
        renderBots();
        refreshTradeRelayPanel();
      });
    }
  });
}

function renderConfigPreview() {
  const bot = getSelectedBot();
  let normalized;
  if (bot.strategy === 'h9s') {
    normalized = {
      indicatorId: 'H9S',
      botId: bot.id,
      symbol: bot.symbol,
      timeframe: bot.timeframe,
      webhookKey: bot.webhookKey,
      tradeRelayUrl: bot.tradeRelayUrl || '',
      takeProfitPercent: Number(bot.tp),
      stopLossPercent: Number(bot.sl),
      swingSize: Number(bot.threshold),
      bosConfType: bot.bosConfType || 'close',
      tpType: bot.tpType || 'dynamic',
      slippage: Number(bot.slippage ?? 0.05),
    };
  } else if (bot.strategy === 'b5s') {
    normalized = {
      indicatorId: 'B5S',
      botId: bot.id,
      symbol: bot.symbol,
      timeframe: bot.timeframe,
      webhookKey: bot.webhookKey,
      tradeRelayUrl: bot.tradeRelayUrl || '',
      takeProfitPercent: Number(bot.tp),
      stopLossPercent: Number(bot.sl),
      swingSize: Number(bot.threshold),
      bosConfType: bot.bosConfType || 'close',
      tpType: bot.tpType || 'dynamic',
      maxTrades: Number(bot.maxTrades ?? 3),
    };
  } else {
    normalized = {
      indicatorId: 'AD1',
      botId: bot.id,
      symbol: bot.symbol,
      timeframe: bot.timeframe,
      webhookKey: bot.webhookKey,
      tradeRelayUrl: bot.tradeRelayUrl || '',
      takeProfitPercent: Number(bot.tp),
      stopLossPercent: Number(bot.sl),
      unusualPercentileThreshold: Number(bot.threshold),
      sourceSymbols: [bot.source1, bot.source2, bot.source3, bot.source4],
    };
  }

  if (!configPreview) return;
  configPreview.textContent = JSON.stringify(normalized, null, 2);
}

// ── TradeRelay Integration ────────────────────────────────────────────────────

async function sendTradeRelaySignal(url, message) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: message,
  });
  const text = await response.text().catch(() => '');
  return { ok: response.ok, status: response.status, text };
}

function refreshTradeRelayPanel() {
  const bot = getSelectedBot();
  const urlDisplay = document.getElementById('tr-url-display');
  const msgPreview = document.getElementById('tr-message-preview');
  const badge = document.getElementById('tr-connection-badge');
  const sendBtn = document.getElementById('tr-send-btn');
  const actionSelect = document.getElementById('tr-action');
  if (!urlDisplay || !actionSelect) return;

  const url = bot.tradeRelayUrl || '';
  const action = actionSelect.value;
  const code = bot.tradeRelayWebhookCode || bot.webhookKey;
  const message = `${action}_${code}`;

  urlDisplay.textContent = url || '— paste URL in bot config above —';
  msgPreview.textContent = message;
  badge.textContent = url ? 'Configured' : 'Not configured';
  badge.className = `tr-badge ${url ? 'tr-badge-ok' : 'tr-badge-idle'}`;
  if (sendBtn) sendBtn.disabled = !url;
}

function setupTradeRelayTestPanel() {
  const actionSelect = document.getElementById('tr-action');
  const sendBtn = document.getElementById('tr-send-btn');
  const responseEl = document.getElementById('tr-response');
  if (!actionSelect || !sendBtn || !responseEl) return;

  actionSelect.addEventListener('change', refreshTradeRelayPanel);

  sendBtn.addEventListener('click', async () => {
    const bot = getSelectedBot();
    const url = bot.tradeRelayUrl;
    if (!url) return;

    const action = document.getElementById('tr-action').value;
    const code = bot.tradeRelayWebhookCode || bot.webhookKey;
    const message = `${action}_${code}`;

    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending…';
    responseEl.textContent = '';
    responseEl.className = 'tr-response';

    try {
      const res = await sendTradeRelaySignal(url, message);
      responseEl.textContent = res.ok
        ? `✓ ${res.status} OK — signal accepted by TradeRelay`
        : `✗ ${res.status} — ${res.text || 'Rejected'}`;
      responseEl.className = `tr-response ${res.ok ? 'tr-response-ok' : 'tr-response-err'}`;
    } catch (err) {
      responseEl.textContent = `✗ Network error — ${err instanceof Error ? err.message : 'Could not reach TradeRelay'}`;
      responseEl.className = 'tr-response tr-response-err';
    } finally {
      sendBtn.disabled = !bot.tradeRelayUrl;
      sendBtn.textContent = 'Send Test Signal';
    }
  });

  refreshTradeRelayPanel();
}

// ── Chart View ────────────────────────────────────────────────────────────────

const chartState = {
  chart: null,
  candleSeries: null,
  smaSeries: null,
  volumeSeries: null,
  priceLines: [],
  infoLines: [],
  resizeObserver: null,
  timerId: null,
  liveTimerId: null,
  isLoadingOlder: false,
  replayIndex: 0,
  speed: 2,
  isPlaying: false,
  mode: 'live',
  sourceLabel: 'Sample data',
  historyBarsTarget: 4000,
  followLive: false,
  barSpacing: 7,
  marketType: null,
  autoSignalByBot: {},       // botId -> boolean
  lastFiredByBot: {},         // botId -> unix seconds (persisted across reloads)
  data: null,
  replaySignals: [],
  replayEquityTimeline: [],
  fullHistoryByBot: {},
  showCandles: true,
  showSma: true,
  showVolume: true,
  showMarkers: true,
  showLevels: true,
  initialized: false,
  currentBotId: null,
};

function toBinanceSymbol(symbol) {
  let clean = String(symbol || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!clean) return 'BTCUSDT';
  if (clean.endsWith('P')) clean = clean.slice(0, -1);
  if (clean.endsWith('USD')) clean = `${clean}T`;
  const hasKnownQuote = /(USDT|USDC|BUSD|BTC|ETH)$/.test(clean);
  return hasKnownQuote ? clean : `${clean}USDT`;
}

function getMarketCandidates(bot, preferredMarketType = null) {
  const raw = String(bot.symbol || '').toUpperCase();
  const prefersFutures = raw.includes('.P') || raw.includes('PERP');
  const spot = { marketType: 'spot', label: 'Binance Spot', baseUrl: 'https://api.binance.com', path: '/api/v3/klines' };
  const futures = { marketType: 'futures', label: 'Binance Futures', baseUrl: 'https://fapi.binance.com', path: '/fapi/v1/klines' };

  if (preferredMarketType === 'futures') return [futures, spot];
  if (preferredMarketType === 'spot') return [spot, futures];
  return prefersFutures ? [futures, spot] : [spot, futures];
}

async function fetchKlineChunk(candidate, pair, interval, limit, endTimeMs = null) {
  const endParam = endTimeMs ? `&endTime=${Math.max(1, Math.floor(endTimeMs))}` : '';
  const url = `${candidate.baseUrl}${candidate.path}?symbol=${pair}&interval=${interval}&limit=${limit}${endParam}`;
  const response = await fetch(url);
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const apiMessage = payload && typeof payload === 'object' && payload.msg ? String(payload.msg) : `HTTP ${response.status}`;
    throw new Error(`${candidate.label}: ${apiMessage}`);
  }

  if (!Array.isArray(payload)) {
    throw new Error(`${candidate.label}: unexpected payload`);
  }

  return payload;
}

async function fetchBinanceKlines(bot, limit = 500, preferredMarketType = null, fromEndTimeMs = null) {
  const pair = toBinanceSymbol(bot.symbol);
  const interval = String(bot.timeframe || '5m').toLowerCase();
  const target = Math.max(60, Math.min(limit, 12000));
  let lastError = new Error('No Binance market candidates tried');

  for (const candidate of getMarketCandidates(bot, preferredMarketType)) {
    try {
      const allRows = [];
      let endTimeMs = fromEndTimeMs;

      while (allRows.length < target) {
        const remaining = target - allRows.length;
        const chunkSize = Math.min(1000, remaining);
        const rows = await fetchKlineChunk(candidate, pair, interval, chunkSize, endTimeMs);
        if (!rows.length) break;
        allRows.unshift(...rows);
        const firstOpenTime = Number(rows[0][0]);
        if (!Number.isFinite(firstOpenTime)) break;
        endTimeMs = Math.max(firstOpenTime - 1, 1);
        if (rows.length < chunkSize) break;
      }

      const rows = allRows.slice(-target);
      if (!rows.length) throw new Error(`${candidate.label}: no kline rows returned`);

      const candles = [];
      const volumes = [];
      for (const row of rows) {
        const openTime = Math.floor(Number(row[0]) / 1000);
        const open = Number(row[1]);
        const high = Number(row[2]);
        const low = Number(row[3]);
        const close = Number(row[4]);
        const vol = Number(row[5]);
        if (![openTime, open, high, low, close].every(Number.isFinite)) continue;
        candles.push({ time: openTime, open, high, low, close });
        volumes.push({
          time: openTime,
          value: Number.isFinite(vol) ? Math.max(vol, 1) : 1,
          color: close >= open ? 'rgba(45,219,117,0.35)' : 'rgba(255,109,109,0.35)',
        });
      }

      if (candles.length < 30) throw new Error(`${candidate.label}: not enough bars returned`);

      return {
        candles,
        volumes,
        source: `${candidate.label} ${pair} · ${candles.length} bars`,
        marketType: candidate.marketType,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown Binance error');
    }
  }

  throw lastError;
}

async function fetchBinanceKlinesBefore(bot, endTimeMs, limit = 1000, preferredMarketType = null) {
  const pair = toBinanceSymbol(bot.symbol);
  const interval = String(bot.timeframe || '5m').toLowerCase();
  let lastError = new Error('No Binance market candidates tried for older data');

  for (const candidate of getMarketCandidates(bot, preferredMarketType)) {
    try {
      const rows = await fetchKlineChunk(candidate, pair, interval, Math.max(50, Math.min(limit, 1000)), endTimeMs);
      if (!rows.length) return { candles: [], volumes: [], marketType: candidate.marketType };

      const candles = [];
      const volumes = [];
      for (const row of rows) {
        const openTime = Math.floor(Number(row[0]) / 1000);
        const open = Number(row[1]);
        const high = Number(row[2]);
        const low = Number(row[3]);
        const close = Number(row[4]);
        const vol = Number(row[5]);
        if (![openTime, open, high, low, close].every(Number.isFinite)) continue;
        candles.push({ time: openTime, open, high, low, close });
        volumes.push({
          time: openTime,
          value: Number.isFinite(vol) ? Math.max(vol, 1) : 1,
          color: close >= open ? 'rgba(45,219,117,0.35)' : 'rgba(255,109,109,0.35)',
        });
      }

      candles.sort((a, b) => a.time - b.time);
      volumes.sort((a, b) => a.time - b.time);
      return { candles, volumes, marketType: candidate.marketType };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown Binance older-data error');
    }
  }

  throw lastError;
}

function mergeMarketData(existingCandles, existingVolumes, incomingCandles, incomingVolumes, maxBars = 50000) {
  const candleMap = new Map();
  const volumeMap = new Map();

  for (const candle of existingCandles) candleMap.set(candle.time, candle);
  for (const candle of incomingCandles) candleMap.set(candle.time, candle);
  for (const vol of existingVolumes) volumeMap.set(vol.time, vol);
  for (const vol of incomingVolumes) volumeMap.set(vol.time, vol);

  const times = Array.from(candleMap.keys()).sort((a, b) => a - b);
  const trimmedTimes = times.length > maxBars ? times.slice(times.length - maxBars) : times;

  const candles = trimmedTimes.map((time) => candleMap.get(time));
  const volumes = trimmedTimes.map((time) => {
    if (volumeMap.has(time)) return volumeMap.get(time);
    const c = candleMap.get(time);
    return {
      time,
      value: Math.max(1, Math.abs((c.close - c.open) * 10000)),
      color: c.close >= c.open ? 'rgba(45,219,117,0.35)' : 'rgba(255,109,109,0.35)',
    };
  });

  return { candles, volumes };
}

function setReplayControlsVisible(visible) {
  const controls = document.getElementById('replay-controls');
  if (controls) controls.classList.toggle('is-hidden', !visible);
  const rnd = document.getElementById('replay-random-sample');
  const prog = document.getElementById('replay-progress');
  if (rnd) rnd.style.display = visible ? 'inline-flex' : 'none';
  if (prog) prog.style.display = visible ? 'inline' : 'none';
}

function getModeStatusText() {
  const bot = state.bots.find((b) => b.id === chartState.currentBotId) || state.bots[0];
  const bars = chartState.historyBarsTarget || 4000;
  const minutes = timeframeToMinutes(bot?.timeframe || '5m');
  const totalDays = (bars * minutes) / (60 * 24);
  const daysLabel = totalDays >= 1 ? `${totalDays.toFixed(1)}d` : `${(totalDays * 24).toFixed(1)}h`;

  let dateRange = '';
  const candles = chartState.data?.candles;
  if (candles?.length >= 2) {
    const fmt = (ts) => new Date(ts * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' });
    dateRange = ` · ${fmt(candles[0].time)} → ${fmt(candles[candles.length - 1].time)}`;
  }

  if (chartState.mode === 'history') return `History · ${chartState.sourceLabel} · ${bars.toLocaleString()} bars · ${daysLabel}${dateRange}`;
  return `Live mode · ${chartState.sourceLabel} · ${bars.toLocaleString()} bars · ${daysLabel}${dateRange}`;
}

function setModeStatus(extraText) {
  const modeStatus = document.getElementById('chart-mode-status');
  if (!modeStatus) return;
  modeStatus.textContent = extraText || getModeStatusText();
}

let _toastTimer = null;
function showSignalToast(message, type = 'ok') {
  let toast = document.getElementById('signal-fire-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'signal-fire-toast';
    document.getElementById('tv-chart')?.parentElement?.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `signal-fire-toast toast-${type} toast-visible`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { toast.classList.remove('toast-visible'); }, 3500);
}

function getDesiredHistoryBars() {
  const selector = document.getElementById('chart-history-bars');
  const raw = Number(selector?.value || chartState.historyBarsTarget || 4000);
  const safe = Math.max(500, Math.min(12000, Number.isFinite(raw) ? raw : 4000));
  chartState.historyBarsTarget = safe;
  return safe;
}

function applyInteractiveChartOptions(chart) {
  chart.applyOptions({
    handleScroll: {
      mouseWheel: true,
      pressedMouseMove: true,
      horzTouchDrag: true,
      vertTouchDrag: true,
    },
    handleScale: {
      axisPressedMouseMove: true,
      mouseWheel: true,
      pinch: true,
    },
    kineticScroll: {
      mouse: true,
      touch: true,
    },
    timeScale: {
      rightBarStaysOnScroll: false,
      lockVisibleTimeRangeOnResize: false,
      fixLeftEdge: false,
      fixRightEdge: false,
      minBarSpacing: 0.25,
      barSpacing: chartState.barSpacing,
    },
  });
}

function setFollowLive(enabled) {
  chartState.followLive = Boolean(enabled);
  const button = document.getElementById('chart-follow-toggle');
  if (!button) return;
  button.title = `Follow Price: ${chartState.followLive ? 'On' : 'Off'}`;
  button.classList.toggle('is-active', chartState.followLive);
}

async function loadOlderHistory(bot, bars = 1000) {
  if (!chartState.chart || !chartState.data || chartState.isLoadingOlder) return;
  if (!String(chartState.sourceLabel).startsWith('Binance')) return;

  const oldest = chartState.data.candles[0]?.time;
  if (!oldest) return;

  chartState.isLoadingOlder = true;
  setModeStatus('Loading older history...');
  const visibleRange = chartState.chart.timeScale().getVisibleRange?.() || null;
  try {
    const targetBars = Math.max(500, Math.min(bars, 10000));
    let cursor = oldest * 1000 - 1;
    let merged = { candles: chartState.data.candles, volumes: chartState.data.volumes };
    let fetched = 0;

    while (fetched < targetBars) {
      const chunk = await fetchBinanceKlinesBefore(bot, cursor, Math.min(1000, targetBars - fetched), chartState.marketType);
      if (!chunk.candles.length) break;
      fetched += chunk.candles.length;
      merged = mergeMarketData(merged.candles, merged.volumes, chunk.candles, chunk.volumes, 50000);
      chartState.marketType = chunk.marketType || chartState.marketType;
      cursor = chunk.candles[0].time * 1000 - 1;
      if (chunk.candles.length < 1000) break;
    }

    if (!fetched) return;

    const rebuilt = buildReplayPackageFromCandles(merged.candles, merged.volumes, bot);
    chartState.data = { ...rebuilt, smaData: buildSma(rebuilt.candles, 20) };
    chartState.replaySignals = rebuilt.replaySignals;
    chartState.replayEquityTimeline = rebuilt.replayEquityTimeline;
    renderChartControls(bot, rebuilt.summary);
    applyHistoryOrLiveFrame();
    if (visibleRange) {
      chartState.chart.timeScale().setVisibleRange(visibleRange);
    }
  } catch {
    // Keep current data if older fetch fails.
  } finally {
    chartState.isLoadingOlder = false;
    setModeStatus();
  }
}

function installAutoBackfill(bot) {
  if (!chartState.chart) return;
  const scale = chartState.chart.timeScale();
  scale.subscribeVisibleLogicalRangeChange((range) => {
    if (!range || chartState.isLoadingOlder) return;
    if (range.from < 20) {
      void loadOlderHistory(bot, 1000);
    }
  });
}

function getChartHeightForMode() {
  return 640;
}

function generateChartBars(bot, bars = 120) {
  const timeframeMinutes = timeframeToMinutes(bot.timeframe);
  const stepSeconds = timeframeMinutes * 60;
  // Seeded deterministic XorShift RNG for reproducible sample data
  let s = hashString(`${bot.symbol}|${bot.timeframe}`) || 0x2d4a1f83;
  const rng = () => {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    return (s >>> 0) / 0xffffffff;
  };

  // Build synthetic history that ends at "now" so dates never appear in the future.
  const nowUnix = Math.floor(Date.now() / 1000);
  const endUnix = nowUnix - (nowUnix % stepSeconds);
  const startUnix = endUnix - (Math.max(1, bars) - 1) * stepSeconds;
  let price = inferBasePriceForSymbol(bot.symbol);
  const candles = [];
  const volumes = [];

  for (let i = 0; i < bars; i++) {
    const trend = (rng() - 0.492) * 0.006;
    const open = price;
    const close = Math.max(0.001, price * (1 + trend));
    const body = Math.abs(close - open);
    const wick = body + price * rng() * 0.0018;
    const high = Math.max(open, close) + wick * rng() * 0.55;
    const low  = Math.min(open, close) - wick * rng() * 0.45;
    candles.push({
      time:  startUnix + i * stepSeconds,
      open:  +open.toFixed(6),
      high:  +high.toFixed(6),
      low:   +low.toFixed(6),
      close: +close.toFixed(6),
    });
    volumes.push({
      time:  startUnix + i * stepSeconds,
      value: Math.floor(80000 + rng() * 320000),
      color: close >= open ? 'rgba(45,219,117,0.35)' : 'rgba(255,109,109,0.35)',
    });
    price = close;
  }

  return { candles, volumes };
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash >>> 0;
}

function timeframeToMinutes(timeframe) {
  const value = String(timeframe || '5m').trim().toLowerCase();
  const match = value.match(/^(\d+)(m|h|d|w)$/);
  if (!match) return 5;
  const amount = Number(match[1]);
  const unit = match[2];
  if (!Number.isFinite(amount) || amount <= 0) return 5;
  if (unit === 'm') return amount;
  if (unit === 'h') return amount * 60;
  if (unit === 'd') return amount * 60 * 24;
  if (unit === 'w') return amount * 60 * 24 * 7;
  return 5;
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return '-';
  if (Math.abs(value) >= 1000) return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (Math.abs(value) >= 1) return value.toFixed(4);
  return value.toFixed(6);
}

function formatChartDateTime(unixSeconds) {
  if (!Number.isFinite(unixSeconds)) return '--';
  const d = new Date(unixSeconds * 1000);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mi = String(d.getUTCMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi} UTC`;
}

function renderBinanceTopMetrics(candle, previousClose, timestamp) {
  const container = document.getElementById('chart-top-metrics');
  if (!container || !candle) return;
  const open = Number(candle.open);
  const high = Number(candle.high);
  const low = Number(candle.low);
  const close = Number(candle.close);
  const changeBase = Number.isFinite(previousClose) ? previousClose : open;
  const changePct = changeBase ? ((close - changeBase) / changeBase) * 100 : 0;
  const rangePct = open ? ((high - low) / open) * 100 : 0;
  const timeLabel = formatChartDateTime(timestamp);
  container.innerHTML =
    `<span>${timeLabel}</span>` +
    `<span>Open <b>${formatNumber(open)}</b></span>` +
    `<span>High <b>${formatNumber(high)}</b></span>` +
    `<span>Low <b>${formatNumber(low)}</b></span>` +
    `<span>Close <b>${formatNumber(close)}</b></span>` +
    `<span style="color:${changePct >= 0 ? '#2ddb75' : '#ff6d6d'}">Change <b>${changePct >= 0 ? '+' : ''}${changePct.toFixed(2)}%</b></span>` +
    `<span>Range <b>${rangePct.toFixed(2)}%</b></span>`;
}

function inferBasePriceForSymbol(symbol) {
  const upper = String(symbol || 'BTCUSDT').toUpperCase();
  if (upper.includes('BTC')) return 65000;
  if (upper.includes('ETH')) return 3200;
  if (upper.includes('SOL')) return 150;
  if (upper.includes('XRP')) return 0.6;
  if (upper.includes('FARTCOIN')) return 0.085;
  if (upper.includes('DOGE')) return 0.16;
  return 100;
}

function buildReplayPackageFromCandles(candles, volumes, bot) {
  const trades = runStrategySimulation(candles, bot);
  const summary = summarizeTradeLog(trades.tradeLog, candles);
  return {
    candles,
    volumes,
    markers: trades.markers,
    tradeLog: trades.tradeLog,
    openTrade: trades.openTrade,
    summary,
    replaySignals: buildReplaySignals(trades.tradeLog, bot),
    replayEquityTimeline: buildReplayEquityTimeline(candles, trades.tradeLog),
  };
}

function percentileRank(values, value) {
  if (!values.length) return 0;
  let lessOrEqual = 0;
  for (const v of values) if (v <= value) lessOrEqual += 1;
  return (lessOrEqual / values.length) * 100;
}

function runH9SStrategy(candles, bot) {
  const markers = [];
  const tradeLog = [];
  let openTrade = null;

  const tpPct = Number(bot.tp) / 100;
  const slPct = Number(bot.sl) / 100;
  const swingSize = Math.max(2, Math.round(Number(bot.threshold) || 25));
  const useDynamic = (bot.tpType || 'dynamic') === 'dynamic';
  const useWicks = (bot.bosConfType || 'close') === 'wicks';
  const slipMult = Number(bot.slippage || 0) / 100;

  function atrAt(i) {
    const period = 30;
    if (i < 1) return candles[i].close * 0.02;
    let sum = 0, count = 0;
    for (let j = Math.max(1, i - period + 1); j <= i; j++) {
      const c = candles[j], p = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - p.close), Math.abs(c.low - p.close));
      count++;
    }
    return count > 0 ? sum / count : candles[i].close * 0.02;
  }

  let inTrade = false, isBull = false;
  let highAct = true, lowAct = true;
  let prevHigh = NaN, prevLow = NaN;
  let entryBar = -1, entryPx = NaN, tpLvl = NaN, slLvl = NaN;
  let lastEntryBar = -1, lastExitBar = -1;

  for (let i = 0; i < candles.length; i++) {
    const bar = candles[i];

    // Confirm pivot at bar (i - swingSize) once both sides are visible
    const pivIdx = i - swingSize;
    if (pivIdx >= swingSize) {
      const pivot = candles[pivIdx];
      let isPivHigh = true, isPivLow = true;
      for (let k = pivIdx - swingSize; k <= pivIdx + swingSize; k++) {
        if (k === pivIdx) continue;
        if (candles[k].high >= pivot.high) isPivHigh = false;
        if (candles[k].low  <= pivot.low)  isPivLow  = false;
      }
      if (isPivHigh) { prevHigh = pivot.high; highAct = true; }
      if (isPivLow)  { prevLow  = pivot.low;  lowAct  = true; }
    }

    // While in trade: consume (deactivate) pivots when candidate BOS occurs
    if (inTrade) {
      if (!isNaN(prevHigh) && highAct && (useWicks ? bar.high > prevHigh : bar.close > prevHigh)) highAct = false;
      if (!isNaN(prevLow)  && lowAct  && (useWicks ? bar.low  < prevLow  : bar.close < prevLow))  lowAct  = false;
    }

    // EXIT: TP/SL
    if (inTrade && i > entryBar && lastExitBar !== i) {
      let hitTP = isBull ? bar.high >= tpLvl : bar.low  <= tpLvl;
      let hitSL = isBull ? bar.low  <= slLvl : bar.high >= slLvl;
      if (hitTP && hitSL) {
        const dTP = Math.abs(bar.open - tpLvl), dSL = Math.abs(bar.open - slLvl);
        if (dTP <= dSL) hitSL = false; else hitTP = false;
      }
      if (hitTP || hitSL) {
        lastExitBar = i;
        inTrade = false;
        const exitPx = hitTP ? tpLvl : slLvl;
        const pct = isBull
          ? (exitPx - entryPx) / entryPx * 100
          : (entryPx - exitPx) / entryPx * 100;
        const reason = hitTP ? 'tp' : 'sl';
        tradeLog.push({
          dir: isBull ? 'long' : 'short',
          entry: entryPx, tp: tpLvl, sl: slLvl,
          exit: exitPx, pl: pct, reason,
          entryTime: candles[entryBar].time, exitTime: bar.time,
          entryIndex: entryBar, exitIndex: i,
        });
        markers.push({
          time: bar.time,
          position: isBull ? 'aboveBar' : 'belowBar',
          color: hitTP ? '#27d3c5' : '#f7bc52',
          shape: 'circle',
          text: hitTP ? 'TP' : 'SL',
          size: 0.8,
        });
      }
    }

    // ENTRY: BOS confirmation (wicks or candle close)
    const canEnter = !inTrade && lastEntryBar !== i && lastExitBar !== i;
    if (canEnter && !isNaN(prevHigh) && !isNaN(prevLow)) {
      let bullSig = false, bearSig = false;
      if (useWicks) {
        if (bar.high > prevHigh && highAct)    { bullSig = true; highAct = false; }
        else if (bar.low < prevLow && lowAct)  { bearSig = true; lowAct  = false; }
      } else {
        if (bar.close > prevHigh && highAct)     { bullSig = true; highAct = false; }
        else if (bar.close < prevLow && lowAct)  { bearSig = true; lowAct  = false; }
      }

      if (bullSig || bearSig) {
        lastEntryBar = i;
        inTrade = true;
        isBull = bullSig;
        entryBar = i;
        const rawPx = useWicks ? (bullSig ? bar.high : bar.low) : bar.close;
        entryPx = bullSig ? rawPx * (1 + slipMult) : rawPx * (1 - slipMult);
        const atr = atrAt(i);
        const dist  = useDynamic ? atr * 1.5 : entryPx * tpPct;
        const sdist = useDynamic ? atr * 1.5 : entryPx * slPct;
        tpLvl = bullSig ? entryPx + dist  : entryPx - dist;
        slLvl = bullSig ? entryPx - sdist : entryPx + sdist;
        markers.push({
          time: bar.time,
          position: bullSig ? 'belowBar' : 'aboveBar',
          color: bullSig ? '#2ddb75' : '#ff6d6d',
          shape: bullSig ? 'arrowUp' : 'arrowDown',
          text: bullSig ? 'L' : 'S',
          size: 1,
        });
      }
    }
  }

  if (inTrade) {
    openTrade = { entry: entryPx, tp: tpLvl, sl: slLvl, dir: isBull ? 'long' : 'short' };
    tradeLog.push({
      dir: isBull ? 'long' : 'short',
      entry: entryPx, tp: tpLvl, sl: slLvl,
      exit: null, pl: null, reason: 'open',
      entryTime: candles[entryBar].time, exitTime: null,
      entryIndex: entryBar, exitIndex: null,
    });
  }

  markers.sort((a, b) => a.time - b.time);
  return { markers, tradeLog, openTrade };
}

function runB5SStrategy(candles, bot) {
  const tpPct = Number(bot.tp) / 100;
  const slPct = Number(bot.sl) / 100;
  const swingSize = Math.max(2, Math.round(Number(bot.threshold) || 25));
  const useDynamic = (bot.tpType || 'dynamic') === 'dynamic';
  const useWicks = (bot.bosConfType || 'close') === 'wicks';
  const maxTrades = Math.max(1, Math.min(10, Math.round(Number(bot.maxTrades) || 3)));

  const markers = [];
  const tradeLog = [];
  let activeTrades = []; // { dir, entry, tp, sl, entryBar, entryTime }

  let prevHigh = NaN, prevLow = NaN;
  let prevHighIdx = -1, prevLowIdx = -1;
  let highActive = false, lowActive = false;

  // Separate pending state per direction
  let pendingLong = false, pendingShort = false;
  let pendingLongBar = -1, pendingShortBar = -1;
  let pendingLongDist = NaN, pendingShortDist = NaN;

  for (let i = 0; i < candles.length; i++) {
    const bar = candles[i];

    // Confirm pivot at (i - swingSize) once both sides visible
    const pivIdx = i - swingSize;
    if (pivIdx >= swingSize) {
      const pivot = candles[pivIdx];
      let isPivHigh = true, isPivLow = true;
      for (let k = pivIdx - swingSize; k <= pivIdx + swingSize; k++) {
        if (k === pivIdx) continue;
        if (candles[k].high >= pivot.high) isPivHigh = false;
        if (candles[k].low  <= pivot.low)  isPivLow  = false;
      }
      if (isPivHigh) { prevHigh = pivot.high; prevHighIdx = pivIdx; highActive = true; }
      if (isPivLow)  { prevLow  = pivot.low;  prevLowIdx  = pivIdx; lowActive  = true; }
    }

    // BOS detection
    const highSrc = useWicks ? bar.high : bar.close;
    const lowSrc  = useWicks ? bar.low  : bar.close;

    if (highSrc > prevHigh && highActive && !isNaN(prevHigh)) {
      highActive = false;
      const len = Math.max(1, Math.min(i - prevHighIdx, 100));
      let hi = -Infinity, lo = Infinity;
      for (let k = Math.max(0, i - len); k <= i; k++) {
        if (candles[k].high > hi) hi = candles[k].high;
        if (candles[k].low  < lo) lo = candles[k].low;
      }
      pendingLong = true;
      pendingLongBar = i;
      pendingLongDist = (hi - lo) / 2;
      markers.push({ time: bar.time, position: 'belowBar', color: 'rgba(39,211,197,0.6)', shape: 'circle', text: 'BOS', size: 0.5 });
    }

    if (lowSrc < prevLow && lowActive && !isNaN(prevLow)) {
      lowActive = false;
      const len = Math.max(1, Math.min(i - prevLowIdx, 100));
      let hi = -Infinity, lo = Infinity;
      for (let k = Math.max(0, i - len); k <= i; k++) {
        if (candles[k].high > hi) hi = candles[k].high;
        if (candles[k].low  < lo) lo = candles[k].low;
      }
      pendingShort = true;
      pendingShortBar = i;
      pendingShortDist = (hi - lo) / 2;
      markers.push({ time: bar.time, position: 'aboveBar', color: 'rgba(255,109,109,0.6)', shape: 'circle', text: 'BOS', size: 0.5 });
    }

    // Execute pending long on NEXT bar
    if (pendingLong && i > pendingLongBar && activeTrades.length < maxTrades) {
      const entry = bar.open;
      const d = pendingLongDist;
      const tp = useDynamic ? entry + d : entry * (1 + tpPct);
      const sl = useDynamic ? entry - d : entry * (1 - slPct);
      activeTrades.push({ dir: 'long', entry, tp, sl, entryBar: i, entryTime: bar.time });
      markers.push({ time: bar.time, position: 'belowBar', color: '#2ddb75', shape: 'arrowUp', text: 'L', size: 1 });
      pendingLong = false;
    }

    // Execute pending short on NEXT bar
    if (pendingShort && i > pendingShortBar && activeTrades.length < maxTrades) {
      const entry = bar.open;
      const d = pendingShortDist;
      const tp = useDynamic ? entry - d : entry * (1 - tpPct);
      const sl = useDynamic ? entry + d : entry * (1 + slPct);
      activeTrades.push({ dir: 'short', entry, tp, sl, entryBar: i, entryTime: bar.time });
      markers.push({ time: bar.time, position: 'aboveBar', color: '#ff6d6d', shape: 'arrowDown', text: 'S', size: 1 });
      pendingShort = false;
    }

    // Check TP/SL on all active trades
    const remaining = [];
    for (const trade of activeTrades) {
      if (i <= trade.entryBar) { remaining.push(trade); continue; }
      let hitTP = false, hitSL = false;
      if (trade.dir === 'long') {
        hitTP = bar.high >= trade.tp;
        hitSL = bar.low  <= trade.sl;
      } else {
        hitTP = bar.low  <= trade.tp;
        hitSL = bar.high >= trade.sl;
      }
      if (hitTP && hitSL) {
        const dTP = Math.abs(bar.open - trade.tp);
        const dSL = Math.abs(bar.open - trade.sl);
        if (dTP <= dSL) hitSL = false; else hitTP = false;
      }
      if (hitTP || hitSL) {
        const exitPx = hitTP ? trade.tp : trade.sl;
        const pct = trade.dir === 'long'
          ? (exitPx - trade.entry) / trade.entry * 100
          : (trade.entry - exitPx) / trade.entry * 100;
        tradeLog.push({
          dir: trade.dir, entry: trade.entry, tp: trade.tp, sl: trade.sl,
          exit: exitPx, pl: pct, reason: hitTP ? 'tp' : 'sl',
          entryTime: trade.entryTime, exitTime: bar.time,
          entryIndex: trade.entryBar, exitIndex: i,
        });
        markers.push({
          time: bar.time,
          position: trade.dir === 'long' ? 'aboveBar' : 'belowBar',
          color: hitTP ? '#27d3c5' : '#f7bc52',
          shape: 'circle', text: hitTP ? 'TP' : 'SL', size: 0.8,
        });
      } else {
        remaining.push(trade);
      }
    }
    activeTrades = remaining;
  }

  // Any still-open trades
  let openTrade = null;
  for (const trade of activeTrades) {
    tradeLog.push({
      dir: trade.dir, entry: trade.entry, tp: trade.tp, sl: trade.sl,
      exit: null, pl: null, reason: 'open',
      entryTime: trade.entryTime, exitTime: null,
      entryIndex: trade.entryBar, exitIndex: null,
    });
    if (!openTrade) openTrade = { entry: trade.entry, tp: trade.tp, sl: trade.sl, dir: trade.dir };
  }

  markers.sort((a, b) => a.time - b.time);
  return { markers, tradeLog, openTrade };
}

// ── AI1 Strategy — EMA Crossover + RSI Momentum ───────────────────────────────
// EMA(8)/EMA(21) cross filtered by RSI(14) momentum window.
// Long: fast crosses above slow while RSI 45-72 (momentum rising, not overbought).
// Short: fast crosses below slow while RSI 28-55 (momentum falling, not oversold).
// Exits via ATR-based dynamic TP (tp × ATR) and SL (sl × ATR) for ~2:1 R/R.
function runAI1Strategy(candles, bot) {
  const markers = [];
  const tradeLog = [];
  let openTrade = null;

  const rsiPeriod = Math.max(5, Math.round(Number(bot.threshold || 14)));
  const tpMult    = Math.max(0.5, Number(bot.tp || 2.5));
  const slMult    = Math.max(0.3, Number(bot.sl || 1.2));
  const emaFastP  = 8;
  const emaSlowP  = 21;

  function calcEma(data, period) {
    const k = 2 / (period + 1);
    const result = new Array(data.length).fill(NaN);
    let prev = NaN;
    for (let i = 0; i < data.length; i++) {
      prev = isNaN(prev) ? data[i] : data[i] * k + prev * (1 - k);
      result[i] = prev;
    }
    return result;
  }

  function calcRsi(data, period) {
    const result = new Array(data.length).fill(NaN);
    if (data.length < period + 1) return result;
    let avgGain = 0, avgLoss = 0;
    for (let i = 1; i <= period; i++) {
      const d = data[i] - data[i - 1];
      if (d > 0) avgGain += d; else avgLoss -= d;
    }
    avgGain /= period; avgLoss /= period;
    result[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
    for (let i = period + 1; i < data.length; i++) {
      const d = data[i] - data[i - 1];
      avgGain = (avgGain * (period - 1) + Math.max(0, d))  / period;
      avgLoss = (avgLoss * (period - 1) + Math.max(0, -d)) / period;
      result[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
    }
    return result;
  }

  function atrAt(idx) {
    const period = 14;
    if (idx < 1) return candles[idx].close * 0.015;
    let sum = 0, count = 0;
    for (let j = Math.max(1, idx - period + 1); j <= idx; j++) {
      const c = candles[j], p = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - p.close), Math.abs(c.low - p.close));
      count++;
    }
    return count > 0 ? sum / count : candles[idx].close * 0.015;
  }

  const closes = candles.map(c => c.close);
  const emaF = calcEma(closes, emaFastP);
  const emaS = calcEma(closes, emaSlowP);
  const rsi  = calcRsi(closes, rsiPeriod);
  const warmup = emaSlowP + rsiPeriod + 2;
  let position = null;

  for (let i = warmup; i < candles.length; i++) {
    const bar = candles[i];

    if (position && i > position.entryIndex) {
      const hitTP = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const hitSL = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (hitTP || hitSL) {
        const reason = hitTP ? 'tp' : 'sl';
        const exitPx = hitTP ? position.tp : position.sl;
        const pl = position.dir === 'long'
          ? (exitPx - position.entry) / position.entry * 100
          : (position.entry - exitPx) / position.entry * 100;
        tradeLog.push({ dir: position.dir, entry: position.entry, tp: position.tp, sl: position.sl, exit: exitPx, pl, reason, entryTime: candles[position.entryIndex].time, exitTime: bar.time, entryIndex: position.entryIndex, exitIndex: i });
        markers.push({ time: bar.time, position: position.dir === 'long' ? 'aboveBar' : 'belowBar', color: hitTP ? '#27d3c5' : '#f7bc52', shape: 'circle', text: hitTP ? 'TP' : 'SL', size: 0.8 });
        position = null;
      }
    }

    if (!position && !isNaN(rsi[i]) && !isNaN(emaF[i - 1]) && !isNaN(emaS[i - 1])) {
      const crossUp   = emaF[i - 1] <= emaS[i - 1] && emaF[i] > emaS[i];
      const crossDown = emaF[i - 1] >= emaS[i - 1] && emaF[i] < emaS[i];
      const atr = atrAt(i);
      if (crossUp && rsi[i] >= 45 && rsi[i] <= 72) {
        const entry = bar.close;
        position = { dir: 'long', entry, tp: entry + atr * tpMult, sl: entry - atr * slMult, entryIndex: i, entryTime: bar.time };
        markers.push({ time: bar.time, position: 'belowBar', color: '#2ddb75', shape: 'arrowUp', text: 'L', size: 1 });
      } else if (crossDown && rsi[i] >= 28 && rsi[i] <= 55) {
        const entry = bar.close;
        position = { dir: 'short', entry, tp: entry - atr * tpMult, sl: entry + atr * slMult, entryIndex: i, entryTime: bar.time };
        markers.push({ time: bar.time, position: 'aboveBar', color: '#ff6d6d', shape: 'arrowDown', text: 'S', size: 1 });
      }
    }
  }

  if (position) {
    openTrade = { entry: position.entry, tp: position.tp, sl: position.sl, dir: position.dir };
    tradeLog.push({ dir: position.dir, entry: position.entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: position.entryTime, exitTime: null, entryIndex: position.entryIndex, exitIndex: null });
  }
  markers.sort((a, b) => a.time - b.time);
  return { markers, tradeLog, openTrade };
}

// ── AI2 Strategy — Bollinger Band Squeeze Breakout ────────────────────────────
// Detects low-volatility compression via Bollinger Band bandwidth percentile.
// When bandwidth < squeezePct-th percentile (tight coil), fires on direction of
// the breakout candle (close outside the bands) confirmed by a strong bar body.
// ATR-based dynamic exits keep R/R adaptive to current volatility.
function runAI2Strategy(candles, bot) {
  const markers = [];
  const tradeLog = [];
  let openTrade = null;

  const bbPeriod    = 20;
  const bbStdDev    = 2.0;
  const squeezePct  = Math.max(5, Math.min(50, Number(bot.threshold || 25)));
  const tpMult      = Math.max(0.5, Number(bot.tp || 2.0));
  const slMult      = Math.max(0.3, Number(bot.sl || 1.0));

  function calcBB(idx) {
    if (idx < bbPeriod - 1) return null;
    let sum = 0;
    for (let j = idx - bbPeriod + 1; j <= idx; j++) sum += candles[j].close;
    const mean = sum / bbPeriod;
    let varSum = 0;
    for (let j = idx - bbPeriod + 1; j <= idx; j++) varSum += (candles[j].close - mean) ** 2;
    const sd = Math.sqrt(varSum / bbPeriod);
    return { upper: mean + bbStdDev * sd, lower: mean - bbStdDev * sd, mean, bw: mean > 0 ? (sd * 2 * bbStdDev) / mean : 0 };
  }

  function atrAt(idx) {
    const period = 14;
    if (idx < 1) return candles[idx].close * 0.015;
    let sum = 0, count = 0;
    for (let j = Math.max(1, idx - period + 1); j <= idx; j++) {
      const c = candles[j], p = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - p.close), Math.abs(c.low - p.close));
      count++;
    }
    return count > 0 ? sum / count : candles[idx].close * 0.015;
  }

  const bwHistory = [];
  let position = null;

  for (let i = 0; i < candles.length; i++) {
    const bar = candles[i];
    const bb  = calcBB(i);
    if (!bb) continue;

    bwHistory.push(bb.bw);
    if (bwHistory.length > 100) bwHistory.shift();

    if (position && i > position.entryIndex) {
      const hitTP = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const hitSL = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (hitTP || hitSL) {
        const reason = hitTP ? 'tp' : 'sl';
        const exitPx = hitTP ? position.tp : position.sl;
        const pl = position.dir === 'long'
          ? (exitPx - position.entry) / position.entry * 100
          : (position.entry - exitPx) / position.entry * 100;
        tradeLog.push({ dir: position.dir, entry: position.entry, tp: position.tp, sl: position.sl, exit: exitPx, pl, reason, entryTime: candles[position.entryIndex].time, exitTime: bar.time, entryIndex: position.entryIndex, exitIndex: i });
        markers.push({ time: bar.time, position: position.dir === 'long' ? 'aboveBar' : 'belowBar', color: hitTP ? '#27d3c5' : '#f7bc52', shape: 'circle', text: hitTP ? 'TP' : 'SL', size: 0.8 });
        position = null;
      }
    }

    if (!position && bwHistory.length >= 30) {
      const bwRank = percentileRank(bwHistory, bb.bw);
      const inSqueeze = bwRank <= squeezePct;
      if (inSqueeze) {
        const atr = atrAt(i);
        const barRange = bar.high - bar.low;
        if (bar.close > bb.upper && barRange > atr * 0.6) {
          const entry = bar.close;
          position = { dir: 'long', entry, tp: entry + atr * tpMult, sl: entry - atr * slMult, entryIndex: i, entryTime: bar.time };
          markers.push({ time: bar.time, position: 'belowBar', color: '#2ddb75', shape: 'arrowUp', text: 'L', size: 1 });
        } else if (bar.close < bb.lower && barRange > atr * 0.6) {
          const entry = bar.close;
          position = { dir: 'short', entry, tp: entry - atr * tpMult, sl: entry + atr * slMult, entryIndex: i, entryTime: bar.time };
          markers.push({ time: bar.time, position: 'aboveBar', color: '#ff6d6d', shape: 'arrowDown', text: 'S', size: 1 });
        }
      }
    }
  }

  if (position) {
    openTrade = { entry: position.entry, tp: position.tp, sl: position.sl, dir: position.dir };
    tradeLog.push({ dir: position.dir, entry: position.entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: position.entryTime, exitTime: null, entryIndex: position.entryIndex, exitIndex: null });
  }
  markers.sort((a, b) => a.time - b.time);
  return { markers, tradeLog, openTrade };
}

// ── AI3 Strategy — MACD + Stochastic + SMA(200) Triple Confluence ────────────
// Only trades in the direction of the 200-bar SMA macro trend.
// Entry trigger: MACD histogram sign flip (momentum shift confirmation)
//   AND Stochastic K/D indicating reversal from extreme zone (< 30 or > 70).
// This triple-filter design produces fewer but much higher-conviction signals.
function runAI3Strategy(candles, bot) {
  const markers = [];
  const tradeLog = [];
  let openTrade = null;

  const stochKPeriod = Math.max(3, Math.round(Number(bot.threshold || 14)));
  const tpMult       = Math.max(0.5, Number(bot.tp || 2.5));
  const slMult       = Math.max(0.3, Number(bot.sl || 1.5));
  const smaPeriod    = 200;

  function calcEma(data, period) {
    const k = 2 / (period + 1);
    const result = new Array(data.length).fill(NaN);
    let prev = NaN;
    for (let i = 0; i < data.length; i++) {
      prev = isNaN(prev) ? data[i] : data[i] * k + prev * (1 - k);
      result[i] = prev;
    }
    return result;
  }

  function calcSma(data, period) {
    const result = new Array(data.length).fill(NaN);
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
      if (i >= period) sum -= data[i - period];
      if (i >= period - 1) result[i] = sum / period;
    }
    return result;
  }

  function atrAt(idx) {
    const period = 14;
    if (idx < 1) return candles[idx].close * 0.015;
    let sum = 0, count = 0;
    for (let j = Math.max(1, idx - period + 1); j <= idx; j++) {
      const c = candles[j], p = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - p.close), Math.abs(c.low - p.close));
      count++;
    }
    return count > 0 ? sum / count : candles[idx].close * 0.015;
  }

  const closes = candles.map(c => c.close);

  // MACD(12,26,9)
  const ema12     = calcEma(closes, 12);
  const ema26     = calcEma(closes, 26);
  const macdLine  = ema12.map((v, i) => isNaN(v) || isNaN(ema26[i]) ? NaN : v - ema26[i]);
  const sigLine   = calcEma(macdLine.map(v => isNaN(v) ? 0 : v), 9);
  const histogram = macdLine.map((v, i) => isNaN(v) || isNaN(sigLine[i]) ? NaN : v - sigLine[i]);

  // Stochastic K(stochKPeriod, 3, 3) with smoothing
  const stochKRaw = new Array(candles.length).fill(NaN);
  for (let i = stochKPeriod - 1; i < candles.length; i++) {
    let lo = Infinity, hi = -Infinity;
    for (let j = i - stochKPeriod + 1; j <= i; j++) {
      if (candles[j].low  < lo) lo = candles[j].low;
      if (candles[j].high > hi) hi = candles[j].high;
    }
    const range = hi - lo;
    stochKRaw[i] = range > 0 ? (candles[i].close - lo) / range * 100 : 50;
  }
  const stochK = calcSma(stochKRaw.map(v => isNaN(v) ? 50 : v), 3);  // %K smoothed
  const stochD = calcSma(stochK.map(v => isNaN(v) ? 50 : v), 3);     // %D signal line

  // SMA(200)
  const sma200 = calcSma(closes, smaPeriod);
  const warmup = smaPeriod + 26 + 9 + stochKPeriod + 10;

  let position = null;

  for (let i = warmup; i < candles.length; i++) {
    const bar = candles[i];

    if (position && i > position.entryIndex) {
      const hitTP = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const hitSL = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (hitTP || hitSL) {
        const reason = hitTP ? 'tp' : 'sl';
        const exitPx = hitTP ? position.tp : position.sl;
        const pl = position.dir === 'long'
          ? (exitPx - position.entry) / position.entry * 100
          : (position.entry - exitPx) / position.entry * 100;
        tradeLog.push({ dir: position.dir, entry: position.entry, tp: position.tp, sl: position.sl, exit: exitPx, pl, reason, entryTime: candles[position.entryIndex].time, exitTime: bar.time, entryIndex: position.entryIndex, exitIndex: i });
        markers.push({ time: bar.time, position: position.dir === 'long' ? 'aboveBar' : 'belowBar', color: hitTP ? '#27d3c5' : '#f7bc52', shape: 'circle', text: hitTP ? 'TP' : 'SL', size: 0.8 });
        position = null;
      }
    }

    if (!position && !isNaN(sma200[i]) && !isNaN(histogram[i]) && !isNaN(histogram[i - 1])) {
      const aboveSma      = bar.close > sma200[i];
      const histFlipBull  = histogram[i - 1] < 0 && histogram[i] >= 0;  // MACD hist turns positive
      const histFlipBear  = histogram[i - 1] > 0 && histogram[i] <= 0;  // MACD hist turns negative
      const stochOversold  = stochK[i] < 30 && stochK[i] > stochD[i];   // K rising from oversold
      const stochOverbought = stochK[i] > 70 && stochK[i] < stochD[i];   // K falling from overbought
      const atr = atrAt(i);

      if (aboveSma && histFlipBull && stochOversold) {
        const entry = bar.close;
        position = { dir: 'long', entry, tp: entry + atr * tpMult, sl: entry - atr * slMult, entryIndex: i, entryTime: bar.time };
        markers.push({ time: bar.time, position: 'belowBar', color: '#2ddb75', shape: 'arrowUp', text: 'L', size: 1 });
      } else if (!aboveSma && histFlipBear && stochOverbought) {
        const entry = bar.close;
        position = { dir: 'short', entry, tp: entry - atr * tpMult, sl: entry + atr * slMult, entryIndex: i, entryTime: bar.time };
        markers.push({ time: bar.time, position: 'aboveBar', color: '#ff6d6d', shape: 'arrowDown', text: 'S', size: 1 });
      }
    }
  }

  if (position) {
    openTrade = { entry: position.entry, tp: position.tp, sl: position.sl, dir: position.dir };
    tradeLog.push({ dir: position.dir, entry: position.entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: position.entryTime, exitTime: null, entryIndex: position.entryIndex, exitIndex: null });
  }
  markers.sort((a, b) => a.time - b.time);
  return { markers, tradeLog, openTrade };
}

// ── VW1 Strategy — VWAP Deviation Mean-Reversion ─────────────────────────────
// Computes a rolling 1-day VWAP anchor. When price deviates beyond the N-th
// percentile of its historical VWAP-gap distribution, it bets on the snap-back.
// Long: price < VWAP and the gap is < (100-threshold) percentile (extreme low).
// Short: price > VWAP and the gap is > threshold percentile (extreme high).
// ATR-based TP/SL — mean-reversion means tighter targets are more appropriate.
function runVW1Strategy(candles, bot) {
  const markers  = [];
  const tradeLog = [];
  let openTrade  = null;

  const devPct  = Math.max(5, Math.min(49, Number(bot.threshold || 20)));
  const tpMult  = Math.max(0.3, Number(bot.tp || 1.8));
  const slMult  = Math.max(0.2, Number(bot.sl || 0.9));
  const vwapWin = 100; // bars per rolling VWAP window

  function atrAt(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.012;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.012;
  }

  // Rolling VWAP over the previous `vwapWin` bars
  function calcVwap(i) {
    let tpvSum = 0, volSum = 0;
    const start = Math.max(0, i - vwapWin + 1);
    for (let j = start; j <= i; j++) {
      const c = candles[j];
      const typicalPrice = (c.high + c.low + c.close) / 3;
      const vol = Math.max(c.volume || 1, 1);
      tpvSum += typicalPrice * vol;
      volSum += vol;
    }
    return volSum > 0 ? tpvSum / volSum : candles[i].close;
  }

  const gapHistory = [];
  let position = null;

  for (let i = vwapWin; i < candles.length; i++) {
    const bar  = candles[i];
    const vwap = calcVwap(i);
    const gap  = (bar.close - vwap) / vwap * 100; // % above/below VWAP
    gapHistory.push(gap);
    if (gapHistory.length > 200) gapHistory.shift();

    if (position && i > position.entryIndex) {
      const hitTP = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const hitSL = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (hitTP || hitSL) {
        const reason   = hitTP ? 'tp' : 'sl';
        const exitPx   = hitTP ? position.tp : position.sl;
        const pl = position.dir === 'long'
          ? (exitPx - position.entry) / position.entry * 100
          : (position.entry - exitPx) / position.entry * 100;
        tradeLog.push({ dir: position.dir, entry: position.entry, tp: position.tp, sl: position.sl, exit: exitPx, pl, reason, entryTime: candles[position.entryIndex].time, exitTime: bar.time, entryIndex: position.entryIndex, exitIndex: i });
        markers.push({ time: bar.time, position: position.dir === 'long' ? 'aboveBar' : 'belowBar', color: hitTP ? '#27d3c5' : '#f7bc52', shape: 'circle', text: hitTP ? 'TP' : 'SL', size: 0.8 });
        position = null;
      }
    }

    if (!position && gapHistory.length >= 50) {
      const rank = percentileRank(gapHistory, gap);
      const atr  = atrAt(i);
      // Oversold extreme — expect snap back up to VWAP
      if (rank <= devPct && gap < 0) {
        const entry = bar.close;
        position = { dir: 'long', entry, tp: entry + atr * tpMult, sl: entry - atr * slMult, entryIndex: i, entryTime: bar.time };
        markers.push({ time: bar.time, position: 'belowBar', color: '#2ddb75', shape: 'arrowUp', text: 'L', size: 1 });
      // Overbought extreme — expect snap back down to VWAP
      } else if (rank >= (100 - devPct) && gap > 0) {
        const entry = bar.close;
        position = { dir: 'short', entry, tp: entry - atr * tpMult, sl: entry + atr * slMult, entryIndex: i, entryTime: bar.time };
        markers.push({ time: bar.time, position: 'aboveBar', color: '#ff6d6d', shape: 'arrowDown', text: 'S', size: 1 });
      }
    }
  }

  if (position) {
    openTrade = { entry: position.entry, tp: position.tp, sl: position.sl, dir: position.dir };
    tradeLog.push({ dir: position.dir, entry: position.entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: position.entryTime, exitTime: null, entryIndex: position.entryIndex, exitIndex: null });
  }
  markers.sort((a, b) => a.time - b.time);
  return { markers, tradeLog, openTrade };
}

// ── KC1 Strategy — Keltner Channel Trend Breakout ─────────────────────────────
// Keltner Channels use ATR-based bands around an EMA (not stddev like Bollinger).
// This makes them wider in trending markets and narrower in calmer ones.
// Signal: close breaks OUTSIDE the channel (strong trend expansion).
// Filter: require the last 3 bars to be progressive (trending) — avoids whipsaws.
// Uses a 2× ATR trailing approach: SL hugs below the EMA, TP is ATR-projected.
function runKC1Strategy(candles, bot) {
  const markers  = [];
  const tradeLog = [];
  let openTrade  = null;

  const emaPeriod = Math.max(5, Math.round(Number(bot.threshold || 20)));
  const tpMult    = Math.max(0.5, Number(bot.tp || 2.2));
  const slMult    = Math.max(0.3, Number(bot.sl || 1.1));
  const atrMult   = 2.0; // KC band width

  function calcEma(data, period) {
    const k = 2 / (period + 1); let prev = NaN;
    return data.map(v => { prev = isNaN(prev) ? v : v * k + prev * (1 - k); return prev; });
  }

  function atrAt(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.015;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.015;
  }

  const closes = candles.map(c => c.close);
  const ema    = calcEma(closes, emaPeriod);
  const warmup = emaPeriod + 16;
  let position = null;

  for (let i = warmup; i < candles.length; i++) {
    const bar  = candles[i];
    const atr  = atrAt(i);
    const mid  = ema[i];
    const upper = mid + atrMult * atr;
    const lower = mid - atrMult * atr;

    if (position && i > position.entryIndex) {
      const hitTP = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const hitSL = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (hitTP || hitSL) {
        const reason = hitTP ? 'tp' : 'sl';
        const exitPx = hitTP ? position.tp : position.sl;
        const pl = position.dir === 'long'
          ? (exitPx - position.entry) / position.entry * 100
          : (position.entry - exitPx) / position.entry * 100;
        tradeLog.push({ dir: position.dir, entry: position.entry, tp: position.tp, sl: position.sl, exit: exitPx, pl, reason, entryTime: candles[position.entryIndex].time, exitTime: bar.time, entryIndex: position.entryIndex, exitIndex: i });
        markers.push({ time: bar.time, position: position.dir === 'long' ? 'aboveBar' : 'belowBar', color: hitTP ? '#27d3c5' : '#f7bc52', shape: 'circle', text: hitTP ? 'TP' : 'SL', size: 0.8 });
        position = null;
      }
    }

    if (!position) {
      // Require 3 consecutive higher closes (bullish momentum) before taking the long
      const bullTrend = candles[i].close > candles[i - 1].close && candles[i - 1].close > candles[i - 2].close;
      const bearTrend = candles[i].close < candles[i - 1].close && candles[i - 1].close < candles[i - 2].close;

      if (bar.close > upper && bullTrend) {
        const entry = bar.close;
        position = { dir: 'long', entry, tp: entry + atr * tpMult, sl: entry - atr * slMult, entryIndex: i, entryTime: bar.time };
        markers.push({ time: bar.time, position: 'belowBar', color: '#2ddb75', shape: 'arrowUp', text: 'L', size: 1 });
      } else if (bar.close < lower && bearTrend) {
        const entry = bar.close;
        position = { dir: 'short', entry, tp: entry - atr * tpMult, sl: entry + atr * slMult, entryIndex: i, entryTime: bar.time };
        markers.push({ time: bar.time, position: 'aboveBar', color: '#ff6d6d', shape: 'arrowDown', text: 'S', size: 1 });
      }
    }
  }

  if (position) {
    openTrade = { entry: position.entry, tp: position.tp, sl: position.sl, dir: position.dir };
    tradeLog.push({ dir: position.dir, entry: position.entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: position.entryTime, exitTime: null, entryIndex: position.entryIndex, exitIndex: null });
  }
  markers.sort((a, b) => a.time - b.time);
  return { markers, tradeLog, openTrade };
}

// ── DV1 Strategy — Donchian Velocity + Volume Surge ──────────────────────────
// Donchian channels (highest high / lowest low over N bars) mark breakouts.
// But raw Donchian signals are noisy. DV1 adds a volume-surge filter:
// only fires if the breakout candle's body is in the top-30th percentile of
// recent bar bodies AND close-volume is above its 20-bar average.
// This selects explosive breakout candles, not slow drift-throughs.
function runDV1Strategy(candles, bot) {
  const markers  = [];
  const tradeLog = [];
  let openTrade  = null;

  const dcPeriod  = Math.max(5, Math.round(Number(bot.threshold || 20)));
  const tpMult    = Math.max(0.5, Number(bot.tp || 2.0));
  const slMult    = Math.max(0.3, Number(bot.sl || 1.0));
  const volAvgP   = 20;
  const bodyPctTh = 70; // body must be ≥ 70th percentile of recent bodies

  function atrAt(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.015;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.015;
  }

  const warmup  = dcPeriod + volAvgP + 5;
  let position  = null;
  const bodyBuf = [];

  for (let i = warmup; i < candles.length; i++) {
    const bar  = candles[i];
    const body = Math.abs(bar.close - bar.open);
    bodyBuf.push(body);
    if (bodyBuf.length > 50) bodyBuf.shift();

    // Donchian channel (exclude current bar)
    let dcHigh = -Infinity, dcLow = Infinity;
    for (let j = i - dcPeriod; j < i; j++) {
      if (candles[j].high > dcHigh) dcHigh = candles[j].high;
      if (candles[j].low  < dcLow)  dcLow  = candles[j].low;
    }

    // Volume average
    let volSum = 0;
    for (let j = i - volAvgP; j < i; j++) volSum += Math.max(candles[j].volume || 1, 1);
    const volAvg = volSum / volAvgP;
    const vol    = Math.max(bar.volume || 1, 1);

    if (position && i > position.entryIndex) {
      const hitTP = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const hitSL = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (hitTP || hitSL) {
        const reason = hitTP ? 'tp' : 'sl';
        const exitPx = hitTP ? position.tp : position.sl;
        const pl = position.dir === 'long'
          ? (exitPx - position.entry) / position.entry * 100
          : (position.entry - exitPx) / position.entry * 100;
        tradeLog.push({ dir: position.dir, entry: position.entry, tp: position.tp, sl: position.sl, exit: exitPx, pl, reason, entryTime: candles[position.entryIndex].time, exitTime: bar.time, entryIndex: position.entryIndex, exitIndex: i });
        markers.push({ time: bar.time, position: position.dir === 'long' ? 'aboveBar' : 'belowBar', color: hitTP ? '#27d3c5' : '#f7bc52', shape: 'circle', text: hitTP ? 'TP' : 'SL', size: 0.8 });
        position = null;
      }
    }

    if (!position && bodyBuf.length >= 20) {
      const bodyRank   = percentileRank(bodyBuf, body);
      const volSurge   = vol > volAvg * 1.3;
      const strongBody = bodyRank >= bodyPctTh;
      const atr = atrAt(i);

      if (bar.close > dcHigh && bar.close > bar.open && strongBody && volSurge) {
        const entry = bar.close;
        position = { dir: 'long', entry, tp: entry + atr * tpMult, sl: entry - atr * slMult, entryIndex: i, entryTime: bar.time };
        markers.push({ time: bar.time, position: 'belowBar', color: '#2ddb75', shape: 'arrowUp', text: 'L', size: 1 });
      } else if (bar.close < dcLow && bar.close < bar.open && strongBody && volSurge) {
        const entry = bar.close;
        position = { dir: 'short', entry, tp: entry - atr * tpMult, sl: entry + atr * slMult, entryIndex: i, entryTime: bar.time };
        markers.push({ time: bar.time, position: 'aboveBar', color: '#ff6d6d', shape: 'arrowDown', text: 'S', size: 1 });
      }
    }
  }

  if (position) {
    openTrade = { entry: position.entry, tp: position.tp, sl: position.sl, dir: position.dir };
    tradeLog.push({ dir: position.dir, entry: position.entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: position.entryTime, exitTime: null, entryIndex: position.entryIndex, exitIndex: null });
  }
  markers.sort((a, b) => a.time - b.time);
  return { markers, tradeLog, openTrade };
}

// ── RS1 Strategy — Rate-of-Change Divergence Reversal ────────────────────────
// Detects classical price/momentum divergence using ROC (Rate of Change).
// Bullish divergence: price forms a lower-low, but ROC is HIGHER than previous low.
//   → bears are losing momentum → expect reversal up.
// Bearish divergence: price forms a higher-high, but ROC is LOWER than previous high.
//   → bulls are exhausted → expect reversal down.
// Swing detection uses a 5-bar lookback for local highs/lows.
function runRS1Strategy(candles, bot) {
  const markers  = [];
  const tradeLog = [];
  let openTrade  = null;

  const rocPeriod = Math.max(3, Math.round(Number(bot.threshold || 14)));
  const tpMult    = Math.max(0.5, Number(bot.tp || 2.5));
  const slMult    = Math.max(0.3, Number(bot.sl || 1.3));
  const swingWin  = 5; // bars each side for local extremes

  function calcRoc(i) {
    if (i < rocPeriod) return 0;
    const prev = candles[i - rocPeriod].close;
    return prev > 0 ? (candles[i].close - prev) / prev * 100 : 0;
  }

  function atrAt(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.015;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.015;
  }

  // Scan previous confirmed swing lows for divergence lookback
  const swingLows  = [];  // { priceIdx, price, roc }
  const swingHighs = [];  // { priceIdx, price, roc }
  let position = null;
  const warmup = rocPeriod + swingWin * 2 + 5;

  for (let i = warmup; i < candles.length; i++) {
    const bar = candles[i];
    const roc = calcRoc(i);

    // Confirm pivot at (i - swingWin)
    const pivIdx = i - swingWin;
    if (pivIdx >= swingWin) {
      const pivot = candles[pivIdx];
      let isSwingLow = true, isSwingHigh = true;
      for (let k = pivIdx - swingWin; k <= pivIdx + swingWin; k++) {
        if (k === pivIdx) continue;
        if (candles[k].low  <= pivot.low)  isSwingLow  = false;
        if (candles[k].high >= pivot.high) isSwingHigh = false;
      }
      const pivRoc = calcRoc(pivIdx);
      if (isSwingLow)  { swingLows.push({ idx: pivIdx, price: pivot.low,   roc: pivRoc }); if (swingLows.length  > 10) swingLows.shift(); }
      if (isSwingHigh) { swingHighs.push({ idx: pivIdx, price: pivot.high, roc: pivRoc }); if (swingHighs.length > 10) swingHighs.shift(); }
    }

    if (position && i > position.entryIndex) {
      const hitTP = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const hitSL = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (hitTP || hitSL) {
        const reason = hitTP ? 'tp' : 'sl';
        const exitPx = hitTP ? position.tp : position.sl;
        const pl = position.dir === 'long'
          ? (exitPx - position.entry) / position.entry * 100
          : (position.entry - exitPx) / position.entry * 100;
        tradeLog.push({ dir: position.dir, entry: position.entry, tp: position.tp, sl: position.sl, exit: exitPx, pl, reason, entryTime: candles[position.entryIndex].time, exitTime: bar.time, entryIndex: position.entryIndex, exitIndex: i });
        markers.push({ time: bar.time, position: position.dir === 'long' ? 'aboveBar' : 'belowBar', color: hitTP ? '#27d3c5' : '#f7bc52', shape: 'circle', text: hitTP ? 'TP' : 'SL', size: 0.8 });
        position = null;
      }
    }

    if (!position && swingLows.length >= 2 && swingHighs.length >= 2) {
      const atr = atrAt(i);
      // Bullish divergence: current bar is a new low but ROC is improving
      const prevL = swingLows[swingLows.length - 1];
      const prevH = swingHighs[swingHighs.length - 1];

      if (bar.low < prevL.price && roc > prevL.roc && roc < 0) {
        const entry = bar.close;
        position = { dir: 'long', entry, tp: entry + atr * tpMult, sl: entry - atr * slMult, entryIndex: i, entryTime: bar.time };
        markers.push({ time: bar.time, position: 'belowBar', color: '#2ddb75', shape: 'arrowUp', text: 'L', size: 1 });
      } else if (bar.high > prevH.price && roc < prevH.roc && roc > 0) {
        const entry = bar.close;
        position = { dir: 'short', entry, tp: entry - atr * tpMult, sl: entry + atr * slMult, entryIndex: i, entryTime: bar.time };
        markers.push({ time: bar.time, position: 'aboveBar', color: '#ff6d6d', shape: 'arrowDown', text: 'S', size: 1 });
      }
    }
  }

  if (position) {
    openTrade = { entry: position.entry, tp: position.tp, sl: position.sl, dir: position.dir };
    tradeLog.push({ dir: position.dir, entry: position.entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: position.entryTime, exitTime: null, entryIndex: position.entryIndex, exitIndex: null });
  }
  markers.sort((a, b) => a.time - b.time);
  return { markers, tradeLog, openTrade };
}

// ── E3 Strategy — Range Consolidation Breakout ────────────────────────────────
// Inspired by E3S (Pine Script): detects when price consolidates in a stable
// range (highest/lowest unchanged for `confirmBars`) then fires on the first
// confirmed close breakout, with a volume-surge gate.  Range size drives TP/SL.
function runE3Strategy(candles, bot) {
  const markers  = [];
  const tradeLog = [];
  let openTrade  = null;

  const rangePeriod  = Math.max(5, Math.round(Number(bot.threshold || 20)));
  const confirmBars  = Math.max(3, Math.round(rangePeriod / 4));
  const tpMult       = Math.max(0.5, Number(bot.tp || 2.2));
  const slMult       = Math.max(0.3, Number(bot.sl || 1.0));
  const volGate      = 1.2; // vol must be > avgVol × volGate
  const volAvgP      = 20;

  function atrAt(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.012;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.012;
  }

  const warmup = rangePeriod + confirmBars + volAvgP + 2;
  let position = null;

  for (let i = warmup; i < candles.length; i++) {
    const bar = candles[i];

    // Rolling range
    let upper = -Infinity, lower = Infinity;
    for (let j = i - rangePeriod; j < i; j++) {
      if (candles[j].high > upper) upper = candles[j].high;
      if (candles[j].low  < lower) lower = candles[j].low;
    }
    let upperPrev = -Infinity, lowerPrev = Infinity;
    for (let j = i - rangePeriod - confirmBars; j < i - confirmBars; j++) {
      if (candles[j].high > upperPrev) upperPrev = candles[j].high;
      if (candles[j].low  < lowerPrev) lowerPrev = candles[j].low;
    }

    const rangeStable = Math.abs(upper - upperPrev) < upper * 0.002 &&
                        Math.abs(lower - lowerPrev) < lower * 0.002;

    // Volume gate
    let volSum = 0;
    for (let j = i - volAvgP; j < i; j++) volSum += Math.max(candles[j].volume || 1, 1);
    const volAvg   = volSum / volAvgP;
    const volSurge = Math.max(bar.volume || 1, 1) > volAvg * volGate;

    if (position && i > position.entryIndex) {
      const tpHit = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const slHit = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (tpHit || slHit) {
        const reason    = tpHit ? 'tp' : 'sl';
        const exitPrice = tpHit ? position.tp : position.sl;
        const pl  = position.dir === 'long'
          ? ((exitPrice - position.entry) / position.entry) * 100
          : ((position.entry - exitPrice) / position.entry) * 100;
        tradeLog.push({ ...position, exit: exitPrice, pl, reason, exitTime: bar.time, exitIndex: i });
        markers.push({ time: bar.time, position: 'aboveBar', color: tpHit ? '#2ddb75' : '#ff6d6d', shape: 'square', text: reason.toUpperCase(), size: 0.5 });
        openTrade = null;
        position  = null;
      }
    }

    if (!position && rangeStable && volSurge) {
      const atr   = atrAt(i);
      // Bullish breakout: close above upper band
      if (bar.close > upper) {
        const entry  = bar.close;
        position = { dir: 'long', entry, tp: entry + atr * tpMult, sl: entry - atr * slMult, entryIndex: i, entryTime: bar.time };
        tradeLog.push({ dir: 'long', entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: bar.time, exitTime: null, entryIndex: i, exitIndex: null });
        markers.push({ time: bar.time, position: 'belowBar', color: '#2ddb75', shape: 'arrowUp', text: 'L', size: 1 });
      } else if (bar.close < lower) {
        // Bearish breakout: close below lower band
        const entry  = bar.close;
        position = { dir: 'short', entry, tp: entry - atr * tpMult, sl: entry + atr * slMult, entryIndex: i, entryTime: bar.time };
        tradeLog.push({ dir: 'short', entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: bar.time, exitTime: null, entryIndex: i, exitIndex: null });
        markers.push({ time: bar.time, position: 'aboveBar', color: '#ff6d6d', shape: 'arrowDown', text: 'S', size: 1 });
      }
    }
  }

  if (position) {
    openTrade = { entry: position.entry, tp: position.tp, sl: position.sl, dir: position.dir };
    tradeLog.push({ dir: position.dir, entry: position.entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: position.entryTime, exitTime: null, entryIndex: position.entryIndex, exitIndex: null });
  }
  markers.sort((a, b) => a.time - b.time);
  return { markers, tradeLog, openTrade };
}

// ── CV1 Strategy — Cumulative Volume Delta ────────────────────────────────────
// Inspired by F10S Slim (Pine Script): tracks cumulative signed volume over a
// rolling window.  When CVD flips from negative to positive → long; positive to
// negative → short.  Reflects institutional buying/selling pressure shifts.
function runCV1Strategy(candles, bot) {
  const markers  = [];
  const tradeLog = [];
  let openTrade  = null;

  const cvdWindow = Math.max(5, Math.round(Number(bot.threshold || 20)));
  const tpMult    = Math.max(0.5, Number(bot.tp || 2.5));
  const slMult    = Math.max(0.3, Number(bot.sl || 1.2));

  function atrAt(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.015;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.015;
  }

  function calcCVD(endIdx) {
    let cvd = 0;
    for (let j = Math.max(0, endIdx - cvdWindow + 1); j <= endIdx; j++) {
      const c = candles[j];
      const vol = Math.max(c.volume || 1, 1);
      cvd += c.close >= c.open ? vol : -vol;
    }
    return cvd;
  }

  const warmup = cvdWindow + 2;
  let position = null;

  for (let i = warmup; i < candles.length; i++) {
    const bar  = candles[i];
    const cvd  = calcCVD(i);
    const cvdPrev = calcCVD(i - 1);

    if (position && i > position.entryIndex) {
      const tpHit = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const slHit = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (tpHit || slHit) {
        const reason    = tpHit ? 'tp' : 'sl';
        const exitPrice = tpHit ? position.tp : position.sl;
        const pl  = position.dir === 'long'
          ? ((exitPrice - position.entry) / position.entry) * 100
          : ((position.entry - exitPrice) / position.entry) * 100;
        tradeLog.push({ ...position, exit: exitPrice, pl, reason, exitTime: bar.time, exitIndex: i });
        markers.push({ time: bar.time, position: 'aboveBar', color: tpHit ? '#2ddb75' : '#ff6d6d', shape: 'square', text: reason.toUpperCase(), size: 0.5 });
        openTrade = null;
        position  = null;
      }
    }

    if (!position) {
      const atr = atrAt(i);
      // CVD crosses above 0 (sellers → buyers)
      if (cvdPrev <= 0 && cvd > 0) {
        const entry = bar.close;
        position = { dir: 'long', entry, tp: entry + atr * tpMult, sl: entry - atr * slMult, entryIndex: i, entryTime: bar.time };
        tradeLog.push({ dir: 'long', entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: bar.time, exitTime: null, entryIndex: i, exitIndex: null });
        markers.push({ time: bar.time, position: 'belowBar', color: '#2ddb75', shape: 'arrowUp', text: 'L', size: 1 });
      } else if (cvdPrev >= 0 && cvd < 0) {
        // CVD crosses below 0 (buyers → sellers)
        const entry = bar.close;
        position = { dir: 'short', entry, tp: entry - atr * tpMult, sl: entry + atr * slMult, entryIndex: i, entryTime: bar.time };
        tradeLog.push({ dir: 'short', entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: bar.time, exitTime: null, entryIndex: i, exitIndex: null });
        markers.push({ time: bar.time, position: 'aboveBar', color: '#ff6d6d', shape: 'arrowDown', text: 'S', size: 1 });
      }
    }
  }

  if (position) {
    openTrade = { entry: position.entry, tp: position.tp, sl: position.sl, dir: position.dir };
    tradeLog.push({ dir: position.dir, entry: position.entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: position.entryTime, exitTime: null, entryIndex: position.entryIndex, exitIndex: null });
  }
  markers.sort((a, b) => a.time - b.time);
  return { markers, tradeLog, openTrade };
}

// ── CH1 Strategy — CHoCH Market Structure Break ───────────────────────────────
// Inspired by SP MSI&S (LuxAlgo Pine Script): detects Change of Character by
// tracking swing highs/lows.  A bullish CHoCH occurs when price was making
// lower-highs then breaks above the most recent confirmed swing high.
// A bearish CHoCH occurs when price breaks below the most recent swing low
// while in an upward structure.  Trades the structure flip immediately.
function runCH1Strategy(candles, bot) {
  const markers  = [];
  const tradeLog = [];
  let openTrade  = null;

  const swingWin = Math.max(3, Math.round(Number(bot.threshold || 10)));
  const tpMult   = Math.max(0.5, Number(bot.tp || 3.0));
  const slMult   = Math.max(0.3, Number(bot.sl || 1.5));

  function atrAt(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.015;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.015;
  }

  // Detect confirmed pivot high/low at index (requires swingWin bars on each side)
  function isPivotHigh(i) {
    if (i < swingWin || i + swingWin >= candles.length) return false;
    for (let k = i - swingWin; k <= i + swingWin; k++) {
      if (k === i) continue;
      if (candles[k].high >= candles[i].high) return false;
    }
    return true;
  }
  function isPivotLow(i) {
    if (i < swingWin || i + swingWin >= candles.length) return false;
    for (let k = i - swingWin; k <= i + swingWin; k++) {
      if (k === i) continue;
      if (candles[k].low <= candles[i].low) return false;
    }
    return true;
  }

  // Pre-compute pivots (offset by swingWin: pivot at idx is confirmed at idx+swingWin)
  const pivotHighs = []; // { idx, price }
  const pivotLows  = []; // { idx, price }
  for (let i = swingWin; i < candles.length - swingWin; i++) {
    if (isPivotHigh(i)) pivotHighs.push({ idx: i, price: candles[i].high });
    if (isPivotLow(i))  pivotLows.push( { idx: i, price: candles[i].low  });
  }

  // os = 1 uptrend (HH/HL), os = -1 downtrend (LH/LL), 0 = undefined
  let os = 0;
  let lastSwingHigh = null;
  let lastSwingLow  = null;
  let phPtr = 0, plPtr = 0;
  let position = null;

  const warmup = swingWin * 2 + 14;

  for (let i = warmup; i < candles.length; i++) {
    // Incorporate any pivots now confirmed (pivot at j confirmed when i >= j + swingWin)
    while (phPtr < pivotHighs.length && i >= pivotHighs[phPtr].idx + swingWin) {
      lastSwingHigh = pivotHighs[phPtr];
      phPtr++;
    }
    while (plPtr < pivotLows.length && i >= pivotLows[plPtr].idx + swingWin) {
      lastSwingLow = pivotLows[plPtr];
      plPtr++;
    }

    const bar = candles[i];

    if (position && i > position.entryIndex) {
      const tpHit = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const slHit = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (tpHit || slHit) {
        const reason    = tpHit ? 'tp' : 'sl';
        const exitPrice = tpHit ? position.tp : position.sl;
        const pl  = position.dir === 'long'
          ? ((exitPrice - position.entry) / position.entry) * 100
          : ((position.entry - exitPrice) / position.entry) * 100;
        tradeLog.push({ ...position, exit: exitPrice, pl, reason, exitTime: bar.time, exitIndex: i });
        markers.push({ time: bar.time, position: 'aboveBar', color: tpHit ? '#2ddb75' : '#ff6d6d', shape: 'square', text: reason.toUpperCase(), size: 0.5 });
        openTrade = null;
        position  = null;
        os        = 0; // reset structure after trade closes
      }
    }

    if (!position && lastSwingHigh && lastSwingLow) {
      const atr = atrAt(i);
      // Bullish CHoCH: was bearish (os <= 0), close breaks above last swing high
      if (os <= 0 && bar.close > lastSwingHigh.price) {
        os = 1;
        const entry = bar.close;
        position = { dir: 'long', entry, tp: entry + atr * tpMult, sl: entry - atr * slMult, entryIndex: i, entryTime: bar.time };
        tradeLog.push({ dir: 'long', entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: bar.time, exitTime: null, entryIndex: i, exitIndex: null });
        markers.push({ time: bar.time, position: 'belowBar', color: '#2ddb75', shape: 'arrowUp', text: 'L', size: 1 });
      } else if (os >= 0 && bar.close < lastSwingLow.price) {
        // Bearish CHoCH: was bullish (os >= 0), close breaks below last swing low
        os = -1;
        const entry = bar.close;
        position = { dir: 'short', entry, tp: entry - atr * tpMult, sl: entry + atr * slMult, entryIndex: i, entryTime: bar.time };
        tradeLog.push({ dir: 'short', entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: bar.time, exitTime: null, entryIndex: i, exitIndex: null });
        markers.push({ time: bar.time, position: 'aboveBar', color: '#ff6d6d', shape: 'arrowDown', text: 'S', size: 1 });
      }
    }
  }

  if (position) {
    openTrade = { entry: position.entry, tp: position.tp, sl: position.sl, dir: position.dir };
    tradeLog.push({ dir: position.dir, entry: position.entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: position.entryTime, exitTime: null, entryIndex: position.entryIndex, exitIndex: null });
  }
  markers.sort((a, b) => a.time - b.time);
  return { markers, tradeLog, openTrade };
}

// ── PM1 — RSI/SMA Pivot Momentum ─────────────────────────────────────────────
// Inspired by: ChartPrime RR-Optimiser — RSI crossover with its own SMA is the
// default internal entry signal.  We layer a 50-bar SMA trend-filter + ATR
// proximity gate: entry must be within 1.5 ATR of the mean (pullback/rally to
// the mid-band).  RSI must stay in 35-65 zone (momentum building, not extreme).
// Long:  RSI crosses above SMA(RSI) in zone, price near 50-SMA from above.
// Short: RSI crosses below SMA(RSI) in zone, price near 50-SMA from below.
function runPM1Strategy(candles, bot) {
  const rsiPeriod = Math.max(5, Math.round(Number(bot.threshold || 14)));
  const tpMult    = Math.max(0.5, Number(bot.tp || 2.0));
  const slMult    = Math.max(0.3, Number(bot.sl || 1.0));
  const markers   = [];
  const tradeLog  = [];
  let openTrade   = null;

  function calcATR(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.015;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.015;
  }

  function calcRSI(endIdx) {
    const len = rsiPeriod;
    if (endIdx < len) return 50;
    let gains = 0, losses = 0;
    for (let j = endIdx - len + 1; j <= endIdx; j++) {
      const diff = candles[j].close - candles[j - 1].close;
      if (diff > 0) gains += diff; else losses -= diff;
    }
    const rs = losses === 0 ? 100 : gains / losses;
    return 100 - 100 / (1 + rs);
  }

  function calcRSISMA(endIdx) {
    let sum = 0;
    for (let j = endIdx - rsiPeriod + 1; j <= endIdx; j++) sum += calcRSI(j);
    return sum / rsiPeriod;
  }

  function calcSMA50(endIdx) {
    const len = 50;
    if (endIdx < len - 1) return candles[endIdx].close;
    let sum = 0;
    for (let j = endIdx - len + 1; j <= endIdx; j++) sum += candles[j].close;
    return sum / len;
  }

  const warmup = rsiPeriod * 2 + 50 + 14;
  let position  = null;

  for (let i = warmup; i < candles.length; i++) {
    const bar = candles[i];
    const atr = calcATR(i);

    if (position && i > position.entryIndex) {
      const tpHit = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const slHit = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (tpHit || slHit) {
        const reason    = tpHit ? 'tp' : 'sl';
        const exitPrice = tpHit ? position.tp : position.sl;
        const pl = position.dir === 'long'
          ? ((exitPrice - position.entry) / position.entry) * 100
          : ((position.entry - exitPrice) / position.entry) * 100;
        tradeLog.push({ ...position, exit: exitPrice, pl, reason, exitTime: bar.time, exitIndex: i });
        markers.push({ time: bar.time, position: 'aboveBar', color: tpHit ? '#2ddb75' : '#ff6d6d', shape: 'square', text: reason.toUpperCase(), size: 0.5 });
        openTrade = null;
        position  = null;
      }
    }

    if (!position) {
      const rsi     = calcRSI(i);
      const rsiPrev = calcRSI(i - 1);
      const rsma    = calcRSISMA(i);
      const rsmaPrev = calcRSISMA(i - 1);
      const sma50   = calcSMA50(i);
      const inZone  = rsi >= 35 && rsi <= 65;

      const crossUp   = rsiPrev <= rsmaPrev && rsi > rsma;
      const crossDown = rsiPrev >= rsmaPrev && rsi < rsma;

      if (crossUp && inZone && bar.close >= sma50 - 1.5 * atr && bar.close <= sma50 + 3 * atr) {
        const entry = bar.close;
        position = { dir: 'long', entry, tp: entry + atr * tpMult, sl: entry - atr * slMult, entryIndex: i, entryTime: bar.time };
        tradeLog.push({ dir: 'long', entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: bar.time, exitTime: null, entryIndex: i, exitIndex: null });
        markers.push({ time: bar.time, position: 'belowBar', color: '#2ddb75', shape: 'arrowUp', text: 'L', size: 1 });
      } else if (crossDown && inZone && bar.close <= sma50 + 1.5 * atr && bar.close >= sma50 - 3 * atr) {
        const entry = bar.close;
        position = { dir: 'short', entry, tp: entry - atr * tpMult, sl: entry + atr * slMult, entryIndex: i, entryTime: bar.time };
        tradeLog.push({ dir: 'short', entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: bar.time, exitTime: null, entryIndex: i, exitIndex: null });
        markers.push({ time: bar.time, position: 'aboveBar', color: '#ff6d6d', shape: 'arrowDown', text: 'S', size: 1 });
      }
    }
  }

  if (position) {
    openTrade = { entry: position.entry, tp: position.tp, sl: position.sl, dir: position.dir };
    tradeLog.push({ dir: position.dir, entry: position.entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: position.entryTime, exitTime: null, entryIndex: position.entryIndex, exitIndex: null });
  }
  markers.sort((a, b) => a.time - b.time);
  return { markers, tradeLog, openTrade };
}

// ── OB1 — Order Block Retest ──────────────────────────────────────────────────
// Inspired by: SPMANUEL1 MSB & Order Block (EmreKb)
// Logic:
//   1. Detect swing pivot highs/lows using zigLen bars either side.
//   2. Maintain the last two confirmed pivot highs (h0, h1) and lows (l0, l1).
//   3. Bullish MSB: h0 breaks above h1 by at least fib(h1-l0)*0.33 — market flips bullish.
//      → Find Bu-OB: last bearish candle (open>close) in the corrective leg h1→l0.
//   4. Bearish MSB: l0 breaks below l1 by at least fib(h0-l1)*0.33 — market flips bearish.
//      → Find Be-OB: last bullish candle (open<close) in the rally leg l1→h0.
//   5. Enter on retest: price closes inside the OB zone → TP/SL via ATR multiples.
//      OB is invalidated (deleted) if price closes beyond the opposite edge of the zone.
function runOB1Strategy(candles, bot) {
  const zigLen  = Math.max(3, Math.round(Number(bot.threshold || 9)));
  const tpMult  = Math.max(0.5, Number(bot.tp || 2.5));
  const slMult  = Math.max(0.3, Number(bot.sl || 1.2));
  const fibFact = 0.33;
  const markers  = [];
  const tradeLog = [];
  let openTrade  = null;

  function calcATR(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.015;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.015;
  }

  // Pre-compute confirmed pivot highs/lows (must have zigLen bars on each side)
  const pivotHighs = [], pivotLows = [];
  for (let i = zigLen; i < candles.length - zigLen; i++) {
    let isHi = true, isLo = true;
    for (let k = i - zigLen; k <= i + zigLen; k++) {
      if (k === i) continue;
      if (candles[k].high >= candles[i].high) isHi = false;
      if (candles[k].low  <= candles[i].low)  isLo = false;
    }
    if (isHi) pivotHighs.push({ idx: i, price: candles[i].high });
    if (isLo)  pivotLows.push({ idx: i, price: candles[i].low  });
  }

  const recentHighs = []; // last 2 confirmed pivot highs [older, newer]
  const recentLows  = []; // last 2 confirmed pivot lows  [older, newer]
  let phPtr = 0, plPtr = 0;
  let market = 0; // 1=bullish structure, -1=bearish, 0=undefined
  let bullOB = null; // { obHigh, obLow } — retest → long
  let bearOB = null; // { obHigh, obLow } — retest → short
  let position = null;

  const warmup = zigLen * 2 + 14 + 5;

  for (let i = warmup; i < candles.length; i++) {
    // Absorb any pivots now confirmed (pivot at idx confirmed when i >= idx + zigLen)
    while (phPtr < pivotHighs.length && i >= pivotHighs[phPtr].idx + zigLen) {
      recentHighs.push(pivotHighs[phPtr++]);
      if (recentHighs.length > 2) recentHighs.shift();
    }
    while (plPtr < pivotLows.length && i >= pivotLows[plPtr].idx + zigLen) {
      recentLows.push(pivotLows[plPtr++]);
      if (recentLows.length > 2) recentLows.shift();
    }

    const bar = candles[i];

    // ── Exit management ──
    if (position && i > position.entryIndex) {
      const tpHit = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const slHit = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (tpHit || slHit) {
        const reason    = tpHit ? 'tp' : 'sl';
        const exitPrice = tpHit ? position.tp : position.sl;
        const pl = position.dir === 'long'
          ? ((exitPrice - position.entry) / position.entry) * 100
          : ((position.entry - exitPrice) / position.entry) * 100;
        tradeLog.push({ ...position, exit: exitPrice, pl, reason, exitTime: bar.time, exitIndex: i });
        markers.push({ time: bar.time, position: 'aboveBar', color: tpHit ? '#2ddb75' : '#ff6d6d', shape: 'square', text: reason.toUpperCase(), size: 0.5 });
        openTrade = null;
        position  = null;
        bullOB    = null;
        bearOB    = null;
      }
    }

    // ── MSB detection ──
    if (recentHighs.length >= 2 && recentLows.length >= 2) {
      const h0 = recentHighs[recentHighs.length - 1];
      const h1 = recentHighs[recentHighs.length - 2];
      const l0 = recentLows[recentLows.length - 1];
      const l1 = recentLows[recentLows.length - 2];

      // Bullish MSB: new high significantly above previous high (from bearish/flat structure)
      if (market <= 0 && h0.price > h1.price &&
          h0.price > h1.price + Math.abs(h1.price - l0.price) * fibFact) {
        market = 1;
        // Bu-OB: last bearish candle (open>close) in the corrective leg from h1→l0
        const s = Math.min(h1.idx, l0.idx), e = Math.max(h1.idx, l0.idx);
        let obIdx = -1;
        for (let k = s; k <= e; k++) { if (candles[k].open > candles[k].close) obIdx = k; }
        if (obIdx >= 0) bullOB = { obHigh: candles[obIdx].high, obLow: candles[obIdx].low };
        bearOB = null;
      }
      // Bearish MSB: new low significantly below previous low
      else if (market >= 0 && l0.price < l1.price &&
               l0.price < l1.price - Math.abs(h0.price - l1.price) * fibFact) {
        market = -1;
        // Be-OB: last bullish candle (open<close) in the rally from l1→h0
        const s = Math.min(l1.idx, h0.idx), e = Math.max(l1.idx, h0.idx);
        let obIdx = -1;
        for (let k = s; k <= e; k++) { if (candles[k].open < candles[k].close) obIdx = k; }
        if (obIdx >= 0) bearOB = { obHigh: candles[obIdx].high, obLow: candles[obIdx].low };
        bullOB = null;
      }
    }

    // ── OB invalidation on close beyond zone ──
    if (bullOB && bar.close < bullOB.obLow) bullOB = null;
    if (bearOB && bar.close > bearOB.obHigh) bearOB = null;

    // ── Entry on OB retest ──
    if (!position) {
      const atr = calcATR(i);
      if (bullOB && bar.close >= bullOB.obLow && bar.close <= bullOB.obHigh) {
        const entry = bar.close;
        position = { dir: 'long', entry, tp: entry + atr * tpMult, sl: entry - atr * slMult, entryIndex: i, entryTime: bar.time };
        tradeLog.push({ dir: 'long', entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: bar.time, exitTime: null, entryIndex: i, exitIndex: null });
        markers.push({ time: bar.time, position: 'belowBar', color: '#2ddb75', shape: 'arrowUp', text: 'L', size: 1 });
        bullOB = null;
      } else if (bearOB && bar.close >= bearOB.obLow && bar.close <= bearOB.obHigh) {
        const entry = bar.close;
        position = { dir: 'short', entry, tp: entry - atr * tpMult, sl: entry + atr * slMult, entryIndex: i, entryTime: bar.time };
        tradeLog.push({ dir: 'short', entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: bar.time, exitTime: null, entryIndex: i, exitIndex: null });
        markers.push({ time: bar.time, position: 'aboveBar', color: '#ff6d6d', shape: 'arrowDown', text: 'S', size: 1 });
        bearOB = null;
      }
    }
  }

  if (position) {
    openTrade = { entry: position.entry, tp: position.tp, sl: position.sl, dir: position.dir };
    tradeLog.push({ dir: position.dir, entry: position.entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: position.entryTime, exitTime: null, entryIndex: position.entryIndex, exitIndex: null });
  }
  markers.sort((a, b) => a.time - b.time);
  return { markers, tradeLog, openTrade };
}

// ── FG1 — CVD + FVG Retracement ──────────────────────────────────────────────
// Inspired by: SPMANUEL2 CVD Strategy (FluxCharts / fluxchart)
// Three-phase confirmation from the Pine script:
//   1. Rolling CVD (close>open → +vol, else -vol) crossover above/below 0
//      gives the directional bias  (approximates Pine's ta.requestVolumeDelta).
//   2. The first 3-bar Fair Value Gap that forms AFTER the CVD signal and
//      in the SAME direction is captured as the entry zone.
//      Bullish FVG: candle[-2].high < candle[0].low  (gap up imbalance)
//      Bearish FVG: candle[-2].low  > candle[0].high (gap down imbalance)
//      Zone must be > 0.2 × ATR (size filter mirrors Pine's fvgSensitivity).
//   3. Entry when close RETRACES into the FVG zone; zone invalidated if price
//      closes beyond its far edge (matching Pine's fvgEndMethod = "Close").
//   TP / SL remain ATR-multiplier based.
function runFG1Strategy(candles, bot) {
  const cvdLen  = Math.max(5, Math.round(Number(bot.threshold || 20)));
  const tpMult  = Math.max(0.5, Number(bot.tp || 2.0));
  const slMult  = Math.max(0.3, Number(bot.sl || 1.5));
  const markers  = [];
  const tradeLog = [];
  let openTrade  = null;

  function calcATR(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.015;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.015;
  }

  function calcCVD(endIdx) {
    let cvd = 0;
    for (let j = Math.max(0, endIdx - cvdLen + 1); j <= endIdx; j++) {
      const c = candles[j];
      cvd += c.close >= c.open ? Math.max(c.volume || 1, 1) : -Math.max(c.volume || 1, 1);
    }
    return cvd;
  }

  const warmup  = cvdLen + 14 + 5;
  let position  = null;
  let fvgZone   = null; // { dir, top, bottom } — active FVG awaiting retracement
  let signalDir = null; // 'long' | 'short' from last CVD cross

  for (let i = warmup; i < candles.length; i++) {
    const bar  = candles[i];
    const atr  = calcATR(i);
    const cvd  = calcCVD(i);
    const cvdP = calcCVD(i - 1);

    // ── Exit management ──
    if (position && i > position.entryIndex) {
      const tpHit = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const slHit = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (tpHit || slHit) {
        const reason    = tpHit ? 'tp' : 'sl';
        const exitPrice = tpHit ? position.tp : position.sl;
        const pl = position.dir === 'long'
          ? ((exitPrice - position.entry) / position.entry) * 100
          : ((position.entry - exitPrice) / position.entry) * 100;
        tradeLog.push({ ...position, exit: exitPrice, pl, reason, exitTime: bar.time, exitIndex: i });
        markers.push({ time: bar.time, position: 'aboveBar', color: tpHit ? '#2ddb75' : '#ff6d6d', shape: 'square', text: reason.toUpperCase(), size: 0.5 });
        openTrade = null;
        position  = null;
        fvgZone   = null;
        signalDir = null;
      }
    }

    // ── CVD crossover detection ──
    if (!position) {
      if (cvdP <= 0 && cvd > 0) { signalDir = 'long';  fvgZone = null; }
      if (cvdP >= 0 && cvd < 0) { signalDir = 'short'; fvgZone = null; }
    }

    // ── FVG detection (requires i >= 2) ──
    if (!position && signalDir && !fvgZone && i >= 2) {
      const c0 = candles[i], c2 = candles[i - 2];
      if (signalDir === 'long' && c2.high < c0.low && (c0.low - c2.high) > atr * 0.2) {
        // Bullish FVG: gap between c2.high and c0.low
        fvgZone = { dir: 'long', top: c0.low, bottom: c2.high };
      } else if (signalDir === 'short' && c2.low > c0.high && (c2.low - c0.high) > atr * 0.2) {
        // Bearish FVG: gap between c0.high and c2.low
        fvgZone = { dir: 'short', top: c2.low, bottom: c0.high };
      }
    }

    // ── FVG zone invalidation (close beyond far edge) ──
    if (fvgZone && !position) {
      if (fvgZone.dir === 'long'  && bar.close < fvgZone.bottom) fvgZone = null;
      if (fvgZone.dir === 'short' && bar.close > fvgZone.top)    fvgZone = null;
    }

    // ── Entry: retracement close inside FVG zone ──
    if (!position && fvgZone) {
      if (bar.close >= fvgZone.bottom && bar.close <= fvgZone.top) {
        const entry = bar.close;
        if (fvgZone.dir === 'long') {
          position = { dir: 'long', entry, tp: entry + atr * tpMult, sl: entry - atr * slMult, entryIndex: i, entryTime: bar.time };
          tradeLog.push({ dir: 'long', entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: bar.time, exitTime: null, entryIndex: i, exitIndex: null });
          markers.push({ time: bar.time, position: 'belowBar', color: '#2ddb75', shape: 'arrowUp', text: 'L', size: 1 });
        } else {
          position = { dir: 'short', entry, tp: entry - atr * tpMult, sl: entry + atr * slMult, entryIndex: i, entryTime: bar.time };
          tradeLog.push({ dir: 'short', entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: bar.time, exitTime: null, entryIndex: i, exitIndex: null });
          markers.push({ time: bar.time, position: 'aboveBar', color: '#ff6d6d', shape: 'arrowDown', text: 'S', size: 1 });
        }
        fvgZone   = null;
        signalDir = null;
      }
    }
  }

  if (position) {
    openTrade = { entry: position.entry, tp: position.tp, sl: position.sl, dir: position.dir };
    tradeLog.push({ dir: position.dir, entry: position.entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: position.entryTime, exitTime: null, entryIndex: position.entryIndex, exitIndex: null });
  }
  markers.sort((a, b) => a.time - b.time);
  return { markers, tradeLog, openTrade };
}

// ── SM1 — Smart Money BOS ─────────────────────────────────────────────────────
// Inspired by: SPMANUEL3 Smart Money Breakout Signals (AlgoAlpha)
// Four-phase logic direct from the Pine script:
//   1. Detect confirmed pivot highs/lows with swingSize bars either side,
//      identical to the script's MS() function using ta.pivothigh/pivotlow.
//   2. Track the most-recent confirmed prevHigh/prevLow.
//   3. Bullish BOS: close breaks above prevHigh (bosConfType = "Candle Close").
//      Bearish BOS: close breaks below prevLow.
//   4. On BOS measure the breakout leg ("dist"):
//        range = highest(leg) - lowest(leg) over the leg's bar count
//        dist  = range / 3   (Pine's exact division used for TP spacing)
//      Entry: breakout close.
//      TP = entry ± dist × bot.tp   (bot.tp is the dist multiplier, default 2.0)
//      SL = entry ∓ dist × bot.sl   (bot.sl is the dist multiplier, default 1.0)
//      ATR floor prevents dist from collapsing to 0 on tight bars.
function runSM1Strategy(candles, bot) {
  const swingSize = Math.max(3, Math.round(Number(bot.threshold || 25)));
  const tpMult    = Math.max(0.5, Number(bot.tp || 2.0));
  const slMult    = Math.max(0.3, Number(bot.sl || 1.0));
  const markers   = [];
  const tradeLog  = [];
  let openTrade   = null;

  function calcATR(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.015;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.015;
  }

  // Pre-compute confirmed pivot highs/lows (need swingSize bars each side)
  const pivotHighs = [], pivotLows = [];
  for (let i = swingSize; i < candles.length - swingSize; i++) {
    let isHi = true, isLo = true;
    for (let k = i - swingSize; k <= i + swingSize; k++) {
      if (k === i) continue;
      if (candles[k].high >= candles[i].high) isHi = false;
      if (candles[k].low  <= candles[i].low)  isLo = false;
    }
    if (isHi) pivotHighs.push({ idx: i, price: candles[i].high });
    if (isLo)  pivotLows.push({ idx: i, price: candles[i].low  });
  }

  let prevHigh = null, prevLow = null;
  let prevHighActive = false, prevLowActive = false;
  let prevHighIdx = 0, prevLowIdx = 0;
  let phPtr = 0, plPtr = 0;
  let position = null;
  const warmup = swingSize * 2 + 14;

  for (let i = warmup; i < candles.length; i++) {
    // Absorb confirmed pivots
    while (phPtr < pivotHighs.length && i >= pivotHighs[phPtr].idx + swingSize) {
      prevHigh = pivotHighs[phPtr].price;
      prevHighIdx = pivotHighs[phPtr].idx;
      prevHighActive = true;
      phPtr++;
    }
    while (plPtr < pivotLows.length && i >= pivotLows[plPtr].idx + swingSize) {
      prevLow = pivotLows[plPtr].price;
      prevLowIdx = pivotLows[plPtr].idx;
      prevLowActive = true;
      plPtr++;
    }

    const bar = candles[i];

    // ── Exit management ──
    if (position && i > position.entryIndex) {
      const tpHit = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const slHit = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (tpHit || slHit) {
        const reason    = tpHit ? 'tp' : 'sl';
        const exitPrice = tpHit ? position.tp : position.sl;
        const pl = position.dir === 'long'
          ? ((exitPrice - position.entry) / position.entry) * 100
          : ((position.entry - exitPrice) / position.entry) * 100;
        tradeLog.push({ ...position, exit: exitPrice, pl, reason, exitTime: bar.time, exitIndex: i });
        markers.push({ time: bar.time, position: 'aboveBar', color: tpHit ? '#2ddb75' : '#ff6d6d', shape: 'square', text: reason.toUpperCase(), size: 0.5 });
        openTrade = null;
        position  = null;
      }
    }

    // ── BOS detection (Candle Close confirmation) ──
    if (!position) {
      const atr = calcATR(i);

      // Bullish BOS: close breaks above prevHigh
      if (prevHighActive && prevHigh !== null && bar.close > prevHigh) {
        prevHighActive = false;
        // Measure the breakout leg from prevHighIdx to i
        const legLen = Math.max(1, i - prevHighIdx);
        let legHigh = -Infinity, legLow = Infinity;
        for (let k = prevHighIdx; k <= i; k++) {
          if (candles[k].high > legHigh) legHigh = candles[k].high;
          if (candles[k].low  < legLow)  legLow  = candles[k].low;
        }
        const range = Math.max(legHigh - legLow, atr);
        const dist  = range / 3;
        const entry = bar.close;
        position = { dir: 'long', entry, tp: entry + dist * tpMult, sl: entry - dist * slMult, entryIndex: i, entryTime: bar.time };
        tradeLog.push({ dir: 'long', entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: bar.time, exitTime: null, entryIndex: i, exitIndex: null });
        markers.push({ time: bar.time, position: 'belowBar', color: '#2ddb75', shape: 'arrowUp', text: 'L', size: 1 });
      }
      // Bearish BOS: close breaks below prevLow
      else if (prevLowActive && prevLow !== null && bar.close < prevLow) {
        prevLowActive = false;
        const legLen = Math.max(1, i - prevLowIdx);
        let legHigh = -Infinity, legLow = Infinity;
        for (let k = prevLowIdx; k <= i; k++) {
          if (candles[k].high > legHigh) legHigh = candles[k].high;
          if (candles[k].low  < legLow)  legLow  = candles[k].low;
        }
        const range = Math.max(legHigh - legLow, atr);
        const dist  = range / 3;
        const entry = bar.close;
        position = { dir: 'short', entry, tp: entry - dist * tpMult, sl: entry + dist * slMult, entryIndex: i, entryTime: bar.time };
        tradeLog.push({ dir: 'short', entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: bar.time, exitTime: null, entryIndex: i, exitIndex: null });
        markers.push({ time: bar.time, position: 'aboveBar', color: '#ff6d6d', shape: 'arrowDown', text: 'S', size: 1 });
      }
    }
  }

  if (position) {
    openTrade = { entry: position.entry, tp: position.tp, sl: position.sl, dir: position.dir };
    tradeLog.push({ dir: position.dir, entry: position.entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: position.entryTime, exitTime: null, entryIndex: position.entryIndex, exitIndex: null });
  }
  markers.sort((a, b) => a.time - b.time);
  return { markers, tradeLog, openTrade };
}

function runSB1Strategy(candles, bot) {
  const swingSize = Math.max(3, Math.round(Number(bot.threshold || 25)));
  const tpMult    = Math.max(0.5, Number(bot.tp || 2.0));
  const slMult    = Math.max(0.3, Number(bot.sl || 1.0));
  const markers   = [];
  const tradeLog  = [];
  let openTrade   = null;

  function calcATR(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.015;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.015;
  }

  // Pre-compute confirmed pivot highs/lows
  const pivotHighs = [], pivotLows = [];
  for (let i = swingSize; i < candles.length - swingSize; i++) {
    let isHi = true, isLo = true;
    for (let k = i - swingSize; k <= i + swingSize; k++) {
      if (k === i) continue;
      if (candles[k].high >= candles[i].high) isHi = false;
      if (candles[k].low  <= candles[i].low)  isLo = false;
    }
    if (isHi) pivotHighs.push({ idx: i, price: candles[i].high });
    if (isLo)  pivotLows.push({ idx: i, price: candles[i].low  });
  }

  let prevHigh = null, prevLow = null;
  let prevHighActive = false, prevLowActive = false;
  let prevHighIdx = 0, prevLowIdx = 0;
  let phPtr = 0, plPtr = 0;
  let position = null;
  const warmup = swingSize * 2 + 14;

  for (let i = warmup; i < candles.length; i++) {
    while (phPtr < pivotHighs.length && i >= pivotHighs[phPtr].idx + swingSize) {
      prevHigh = pivotHighs[phPtr].price;
      prevHighIdx = pivotHighs[phPtr].idx;
      prevHighActive = true;
      phPtr++;
    }
    while (plPtr < pivotLows.length && i >= pivotLows[plPtr].idx + swingSize) {
      prevLow = pivotLows[plPtr].price;
      prevLowIdx = pivotLows[plPtr].idx;
      prevLowActive = true;
      plPtr++;
    }

    const bar = candles[i];
    const highSrc = bar.close; // Candle Close confirmation

    // Detect BOS events this bar
    let highBroken = false, lowBroken = false;
    if (prevHighActive && prevHigh !== null && highSrc > prevHigh) {
      highBroken = true;
      prevHighActive = false;
    }
    if (prevLowActive && prevLow !== null && highSrc < prevLow) {
      lowBroken = true;
      prevLowActive = false;
    }

    // ── Flip exit: opposite BOS closes the active position ──
    if (position && highBroken && position.dir === 'short') {
      const pl = ((position.entry - bar.close) / position.entry) * 100;
      tradeLog.push({ ...position, exit: bar.close, pl, reason: 'flip', exitTime: bar.time, exitIndex: i });
      markers.push({ time: bar.time, position: 'aboveBar', color: '#f0a500', shape: 'square', text: 'FX', size: 0.5 });
      openTrade = null;
      position  = null;
    }
    if (position && lowBroken && position.dir === 'long') {
      const pl = ((bar.close - position.entry) / position.entry) * 100;
      tradeLog.push({ ...position, exit: bar.close, pl, reason: 'flip', exitTime: bar.time, exitIndex: i });
      markers.push({ time: bar.time, position: 'aboveBar', color: '#f0a500', shape: 'square', text: 'FX', size: 0.5 });
      openTrade = null;
      position  = null;
    }

    // ── TP / SL exit ──
    if (position && i > position.entryIndex) {
      const tpHit = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const slHit = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (tpHit || slHit) {
        const reason    = tpHit ? 'tp' : 'sl';
        const exitPrice = tpHit ? position.tp : position.sl;
        const pl = position.dir === 'long'
          ? ((exitPrice - position.entry) / position.entry) * 100
          : ((position.entry - exitPrice) / position.entry) * 100;
        tradeLog.push({ ...position, exit: exitPrice, pl, reason, exitTime: bar.time, exitIndex: i });
        markers.push({ time: bar.time, position: 'aboveBar', color: tpHit ? '#2ddb75' : '#ff6d6d', shape: 'square', text: reason.toUpperCase(), size: 0.5 });
        openTrade = null;
        position  = null;
      }
    }

    // ── New entry: at prevHigh/prevLow (the broken level) ──
    if (!position) {
      if (highBroken && prevHigh !== null) {
        const atr = calcATR(i);
        let legHigh = -Infinity, legLow = Infinity;
        for (let k = prevHighIdx; k <= i; k++) {
          if (candles[k].high > legHigh) legHigh = candles[k].high;
          if (candles[k].low  < legLow)  legLow  = candles[k].low;
        }
        const dist  = Math.max(legHigh - legLow, atr) / 3;
        const entry = prevHigh; // enter AT the broken level (limit-style)
        position = { dir: 'long', entry, tp: entry + dist * tpMult, sl: entry - dist * slMult, entryIndex: i, entryTime: bar.time };
        tradeLog.push({ dir: 'long', entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: bar.time, exitTime: null, entryIndex: i, exitIndex: null });
        markers.push({ time: bar.time, position: 'belowBar', color: '#2ddb75', shape: 'arrowUp', text: 'L', size: 1 });
      } else if (lowBroken && prevLow !== null) {
        const atr = calcATR(i);
        let legHigh = -Infinity, legLow = Infinity;
        for (let k = prevLowIdx; k <= i; k++) {
          if (candles[k].high > legHigh) legHigh = candles[k].high;
          if (candles[k].low  < legLow)  legLow  = candles[k].low;
        }
        const dist  = Math.max(legHigh - legLow, atr) / 3;
        const entry = prevLow;
        position = { dir: 'short', entry, tp: entry - dist * tpMult, sl: entry + dist * slMult, entryIndex: i, entryTime: bar.time };
        tradeLog.push({ dir: 'short', entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: bar.time, exitTime: null, entryIndex: i, exitIndex: null });
        markers.push({ time: bar.time, position: 'aboveBar', color: '#ff6d6d', shape: 'arrowDown', text: 'S', size: 1 });
      }
    }
  }

  if (position) {
    openTrade = { entry: position.entry, tp: position.tp, sl: position.sl, dir: position.dir };
    tradeLog.push({ dir: position.dir, entry: position.entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: position.entryTime, exitTime: null, entryIndex: position.entryIndex, exitIndex: null });
  }
  markers.sort((a, b) => a.time - b.time);
  return { markers, tradeLog, openTrade };
}

function runST1Strategy(candles, bot) {
  const stPeriod = Math.max(5, Math.round(Number(bot.threshold || 14)));
  const stFactor = 3.0;
  const slFactor = Math.max(0.5, Number(bot.sl  || 1.4));
  const tpMult   = Math.max(0.5, Number(bot.tp  || 2.0));
  const markers  = [];
  const tradeLog = [];
  let openTrade  = null;

  function calcATR(i) {
    if (i < 1) return candles[i].close * 0.015;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - stPeriod + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.015;
  }

  // Pre-compute SuperTrend direction (+1 = bearish above price, -1 = bullish below price)
  const stDir   = new Array(candles.length).fill(1);
  const upperBand = new Array(candles.length).fill(0);
  const lowerBand = new Array(candles.length).fill(0);
  for (let i = 0; i < candles.length; i++) {
    const atr = calcATR(i);
    const hl2 = (candles[i].high + candles[i].low) / 2;
    const rawUB = hl2 + stFactor * atr;
    const rawLB = hl2 - stFactor * atr;
    if (i === 0) { upperBand[i] = rawUB; lowerBand[i] = rawLB; stDir[i] = 1; continue; }
    const prevClose = candles[i - 1].close;
    upperBand[i] = rawUB < upperBand[i-1] || prevClose > upperBand[i-1] ? rawUB : upperBand[i-1];
    lowerBand[i] = rawLB > lowerBand[i-1] || prevClose < lowerBand[i-1] ? rawLB : lowerBand[i-1];
    const prevDir = stDir[i - 1];
    if (prevDir === 1)  stDir[i] = candles[i].close > upperBand[i] ? -1 : 1;
    else                stDir[i] = candles[i].close < lowerBand[i] ?  1 : -1;
  }

  let position = null;
  const warmup = stPeriod * 2;

  for (let i = warmup; i < candles.length; i++) {
    const bar  = candles[i];
    const dist = calcATR(i) * slFactor;

    // ── Exit management ──
    if (position && i > position.entryIndex) {
      const tpHit = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const slHit = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (tpHit || slHit) {
        const reason    = tpHit ? 'tp' : 'sl';
        const exitPrice = tpHit ? position.tp : position.sl;
        const pl = position.dir === 'long'
          ? ((exitPrice - position.entry) / position.entry) * 100
          : ((position.entry - exitPrice) / position.entry) * 100;
        tradeLog.push({ ...position, exit: exitPrice, pl, reason, exitTime: bar.time, exitIndex: i });
        markers.push({ time: bar.time, position: 'aboveBar', color: tpHit ? '#2ddb75' : '#ff6d6d', shape: 'square', text: reason.toUpperCase(), size: 0.5 });
        openTrade = null;
        position  = null;
      }
    }

    // ── Entry: SuperTrend direction flip ──
    if (!position) {
      const prevDir = stDir[i - 1];
      const curDir  = stDir[i];
      // Bullish flip: bearish (1) → bullish (-1)
      if (prevDir === 1 && curDir === -1) {
        const entry = bar.close;
        position = { dir: 'long', entry, tp: entry + dist * tpMult, sl: entry - dist, entryIndex: i, entryTime: bar.time };
        tradeLog.push({ dir: 'long', entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: bar.time, exitTime: null, entryIndex: i, exitIndex: null });
        markers.push({ time: bar.time, position: 'belowBar', color: '#2ddb75', shape: 'arrowUp', text: 'L', size: 1 });
      }
      // Bearish flip: bullish (-1) → bearish (1)
      else if (prevDir === -1 && curDir === 1) {
        const entry = bar.close;
        position = { dir: 'short', entry, tp: entry - dist * tpMult, sl: entry + dist, entryIndex: i, entryTime: bar.time };
        tradeLog.push({ dir: 'short', entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: bar.time, exitTime: null, entryIndex: i, exitIndex: null });
        markers.push({ time: bar.time, position: 'aboveBar', color: '#ff6d6d', shape: 'arrowDown', text: 'S', size: 1 });
      }
    }
  }

  if (position) {
    openTrade = { entry: position.entry, tp: position.tp, sl: position.sl, dir: position.dir };
    tradeLog.push({ dir: position.dir, entry: position.entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: position.entryTime, exitTime: null, entryIndex: position.entryIndex, exitIndex: null });
  }
  markers.sort((a, b) => a.time - b.time);
  return { markers, tradeLog, openTrade };
}

function runMN1Strategy(candles, bot) {
  const swingSize = Math.max(3, Math.round(Number(bot.threshold || 25)));
  const tpMult    = Math.max(0.5, Number(bot.tp || 2.0));
  const slMult    = Math.max(0.3, Number(bot.sl || 1.0));
  const markers   = [];
  const tradeLog  = [];
  let openTrade   = null;

  function calcATR(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.015;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.015;
  }

  // Pre-compute confirmed pivot highs/lows (need swingSize bars each side)
  const pivotHighs = [], pivotLows = [];
  for (let i = swingSize; i < candles.length - swingSize; i++) {
    let isHi = true, isLo = true;
    for (let k = i - swingSize; k <= i + swingSize; k++) {
      if (k === i) continue;
      if (candles[k].high >= candles[i].high) isHi = false;
      if (candles[k].low  <= candles[i].low)  isLo = false;
    }
    if (isHi) pivotHighs.push({ idx: i, price: candles[i].high });
    if (isLo)  pivotLows.push({ idx: i, price: candles[i].low  });
  }

  let prevHigh = null, prevLow = null;
  let prevHighActive = false, prevLowActive = false;
  let prevHighIdx = 0, prevLowIdx = 0;
  let phPtr = 0, plPtr = 0;
  // pending: flip-level retest zone set after BOS confirmation
  let pending  = null; // { dir, level, tp, sl, invalidLevel }
  let position = null;
  const warmup = swingSize * 2 + 14;

  for (let i = warmup; i < candles.length; i++) {
    // Absorb newly confirmed pivots
    while (phPtr < pivotHighs.length && i >= pivotHighs[phPtr].idx + swingSize) {
      prevHigh = pivotHighs[phPtr].price;
      prevHighIdx = pivotHighs[phPtr].idx;
      prevHighActive = true;
      phPtr++;
    }
    while (plPtr < pivotLows.length && i >= pivotLows[plPtr].idx + swingSize) {
      prevLow = pivotLows[plPtr].price;
      prevLowIdx = pivotLows[plPtr].idx;
      prevLowActive = true;
      plPtr++;
    }

    const bar = candles[i];
    const atr = calcATR(i);

    // ── Exit management ──
    if (position && i > position.entryIndex) {
      const tpHit = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const slHit = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (tpHit || slHit) {
        const reason    = tpHit ? 'tp' : 'sl';
        const exitPrice = tpHit ? position.tp : position.sl;
        const pl = position.dir === 'long'
          ? ((exitPrice - position.entry) / position.entry) * 100
          : ((position.entry - exitPrice) / position.entry) * 100;
        tradeLog.push({ ...position, exit: exitPrice, pl, reason, exitTime: bar.time, exitIndex: i });
        markers.push({ time: bar.time, position: 'aboveBar', color: tpHit ? '#2ddb75' : '#ff6d6d', shape: 'square', text: reason.toUpperCase(), size: 0.5 });
        openTrade = null;
        position  = null;
        pending   = null;
      }
    }

    if (!position) {
      // ── BOS detection → arm flip-level pending zone ──
      if (prevHighActive && prevHigh !== null && bar.close > prevHigh) {
        prevHighActive = false;
        let legHigh = -Infinity, legLow = Infinity;
        for (let k = prevHighIdx; k <= i; k++) {
          if (candles[k].high > legHigh) legHigh = candles[k].high;
          if (candles[k].low  < legLow)  legLow  = candles[k].low;
        }
        const dist = Math.max(legHigh - legLow, atr) / 3;
        pending = { dir: 'long', level: prevHigh, tp: prevHigh + dist * tpMult, sl: prevHigh - dist * slMult, invalidLevel: prevHigh - dist * slMult };
      } else if (prevLowActive && prevLow !== null && bar.close < prevLow) {
        prevLowActive = false;
        let legHigh = -Infinity, legLow = Infinity;
        for (let k = prevLowIdx; k <= i; k++) {
          if (candles[k].high > legHigh) legHigh = candles[k].high;
          if (candles[k].low  < legLow)  legLow  = candles[k].low;
        }
        const dist = Math.max(legHigh - legLow, atr) / 3;
        pending = { dir: 'short', level: prevLow, tp: prevLow - dist * tpMult, sl: prevLow + dist * slMult, invalidLevel: prevLow + dist * slMult };
      }

      // ── Check flip-level retest entry ──
      if (pending) {
        const buf = atr * 0.15;
        if (pending.dir === 'long') {
          if (bar.close < pending.invalidLevel) {
            // price broke down through SL level, zone invalid
            pending = null;
          } else if (bar.low <= pending.level + buf && bar.close >= pending.level - buf) {
            // price pulled back to the broken resistance (now support)
            const entry = pending.level;
            position = { dir: 'long', entry, tp: pending.tp, sl: pending.sl, entryIndex: i, entryTime: bar.time };
            tradeLog.push({ dir: 'long', entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: bar.time, exitTime: null, entryIndex: i, exitIndex: null });
            markers.push({ time: bar.time, position: 'belowBar', color: '#2ddb75', shape: 'arrowUp', text: 'L', size: 1 });
            pending = null;
          }
        } else {
          if (bar.close > pending.invalidLevel) {
            // price broke up through SL level, zone invalid
            pending = null;
          } else if (bar.high >= pending.level - buf && bar.close <= pending.level + buf) {
            // price pulled back to the broken support (now resistance)
            const entry = pending.level;
            position = { dir: 'short', entry, tp: pending.tp, sl: pending.sl, entryIndex: i, entryTime: bar.time };
            tradeLog.push({ dir: 'short', entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: bar.time, exitTime: null, entryIndex: i, exitIndex: null });
            markers.push({ time: bar.time, position: 'aboveBar', color: '#ff6d6d', shape: 'arrowDown', text: 'S', size: 1 });
            pending = null;
          }
        }
      }
    }
  }

  if (position) {
    openTrade = { entry: position.entry, tp: position.tp, sl: position.sl, dir: position.dir };
    tradeLog.push({ dir: position.dir, entry: position.entry, tp: position.tp, sl: position.sl, exit: null, pl: null, reason: 'open', entryTime: position.entryTime, exitTime: null, entryIndex: position.entryIndex, exitIndex: null });
  }
  markers.sort((a, b) => a.time - b.time);
  return { markers, tradeLog, openTrade };
}

function runStrategySimulation(candles, bot) {
  if (bot.strategy === 'h9s') return runH9SStrategy(candles, bot);
  if (bot.strategy === 'b5s') return runB5SStrategy(candles, bot);
  if (bot.strategy === 'ai1') return runAI1Strategy(candles, bot);
  if (bot.strategy === 'ai2') return runAI2Strategy(candles, bot);
  if (bot.strategy === 'ai3') return runAI3Strategy(candles, bot);
  if (bot.strategy === 'vw1') return runVW1Strategy(candles, bot);
  if (bot.strategy === 'kc1') return runKC1Strategy(candles, bot);
  if (bot.strategy === 'dv1') return runDV1Strategy(candles, bot);
  if (bot.strategy === 'rs1') return runRS1Strategy(candles, bot);
  if (bot.strategy === 'e3')  return runE3Strategy(candles, bot);
  if (bot.strategy === 'cv1') return runCV1Strategy(candles, bot);
  if (bot.strategy === 'ch1') return runCH1Strategy(candles, bot);
  if (bot.strategy === 'pm1') return runPM1Strategy(candles, bot);
  if (bot.strategy === 'ob1') return runOB1Strategy(candles, bot);
  if (bot.strategy === 'fg1') return runFG1Strategy(candles, bot);
  if (bot.strategy === 'sm1') return runSM1Strategy(candles, bot);
  if (bot.strategy === 'mn1') return runMN1Strategy(candles, bot);
  if (bot.strategy === 'st1') return runST1Strategy(candles, bot);
  if (bot.strategy === 'sb1') return runSB1Strategy(candles, bot);
  const markers = [];
  const tradeLog = [];
  let openTrade = null;

  const tpPct = Number(bot.tp) / 100;
  const slPct = Number(bot.sl) / 100;
  const threshold = Number(bot.threshold);
  const lookback = 30;
  const scoreWindow = [];
  const closes = [];
  let position = null;

  for (let i = 0; i < candles.length; i++) {
    const bar = candles[i];
    closes.push(bar.close);

    if (i > 0) {
      const prev = candles[i - 1].close;
      const absChange = Math.abs((bar.close - prev) / Math.max(prev, 0.000001)) * 100;
      scoreWindow.push(absChange);
      if (scoreWindow.length > 200) scoreWindow.shift();
    }

    if (position && i > position.entryIndex) {
      const tpHit = position.dir === 'long' ? bar.high >= position.tp : bar.low <= position.tp;
      const slHit = position.dir === 'long' ? bar.low <= position.sl : bar.high >= position.sl;
      if (tpHit || slHit) {
        const reason = tpHit ? 'tp' : 'sl';
        const exitPrice = tpHit ? position.tp : position.sl;
        const pl = position.dir === 'long'
          ? ((exitPrice - position.entry) / position.entry) * 100
          : ((position.entry - exitPrice) / position.entry) * 100;

        tradeLog.push({
          dir: position.dir,
          entry: position.entry,
          tp: position.tp,
          sl: position.sl,
          exit: exitPrice,
          pl,
          reason,
          entryTime: position.entryTime,
          exitTime: bar.time,
          entryIndex: position.entryIndex,
          exitIndex: i,
        });

        markers.push({
          time: bar.time,
          position: position.dir === 'long' ? 'aboveBar' : 'belowBar',
          color: reason === 'tp' ? '#27d3c5' : '#f7bc52',
          shape: 'circle',
          text: reason === 'tp' ? 'TP' : 'SL',
          size: 0.8,
        });

        position = null;
      }
    }

    if (!position && scoreWindow.length >= lookback) {
      const score = scoreWindow[scoreWindow.length - 1];
      const percentile = percentileRank(scoreWindow.slice(-lookback), score);
      if (percentile >= threshold) {
        const sma20 = closes.slice(-20).reduce((acc, value) => acc + value, 0) / Math.min(20, closes.length);
        const dir = bar.close >= sma20 ? 'long' : 'short';
        const entry = bar.close;
        const tp = dir === 'long' ? entry * (1 + tpPct) : entry * (1 - tpPct);
        const sl = dir === 'long' ? entry * (1 - slPct) : entry * (1 + slPct);
        position = { dir, entry, tp, sl, entryTime: bar.time, entryIndex: i };
        markers.push({
          time: bar.time,
          position: dir === 'long' ? 'belowBar' : 'aboveBar',
          color: dir === 'long' ? '#2ddb75' : '#ff6d6d',
          shape: dir === 'long' ? 'arrowUp' : 'arrowDown',
          text: dir === 'long' ? 'L' : 'S',
          size: 1,
        });
      }
    }
  }

  if (position) {
    openTrade = { entry: position.entry, tp: position.tp, sl: position.sl, dir: position.dir };
    tradeLog.push({
      dir: position.dir,
      entry: position.entry,
      tp: position.tp,
      sl: position.sl,
      exit: null,
      pl: null,
      reason: 'open',
      entryTime: position.entryTime,
      exitTime: null,
      entryIndex: position.entryIndex,
      exitIndex: null,
    });
  }

  markers.sort((a, b) => a.time - b.time);
  return { markers, tradeLog, openTrade };
}

function summarizeTradeLog(tradeLog, candles) {
  const closedTrades = tradeLog.filter((trade) => trade.pl !== null);
  const wins   = closedTrades.filter((trade) => trade.pl > 0);
  const losses = closedTrades.filter((trade) => trade.pl <= 0);
  const winRate = closedTrades.length ? (wins.length / closedTrades.length) * 100 : 0;
  let grossProfit = 0, grossLoss = 0;
  for (const trade of closedTrades) {
    if (trade.pl > 0) grossProfit += trade.pl;
    if (trade.pl < 0) grossLoss  += Math.abs(trade.pl);
  }
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : (grossProfit > 0 ? 99 : 0);

  // Per-trade averages
  const avgWin  = wins.length   ? wins.reduce((s, t) => s + t.pl, 0)   / wins.length   : 0;
  const avgLoss = losses.length ? losses.reduce((s, t) => s + Math.abs(t.pl), 0) / losses.length : 0;

  // Expectancy = (WR × avgWin) − (LR × avgLoss) — the edge per trade in %
  const wr = winRate / 100;
  const expectancy = (wr * avgWin) - ((1 - wr) * avgLoss);

  // Max consecutive losses
  let maxConsecLosses = 0, curConsec = 0;
  for (const t of closedTrades) {
    if (t.pl <= 0) { curConsec++; maxConsecLosses = Math.max(maxConsecLosses, curConsec); }
    else curConsec = 0;
  }

  const timeline = buildReplayEquityTimeline(candles, tradeLog);
  const endingEquity = timeline.length ? timeline[timeline.length - 1].equity : 100;
  let peak = 100, maxDrawdown = 0;
  for (const item of timeline) {
    peak = Math.max(peak, item.equity);
    const dd = peak > 0 ? ((peak - item.equity) / peak) * 100 : 0;
    maxDrawdown = Math.max(maxDrawdown, dd);
  }
  const netPl = ((endingEquity - 100) / 100) * 100;

  // Recovery Factor = net profit / max drawdown (how well strategy recovers)
  const recoveryFactor = maxDrawdown > 0 ? Math.abs(netPl) / maxDrawdown : (netPl > 0 ? 10 : 0);

  // Sharpe-like ratio: mean per-trade return / stddev of per-trade returns
  // (trade-level, not time-series — suitable for optimizer ranking)
  let sharpe = 0, sortino = 0;
  if (closedTrades.length > 1) {
    const returns = closedTrades.map(t => t.pl);
    const mean = returns.reduce((s, v) => s + v, 0) / returns.length;
    const variance = returns.reduce((s, v) => s + (v - mean) ** 2, 0) / returns.length;
    const stdDev   = Math.sqrt(variance);
    sharpe = stdDev > 0 ? mean / stdDev : (mean > 0 ? 5 : -5);

    // Sortino: only penalize downside (negative) returns
    const downsideVariance = returns.filter(r => r < 0).reduce((s, v) => s + v ** 2, 0) / returns.length;
    const downsideDev = Math.sqrt(downsideVariance);
    sortino = downsideDev > 0 ? mean / downsideDev : (mean > 0 ? 5 : -5);
  }

  return {
    trades: closedTrades.length,
    wins: wins.length,
    losses: losses.length,
    winRate,
    grossProfit,
    grossLoss,
    profitFactor,
    netPl,
    maxDrawdown,
    endingEquity,
    avgWin,
    avgLoss,
    expectancy,
    recoveryFactor,
    maxConsecLosses,
    sharpe,
    sortino,
  };
}

function buildReplaySignals(tradeLog, bot) {
  const signals = [];
  for (const trade of tradeLog) {
    const entryEvent = trade.dir === 'long' ? 'ENTER_LONG' : 'ENTER_SHORT';
    const signalCode = bot.tradeRelayWebhookCode || bot.webhookKey;
    signals.push({
      time: trade.entryTime,
      event: entryEvent,
      code: `${entryEvent.replace('_', '-')}_${signalCode}`,
      kind: 'entry',
      direction: trade.dir,
    });

    if (trade.exitTime !== null) {
      signals.push({
        time: trade.exitTime,
        event: 'EXIT_ALL',
        code: `EXIT-ALL_${signalCode}`,
        kind: 'exit',
        direction: trade.dir,
      });
    }
  }

  signals.sort((a, b) => a.time - b.time);
  return signals;
}

function buildReplayEquityTimeline(candles, tradeLog) {
  const timeline = [];
  let equity = 100;
  // Round-trip cost: commission charged on entry + exit, slippage on entry + exit
  const roundTripCostPct = (simSettings.commission + simSettings.slippage) * 2;

  for (const candle of candles) {
    for (const trade of tradeLog) {
      if (trade.exitTime === candle.time && trade.pl !== null) {
        const netPl = trade.pl - roundTripCostPct;
        equity *= 1 + netPl / 100;
      }
    }
    timeline.push({ time: candle.time, equity: +equity.toFixed(4) });
  }

  return timeline;
}

function formatReplayTime(unixSeconds) {
  const d = new Date(unixSeconds * 1000);
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `${hh}:${mm} UTC`;
}

function buildSma(candles, period) {
  const result = [];
  for (let i = period - 1; i < candles.length; i++) {
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) sum += candles[j].close;
    result.push({ time: candles[i].time, value: +(sum / period).toFixed(6) });
  }
  return result;
}

async function initChart(botId) {
  if (typeof LightweightCharts === 'undefined') return;
  stopReplay();
  stopLive();
  chartState.barSpacing = 7;
  const bot  = state.bots.find((b) => b.id === botId) || state.bots[0];
  // Restore persisted autoSignal state into chartState on every chart init
  if (bot.autoSignal && chartState.autoSignalByBot[bot.id] === undefined) {
    chartState.autoSignalByBot[bot.id] = true;
    if (!chartState.lastFiredByBot[bot.id]) {
      chartState.lastFiredByBot[bot.id] = Math.floor(Date.now() / 1000);
    }
  }
  let sourcePayload = generateChartBars(bot, Math.max(2000, getDesiredHistoryBars()));
  chartState.sourceLabel = 'Sample data';

  if (chartState.mode === 'history' || chartState.mode === 'live') {
    try {
      const market = await fetchBinanceKlines(bot, getDesiredHistoryBars(), chartState.marketType);
      sourcePayload = { candles: market.candles, volumes: market.volumes };
      chartState.sourceLabel = market.source;
      chartState.marketType = market.marketType || chartState.marketType;
    } catch (error) {
      sourcePayload = generateChartBars(bot, Math.max(2000, getDesiredHistoryBars()));
      const reason = error instanceof Error ? error.message : 'market feed unavailable';
      chartState.sourceLabel = `Sample fallback (${reason})`;
    }
  }

  const data = buildReplayPackageFromCandles(sourcePayload.candles, sourcePayload.volumes, bot);
  const container = document.getElementById('tv-chart');
  const cursorTimeLabel = document.getElementById('chart-cursor-time');
  const candleIndexByTime = new Map(data.candles.map((candle, idx) => [candle.time, idx]));

  if (chartState.chart) {
    chartState.chart.remove();
    chartState.chart = null;
    chartState.priceLines = [];
    chartState.infoLines = [];
  }

  if (chartState.resizeObserver) {
    chartState.resizeObserver.disconnect();
    chartState.resizeObserver = null;
  }

  const chart = LightweightCharts.createChart(container, {
    width:  container.clientWidth || 900,
    height: getChartHeightForMode(),
    layout: {
      background: { type: 'solid', color: '#071018' },
      textColor: '#8ca0b3',
      fontSize: 12,
    },
    grid: {
      vertLines: { color: 'rgba(128,156,181,0.08)' },
      horzLines: { color: 'rgba(128,156,181,0.08)' },
    },
    crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
    rightPriceScale: { borderColor: 'rgba(128,156,181,0.18)' },
    timeScale: {
      borderColor: 'rgba(128,156,181,0.18)',
      timeVisible: true,
      secondsVisible: false,
    },
  });
  applyInteractiveChartOptions(chart);

  // Candlestick series
  const candleSeries = chart.addCandlestickSeries({
    upColor:        '#2ddb75',
    downColor:      '#ff6d6d',
    borderUpColor:  '#2ddb75',
    borderDownColor:'#ff6d6d',
    wickUpColor:    '#2ddb75',
    wickDownColor:  '#ff6d6d',
  });
  candleSeries.setData(data.candles);

  // 20-bar SMA overlay
  const smaSeries = chart.addLineSeries({
    color:                   'rgba(247,188,82,0.72)',
    lineWidth:               1,
    crosshairMarkerVisible:  false,
    lastValueVisible:        false,
    priceLineVisible:        false,
  });
  const smaData = buildSma(data.candles, 20);
  smaSeries.setData(smaData);

  // Volume histogram in overlay pane
  const volSeries = chart.addHistogramSeries({
    priceFormat: { type: 'volume' },
    priceScaleId: 'vol',
  });
  volSeries.setData(data.volumes);
  chart.priceScale('vol').applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } });

  // Trade markers
  candleSeries.setMarkers(data.markers);

  // TP / SL / Entry lines for open trade
  if (data.openTrade) {
    const ot = data.openTrade;
    chartState.priceLines = [
      candleSeries.createPriceLine({ price: ot.entry, color: '#27d3c5', lineWidth: 1, lineStyle: LightweightCharts.LineStyle.Dotted, axisLabelVisible: true, title: 'Entry' }),
      candleSeries.createPriceLine({ price: ot.tp, color: '#2ddb75', lineWidth: 1, lineStyle: LightweightCharts.LineStyle.Dashed, axisLabelVisible: true, title: `TP +${bot.tp}%` }),
      candleSeries.createPriceLine({ price: ot.sl, color: '#ff6d6d', lineWidth: 1, lineStyle: LightweightCharts.LineStyle.Dashed, axisLabelVisible: true, title: `SL -${bot.sl}%` }),
    ];
  }

  const basePrice = data.candles[0]?.close || 0;
  if (basePrice > 0) {
    chartState.infoLines.push(
      candleSeries.createPriceLine({
        price: basePrice,
        color: 'rgba(140,160,179,0.55)',
        lineWidth: 1,
        lineStyle: LightweightCharts.LineStyle.Dotted,
        axisLabelVisible: true,
        title: 'Base',
      })
    );
  }
  const cursorGuide = candleSeries.createPriceLine({
    price: data.candles[data.candles.length - 1]?.close || basePrice,
    color: 'rgba(122,162,255,0.85)',
    lineWidth: 1,
    lineStyle: LightweightCharts.LineStyle.Solid,
    axisLabelVisible: true,
    title: 'Price',
  });
  chartState.infoLines.push(cursorGuide);

  // OHLCV crosshair legend
  const legend = document.getElementById('chart-ohlcv-legend');
  chart.subscribeCrosshairMove((param) => {
    if (!param.time) { legend.innerHTML = ''; return; }
    const d = param.seriesData.get(candleSeries);
    if (!d) { legend.innerHTML = ''; return; }
    const col = d.close >= d.open ? '#2ddb75' : '#ff6d6d';
    const deltaPct = basePrice > 0 ? ((d.close - basePrice) / basePrice) * 100 : 0;
    const idx = candleIndexByTime.get(param.time);
    const prevClose = idx && idx > 0 ? data.candles[idx - 1].close : d.open;
    cursorGuide.applyOptions({
      price: d.close,
      title: `${d.close.toFixed(6)} ${deltaPct >= 0 ? '+' : ''}${deltaPct.toFixed(2)}%`,
    });
    renderBinanceTopMetrics(d, prevClose, param.time);
    if (cursorTimeLabel) cursorTimeLabel.textContent = formatChartDateTime(param.time);
    legend.innerHTML =
      `<span style="color:${col}">O <b>${d.open}</b></span>` +
      `<span style="color:${col}">H <b>${d.high}</b></span>` +
      `<span style="color:${col}">L <b>${d.low}</b></span>` +
      `<span style="color:${col}">C <b>${d.close}</b></span>` +
      `<span style="color:${deltaPct >= 0 ? '#2ddb75' : '#ff6d6d'}">% <b>${deltaPct >= 0 ? '+' : ''}${deltaPct.toFixed(2)}%</b></span>`;
  });

  const last = data.candles[data.candles.length - 1];
  const prev = data.candles.length > 1 ? data.candles[data.candles.length - 2].close : last?.open;
  if (last) {
    renderBinanceTopMetrics(last, prev, last.time);
    if (cursorTimeLabel) cursorTimeLabel.textContent = formatChartDateTime(last.time);
  }

  // Responsive resize
  chartState.resizeObserver = new ResizeObserver(() => {
    if (chartState.chart) chartState.chart.applyOptions({ width: container.clientWidth });
  });
  chartState.resizeObserver.observe(container);

  chartState.chart         = chart;
  chartState.candleSeries  = candleSeries;
  chartState.smaSeries     = smaSeries;
  chartState.volumeSeries  = volSeries;
  chartState.data          = { ...data, smaData };
  chartState.replaySignals = data.replaySignals;
  chartState.replayEquityTimeline = data.replayEquityTimeline;
  chartState.replayIndex   = 0;
  chartState.isPlaying     = false;
  chartState.initialized   = true;
  chartState.currentBotId  = bot.id;

  renderChartControls(bot, data.summary);
  setupTimeframePills(bot);
  setupChartModeControls(bot);
  setupChartNavigationTools(bot);
  setupLayerToggles();
  setupReplayControls();
  setupChartParameterLab(bot);
  setupChartBotConfigPanel(bot);

  setReplayControlsVisible(chartState.mode === 'history');
  applyHistoryOrLiveFrame();
  chart.timeScale().fitContent();
  installAutoBackfill(bot);
  if (chartState.mode === 'live' && chartState.followLive) {
    chart.timeScale().scrollToRealTime();
  }
  if (chartState.mode === 'live') {
    startLive(bot);
  }
}

function setupTimeframePills(bot) {
  const sel = document.getElementById('chart-tf-select');
  if (!sel) return;
  const currentTf = String(bot.timeframe || '5m').toLowerCase();
  sel.value = currentTf;
  sel.onchange = () => {
    const tf = String(sel.value || '').toLowerCase();
    if (!tf) return;
    const activeBotId = chartState.currentBotId || state.selectedBotId;
    const activeBot = state.bots.find((b) => b.id === activeBotId) || state.bots[0];
    if (tf === String(activeBot.timeframe).toLowerCase()) return;
    activeBot.timeframe = tf;
    const timeframeInput = document.getElementById('chart-param-timeframe');
    if (timeframeInput) timeframeInput.value = tf;
    renderHero();
    renderBots();
    renderConfigForm();
    renderConfigPreview();
    void initChart(activeBot.id);
  };
}

function renderChartControls(activeBot, summary) {
  const tabs = document.getElementById('chart-bot-tabs');
  tabs.innerHTML = state.bots.map((bot) => {
    const isLive = !!chartState.autoSignalByBot[bot.id];
    const liveClass = isLive ? 'is-live' : 'is-off';
    return `<button class="chart-bot-tab ${bot.id === activeBot.id ? 'is-active' : ''} ${liveClass}" data-bot-id="${bot.id}">${bot.name}</button>`;
  }).join('');
  tabs.querySelectorAll('[data-bot-id]').forEach((btn) => {
    btn.addEventListener('click', () => requestAnimationFrame(() => initChart(btn.dataset.botId)));
  });

  document.getElementById('chart-symbol-info').innerHTML =
    `<span class="chart-symbol-name">${activeBot.symbol}</span>` +
    `<span class="chart-timeframe-badge">${activeBot.timeframe}</span>`;

  const pfText = Number.isFinite(summary.profitFactor) ? summary.profitFactor.toFixed(2) : '-';
  const pfTone = Number.isFinite(summary.profitFactor) && summary.profitFactor >= 1 ? 'is-positive' : 'is-negative';
  const sortinoVal = Number.isFinite(summary.sortino) ? summary.sortino.toFixed(2) : '-';
  const sortinoTone = (summary.sortino ?? 0) >= 0.5 ? 'is-positive' : (summary.sortino ?? 0) < 0 ? 'is-negative' : '';
  const edgeVal = Number.isFinite(summary.expectancy) ? `${summary.expectancy.toFixed(2)}%` : '-';
  const edgeTone = (summary.expectancy ?? 0) > 0 ? 'is-positive' : 'is-negative';
  document.getElementById('chart-perf-strip').innerHTML = [
    ['Win Rate', `${summary.winRate.toFixed(2)}%`, summary.winRate > 50 ? 'is-positive' : 'is-negative'],
    ['Net P/L', formatPercent(summary.netPl), summary.netPl > 0 ? 'is-positive' : 'is-negative'],
    ['Max DD', `${summary.maxDrawdown.toFixed(2)}%`, 'is-negative'],
    ['Trades', String(summary.trades), ''],
    ['PF', pfText, pfTone],
    ['Sortino', sortinoVal, sortinoTone],
    ['Edge', edgeVal, edgeTone],
    ['W / L', `${summary.wins} / ${summary.losses}`, ''],
  ].map(([label, value, tone]) =>
    `<div class="chart-perf-item">` +
      `<span class="chart-perf-label">${label}</span>` +
      `<span class="chart-perf-value ${tone}">${value}</span>` +
    `</div>`
  ).join('');

  const modeStatus = document.getElementById('chart-mode-status');
  if (modeStatus) modeStatus.textContent = getModeStatusText();
}

function setupChartModeControls(bot) {
  const modeSelect = document.getElementById('chart-mode-select');
  const historyBarsSelect = document.getElementById('chart-history-bars');
  if (!modeSelect || !historyBarsSelect) return;
  modeSelect.value = chartState.mode;
  historyBarsSelect.value = String(chartState.historyBarsTarget);

  modeSelect.onchange = () => {
    chartState.mode = modeSelect.value;
    if (chartState.mode !== 'live') {
      setFollowLive(false);
    }
    syncAutoSignalBtn(bot);
    void initChart(bot.id);
  };

  historyBarsSelect.onchange = () => {
    chartState.historyBarsTarget = getDesiredHistoryBars();
    if (chartState.mode === 'history' || chartState.mode === 'live') {
      void initChart(bot.id);
    }
  };
}

function setupChartNavigationTools(bot) {
  const panLeft = document.getElementById('chart-pan-left');
  const panRight = document.getElementById('chart-pan-right');
  const zoomIn = document.getElementById('chart-zoom-in');
  const zoomOut = document.getElementById('chart-zoom-out');
  const followToggle = document.getElementById('chart-follow-toggle');
  const resetView = document.getElementById('chart-reset-view');
  const loadMore = document.getElementById('chart-load-more');
  if (!panLeft || !panRight || !zoomIn || !zoomOut || !followToggle || !resetView || !loadMore || !chartState.chart) return;

  setFollowLive(chartState.mode === 'live' ? chartState.followLive : false);

  panLeft.onclick = () => {
    setFollowLive(false);
    const scale = chartState.chart.timeScale();
    const range = scale.getVisibleLogicalRange?.();
    if (range) {
      const span = Math.max(10, range.to - range.from);
      scale.setVisibleLogicalRange({ from: range.from - span * 0.25, to: range.to - span * 0.25 });
    }
  };

  panRight.onclick = () => {
    setFollowLive(false);
    const scale = chartState.chart.timeScale();
    const range = scale.getVisibleLogicalRange?.();
    if (range) {
      const span = Math.max(10, range.to - range.from);
      scale.setVisibleLogicalRange({ from: range.from + span * 0.25, to: range.to + span * 0.25 });
    }
  };

  zoomIn.onclick = () => {
    setFollowLive(false);
    chartState.barSpacing = Math.min(120, chartState.barSpacing * 1.28);
    chartState.chart.applyOptions({ timeScale: { barSpacing: chartState.barSpacing } });
  };

  zoomOut.onclick = () => {
    setFollowLive(false);
    chartState.barSpacing = Math.max(0.25, chartState.barSpacing / 1.28);
    chartState.chart.applyOptions({ timeScale: { barSpacing: chartState.barSpacing } });
  };

  followToggle.onclick = () => {
    const enabled = chartState.mode === 'live' ? !chartState.followLive : false;
    setFollowLive(enabled);
    if (enabled && chartState.chart) {
      chartState.chart.timeScale().scrollToRealTime();
    }
  };

  resetView.onclick = () => {
    if (chartState.mode !== 'live') {
      setFollowLive(false);
    }
    chartState.chart.timeScale().fitContent();
  };

  loadMore.onclick = () => {
    chartState.historyBarsTarget = Math.min(chartState.historyBarsTarget + 2000, 12000);
    const historyBarsSelect = document.getElementById('chart-history-bars');
    if (historyBarsSelect) {
      const exists = Array.from(historyBarsSelect.options).some((opt) => Number(opt.value) === chartState.historyBarsTarget);
      if (!exists) {
        const option = document.createElement('option');
        option.value = String(chartState.historyBarsTarget);
        option.textContent = chartState.historyBarsTarget.toLocaleString();
        historyBarsSelect.appendChild(option);
      }
      historyBarsSelect.value = String(chartState.historyBarsTarget);
    }
    if (chartState.mode === 'history' || chartState.mode === 'live') {
      void loadOlderHistory(bot, 3000);
    }
  };

  const autoSignalToggle = document.getElementById('chart-autosignal-toggle');
  if (autoSignalToggle) {
    syncAutoSignalBtn(bot);
    autoSignalToggle.onclick = () => {
      const isLive = chartState.mode === 'live';
      if (!isLive) {
        showSignalToast('Auto-Signal only works in Live mode', 'warn');
        return;
      }
      const hasUrl = !!(bot.tradeRelayUrl);
      if (!hasUrl) {
        showSignalToast('Set TradeRelay Bot URL in Settings first', 'warn');
        return;
      }
      const current = !!chartState.autoSignalByBot[bot.id];
      chartState.autoSignalByBot[bot.id] = !current;
      bot.autoSignal = !current;
      if (!current) {
        // Arm: set lastFired to now so we never re-fire old history
        chartState.lastFiredByBot[bot.id] = Math.floor(Date.now() / 1000);
      }
      void saveSettings();
      syncAutoSignalBtn(bot);
    };
  }
}

function syncAutoSignalBtn(bot) {
  const toggle = document.getElementById('chart-autosignal-toggle');
  if (!toggle) return;
  const isLive = chartState.mode === 'live';
  const armed = !!chartState.autoSignalByBot[bot?.id];
  const hasUrl = !!(bot?.tradeRelayUrl);
  const stateSpan = toggle.querySelector('.autosignal-state');
  if (stateSpan) stateSpan.textContent = armed ? 'ON' : 'OFF';
  toggle.classList.toggle('is-active', armed);
  toggle.disabled = !isLive;
  toggle.title = !isLive ? 'Switch to Live mode to use Auto-Signal' : hasUrl ? '' : 'Configure TradeRelay URL in Settings first';
  // Update topnav dots to reflect real bot status
  updateStatusDots();
  // Refresh bot list so live badge appears/disappears
  renderBots();
}

function updateStatusDots() {
  const dots = document.querySelectorAll('.topnav-status .status-dot');
  const activeLiveBots = state.bots.filter((b) => !!chartState.autoSignalByBot[b.id]);
  const anyLive = activeLiveBots.length > 0;
  const hasRelay = state.bots.some((b) => b.tradeRelayUrl);
  if (dots[0]) { dots[0].className = `status-dot ${anyLive ? 'ok' : hasRelay ? 'warn' : 'off'}`; dots[0].title = anyLive ? `Auto-Signal active (${activeLiveBots.map(b => b.name).join(', ')})` : hasRelay ? 'TradeRelay configured, signals paused' : 'TradeRelay not configured'; }
  if (dots[1]) { dots[1].className = `status-dot ${chartState.mode === 'live' ? 'ok' : 'warn'}`; dots[1].title = chartState.mode === 'live' ? 'Live feed active' : `Mode: ${chartState.mode}`; }
  if (dots[2]) { dots[2].className = `status-dot ${state.bots.length > 0 ? 'ok' : 'warn'}`; dots[2].title = `${state.bots.length} bot(s) configured`; }
}

function fmtTradeTime(unixSec) {
  if (!unixSec) return '—';
  const d = new Date(unixSec * 1000);
  const mo = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dy = String(d.getUTCDate()).padStart(2, '0');
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `${dy}/${mo} ${hh}:${mm} UTC`;
}

let tradeLogView = 'cards'; // 'cards' | 'list'

function setupTradeViewToggle() {
  const cardsBtn = document.getElementById('trade-view-cards');
  const listBtn  = document.getElementById('trade-view-list');
  if (!cardsBtn || !listBtn) return;
  const sync = () => {
    cardsBtn.classList.toggle('is-active', tradeLogView === 'cards');
    listBtn.classList.toggle('is-active',  tradeLogView === 'list');
    const log = document.getElementById('chart-trade-log');
    if (log) log.classList.toggle('is-list-view', tradeLogView === 'list');
  };
  cardsBtn.onclick = () => { tradeLogView = 'cards'; sync(); renderChartTradeLog(chartState.data?.tradeLog || [], getSelectedBotForChart()); };
  listBtn.onclick  = () => { tradeLogView = 'list';  sync(); renderChartTradeLog(chartState.data?.tradeLog || [], getSelectedBotForChart()); };
  sync();
}

function renderChartTradeLog(tradeLog, bot) {
  const currentTime = chartState.data?.candles?.[chartState.replayIndex]?.time || null;
  const log = document.getElementById('chart-trade-log');
  if (!log) return;
  log.classList.toggle('is-list-view', tradeLogView === 'list');

  // Newest first
  const sorted = [...tradeLog].reverse();

  if (tradeLogView === 'list') {
    log.innerHTML = `
      <div class="trade-list-header">
        <span>Dir</span><span>Entry time</span><span>Exit time</span><span>Entry px</span><span>Exit px</span><span>Result</span><span>P/L</span>
      </div>
      ${sorted.map((trade) => {
        const isOpen  = trade.reason === 'open';
        const isWin   = trade.reason === 'tp';
        const hasStarted = currentTime !== null && trade.entryTime <= currentTime;
        const hasClosed  = trade.exitTime !== null && currentTime !== null && trade.exitTime <= currentTime;
        const plStr  = trade.pl !== null ? (trade.pl > 0 ? '+' : '') + trade.pl.toFixed(2) + '%' : '—';
        const plClass = trade.pl === null ? '' : trade.pl > 0 ? 'is-positive' : 'is-negative';
        const result = !hasStarted ? 'Queued' : hasClosed ? (isWin ? 'Win TP' : 'Loss SL') : 'Open';
        return `<div class="trade-list-row ${hasClosed ? '' : hasStarted ? 'is-active' : 'is-pending'}">
          <span class="trade-dir-badge ${trade.dir}">${trade.dir.toUpperCase()}</span>
          <span>${fmtTradeTime(trade.entryTime)}</span>
          <span>${hasClosed ? fmtTradeTime(trade.exitTime) : '—'}</span>
          <span class="mono">${trade.entry.toFixed(5)}</span>
          <span class="mono">${hasClosed ? trade.exit.toFixed(5) : isOpen ? trade.tp.toFixed(5) : '—'}</span>
          <span>${result}</span>
          <span class="${plClass}">${plStr}</span>
        </div>`;
      }).join('')}`;
    return;
  }

  log.innerHTML = sorted.map((trade) => {
    const isOpen = trade.reason === 'open';
    const isWin  = trade.reason === 'tp';
    const hasStarted = currentTime !== null && trade.entryTime <= currentTime;
    const isActive = hasStarted && (trade.exitTime === null || trade.exitTime > currentTime);
    const hasClosed = trade.exitTime !== null && currentTime !== null && trade.exitTime <= currentTime;
    const plStr  = trade.pl !== null
      ? (trade.pl > 0 ? '+' : '') + trade.pl.toFixed(2) + '%'
      : 'In progress';
    const plClass = trade.pl === null ? '' : trade.pl > 0 ? 'is-positive' : 'is-negative';
    const stateClass = hasStarted ? (isActive ? 'is-active' : '') : 'is-pending';
    const exitLabel = hasClosed ? fmtTradeTime(trade.exitTime) : isActive ? 'Open' : '—';
    return `
      <article class="chart-trade-card ${stateClass}">
        <div class="chart-trade-header">
          <span class="trade-dir-badge ${trade.dir}">${trade.dir.toUpperCase()}</span>
          <span class="trade-result-badge ${isOpen ? 'open' : isWin ? 'win' : 'loss'}">${!hasStarted ? 'Queued' : hasClosed ? (isWin ? 'Win TP' : 'Loss SL') : 'Open'}</span>
        </div>
        <div class="trade-timestamps">
          <div class="trade-ts-item"><span>Entry</span><strong>${fmtTradeTime(trade.entryTime)}</strong></div>
          <div class="trade-ts-item"><span>Exit</span><strong>${exitLabel}</strong></div>
        </div>
        <div class="trade-price-grid">
          <div class="trade-price-item"><span>Entry</span><strong>${trade.entry.toFixed(5)}</strong></div>
          <div class="trade-price-item"><span>${isOpen ? 'TP Target' : isWin ? 'Exit (TP)' : 'Exit (SL)'}</span><strong>${(isOpen ? trade.tp : trade.exit).toFixed(5)}</strong></div>
          <div class="trade-price-item"><span>TP +${bot.tp}%</span><strong style="color:var(--green)">${trade.tp.toFixed(5)}</strong></div>
          <div class="trade-price-item"><span>SL -${bot.sl}%</span><strong style="color:var(--red)">${trade.sl.toFixed(5)}</strong></div>
        </div>
        <div class="trade-pl ${plClass}">${plStr}</div>
      </article>`;
  }).join('');
}

function setupReplayControls() {
  if (!chartState.data) return;

  const randomSampleBtn = document.getElementById('replay-random-sample');
  if (!randomSampleBtn) return;

  randomSampleBtn.onclick = async () => {
    randomSampleBtn.disabled = true;
    randomSampleBtn.textContent = 'Loading…';
    try {
      const bot = state.bots.find((b) => b.id === chartState.currentBotId) || state.bots[0];
      // Bars per day by timeframe
      const barsPerDayMap = { '1m':1440,'3m':480,'5m':288,'15m':96,'30m':48,'1h':24,'4h':6,'1d':1,'1w':1 };
      const bpd = barsPerDayMap[String(bot.timeframe).toLowerCase()] ?? 96;
      const IDEAL_WINDOW = Math.max(200, bpd * 30); // ~30 days of bars
      // Pick a random end time anywhere within the past 2 years so each press
      // can land in a completely different historical period (not just recent data)
      const twoYearsMs = 2 * 365 * 24 * 60 * 60 * 1000;
      const randomEndMs = Date.now() - Math.floor(Math.random() * twoYearsMs);
      let candles = [], volumes = [];
      try {
        const market = await fetchBinanceKlines(bot, IDEAL_WINDOW, chartState.marketType, randomEndMs);
        candles = market.candles;
        volumes = market.volumes;
      } catch { /* fall through to fallback */ }
      // If too few bars (pair didn't exist that far back), fall back to most recent data
      if (candles.length < 50) {
        try {
          const market = await fetchBinanceKlines(bot, IDEAL_WINDOW, chartState.marketType);
          candles = market.candles;
          volumes = market.volumes;
        } catch {
          candles = chartState.data?.candles || [];
          volumes = chartState.data?.volumes || [];
        }
      }
      const pkg = buildReplayPackageFromCandles(candles, volumes, bot);
      chartState.data = { ...pkg, smaData: buildSma(pkg.candles, 20) };
      chartState.replaySignals = pkg.replaySignals;
      chartState.replayEquityTimeline = pkg.replayEquityTimeline;
      chartState.replayIndex = 0;
      renderChartControls(bot, pkg.summary);
      setupLayerToggles();
      applyReplayFrame(pkg.candles.length - 1);
      chartState.chart?.timeScale().fitContent();
      // Show date range of sample
      const from = new Date(candles[0].time * 1000).toLocaleDateString();
      const to   = new Date(candles[candles.length - 1].time * 1000).toLocaleDateString();
      const progress = document.getElementById('replay-progress');
      if (progress) progress.textContent = `${from} – ${to} · ${pkg.summary.trades} trades`;
    } finally {
      randomSampleBtn.disabled = false;
      randomSampleBtn.textContent = '\u{1F3B2} Random Sample';
    }
  };
}

function setupLayerToggles() {
  const candleToggle = document.getElementById('toggle-candles');
  const smaToggle = document.getElementById('toggle-sma');
  const volumeToggle = document.getElementById('toggle-volume');
  const markerToggle = document.getElementById('toggle-markers');
  const levelsToggle = document.getElementById('toggle-levels');

  if (!candleToggle || !smaToggle || !volumeToggle || !markerToggle || !levelsToggle) return;

  candleToggle.checked = chartState.showCandles;
  smaToggle.checked = chartState.showSma;
  volumeToggle.checked = chartState.showVolume;
  markerToggle.checked = chartState.showMarkers;
  levelsToggle.checked = chartState.showLevels;

  candleToggle.onchange = () => {
    chartState.showCandles = candleToggle.checked;
    applyReplayFrame(chartState.replayIndex);
  };
  smaToggle.onchange = () => {
    chartState.showSma = smaToggle.checked;
    applyReplayFrame(chartState.replayIndex);
  };
  volumeToggle.onchange = () => {
    chartState.showVolume = volumeToggle.checked;
    applyReplayFrame(chartState.replayIndex);
  };
  markerToggle.onchange = () => {
    chartState.showMarkers = markerToggle.checked;
    applyReplayFrame(chartState.replayIndex);
  };
  levelsToggle.onchange = () => {
    chartState.showLevels = levelsToggle.checked;
    applyLevelVisibility();
  };
}

function applyLevelVisibility() {
  if (!chartState.priceLines?.length) return;
  for (const line of chartState.priceLines) {
    line.applyOptions({
      lineVisible: chartState.showLevels,
      axisLabelVisible: chartState.showLevels,
    });
  }
}

function parseLocaleNumber(rawValue, fallback) {
  const normalized = String(rawValue ?? '').trim().replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function averageSummaries(summaries) {
  if (!summaries.length) return {
    netPl: 0, maxDrawdown: 0, winRate: 50, trades: 0, profitFactor: 1,
    consistency: 0, netPlStdDev: 0, avgWin: 0, avgLoss: 0, expectancy: 0,
    recoveryFactor: 0, maxConsecLosses: 0, sharpe: 0, sortino: 0,
  };
  const n = summaries.length;
  const profitableCount = summaries.filter(s => s.netPl > 0).length;
  const consistency = profitableCount / n;
  const avgNetPl = summaries.reduce((s, x) => s + x.netPl, 0) / n;
  const netPlStdDev = n > 1
    ? Math.sqrt(summaries.reduce((s, x) => s + (x.netPl - avgNetPl) ** 2, 0) / n)
    : 0;
  const avg = (key, cap) => summaries.reduce((s, x) => s + Math.min(x[key] ?? 0, cap ?? Infinity), 0) / n;
  return {
    netPl:            avgNetPl,
    maxDrawdown:      avg('maxDrawdown'),
    winRate:          avg('winRate'),
    trades:           Math.round(avg('trades')),
    profitFactor:     avg('profitFactor', 20),
    consistency,
    netPlStdDev,
    avgWin:           avg('avgWin'),
    avgLoss:          avg('avgLoss'),
    expectancy:       avg('expectancy'),
    recoveryFactor:   avg('recoveryFactor', 20),
    maxConsecLosses:  avg('maxConsecLosses'),
    sharpe:           summaries.reduce((s, x) => s + (x.sharpe ?? 0), 0) / n,
    sortino:          summaries.reduce((s, x) => s + (x.sortino ?? 0), 0) / n,
  };
}

function applyParamsToChart(bot) {
  // Immediately re-run the strategy on the currently loaded candles so the
  // perf strip and equity curve update without waiting for a Binance re-fetch
  if (!chartState.data?.candles?.length) return;
  const rebuilt = buildReplayPackageFromCandles(
    chartState.data.candles,
    chartState.data.volumes || [],
    bot
  );
  chartState.data = { ...rebuilt, smaData: buildSma(rebuilt.candles, 20) };
  chartState.replaySignals = rebuilt.replaySignals;
  chartState.replayEquityTimeline = rebuilt.replayEquityTimeline;
  renderChartControls(bot, rebuilt.summary);
  applyReplayFrame(rebuilt.candles.length - 1);
  renderLiveEquity();
}

// ── AI Optimization Scoring ───────────────────────────────────────────────────
// Multi-factor scoring inspired by institutional-grade optimizer design:
//
//  CORE METRICS (risk-adjusted)
//  • Sortino ratio  — mean trade return / downside deviation (rewards upside volatility)
//  • Profit Factor  — gross win / gross loss (raw edge quality, capped at 5×)
//  • Recovery Factor — net profit / max drawdown (how efficiently losses are recovered)
//
//  EDGE METRICS
//  • Expectancy     — (WR × avgWin) − (LR × avgLoss) = avg dollar edge per trade
//  • Win-rate bonus — above 50% gets a modest reward, but not over-weighted
//
//  ROBUSTNESS PENALTIES
//  • Drawdown penalty  — direct penalisation of max drawdown
//  • Consistency gate  — fraction of sampled periods that were profitable
//  • Return std-dev    — penalises lucky outlier periods vs. steady returns
//  • Trade count gate  — parameter sets with < 15 trades are down-weighted
//                        (too few trades = untestable, not necessarily bad)
//
// The composite score is dimensionless and suitable for cross-strategy ranking.
function scoreOptimizationCandidate(summary) {
  // Gate on trade count — ramp from 0.15 at 1 trade to 1.0 at 30+ trades
  // (30 is a statistically meaningful sample; ATR/swing strategies rarely hit 40 on higher TFs)
  const tradeFactor = Math.max(0.15, Math.min(1.0, summary.trades / 30));

  // Sortino (downside-adjusted return per trade); cap at ±6 to prevent domination
  const sortinoScore = Math.max(-6, Math.min(6, summary.sortino ?? 0)) * 6;

  // Profit factor contribution (cap at 5× so extreme PF doesn't mask other weaknesses)
  const pfScore = Math.min(summary.profitFactor ?? 1, 5) * 3.5;

  // Recovery factor (net profit efficiency vs drawdown risk); cap at 10×
  const rfScore = Math.min(summary.recoveryFactor ?? 0, 10) * 1.5;

  // Expectancy per trade (raw %)
  const expScore = (summary.expectancy ?? 0) * 0.8;

  // Win-rate edge (distance above random — 50% baseline)
  const wrEdge = ((summary.winRate ?? 50) - 50) * 0.15;

  // Drawdown penalty — quadratic beyond 20% to strongly penalise deep drawdowns
  const dd = summary.maxDrawdown ?? 0;
  const ddPenalty = dd <= 20 ? dd * 0.6 : 20 * 0.6 + (dd - 20) * 1.4;

  // Cross-period consistency: fraction of sampled windows that were profitable
  const consistencyBonus = (summary.consistency ?? 1) * 9;

  // Return volatility penalty: punishes lucky outliers that inflate avg
  const stdPenalty = (summary.netPlStdDev ?? 0) * 0.35;

  // Maximum consecutive losses penalty — anything beyond 5 consecutive losses
  // signals a period of sustained edge failure; quadratic beyond 7 to strongly penalise
  const mcl = summary.maxConsecLosses ?? 0;
  const maxClPenalty = mcl <= 5 ? 0 : mcl <= 7 ? (mcl - 5) * 0.8 : 1.6 + (mcl - 7) * 1.8;

  const raw = sortinoScore + pfScore + rfScore + expScore + wrEdge + consistencyBonus - ddPenalty - stdPenalty - maxClPenalty;
  return raw * tradeFactor;
}

function renderOptimizerResults(candidates, bot, tpInput, slInput, thresholdInput, feedback, source) {
  const container = document.getElementById('optimizer-results');
  if (!container) return;
  if (!candidates.length) {
    container.innerHTML = '';
    return;
  }
  const isH9S = bot.strategy === 'h9s';
  const isB5S = bot.strategy === 'b5s';
  const isBOS = isH9S || isB5S;
  const isAI1 = bot.strategy === 'ai1';
  const isAI2 = bot.strategy === 'ai2';
  const isAI3 = bot.strategy === 'ai3';
  const isAI  = isAI1 || isAI2 || isAI3;
  const isATR = isAI || bot.strategy === 'vw1' || bot.strategy === 'kc1' || bot.strategy === 'dv1' || bot.strategy === 'rs1' || bot.strategy === 'e3' || bot.strategy === 'cv1' || bot.strategy === 'ch1' || bot.strategy === 'pm1' || bot.strategy === 'ob1' || bot.strategy === 'fg1' || bot.strategy === 'sm1' || bot.strategy === 'mn1' || bot.strategy === 'st1' || bot.strategy === 'sb1';

  const atrThLabel =
    isAI1              ? 'RSI'
    : isAI2            ? 'Squeeze%'
    : isAI3            ? 'Stoch'
    : bot.strategy === 'vw1' ? 'Dev%'
    : bot.strategy === 'kc1' ? 'EMA'
    : bot.strategy === 'dv1' ? 'DC'
    : bot.strategy === 'rs1' ? 'ROC'
    : bot.strategy === 'e3'  ? 'RangePd'
    : bot.strategy === 'cv1' ? 'CVD Win'
    : bot.strategy === 'ch1' ? 'Swing'
    : bot.strategy === 'pm1' ? 'RSI Pd'
    : bot.strategy === 'ob1' ? 'ZigLen'
    : bot.strategy === 'fg1' ? 'CVD Len'
    : bot.strategy === 'sm1' ? 'Swing'
    : bot.strategy === 'mn1' ? 'Swing'
    : bot.strategy === 'st1' ? 'ST Pd'
    : bot.strategy === 'sb1' ? 'Swing'
    : 'Th';

  container.innerHTML = candidates
    .slice(0, 6)
    .map((candidate, idx) => {
      let paramStr;
      if (isBOS) {
        const tpPart = candidate.tpType === 'dynamic' ? 'Dyn TP' : `TP ${candidate.tp}% SL ${candidate.sl}%`;
        const tradesPart = isB5S ? ` • ${candidate.maxTrades ?? 3}T` : '';
        paramStr = `Swing ${candidate.threshold} • ${candidate.bosConfType === 'wicks' ? 'Wicks' : 'Close'} • ${tpPart}${tradesPart}`;
      } else if (isATR) {
        paramStr = `TP ${candidate.tp}× ATR • SL ${candidate.sl}× ATR • ${atrThLabel} ${candidate.threshold}`;
      } else {
        paramStr = `TP ${candidate.tp}% • SL ${candidate.sl}% • Th ${candidate.threshold}`;
      }
      return `
      <article class="optimizer-row">
        <div class="optimizer-rank">${idx + 1}</div>
        <div class="optimizer-main">
          <strong>${paramStr}</strong>
          <div class="optimizer-sub">${formatPercent(candidate.summary.netPl)} net • ${candidate.summary.maxDrawdown.toFixed(2)}% DD • ${candidate.summary.winRate.toFixed(2)}% WR • ${candidate.summary.trades} trades</div>
          <div class="optimizer-sub" style="opacity:0.7;font-size:0.78em">Sortino ${(candidate.summary.sortino ?? 0).toFixed(2)} • PF ${Math.min(candidate.summary.profitFactor ?? 1, 99).toFixed(2)} • RF ${Math.min(candidate.summary.recoveryFactor ?? 0, 99).toFixed(2)} • Edge ${(candidate.summary.expectancy ?? 0).toFixed(2)}%</div>
        </div>
        <button class="ghost-button replay-btn optimizer-apply" data-optimizer-index="${idx}" type="button">Apply</button>
      </article>
    `;
    })
    .join('');

  container.querySelectorAll('[data-optimizer-index]').forEach((button) => {
    button.addEventListener('click', () => {
      const idx = Number(button.getAttribute('data-optimizer-index'));
      const candidate = candidates[idx];
      if (!candidate) return;
      bot.tp = candidate.tp;
      bot.sl = candidate.sl;
      bot.threshold = candidate.threshold;
      if (isBOS) {
        bot.bosConfType = candidate.bosConfType;
        bot.tpType = candidate.tpType;
      }
      if (isB5S) {
        bot.maxTrades = candidate.maxTrades ?? 3;
      }
      bot.winRate  = candidate.summary.winRate;
      bot.netPl    = candidate.summary.netPl;
      bot.drawdown = candidate.summary.maxDrawdown;
      bot.trades   = candidate.summary.trades;
      tpInput.value = String(candidate.tp);
      slInput.value = String(candidate.sl);
      thresholdInput.value = String(candidate.threshold);
      feedback.className = 'param-feedback good';
      const label = isBOS
        ? `Swing ${candidate.threshold} / ${candidate.bosConfType} / ${candidate.tpType}${isB5S ? ` / ${candidate.maxTrades ?? 3}T` : ''}`
      : isATR
        ? `TP ${candidate.tp}× / SL ${candidate.sl}× / ${atrThLabel} ${candidate.threshold}`
        : `TP ${candidate.tp}% / SL ${candidate.sl}% / Th ${candidate.threshold}`;
      feedback.textContent = `Applied candidate #${idx + 1}: ${label}.`;
      applyParamsToChart(bot);
      void saveSettings();
      renderHero();
      renderBots();
      renderConfigForm();
      renderConfigPreview();
      void initChart(bot.id);
    });
  });
}

function setupChartBotConfigPanel(bot) {
  const panel = document.getElementById('chart-bot-config-panel');
  const toggleBtn = document.getElementById('toggle-bot-config');
  const fieldsEl = document.getElementById('chart-bot-config-fields');
  const jsonEl = document.getElementById('chart-bot-config-json');
  const titleEl = document.getElementById('chart-bot-config-title');
  if (!panel || !toggleBtn || !fieldsEl || !jsonEl) return;

  if (titleEl) titleEl.textContent = bot.name;

  const isH9S = bot.strategy === 'h9s';
  const isB5S = bot.strategy === 'b5s';
  const isBOS = isH9S || isB5S;

  // Build fields: name, webhookKey, tradeRelayUrl, tradeRelayWebhookCode, strategy-specific
  const fields = [
    ['name', 'Bot Name', bot.name, 'text'],
    ['webhookKey', 'Webhook Key', bot.webhookKey, 'text'],
    ['tradeRelayUrl', 'TradeRelay Bot URL', bot.tradeRelayUrl || '', 'text'],
    ['tradeRelayWebhookCode', 'TradeRelay Webhook Code', bot.tradeRelayWebhookCode || '', 'text'],
    ...(isH9S ? [['slippage', 'Slippage %', bot.slippage ?? 0.05, 'number']] : []),
    ...(!isBOS ? [
      ['source1', 'Source 1', bot.source1, 'text'],
      ['source2', 'Source 2', bot.source2, 'text'],
      ['source3', 'Source 3', bot.source3, 'text'],
      ['source4', 'Source 4', bot.source4, 'text'],
    ] : []),
  ];

  fieldsEl.innerHTML = fields.map(([key, label, value, type]) =>
    `<label class="bot-config-field">
      <span>${label}</span>
      <input data-config-key="${key}" type="${type}" value="${value ?? ''}" step="${type === 'number' ? 0.01 : undefined}">
    </label>`
  ).join('');

  // Render config JSON preview
  const renderJson = () => {
    const normalized = buildBotConfigJson(bot);
    if (jsonEl) jsonEl.textContent = JSON.stringify(normalized, null, 2);
  };
  renderJson();

  // Wire up live editing
  fieldsEl.querySelectorAll('input').forEach((input) => {
    const key = input.dataset.configKey;
    const update = () => {
      const v = input.type === 'number' ? Number(input.value) : input.value;
      bot[key] = v;
      renderJson();
      renderHero();
      renderBots();
      renderChartBotTabsOnly();
      if (titleEl && key === 'name') titleEl.textContent = bot.name;
      void saveSettings();
    };
    input.addEventListener('change', update);
    input.addEventListener('input', update);
  });

  // Toggle collapse
  toggleBtn.onclick = () => {
    const collapsed = panel.classList.toggle('is-collapsed');
    toggleBtn.textContent = collapsed ? 'Expand' : 'Collapse';
    toggleBtn.setAttribute('aria-expanded', String(!collapsed));
  };
}

function buildBotConfigJson(bot) {
  if (bot.strategy === 'h9s') {
    return {
      indicatorId: 'H9S', botId: bot.id, symbol: bot.symbol, timeframe: bot.timeframe,
      webhookKey: bot.webhookKey, tradeRelayUrl: bot.tradeRelayUrl || '',
      takeProfitPercent: Number(bot.tp), stopLossPercent: Number(bot.sl),
      swingSize: Number(bot.threshold), bosConfType: bot.bosConfType || 'close',
      tpType: bot.tpType || 'dynamic', slippage: Number(bot.slippage ?? 0.05),
    };
  } else if (bot.strategy === 'b5s') {
    return {
      indicatorId: 'B5S', botId: bot.id, symbol: bot.symbol, timeframe: bot.timeframe,
      webhookKey: bot.webhookKey, tradeRelayUrl: bot.tradeRelayUrl || '',
      takeProfitPercent: Number(bot.tp), stopLossPercent: Number(bot.sl),
      swingSize: Number(bot.threshold), bosConfType: bot.bosConfType || 'close',
      tpType: bot.tpType || 'dynamic', maxTrades: Number(bot.maxTrades ?? 3),
    };
  }
  return {
    indicatorId: 'AD1', botId: bot.id, symbol: bot.symbol, timeframe: bot.timeframe,
    webhookKey: bot.webhookKey, tradeRelayUrl: bot.tradeRelayUrl || '',
    takeProfitPercent: Number(bot.tp), stopLossPercent: Number(bot.sl),
    unusualPercentileThreshold: Number(bot.threshold),
    sourceSymbols: [bot.source1, bot.source2, bot.source3, bot.source4],
  };
}

function renderChartBotTabsOnly() {
  const tabs = document.getElementById('chart-bot-tabs');
  if (!tabs) return;
  const activeBotId = chartState.currentBotId || state.selectedBotId;
  state.bots.forEach((bot) => {
    const btn = tabs.querySelector(`[data-bot-id="${bot.id}"]`);
    if (!btn) return;
    btn.textContent = bot.name;
    btn.classList.toggle('is-live', !!chartState.autoSignalByBot[bot.id]);
    btn.classList.toggle('is-off', !chartState.autoSignalByBot[bot.id]);
  });
}

function setupChartParameterLab(bot) {
  const symbolInput = document.getElementById('chart-param-symbol');
  const timeframeInput = document.getElementById('chart-param-timeframe');
  const botFieldsContainer = document.getElementById('chart-param-bot-fields');
  const applyButton = document.getElementById('chart-apply-params');
  const optimizeButton = document.getElementById('chart-optimize-params');
  const feedback = document.getElementById('chart-param-feedback');
  if (!symbolInput || !timeframeInput || !botFieldsContainer || !applyButton || !optimizeButton || !feedback) return;

  const isH9S = bot.strategy === 'h9s';
  const isB5S = bot.strategy === 'b5s';
  const isBOS = isH9S || isB5S;
  const bosFixed = isBOS && (bot.tpType || 'dynamic') === 'fixed';

  // Build dynamic bot-specific fields
  let fieldsHTML = '';
  fieldsHTML += `<label class="param-field"><span>${isBOS ? 'Swing Size' : 'Threshold'}</span><input id="chart-param-threshold" type="number" step="1" min="1" max="${isBOS ? 500 : 99}" value="${bot.threshold}"></label>`;
  if (isBOS) {
    fieldsHTML += `<label class="param-field"><span>BOS Conf.</span><select id="chart-param-bos-conf"><option value="close"${(bot.bosConfType||'close')==='close'?' selected':''}>close</option><option value="wicks"${(bot.bosConfType||'close')==='wicks'?' selected':''}>wicks</option></select></label>`;
    fieldsHTML += `<label class="param-field"><span>TP Type</span><select id="chart-param-tp-type"><option value="dynamic"${(bot.tpType||'dynamic')==='dynamic'?' selected':''}>dynamic</option><option value="fixed"${(bot.tpType||'dynamic')==='fixed'?' selected':''}>fixed</option></select></label>`;
  }
  const isATRStrat = ['ai1','ai2','ai3','vw1','kc1','dv1','rs1','e3','cv1','ch1','pm1','ob1','fg1','sm1','mn1','st1','sb1'].includes(bot.strategy);
  const tpLabel = isATRStrat ? 'TP ×ATR' : 'TP %';
  const slLabel = isATRStrat ? 'SL ×ATR' : 'SL %';

  if (!isBOS || bosFixed) {
    fieldsHTML += `<label class="param-field"><span>${tpLabel}</span><input id="chart-param-tp" type="number" step="0.1" min="0.1" max="25" value="${bot.tp}"></label>`;
    fieldsHTML += `<label class="param-field"><span>${slLabel}</span><input id="chart-param-sl" type="number" step="0.1" min="0.1" max="40" value="${bot.sl}"></label>`;
  }
  if (isB5S) {
    fieldsHTML += `<label class="param-field"><span>Max Trades</span><input id="chart-param-max-trades" type="number" step="1" min="1" max="10" value="${bot.maxTrades ?? 3}"></label>`;
  }
  botFieldsContainer.innerHTML = fieldsHTML;

  // Re-bind tpType change to re-render fields
  const tpTypeEl = document.getElementById('chart-param-tp-type');
  if (tpTypeEl) {
    tpTypeEl.onchange = () => {
      bot.tpType = tpTypeEl.value;
      setupChartParameterLab(bot);
    };
  }
  const bosConfEl = document.getElementById('chart-param-bos-conf');
  if (bosConfEl) bosConfEl.onchange = () => { bot.bosConfType = bosConfEl.value; };

  // Helpers to read current field values
  const getThreshold = () => Math.max(1, parseLocaleNumber((document.getElementById('chart-param-threshold') || {}).value, bot.threshold));
  const getTp = () => Math.max(0.1, parseLocaleNumber((document.getElementById('chart-param-tp') || {}).value, bot.tp));
  const getSl = () => Math.max(0.1, parseLocaleNumber((document.getElementById('chart-param-sl') || {}).value, bot.sl));
  const getMaxTrades = () => Math.max(1, Math.min(10, parseInt((document.getElementById('chart-param-max-trades') || {}).value || bot.maxTrades || 3, 10)));

  // Convenience refs used by optimizer (need live elements, fetched on demand)
  const tpInput   = { get value() { return String(bot.tp); }, set value(v) { const el = document.getElementById('chart-param-tp'); if (el) el.value = v; } };
  const slInput   = { get value() { return String(bot.sl); }, set value(v) { const el = document.getElementById('chart-param-sl'); if (el) el.value = v; } };
  const thresholdInput = { get value() { return String(bot.threshold); }, set value(v) { const el = document.getElementById('chart-param-threshold'); if (el) el.value = v; } };

  symbolInput.value = String(bot.symbol || '');
  timeframeInput.value = String(bot.timeframe || '5m').toLowerCase();

  timeframeInput.onchange = () => {
    const tf = String(timeframeInput.value || '').trim().toLowerCase();
    if (!tf) return;
    const activeBotId = chartState.currentBotId || state.selectedBotId;
    const activeBot = state.bots.find((b) => b.id === activeBotId) || state.bots[0];
    if (tf === String(activeBot.timeframe).toLowerCase()) return;
    activeBot.timeframe = tf;
    setupTimeframePills(activeBot);
    renderHero(); renderBots(); renderConfigForm(); renderConfigPreview();
    void initChart(activeBot.id);
  };

  applyButton.onclick = () => {
    const nextSymbol = String(symbolInput.value || bot.symbol).trim().toUpperCase();
    const nextTimeframe = String(timeframeInput.value || bot.timeframe).trim();
    const nextTp = getTp();
    const nextSl = getSl();
    const nextThreshold = getThreshold();
    const symbolChanged = nextSymbol && nextSymbol !== bot.symbol;
    const timeframeChanged = nextTimeframe && nextTimeframe !== bot.timeframe;

    if (nextSymbol) bot.symbol = nextSymbol;
    if (nextTimeframe) bot.timeframe = nextTimeframe;
    bot.tp = +nextTp.toFixed(2);
    bot.sl = +nextSl.toFixed(2);
    bot.threshold = Math.round(nextThreshold);
    if (isBOS) {
      const bcEl = document.getElementById('chart-param-bos-conf');
      if (bcEl) bot.bosConfType = bcEl.value;
      const ttEl = document.getElementById('chart-param-tp-type');
      if (ttEl) bot.tpType = ttEl.value;
    }
    if (isB5S) bot.maxTrades = getMaxTrades();

    if (symbolChanged || timeframeChanged) {
      delete chartState.fullHistoryByBot[bot.id];
    }

    feedback.className = 'param-feedback good';
    const applied = isBOS
      ? `${bot.symbol} ${bot.timeframe}, Swing ${bot.threshold}, ${bot.bosConfType}, ${bot.tpType}${isB5S ? `, ${bot.maxTrades}T` : ''}${(bot.tpType==='fixed') ? `, TP ${bot.tp}% SL ${bot.sl}%` : ''}`
      : `${bot.symbol} ${bot.timeframe}, TP ${bot.tp}%, SL ${bot.sl}%, threshold ${bot.threshold}`;
    feedback.textContent = `Applied: ${applied}. Replay + performance updated.`;
    void saveSettings();
    renderHero();
    renderBots();
    renderConfigForm();
    renderConfigPreview();
    void initChart(bot.id);
  };

  optimizeButton.onclick = async () => {
    const progressBar  = document.getElementById('opt-progress-bar');
    const progressFill = document.getElementById('opt-progress-fill');
    const setProgress = (pct) => { if (progressFill) progressFill.style.width = pct + '%'; };
    const startLoading = (msg) => {
      optimizeButton.disabled = true;
      optimizeButton.classList.add('is-optimizing');
      optimizeButton.textContent = msg;
      feedback.className = 'param-feedback loading';
      feedback.textContent = msg;
      if (progressBar) progressBar.style.display = 'block';
      setProgress(0);
    };
    const stopLoading = () => {
      optimizeButton.disabled = false;
      optimizeButton.classList.remove('is-optimizing');
      optimizeButton.textContent = 'AI Optimize';
      if (progressBar) progressBar.style.display = 'none';
      setProgress(0);
    };
    startLoading('Fetching data…');
    // Fetch 4 chunks spread across the past 2 years IN PARALLEL for speed
    const twoYearsMs = 2 * 365 * 24 * 60 * 60 * 1000;
    const sources = [];
    const tryFetch = async (endMs) => {
      try {
        const m = await fetchBinanceKlines(bot, 3000, chartState.marketType, endMs);
        if (m.candles.length >= 100) sources.push({ candles: m.candles, volumes: m.volumes });
      } catch {}
    };
    try {
      const randomEnds = Array.from({ length: 3 }, () => Date.now() - Math.floor(Math.random() * twoYearsMs));
      await Promise.all([
        tryFetch(null),          // most recent chunk always included
        ...randomEnds.map(e => tryFetch(e)),
      ]);
    } catch {
      stopLoading();
      return;
    }
    if (!sources.length) {
      const fb = chartState.data
        ? { candles: chartState.data.candles, volumes: chartState.data.volumes }
        : generateChartBars(bot, Math.max(2000, getDesiredHistoryBars()));
      sources.push(fb);
    }
    const totalBars = sources.reduce((sum, s) => sum + s.candles.length, 0);
    setProgress(15);
    feedback.textContent = `Optimizing across ${sources.length} periods (${totalBars.toLocaleString()} bars)…`;
    optimizeButton.textContent = 'Optimizing…';
    // Yield to paint the progress update before heavy sync work
    await new Promise(r => setTimeout(r, 0));
    const candidates = [];

    if (bot.strategy === 'h9s') {
      const swingCandidates = [5, 10, 15, 20, 25, 30, 50, 75, 100, 150];
      const bosConfCandidates = ['close', 'wicks'];
      const tpTypeCandidates = ['dynamic', 'fixed'];
      const tpCandidatesFixed = [0.6, 0.8, 1.0, 1.2, 1.5, 2.0, 2.5];
      const slCandidatesFixed = [1.0, 1.5, 2.0, 3.0, 4.0, 5.0];
      for (const threshold of swingCandidates) {
        for (const bosConfType of bosConfCandidates) {
          for (const tpType of tpTypeCandidates) {
            const tpVals = tpType === 'dynamic' ? [1.0] : tpCandidatesFixed;
            const slVals = tpType === 'dynamic' ? [1.0] : slCandidatesFixed;
            for (const tp of tpVals) {
              for (const sl of slVals) {
                const testBot = { ...bot, threshold, bosConfType, tpType, tp, sl };
                const avgSummary = averageSummaries(sources.map(s => buildReplayPackageFromCandles(s.candles, s.volumes, testBot).summary));
                const score = scoreOptimizationCandidate(avgSummary);
                candidates.push({ tp, sl, threshold, bosConfType, tpType, summary: avgSummary, score });
              }
            }
          }
        }
      }
    } else if (bot.strategy === 'b5s') {
      const swingCandidates = [5, 10, 15, 20, 25, 30, 50, 75, 100];
      const bosConfCandidates = ['close', 'wicks'];
      const tpTypeCandidates = ['dynamic', 'fixed'];
      const maxTradesCandidates = [1, 2, 3, 5];
      const tpCandidatesFixed = [0.6, 1.0, 1.5, 2.0];
      const slCandidatesFixed = [1.0, 1.5, 2.0, 3.0];
      for (const threshold of swingCandidates) {
        for (const bosConfType of bosConfCandidates) {
          for (const tpType of tpTypeCandidates) {
            for (const maxTrades of maxTradesCandidates) {
              const tpVals = tpType === 'dynamic' ? [1.0] : tpCandidatesFixed;
              const slVals = tpType === 'dynamic' ? [1.0] : slCandidatesFixed;
              for (const tp of tpVals) {
                for (const sl of slVals) {
                  const testBot = { ...bot, threshold, bosConfType, tpType, maxTrades, tp, sl };
                  const avgSummary = averageSummaries(sources.map(s => buildReplayPackageFromCandles(s.candles, s.volumes, testBot).summary));
                  const score = scoreOptimizationCandidate(avgSummary);
                  candidates.push({ tp, sl, threshold, bosConfType, tpType, maxTrades, summary: avgSummary, score });
                }
              }
            }
          }
        }
      }
    } else if (bot.strategy === 'ai1') {
      // EMA+RSI: optimize ATR-multiplier TP/SL and RSI period
      const tpCandidates = [1.5, 2.0, 2.5, 3.0, 3.5, 4.0];
      const slCandidates = [0.7, 0.9, 1.1, 1.4, 1.8, 2.2];
      const thCandidates = [9, 11, 14, 18, 21]; // RSI period
      for (const tp of tpCandidates) {
        for (const sl of slCandidates) {
          for (const threshold of thCandidates) {
            const testBot = { ...bot, tp, sl, threshold };
            const avgSummary = averageSummaries(sources.map(s => buildReplayPackageFromCandles(s.candles, s.volumes, testBot).summary));
            const score = scoreOptimizationCandidate(avgSummary);
            candidates.push({ tp, sl, threshold, summary: avgSummary, score });
          }
        }
      }
    } else if (bot.strategy === 'ai2') {
      // BB Squeeze: optimize ATR-multiplier TP/SL and squeeze percentile
      const tpCandidates = [1.5, 2.0, 2.5, 3.0, 3.5];
      const slCandidates = [0.6, 0.8, 1.0, 1.3, 1.7];
      const thCandidates = [10, 15, 20, 25, 30, 40]; // squeeze percentile threshold
      for (const tp of tpCandidates) {
        for (const sl of slCandidates) {
          for (const threshold of thCandidates) {
            const testBot = { ...bot, tp, sl, threshold };
            const avgSummary = averageSummaries(sources.map(s => buildReplayPackageFromCandles(s.candles, s.volumes, testBot).summary));
            const score = scoreOptimizationCandidate(avgSummary);
            candidates.push({ tp, sl, threshold, summary: avgSummary, score });
          }
        }
      }
    } else if (bot.strategy === 'ai3') {
      // MACD+Stoch: optimize ATR-multiplier TP/SL and Stochastic period
      const tpCandidates = [1.5, 2.0, 2.5, 3.0, 4.0, 5.0];
      const slCandidates = [0.8, 1.0, 1.3, 1.7, 2.2];
      const thCandidates = [9, 11, 14, 18, 21]; // Stochastic K period
      for (const tp of tpCandidates) {
        for (const sl of slCandidates) {
          for (const threshold of thCandidates) {
            const testBot = { ...bot, tp, sl, threshold };
            const avgSummary = averageSummaries(sources.map(s => buildReplayPackageFromCandles(s.candles, s.volumes, testBot).summary));
            const score = scoreOptimizationCandidate(avgSummary);
            candidates.push({ tp, sl, threshold, summary: avgSummary, score });
          }
        }
      }
    } else if (bot.strategy === 'vw1') {
      // VWAP reversion: TP/SL multipliers + deviation percentile trigger
      const tpCandidates = [1.0, 1.4, 1.8, 2.2, 2.8];
      const slCandidates = [0.5, 0.7, 0.9, 1.2, 1.6];
      const thCandidates = [10, 15, 20, 25, 30]; // deviation percentile
      for (const tp of tpCandidates) {
        for (const sl of slCandidates) {
          for (const threshold of thCandidates) {
            const testBot = { ...bot, tp, sl, threshold };
            const avgSummary = averageSummaries(sources.map(s => buildReplayPackageFromCandles(s.candles, s.volumes, testBot).summary));
            const score = scoreOptimizationCandidate(avgSummary);
            candidates.push({ tp, sl, threshold, summary: avgSummary, score });
          }
        }
      }
    } else if (bot.strategy === 'kc1') {
      // Keltner breakout: TP/SL multipliers + EMA period for channel centre
      const tpCandidates = [1.5, 2.0, 2.5, 3.0, 3.5];
      const slCandidates = [0.7, 0.9, 1.1, 1.4, 1.8];
      const thCandidates = [10, 14, 20, 30, 50]; // EMA period
      for (const tp of tpCandidates) {
        for (const sl of slCandidates) {
          for (const threshold of thCandidates) {
            const testBot = { ...bot, tp, sl, threshold };
            const avgSummary = averageSummaries(sources.map(s => buildReplayPackageFromCandles(s.candles, s.volumes, testBot).summary));
            const score = scoreOptimizationCandidate(avgSummary);
            candidates.push({ tp, sl, threshold, summary: avgSummary, score });
          }
        }
      }
    } else if (bot.strategy === 'dv1') {
      // Donchian velocity: TP/SL multipliers + Donchian period
      const tpCandidates = [1.5, 2.0, 2.5, 3.0, 4.0];
      const slCandidates = [0.7, 0.9, 1.1, 1.5, 2.0];
      const thCandidates = [10, 15, 20, 30, 50]; // Donchian period
      for (const tp of tpCandidates) {
        for (const sl of slCandidates) {
          for (const threshold of thCandidates) {
            const testBot = { ...bot, tp, sl, threshold };
            const avgSummary = averageSummaries(sources.map(s => buildReplayPackageFromCandles(s.candles, s.volumes, testBot).summary));
            const score = scoreOptimizationCandidate(avgSummary);
            candidates.push({ tp, sl, threshold, summary: avgSummary, score });
          }
        }
      }
    } else if (bot.strategy === 'rs1') {
      // ROC divergence: TP/SL multipliers + ROC period
      const tpCandidates = [1.5, 2.0, 2.5, 3.0, 4.0];
      const slCandidates = [0.8, 1.0, 1.3, 1.7, 2.2];
      const thCandidates = [7, 10, 14, 18, 21]; // ROC period
      for (const tp of tpCandidates) {
        for (const sl of slCandidates) {
          for (const threshold of thCandidates) {
            const testBot = { ...bot, tp, sl, threshold };
            const avgSummary = averageSummaries(sources.map(s => buildReplayPackageFromCandles(s.candles, s.volumes, testBot).summary));
            const score = scoreOptimizationCandidate(avgSummary);
            candidates.push({ tp, sl, threshold, summary: avgSummary, score });
          }
        }
      }
    } else if (bot.strategy === 'e3') {
      // Range breakout: TP/SL multipliers + range detection period
      const tpCandidates = [1.5, 2.0, 2.5, 3.0, 3.5];
      const slCandidates = [0.6, 0.8, 1.0, 1.3, 1.7];
      const thCandidates = [10, 15, 20, 30, 40]; // range period
      for (const tp of tpCandidates) {
        for (const sl of slCandidates) {
          for (const threshold of thCandidates) {
            const testBot = { ...bot, tp, sl, threshold };
            const avgSummary = averageSummaries(sources.map(s => buildReplayPackageFromCandles(s.candles, s.volumes, testBot).summary));
            const score = scoreOptimizationCandidate(avgSummary);
            candidates.push({ tp, sl, threshold, summary: avgSummary, score });
          }
        }
      }
    } else if (bot.strategy === 'cv1') {
      // CVD trend: TP/SL multipliers + CVD rolling window
      const tpCandidates = [1.5, 2.0, 2.5, 3.0, 4.0];
      const slCandidates = [0.7, 1.0, 1.2, 1.5, 2.0];
      const thCandidates = [10, 15, 20, 30, 50]; // CVD window
      for (const tp of tpCandidates) {
        for (const sl of slCandidates) {
          for (const threshold of thCandidates) {
            const testBot = { ...bot, tp, sl, threshold };
            const avgSummary = averageSummaries(sources.map(s => buildReplayPackageFromCandles(s.candles, s.volumes, testBot).summary));
            const score = scoreOptimizationCandidate(avgSummary);
            candidates.push({ tp, sl, threshold, summary: avgSummary, score });
          }
        }
      }
    } else if (bot.strategy === 'ch1') {
      // CHoCH structure: TP/SL multipliers + swing detection half-window
      const tpCandidates = [2.0, 2.5, 3.0, 4.0, 5.0];
      const slCandidates = [0.8, 1.0, 1.5, 2.0, 2.5];
      const thCandidates = [5, 7, 10, 14, 20]; // swing half-window
      for (const tp of tpCandidates) {
        for (const sl of slCandidates) {
          for (const threshold of thCandidates) {
            const testBot = { ...bot, tp, sl, threshold };
            const avgSummary = averageSummaries(sources.map(s => buildReplayPackageFromCandles(s.candles, s.volumes, testBot).summary));
            const score = scoreOptimizationCandidate(avgSummary);
            candidates.push({ tp, sl, threshold, summary: avgSummary, score });
          }
        }
      }
    } else if (bot.strategy === 'pm1') {
      // RSI Pivot Momentum: TP/SL ATR multipliers + RSI period
      const tpCandidates = [1.5, 2.0, 2.5, 3.0, 3.5];
      const slCandidates = [0.7, 0.9, 1.1, 1.4, 1.8];
      const thCandidates = [9, 11, 14, 18, 21]; // RSI period
      for (const tp of tpCandidates) {
        for (const sl of slCandidates) {
          for (const threshold of thCandidates) {
            const testBot = { ...bot, tp, sl, threshold };
            const avgSummary = averageSummaries(sources.map(s => buildReplayPackageFromCandles(s.candles, s.volumes, testBot).summary));
            const score = scoreOptimizationCandidate(avgSummary);
            candidates.push({ tp, sl, threshold, summary: avgSummary, score });
          }
        }
      }
    } else if (bot.strategy === 'ob1') {
      // Order Block Retest: TP/SL ATR multipliers + ZigZag half-window
      const tpCandidates = [2.0, 2.5, 3.0, 4.0, 5.0];
      const slCandidates = [0.8, 1.0, 1.3, 1.7, 2.2];
      const thCandidates = [5, 7, 10, 14, 20]; // ZigZag half-window
      for (const tp of tpCandidates) {
        for (const sl of slCandidates) {
          for (const threshold of thCandidates) {
            const testBot = { ...bot, tp, sl, threshold };
            const avgSummary = averageSummaries(sources.map(s => buildReplayPackageFromCandles(s.candles, s.volumes, testBot).summary));
            const score = scoreOptimizationCandidate(avgSummary);
            candidates.push({ tp, sl, threshold, summary: avgSummary, score });
          }
        }
      }
    } else if (bot.strategy === 'fg1') {
      // CVD + FVG Retracement: TP/SL ATR multipliers + CVD observation window
      const tpCandidates = [1.5, 2.0, 2.5, 3.0, 4.0];
      const slCandidates = [0.7, 1.0, 1.2, 1.5, 2.0];
      const thCandidates = [10, 15, 20, 30, 50]; // CVD observation window
      for (const tp of tpCandidates) {
        for (const sl of slCandidates) {
          for (const threshold of thCandidates) {
            const testBot = { ...bot, tp, sl, threshold };
            const avgSummary = averageSummaries(sources.map(s => buildReplayPackageFromCandles(s.candles, s.volumes, testBot).summary));
            const score = scoreOptimizationCandidate(avgSummary);
            candidates.push({ tp, sl, threshold, summary: avgSummary, score });
          }
        }
      }
    } else if (bot.strategy === 'sm1' || bot.strategy === 'mn1' || bot.strategy === 'sb1') {
      // Smart Money BOS family: TP/SL dist multipliers + swing pivot half-window
      const tpCandidates = [1.5, 2.0, 2.5, 3.0, 4.0];
      const slCandidates = [0.6, 0.8, 1.0, 1.3, 1.7];
      const thCandidates = [10, 15, 20, 25, 30]; // swing pivot half-window
      for (const tp of tpCandidates) {
        for (const sl of slCandidates) {
          for (const threshold of thCandidates) {
            const testBot = { ...bot, tp, sl, threshold };
            const avgSummary = averageSummaries(sources.map(s => buildReplayPackageFromCandles(s.candles, s.volumes, testBot).summary));
            const score = scoreOptimizationCandidate(avgSummary);
            candidates.push({ tp, sl, threshold, summary: avgSummary, score });
          }
        }
      }
    } else if (bot.strategy === 'st1') {
      // SuperTrend Flip: RR ratio (tp) + ATR factor (sl) + ST ATR period (threshold)
      const tpCandidates = [1.5, 2.0, 2.5, 3.0, 4.0];
      const slCandidates = [0.8, 1.1, 1.4, 1.8, 2.2];
      const thCandidates = [7, 10, 14, 18, 21]; // SuperTrend ATR period
      for (const tp of tpCandidates) {
        for (const sl of slCandidates) {
          for (const threshold of thCandidates) {
            const testBot = { ...bot, tp, sl, threshold };
            const avgSummary = averageSummaries(sources.map(s => buildReplayPackageFromCandles(s.candles, s.volumes, testBot).summary));
            const score = scoreOptimizationCandidate(avgSummary);
            candidates.push({ tp, sl, threshold, summary: avgSummary, score });
          }
        }
      }
    } else {
      const tpCandidates = [0.6, 0.8, 1.0, 1.2, 1.5, 1.8, 2.2, 3.0];
      const slCandidates = [1.5, 2.0, 3.0, 4.0, 5.0, 6.0, 7.5, 9.0, 12.0];
      const thCandidates = [65, 70, 75, 80, 85, 88, 90, 92, 95, 97];
      for (const tp of tpCandidates) {
        for (const sl of slCandidates) {
          for (const threshold of thCandidates) {
            const testBot = { ...bot, tp, sl, threshold };
            const avgSummary = averageSummaries(sources.map(s => buildReplayPackageFromCandles(s.candles, s.volumes, testBot).summary));
            const score = scoreOptimizationCandidate(avgSummary);
            candidates.push({ tp, sl, threshold, summary: avgSummary, score });
          }
        }
      }
    }

    candidates.sort((a, b) => b.score - a.score);

    // ── Genetic refinement pass ──────────────────────────────────────────────
    setProgress(72);
    feedback.textContent = 'Refining top candidates…';
    optimizeButton.textContent = 'Refining…';
    await new Promise(r => setTimeout(r, 0));
    const tpStep   = bot.strategy === 'h9s' || bot.strategy === 'b5s' ? 0.1 : 0.2;
    const slStep   = bot.strategy === 'h9s' || bot.strategy === 'b5s' ? 0.25 : 0.5;
    const thStep   = (bot.strategy === 'h9s' || bot.strategy === 'b5s') ? 5
                   : (bot.strategy === 'cv1' || bot.strategy === 'fg1') ? 5
                   : 2;
    const TOP_N = Math.min(5, candidates.length);
    for (let ci = 0; ci < TOP_N; ci++) {
      const seed = candidates[ci];
      const mutations = [];
      const tpRange  = [seed.tp - tpStep, seed.tp, seed.tp + tpStep].filter(v => v > 0);
      const slRange  = [seed.sl - slStep, seed.sl, seed.sl + slStep].filter(v => v > 0);
      const thRange  = [seed.threshold - thStep, seed.threshold, seed.threshold + thStep].filter(v => v > 0);
      for (const tp of tpRange) {
        for (const sl of slRange) {
          for (const th of thRange) {
            if (tp === seed.tp && sl === seed.sl && th === seed.threshold) continue; // skip exact duplicate
            const testBot = {
              ...bot, tp: +tp.toFixed(3), sl: +sl.toFixed(3), threshold: +th.toFixed(1),
              ...(seed.bosConfType !== undefined && { bosConfType: seed.bosConfType }),
              ...(seed.tpType      !== undefined && { tpType: seed.tpType }),
              ...(seed.maxTrades   !== undefined && { maxTrades: seed.maxTrades }),
            };
            const avgSummary = averageSummaries(sources.map(s => buildReplayPackageFromCandles(s.candles, s.volumes, testBot).summary));
            const score = scoreOptimizationCandidate(avgSummary);
            mutations.push({ ...seed, tp: testBot.tp, sl: testBot.sl, threshold: testBot.threshold, summary: avgSummary, score });
          }
        }
      }
      candidates.push(...mutations);
    }
    candidates.sort((a, b) => b.score - a.score);
    // ────────────────────────────────────────────────────────────────────────
    setProgress(100);
    await new Promise(r => setTimeout(r, 120)); // let the bar flash to 100% before hiding
    stopLoading();

    const best = candidates[0];

    if (!best) {
      stopLoading();
      feedback.className = 'param-feedback warn';
      feedback.textContent = 'AI optimize could not evaluate candidate sets.';
      renderOptimizerResults([], bot, tpInput, slInput, thresholdInput, feedback, sources[0]);
      return;
    }

    bot.tp = best.tp;
    bot.sl = best.sl;
    bot.threshold = best.threshold;
    if (bot.strategy === 'h9s' || bot.strategy === 'b5s') {
      bot.bosConfType = best.bosConfType;
      bot.tpType = best.tpType;
    }
    if (bot.strategy === 'b5s') {
      bot.maxTrades = best.maxTrades ?? 3;
    }
    bot.winRate  = best.summary.winRate;
    bot.netPl    = best.summary.netPl;
    bot.drawdown = best.summary.maxDrawdown;
    bot.trades   = best.summary.trades;
    tpInput.value = String(best.tp);
    slInput.value = String(best.sl);
    thresholdInput.value = String(best.threshold);
    const isBOSBest = bot.strategy === 'h9s' || bot.strategy === 'b5s';
    const isATRBest = ['ai1','ai2','ai3','vw1','kc1','dv1','rs1','e3','cv1','ch1','pm1','ob1','fg1','sm1','mn1','st1','sb1'].includes(bot.strategy);
    const atrThLblB = bot.strategy === 'ai1' ? 'RSI' : bot.strategy === 'ai2' ? 'Squeeze%' : bot.strategy === 'ai3' ? 'Stoch' : bot.strategy === 'vw1' ? 'Dev%' : bot.strategy === 'kc1' ? 'EMA' : bot.strategy === 'dv1' ? 'DC' : bot.strategy === 'rs1' ? 'ROC' : bot.strategy === 'e3' ? 'RangePd' : bot.strategy === 'cv1' ? 'CVD Win' : bot.strategy === 'ch1' ? 'Swing' : bot.strategy === 'pm1' ? 'RSI Pd' : bot.strategy === 'ob1' ? 'ZigLen' : bot.strategy === 'fg1' ? 'CVD Len' : bot.strategy === 'sm1' ? 'Swing' : bot.strategy === 'mn1' ? 'Swing' : bot.strategy === 'st1' ? 'ST Pd' : bot.strategy === 'sb1' ? 'Swing' : 'Th';
    const bestLabel = isBOSBest
      ? `Swing ${best.threshold} / ${best.bosConfType} / ${best.tpType}${bot.strategy === 'b5s' ? ` / ${best.maxTrades ?? 3}T` : ''}`
      : isATRBest
      ? `TP ${best.tp}× / SL ${best.sl}× / ${atrThLblB} ${best.threshold}`
      : `TP ${best.tp}% / SL ${best.sl}% / Th ${best.threshold}`;
    feedback.className = 'param-feedback good';
    const sortinoBest = (best.summary.sortino ?? 0).toFixed(2);
    const expectBest  = (best.summary.expectancy ?? 0).toFixed(2);
    feedback.textContent = `AI best: ${bestLabel} → ${formatPercent(best.summary.netPl)} net, ${best.summary.maxDrawdown.toFixed(2)}% DD, ${best.summary.winRate.toFixed(2)}% WR, Sortino ${sortinoBest}, Edge ${expectBest}%`;
    applyParamsToChart(bot);
    void saveSettings();
    renderOptimizerResults(candidates, bot, tpInput, slInput, thresholdInput, feedback, sources[0]);
    renderHero();
    renderBots();
    renderConfigForm();
    renderConfigPreview();
    void initChart(bot.id);
  };
}

function stopLive() {
  if (chartState.liveTimerId) {
    clearInterval(chartState.liveTimerId);
    chartState.liveTimerId = null;
  }
}

function getSelectedBotForChart() {
  return state.bots.find((b) => b.id === chartState.currentBotId) || state.bots[0];
}

async function fireNewLiveSignals(bot) {
  if (!chartState.autoSignalByBot[bot.id]) return;
  if (!bot.tradeRelayUrl) return;
  const signals = chartState.replaySignals || [];
  // lastFiredByBot is set to Date.now()/1000 at arm-time, so we only see signals
  // that appeared AFTER the toggle was switched on — no historical re-fires.
  const lastFired = chartState.lastFiredByBot[bot.id] ?? Math.floor(Date.now() / 1000);
  const newSignals = signals.filter((s) => s.time > lastFired);
  for (const signal of newSignals) {
    // AI confidence gate — check before firing
    if (aiGateSettings.enabled && aiGateSettings.apiKey) {
      const confidence = await checkAiConfidence(bot, signal);
      const statusEl = document.getElementById('ai-gate-status');
      if (confidence === null) {
        if (statusEl) statusEl.textContent = 'Gate error — signal allowed through';
        if (statusEl) statusEl.style.color = '#f7bc52';
      } else if (confidence < aiGateSettings.threshold) {
        chartState.lastFiredByBot[bot.id] = signal.time;
        if (statusEl) { statusEl.textContent = `Blocked: ${signal.event} (${confidence}% < ${aiGateSettings.threshold}%)`; statusEl.style.color = '#ff6d6d'; }
        showSignalToast(`🤖 AI blocked ${signal.event} — confidence ${confidence}% (threshold ${aiGateSettings.threshold}%)`, 'warn');
        continue;
      } else {
        if (statusEl) { statusEl.textContent = `Allowed: ${signal.event} (${confidence}%)`; statusEl.style.color = '#2ddb75'; }
      }
    }
    let ok = false;
    try {
      const res = await sendTradeRelaySignal(bot.tradeRelayUrl, signal.code);
      ok = res.ok;
      const status = ok ? 'sent' : 'failed';
      void logSignalToSupabase(bot, signal.code, signal.event, status);
      if (ok) {
        showSignalToast(`⚡ ${signal.event} fired → TradeRelay`, 'ok');
      } else {
        showSignalToast(`✗ ${signal.event} rejected (${res.status})`, 'err');
      }
    } catch (e) {
      void logSignalToSupabase(bot, signal.code, signal.event, 'error');
      showSignalToast(`✗ ${signal.event} network error`, 'err');
    }
    // Always advance cursor so next poll doesn't retry failed signals
    chartState.lastFiredByBot[bot.id] = signal.time;
  }
}

async function checkAiConfidence(bot, signal) {
  try {
    const candles = (chartState.data?.candles || []).slice(-20);
    if (!candles.length) return null;
    const candleSummary = candles.map(c =>
      `O:${c.open.toFixed(2)} H:${c.high.toFixed(2)} L:${c.low.toFixed(2)} C:${c.close.toFixed(2)}`
    ).join('\n');
    const prompt =
      `You are a professional crypto trader. Rate this ${signal.direction} trade setup on ${bot.symbol} (${bot.timeframe}) from 0 to 100 based ONLY on the last 20 candles below.\n` +
      `Signal: ${signal.event}\nStrategy: ${bot.strategy || 'AD1'}\n\nLast 20 candles (oldest first):\n${candleSummary}\n\n` +
      `Reply with ONLY a JSON object: {"confidence": <integer 0-100>, "reason": "<one sentence>"}`;
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${aiGateSettings.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 80,
        temperature: 0.2,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]);
    return typeof parsed.confidence === 'number' ? Math.round(parsed.confidence) : null;
  } catch {
    return null;
  }
}

function applyHistoryOrLiveFrame() {
  if (!chartState.data || !chartState.candleSeries || !chartState.volumeSeries || !chartState.smaSeries) return;
  const candles = chartState.data.candles;
  const volumes = chartState.data.volumes;
  const currentTime = candles[candles.length - 1]?.time;
  chartState.replayIndex = Math.max(candles.length - 1, 0);

  chartState.candleSeries.applyOptions({ visible: chartState.showCandles });
  chartState.volumeSeries.applyOptions({ visible: chartState.showVolume });
  chartState.smaSeries.applyOptions({ visible: chartState.showSma });

  chartState.candleSeries.setData(candles);
  chartState.volumeSeries.setData(volumes);
  chartState.smaSeries.setData(chartState.showSma ? chartState.data.smaData : []);
  chartState.candleSeries.setMarkers(chartState.showMarkers ? chartState.data.markers : []);
  applyLevelVisibility();

  const activeBot = state.bots.find((b) => b.id === chartState.currentBotId) || state.bots[0];
  const progress = document.getElementById('replay-progress');
  if (progress) {
    const timeframeMin = timeframeToMinutes(activeBot?.timeframe || '5m');
    const approxDays = (candles.length * timeframeMin) / (60 * 24);
    const windowText = approxDays >= 1 ? `${approxDays.toFixed(1)}d` : `${(approxDays * 24).toFixed(1)}h`;
    progress.textContent = chartState.mode === 'live'
      ? `Live · ${candles.length} bars · ${windowText}`
      : `History · ${candles.length} bars · ${windowText}`;
  }

  renderChartTradeLog(chartState.data.tradeLog, activeBot);
  renderLiveEquity(currentTime);
  renderReplaySignalFeed(currentTime);
}

function startLive(bot) {
  stopLive();
  chartState.liveTimerId = setInterval(async () => {
    if (chartState.mode !== 'live' || chartState.currentBotId !== bot.id) return;
    try {
      const previousRange = chartState.chart?.timeScale()?.getVisibleLogicalRange?.() || null;
      const market = await fetchBinanceKlines(bot, 3000, chartState.marketType);
      const merged = mergeMarketData(
        chartState.data?.candles || [],
        chartState.data?.volumes || [],
        market.candles,
        market.volumes,
        50000
      );
      const updated = buildReplayPackageFromCandles(merged.candles, merged.volumes, bot);
      chartState.sourceLabel = market.source;
      chartState.marketType = market.marketType || chartState.marketType;
      chartState.data = { ...updated, smaData: buildSma(updated.candles, 20) };
      chartState.replaySignals = updated.replaySignals;
      chartState.replayEquityTimeline = updated.replayEquityTimeline;
      renderChartControls(bot, updated.summary);
      applyHistoryOrLiveFrame();
      await fireNewLiveSignals(bot);
      if (chartState.chart) {
        if (chartState.followLive) {
          chartState.chart.timeScale().scrollToRealTime();
        } else if (previousRange) {
          chartState.chart.timeScale().setVisibleLogicalRange(previousRange);
        }
      }
    } catch {
      // Keep current data if a live poll fails.
    }
  }, 7000);
}

function tickReplay() {
  if (!chartState.isPlaying || !chartState.data) return;
  const frameMs = Math.max(50, Math.round(420 / chartState.speed));
  chartState.timerId = setTimeout(() => {
    if (!chartState.data) return;
    const nextIndex = chartState.replayIndex + 1;
    if (nextIndex >= chartState.data.candles.length) {
      stopReplay();
      return;
    }
    applyReplayFrame(nextIndex);
    tickReplay();
  }, frameMs);
}

function stopReplay() {
  if (chartState.timerId) {
    clearTimeout(chartState.timerId);
    chartState.timerId = null;
  }
  chartState.isPlaying = false;
}

function applyReplayFrame(index) {
  if (!chartState.data || !chartState.candleSeries || !chartState.volumeSeries || !chartState.smaSeries) return;
  const safeIndex = Math.max(0, Math.min(index, chartState.data.candles.length - 1));
  chartState.replayIndex = safeIndex;

  const candles = chartState.data.candles.slice(0, safeIndex + 1);
  const volumes = chartState.data.volumes.slice(0, safeIndex + 1);
  const currentTime = candles[candles.length - 1]?.time;

  chartState.candleSeries.applyOptions({ visible: chartState.showCandles });
  chartState.volumeSeries.applyOptions({ visible: chartState.showVolume });
  chartState.smaSeries.applyOptions({ visible: chartState.showSma });

  chartState.candleSeries.setData(candles);
  chartState.volumeSeries.setData(volumes);
  chartState.smaSeries.setData(chartState.data.smaData.filter((point) => point.time <= currentTime));
  chartState.candleSeries.setMarkers(
    chartState.showMarkers ? chartState.data.markers.filter((marker) => marker.time <= currentTime) : []
  );
  applyLevelVisibility();

  const progress = document.getElementById('replay-progress');
  if (progress) progress.textContent = `Bar ${safeIndex + 1} / ${chartState.data.candles.length}`;

  const activeBot = state.bots.find((b) => b.id === chartState.currentBotId) || state.bots[0];
  renderChartTradeLog(chartState.data.tradeLog, activeBot);
  renderLiveEquity(currentTime);
  renderReplaySignalFeed(currentTime);
}

function renderLiveEquity(currentTime) {
  const svg = document.getElementById('live-equity-svg');
  const stats = document.getElementById('live-equity-stats');
  if (!svg || !stats || !chartState.replayEquityTimeline.length) return;

  const points = chartState.replayEquityTimeline.filter((p) => p.time <= currentTime);
  if (!points.length) return;

  const width = 620;
  const height = 64;
  const padding = 6;
  const minY = Math.min(...points.map((p) => p.equity));
  const maxY = Math.max(...points.map((p) => p.equity));
  const spanY = Math.max(maxY - minY, 0.0001);
  let peak = points[0].equity;
  let maxDd = 0;
  let maxDdIndex = 0;
  const ddPoints = [];

  for (let i = 0; i < points.length; i++) {
    peak = Math.max(peak, points[i].equity);
    const dd = peak > 0 ? ((peak - points[i].equity) / peak) * 100 : 0;
    ddPoints.push(dd);
    if (dd > maxDd) {
      maxDd = dd;
      maxDdIndex = i;
    }
  }

  const maxDdScale = Math.max(...ddPoints, 0.0001);

  const path = points
    .map((p, i) => {
      const x = padding + (i / Math.max(points.length - 1, 1)) * (width - padding * 2);
      const y = height - padding - ((p.equity - minY) / spanY) * (height - padding * 2);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');

  const ddPath = points
    .map((_, i) => {
      const x = padding + (i / Math.max(points.length - 1, 1)) * (width - padding * 2);
      const y = height - padding - (ddPoints[i] / maxDdScale) * (height - padding * 2);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');

  const markerX = padding + (maxDdIndex / Math.max(points.length - 1, 1)) * (width - padding * 2);
  const markerY = height - padding - (ddPoints[maxDdIndex] / maxDdScale) * (height - padding * 2);

  const areaPath = `${path} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`;
  svg.innerHTML =
    `<path class="equity-area" d="${areaPath}"></path>` +
    `<path class="equity-line" d="${path}"></path>` +
    `<path class="drawdown-line" d="${ddPath}"></path>` +
    `<circle class="drawdown-marker" cx="${markerX.toFixed(2)}" cy="${markerY.toFixed(2)}" r="3.5"></circle>`;

  const currentEquity = points[points.length - 1].equity;
  const netPl = (currentEquity - 100) / 100 * 100;
  const closedTrades = chartState.data.tradeLog.filter((trade) => trade.exitTime !== null && trade.exitTime <= currentTime && trade.pl !== null);
  const wins = closedTrades.filter((trade) => trade.pl > 0).length;

  stats.innerHTML = `
    <article class="live-stat">
      <span class="mini-label">Equity</span>
      <strong class="${metricClass(netPl)}">${currentEquity.toFixed(2)}</strong>
    </article>
  `;
}

function renderReplaySignalFeed(currentTime) {
  const feed = document.getElementById('replay-signal-feed');
  if (!feed) return;

  const visible = chartState.replaySignals.filter((signal) => signal.time <= currentTime).slice(-12).reverse();
  if (!visible.length) {
    feed.innerHTML = '<div class="replay-signal-empty">No signals yet in this replay window.</div>';
    return;
  }

  feed.innerHTML = visible
    .map(
      (signal) => `
        <article class="replay-signal-item ${signal.kind === 'entry' ? 'is-entry' : 'is-exit'}">
          <div class="replay-signal-top">
            <strong>${signal.event}</strong>
            <span class="replay-signal-time">${formatReplayTime(signal.time)}</span>
          </div>
          <div class="replay-signal-code">${signal.code}</div>
        </article>
      `
    )
    .join('');
}

function renderAll() {
  renderBots();
  renderConfigForm();
  renderConfigPreview();
  refreshTradeRelayPanel();
}

// ── Supabase ──────────────────────────────────────────────────────────────────

const SUPABASE_URL = 'https://ohguikmqxuhujqrcnuqi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_4mpeCY3NhZ4Y3VT26Ar7uA_w16L8MEO';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const STORAGE_KEY = 'signal-engine-bots-v1'; // offline fallback
const SIM_SETTINGS_KEY = 'signal-engine-sim-v1';
const AI_GATE_KEY = 'signal-engine-ai-gate-v1';

// Global simulation cost settings (account-level, not per-bot)
const simSettings = {
  commission: 0.05,  // % per side (round-trip = 2×)
  slippage:   0.05,  // % per side (round-trip = 2×)
};

// AI confidence gate settings
const aiGateSettings = {
  enabled:   false,
  apiKey:    '',
  threshold: 65,   // 0–100 minimum confidence to allow signal
};

function saveSimSettings() {
  try { localStorage.setItem(SIM_SETTINGS_KEY, JSON.stringify(simSettings)); } catch { /* ignore */ }
}

function loadSimSettings() {
  try {
    const raw = localStorage.getItem(SIM_SETTINGS_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (typeof parsed.commission === 'number') simSettings.commission = parsed.commission;
    if (typeof parsed.slippage   === 'number') simSettings.slippage   = parsed.slippage;
  } catch { /* ignore */ }
}

function saveAiGateSettings() {
  try { localStorage.setItem(AI_GATE_KEY, JSON.stringify(aiGateSettings)); } catch { /* ignore */ }
}

function loadAiGateSettings() {
  try {
    const raw = localStorage.getItem(AI_GATE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (typeof parsed.enabled   === 'boolean') aiGateSettings.enabled   = parsed.enabled;
    if (typeof parsed.apiKey    === 'string')  aiGateSettings.apiKey    = parsed.apiKey;
    if (typeof parsed.threshold === 'number')  aiGateSettings.threshold = parsed.threshold;
  } catch { /* ignore */ }
}

function botToRow(bot) {
  return {
    id: bot.id,
    config: {
      id: bot.id,
      name: bot.name, symbol: bot.symbol, timeframe: bot.timeframe,
      strategy: bot.strategy || 'ad1',
      webhookKey: bot.webhookKey, tradeRelayUrl: bot.tradeRelayUrl,
      tradeRelayWebhookCode: bot.tradeRelayWebhookCode,
      tp: bot.tp, sl: bot.sl, threshold: bot.threshold,
      source1: bot.source1, source2: bot.source2,
      source3: bot.source3, source4: bot.source4,
      bosConfType: bot.bosConfType, tpType: bot.tpType,
      slippage: bot.slippage, maxTrades: bot.maxTrades,
      autoSignal: !!bot.autoSignal,
      winRate: bot.winRate, netPl: bot.netPl, drawdown: bot.drawdown, trades: bot.trades,
    },
  };
}

function applyBotRow(row) {
  const bot = state.bots.find((b) => b.id === row.id);
  if (!bot || !row.config) return;
  const editable = ['name', 'symbol', 'timeframe', 'strategy', 'webhookKey', 'tradeRelayUrl',
    'tradeRelayWebhookCode', 'tp', 'sl', 'threshold',
    'source1', 'source2', 'source3', 'source4',
    'bosConfType', 'tpType', 'slippage', 'maxTrades',
    'autoSignal', 'winRate', 'netPl', 'drawdown', 'trades'];
  editable.forEach((key) => { if (row.config[key] !== undefined) bot[key] = row.config[key]; });
}

async function saveSettings() {
  const rows = state.bots.map(botToRow);
  const { error } = await db.from('bots').upsert(rows);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(rows)); } catch { /* ignore */ }
  return !error;
}

async function loadSavedSettings() {
  try {
    const { data, error } = await db.from('bots').select('id, config');
    if (!error && Array.isArray(data) && data.length) {
      data.forEach(applyBotRow);
      return;
    }
  } catch { /* offline — fall through */ }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (Array.isArray(saved)) saved.forEach(applyBotRow);
  } catch { /* ignore */ }
}

async function logSignalToSupabase(bot, signalCode, event, status = 'sent') {
  try {
    await db.from('signal_log').insert({
      bot_id: bot.id, bot_name: bot.name,
      symbol: bot.symbol, event, message: signalCode, status,
    });
    renderSignalTable(); // refresh log table after each signal
  } catch { /* non-blocking */ }
}

function setupAiGateSettings() {
  const enabledInput   = document.getElementById('ai-gate-enabled');
  const keyInput       = document.getElementById('ai-gate-key');
  const thresholdInput = document.getElementById('ai-gate-threshold');
  const statusEl       = document.getElementById('ai-gate-status');
  if (!enabledInput || !keyInput || !thresholdInput) return;

  enabledInput.checked   = aiGateSettings.enabled;
  keyInput.value         = aiGateSettings.apiKey;
  thresholdInput.value   = String(aiGateSettings.threshold);
  if (statusEl) statusEl.textContent = aiGateSettings.enabled ? 'Enabled — awaiting signals' : 'Disabled';

  enabledInput.addEventListener('change', () => {
    aiGateSettings.enabled = enabledInput.checked;
    if (statusEl) statusEl.textContent = aiGateSettings.enabled ? 'Enabled — awaiting signals' : 'Disabled';
    if (statusEl) statusEl.style.color = '';
    saveAiGateSettings();
  });
  keyInput.addEventListener('change', () => {
    aiGateSettings.apiKey = keyInput.value.trim();
    saveAiGateSettings();
  });
  thresholdInput.addEventListener('change', () => {
    const v = parseInt(thresholdInput.value, 10);
    if (Number.isFinite(v) && v >= 0 && v <= 100) {
      aiGateSettings.threshold = v;
      saveAiGateSettings();
    }
  });
}

async function refreshCronStatus() {
  const list = document.getElementById('cron-status-list');
  if (!list) return;
  list.innerHTML = '<span class="sim-field-hint">Loading…</span>';
  try {
    const { data, error } = await db.from('cron_state').select('*');
    if (error || !data || !data.length) {
      list.innerHTML = '<span class="sim-field-hint">No cron runs recorded yet — worker hasn\'t fired or env vars not configured.</span>';
      return;
    }
    list.innerHTML = data.map(row => {
      const dot = row.last_status === 'ok' ? 'ok' : row.last_status === 'error' ? 'error' : 'idle';
      const when = row.last_run ? new Date(row.last_run).toLocaleString() : 'never';
      const bot  = state.bots.find(b => b.id === row.bot_id);
      const name = bot ? bot.name : row.bot_id;
      return `<div class="cron-status-row">
        <span class="cron-dot ${dot}"></span>
        <span><strong>${name}</strong> — ${row.last_message || row.last_status} <span style="opacity:.5">(${when})</span></span>
      </div>`;
    }).join('');
  } catch (e) {
    list.innerHTML = `<span class="sim-field-hint" style="color:#ff6d6d">Error loading cron state: ${e.message}</span>`;
  }
}

async function syncAiGateToServer() {
  const syncStatus = document.getElementById('cron-sync-status');
  if (syncStatus) syncStatus.textContent = 'Syncing…';
  try {
    await db.from('cron_settings').upsert([
      { key: 'ai_gate_enabled',   value: String(aiGateSettings.enabled) },
      { key: 'ai_gate_threshold', value: String(aiGateSettings.threshold) },
      // Note: API key is NOT synced to Supabase — set OPENAI_API_KEY as a Vercel env var
    ]);
    if (syncStatus) { syncStatus.textContent = 'Synced ✓'; syncStatus.style.color = '#2ddb75'; }
  } catch (e) {
    if (syncStatus) { syncStatus.textContent = `Failed: ${e.message}`; syncStatus.style.color = '#ff6d6d'; }
  }
}

function setupCronStatusPanel() {
  const refreshBtn = document.getElementById('cron-refresh-btn');
  const syncBtn    = document.getElementById('cron-sync-ai-btn');
  if (refreshBtn) refreshBtn.addEventListener('click', refreshCronStatus);
  if (syncBtn)    syncBtn.addEventListener('click', syncAiGateToServer);
  // Auto-load on settings view open
  document.querySelector('[data-view="settings"]')?.addEventListener('click', () => {
    setTimeout(refreshCronStatus, 100);
  });
}

function setupSaveButton() {
  // Save button moved — auto-save on every field change via saveSettings()
}

function setupSimSettings() {
  const commInput = document.getElementById('sim-commission');
  const slipInput = document.getElementById('sim-slippage');
  const rtLabel   = document.getElementById('sim-roundtrip-label');
  if (!commInput || !slipInput || !rtLabel) return;

  // Populate inputs from persisted values
  commInput.value = String(simSettings.commission);
  slipInput.value = String(simSettings.slippage);

  function updateRoundTrip() {
    const rt = (simSettings.commission + simSettings.slippage) * 2;
    rtLabel.textContent = rt.toFixed(3) + '%';
  }
  updateRoundTrip();

  commInput.addEventListener('change', () => {
    const v = parseFloat(commInput.value);
    if (Number.isFinite(v) && v >= 0) {
      simSettings.commission = v;
      updateRoundTrip();
      saveSimSettings();
      applyParamsToChart(state.bots.find(b => b.id === (chartState.currentBotId || state.selectedBotId)) || state.bots[0]);
    }
  });

  slipInput.addEventListener('change', () => {
    const v = parseFloat(slipInput.value);
    if (Number.isFinite(v) && v >= 0) {
      simSettings.slippage = v;
      updateRoundTrip();
      saveSimSettings();
      applyParamsToChart(state.bots.find(b => b.id === (chartState.currentBotId || state.selectedBotId)) || state.bots[0]);
    }
  });
}

// Bootstrap: load settings first, then render
loadSimSettings();
loadAiGateSettings();
loadSavedSettings().then(() => {
  renderAll();
  renderSignalTable();
  updateStatusDots();
  setupTradeLogCollapse();
  setupTradeViewToggle();
  setupTradeRelayTestPanel();
  setupSaveButton();
  setupSimSettings();
  setupAiGateSettings();
  setupCronStatusPanel();
  const refreshBtn = document.getElementById('signal-log-refresh-btn');
  if (refreshBtn) refreshBtn.addEventListener('click', () => renderSignalTable());
  // Wire chart-page collapsibles for TR panel and signal log
  const trToggle = document.getElementById('toggle-tr-panel');
  if (trToggle) {
    const trPanel = document.getElementById('chart-tr-panel');
    trToggle.onclick = () => {
      const collapsed = trPanel.classList.toggle('is-collapsed');
      trToggle.textContent = collapsed ? 'Expand' : 'Collapse';
      trToggle.setAttribute('aria-expanded', String(!collapsed));
    };
  }
  const slToggle = document.getElementById('toggle-signal-log');
  if (slToggle) {
    const slPanel = document.getElementById('chart-signal-log-panel');
    slToggle.onclick = () => {
      const collapsed = slPanel.classList.toggle('is-collapsed');
      slToggle.textContent = collapsed ? 'Expand' : 'Collapse';
      slToggle.setAttribute('aria-expanded', String(!collapsed));
    };
  }
  requestAnimationFrame(() => void initChart(state.selectedBotId));
});
