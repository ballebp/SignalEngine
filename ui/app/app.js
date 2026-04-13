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
  botList.innerHTML = state.bots
    .map(
      (bot) => {
        const isLiveActive = chartState.mode === 'live' && !!chartState.autoSignalByBot[bot.id];
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
      if (el.name === 'timeframe') {
        delete chartState.importedCandlesByBot[currentBot.id];
        delete chartState.importedSourceByBot[currentBot.id];
        setupTimeframePills(currentBot);
        const chartTfSelect = document.getElementById('chart-param-timeframe');
        if (chartTfSelect) chartTfSelect.value = el.value;
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
  importedCandlesByBot: {},
  importedSourceByBot: {},
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

async function fetchBinanceKlines(bot, limit = 500, preferredMarketType = null) {
  const pair = toBinanceSymbol(bot.symbol);
  const interval = String(bot.timeframe || '5m').toLowerCase();
  const target = Math.max(60, Math.min(limit, 12000));
  let lastError = new Error('No Binance market candidates tried');

  for (const candidate of getMarketCandidates(bot, preferredMarketType)) {
    try {
      const allRows = [];
      let endTimeMs = null;

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
  if (!controls) return;
  controls.classList.toggle('is-hidden', !visible);
}

function getModeStatusText() {
  if (chartState.mode === 'history') return `History mode · ${chartState.sourceLabel}`;
  return `Live mode · ${chartState.sourceLabel}`;
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
  button.textContent = `Follow Price: ${chartState.followLive ? 'On' : 'Off'}`;
  button.classList.toggle('is-live', chartState.followLive);
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

function runStrategySimulation(candles, bot) {
  if (bot.strategy === 'h9s') return runH9SStrategy(candles, bot);
  if (bot.strategy === 'b5s') return runB5SStrategy(candles, bot);
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
  const wins = closedTrades.filter((trade) => trade.pl > 0).length;
  const losses = closedTrades.filter((trade) => trade.pl <= 0).length;
  const winRate = closedTrades.length ? (wins / closedTrades.length) * 100 : 0;
  let grossProfit = 0;
  let grossLoss = 0;
  for (const trade of closedTrades) {
    if (trade.pl > 0) grossProfit += trade.pl;
    if (trade.pl < 0) grossLoss += Math.abs(trade.pl);
  }
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : (grossProfit > 0 ? 99 : 0);

  const timeline = buildReplayEquityTimeline(candles, tradeLog);
  const endingEquity = timeline.length ? timeline[timeline.length - 1].equity : 100;
  let peak = 100;
  let maxDrawdown = 0;
  for (const item of timeline) {
    peak = Math.max(peak, item.equity);
    const dd = peak > 0 ? ((peak - item.equity) / peak) * 100 : 0;
    maxDrawdown = Math.max(maxDrawdown, dd);
  }

  return {
    trades: closedTrades.length,
    wins,
    losses,
    winRate,
    grossProfit,
    grossLoss,
    profitFactor,
    netPl: ((endingEquity - 100) / 100) * 100,
    maxDrawdown,
    endingEquity,
  };
}

function parseJsonlCandles(text, bot) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const rows = lines.map((line, idx) => {
    try {
      return JSON.parse(line);
    } catch {
      throw new Error(`Invalid JSON on line ${idx + 1}`);
    }
  });

  if (!rows.length) {
    throw new Error('File is empty.');
  }

  const timeframeMinutes = timeframeToMinutes(bot.timeframe);
  let fallbackTime = 1744416000;
  let previousClose = Number(rows[0].close || 0.085);
  const candles = [];
  const volumes = [];

  for (const row of rows) {
    const timestamp = row.timestamp || row.time || row.t;
    const parsedTime = typeof timestamp === 'number'
      ? (timestamp > 1e12 ? Math.floor(timestamp / 1000) : Math.floor(timestamp))
      : (timestamp ? Math.floor(new Date(timestamp).getTime() / 1000) : fallbackTime);
    const time = Number.isFinite(parsedTime) && parsedTime > 0 ? parsedTime : fallbackTime;
    fallbackTime = time + timeframeMinutes * 60;

    const close = Number(row.close);
    const high = Number(row.high);
    const low = Number(row.low);
    const open = row.open !== undefined ? Number(row.open) : previousClose;
    if (![open, high, low, close].every(Number.isFinite)) {
      continue;
    }

    const fixedOpen = open;
    const fixedHigh = Math.max(high, fixedOpen, close);
    const fixedLow = Math.min(low, fixedOpen, close);
    const volumeValue = Number(row.volume);

    candles.push({
      time,
      open: +fixedOpen.toFixed(6),
      high: +fixedHigh.toFixed(6),
      low: +fixedLow.toFixed(6),
      close: +close.toFixed(6),
    });
    volumes.push({
      time,
      value: Number.isFinite(volumeValue) ? Math.max(1, volumeValue) : Math.floor(75000 + Math.abs(close - fixedOpen) * 100000000),
      color: close >= fixedOpen ? 'rgba(45,219,117,0.35)' : 'rgba(255,109,109,0.35)',
    });
    previousClose = close;
  }

  candles.sort((a, b) => a.time - b.time);
  volumes.sort((a, b) => a.time - b.time);

  if (candles.length < 30) {
    throw new Error('Need at least 30 bars in JSONL for replay.');
  }

  return { candles, volumes };
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

  for (const candle of candles) {
    for (const trade of tradeLog) {
      if (trade.exitTime === candle.time && trade.pl !== null) {
        equity *= 1 + trade.pl / 100;
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
  const imported = chartState.importedCandlesByBot[bot.id];
  let sourcePayload = imported || generateChartBars(bot, Math.max(2000, getDesiredHistoryBars()));
  chartState.sourceLabel = chartState.importedSourceByBot[bot.id] || 'Sample data';

  if (chartState.mode === 'history' || chartState.mode === 'live') {
    try {
      const market = await fetchBinanceKlines(bot, getDesiredHistoryBars(), chartState.marketType);
      sourcePayload = { candles: market.candles, volumes: market.volumes };
      chartState.sourceLabel = market.source;
      chartState.marketType = market.marketType || chartState.marketType;
    } catch (error) {
      if (imported) {
        chartState.sourceLabel = chartState.importedSourceByBot[bot.id] || 'Imported JSONL';
      } else {
        sourcePayload = generateChartBars(bot, Math.max(2000, getDesiredHistoryBars()));
        const reason = error instanceof Error ? error.message : 'market feed unavailable';
        chartState.sourceLabel = `Sample fallback (${reason})`;
      }
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
  setupReplayImport(bot);
  setupChartParameterLab(bot);

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
  const pills = document.querySelectorAll('#chart-time-pills .time-pill');
  if (!pills.length) return;
  const currentTf = String(bot.timeframe || '5m').toLowerCase();
  pills.forEach((pill) => {
    pill.classList.toggle('is-active', pill.dataset.tf === currentTf);
    pill.onclick = () => {
      const tf = String(pill.dataset.tf || '').toLowerCase();
      if (!tf) return;
      // Always look up fresh bot so we never hold a stale closure reference
      const activeBotId = chartState.currentBotId || state.selectedBotId;
      const activeBot = state.bots.find((b) => b.id === activeBotId) || state.bots[0];
      if (tf === String(activeBot.timeframe).toLowerCase()) return; // already this TF
      activeBot.timeframe = tf;
      delete chartState.importedCandlesByBot[activeBot.id];
      delete chartState.importedSourceByBot[activeBot.id];
      // Sync the param-lab select
      const timeframeInput = document.getElementById('chart-param-timeframe');
      if (timeframeInput) timeframeInput.value = tf;
      renderHero();
      renderBots();
      renderConfigForm();
      renderConfigPreview();
      void initChart(activeBot.id);
    };
  });
}

function renderChartControls(activeBot, summary) {
  const tabs = document.getElementById('chart-bot-tabs');
  tabs.innerHTML = state.bots.map((bot) =>
    `<button class="chart-bot-tab ${bot.id === activeBot.id ? 'is-active' : ''}" data-bot-id="${bot.id}">${bot.name}</button>`
  ).join('');
  tabs.querySelectorAll('[data-bot-id]').forEach((btn) => {
    btn.addEventListener('click', () => requestAnimationFrame(() => initChart(btn.dataset.botId)));
  });

  document.getElementById('chart-symbol-info').innerHTML =
    `<span class="chart-symbol-name">${activeBot.symbol}</span>` +
    `<span class="chart-timeframe-badge">${activeBot.timeframe}</span>`;

  document.getElementById('chart-perf-strip').innerHTML = [
    ['Win Rate', `${summary.winRate.toFixed(2)}%`, summary.winRate > 50 ? 'is-positive' : 'is-negative'],
    ['Net P/L', formatPercent(summary.netPl), summary.netPl > 0 ? 'is-positive' : 'is-negative'],
    ['Max DD', `${summary.maxDrawdown.toFixed(2)}%`, 'is-negative'],
    ['Trades', String(summary.trades), ''],
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
  const active = isLive && !!chartState.autoSignalByBot[bot?.id];
  const hasUrl = !!(bot?.tradeRelayUrl);
  const stateSpan = toggle.querySelector('.autosignal-state');
  if (stateSpan) stateSpan.textContent = active ? 'ON' : 'OFF';
  toggle.classList.toggle('is-active', active);
  toggle.disabled = !isLive;
  toggle.title = !isLive ? 'Switch to Live mode to use Auto-Signal' : hasUrl ? '' : 'Configure TradeRelay URL in Settings first';
  // Update topnav dots to reflect real bot status
  updateStatusDots();
  // Refresh bot list so live badge appears/disappears
  renderBots();
}

function updateStatusDots() {
  const dots = document.querySelectorAll('.topnav-status .status-dot');
  const anyLive = chartState.mode === 'live' && state.bots.some((b) => chartState.autoSignalByBot[b.id]);
  const hasRelay = state.bots.some((b) => b.tradeRelayUrl);
  if (dots[0]) { dots[0].className = `status-dot ${anyLive ? 'ok' : hasRelay ? 'warn' : 'off'}`; dots[0].title = anyLive ? 'Auto-Signal active' : hasRelay ? 'TradeRelay configured, signals paused' : 'TradeRelay not configured'; }
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
      const FETCH = Math.min(IDEAL_WINDOW * 6, 10000); // fetch 6× for wide sampling range
      // Always re-fetch to guarantee different period each press
      delete chartState.fullHistoryByBot[bot.id];
      try {
        const market = await fetchBinanceKlines(bot, FETCH, chartState.marketType);
        chartState.fullHistoryByBot[bot.id] = { candles: market.candles, volumes: market.volumes };
      } catch {
        chartState.fullHistoryByBot[bot.id] = {
          candles: chartState.data?.candles || [],
          volumes: chartState.data?.volumes || [],
        };
      }
      const full = chartState.fullHistoryByBot[bot.id];
      const total = full.candles.length;
      // Cap window to at most 40% of total so there's always a random range
      const WINDOW = Math.min(IDEAL_WINDOW, Math.max(50, Math.floor(total * 0.4)));
      let slice, volSlice;
      if (total <= WINDOW) {
        slice = full.candles;
        volSlice = full.volumes;
      } else {
        const start = Math.floor(Math.random() * (total - WINDOW));
        slice = full.candles.slice(start, start + WINDOW);
        volSlice = full.volumes.slice(start, start + WINDOW);
      }
      const pkg = buildReplayPackageFromCandles(slice, volSlice, bot);
      chartState.data = { ...pkg, smaData: buildSma(pkg.candles, 20) };
      chartState.replaySignals = pkg.replaySignals;
      chartState.replayEquityTimeline = pkg.replayEquityTimeline;
      chartState.replayIndex = 0;
      // Show all bars at once
      renderChartControls(bot, pkg.summary);
      setupLayerToggles();
      applyReplayFrame(pkg.candles.length - 1);
      chartState.chart?.timeScale().fitContent();
      // Show date range of sample
      const from = new Date(slice[0].time * 1000).toLocaleDateString();
      const to   = new Date(slice[slice.length - 1].time * 1000).toLocaleDateString();
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

function setupReplayImport(bot) {
  const input = document.getElementById('replay-jsonl-input');
  const button = document.getElementById('replay-load-jsonl');
  const source = document.getElementById('replay-data-source');
  if (!input || !button || !source) return;

  source.textContent = `Source: ${chartState.sourceLabel}`;
  button.onclick = async () => {
    const file = input.files && input.files[0];
    if (!file) {
      alert('Select a JSONL file first.');
      return;
    }

    try {
      const text = await file.text();
      const parsed = parseJsonlCandles(text, bot);
      chartState.importedCandlesByBot[bot.id] = parsed;
      chartState.importedSourceByBot[bot.id] = file.name;
      source.textContent = `Source: ${file.name}`;
      void initChart(bot.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to parse JSONL file.';
      alert(`Could not load replay data: ${message}`);
    }
  };
}

function parseLocaleNumber(rawValue, fallback) {
  const normalized = String(rawValue ?? '').trim().replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function scoreOptimizationCandidate(summary) {
  const tradeFactor = Math.max(0.2, Math.min(1, summary.trades / 35));
  const pfBoost = Math.min(summary.profitFactor, 5) * 3;
  const edgeBoost = (summary.winRate - 50) * 0.18;
  const score = (summary.netPl * 1.2) - (summary.maxDrawdown * 0.72) + pfBoost + edgeBoost;
  return score * tradeFactor;
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

  container.innerHTML = candidates
    .slice(0, 6)
    .map((candidate, idx) => {
      let paramStr;
      if (isBOS) {
        const tpPart = candidate.tpType === 'dynamic' ? 'Dyn TP' : `TP ${candidate.tp}% SL ${candidate.sl}%`;
        const tradesPart = isB5S ? ` • ${candidate.maxTrades ?? 3}T` : '';
        paramStr = `Swing ${candidate.threshold} • ${candidate.bosConfType === 'wicks' ? 'Wicks' : 'Close'} • ${tpPart}${tradesPart}`;
      } else {
        paramStr = `TP ${candidate.tp}% • SL ${candidate.sl}% • Th ${candidate.threshold}`;
      }
      return `
      <article class="optimizer-row">
        <div class="optimizer-rank">${idx + 1}</div>
        <div class="optimizer-main">
          <strong>${paramStr}</strong>
          <div class="optimizer-sub">${formatPercent(candidate.summary.netPl)} net • ${candidate.summary.maxDrawdown.toFixed(2)}% DD • ${candidate.summary.winRate.toFixed(2)}% WR • ${candidate.summary.trades} trades</div>
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
        : `TP ${candidate.tp}% / SL ${candidate.sl}% / Th ${candidate.threshold}`;
      feedback.textContent = `Applied candidate #${idx + 1}: ${label}.`;
      void saveSettings();
      renderHero();
      renderBots();
      renderConfigForm();
      renderConfigPreview();
      void initChart(bot.id);
    });
  });
}

function setupChartParameterLab(bot) {
  const symbolInput = document.getElementById('chart-param-symbol');
  const timeframeInput = document.getElementById('chart-param-timeframe');
  const tpInput = document.getElementById('chart-param-tp');
  const slInput = document.getElementById('chart-param-sl');
  const thresholdInput = document.getElementById('chart-param-threshold');
  const applyButton = document.getElementById('chart-apply-params');
  const optimizeButton = document.getElementById('chart-optimize-params');
  const feedback = document.getElementById('chart-param-feedback');
  if (!symbolInput || !timeframeInput || !tpInput || !slInput || !thresholdInput || !applyButton || !optimizeButton || !feedback) return;

  symbolInput.value = String(bot.symbol || '');
  timeframeInput.value = String(bot.timeframe || '5m').toLowerCase();
  tpInput.value = String(bot.tp);
  slInput.value = String(bot.sl);
  thresholdInput.value = String(bot.threshold);

  timeframeInput.onchange = () => {
    const tf = String(timeframeInput.value || '').trim().toLowerCase();
    if (!tf) return;
    const activeBotId = chartState.currentBotId || state.selectedBotId;
    const activeBot = state.bots.find((b) => b.id === activeBotId) || state.bots[0];
    if (tf === String(activeBot.timeframe).toLowerCase()) return;
    activeBot.timeframe = tf;
    delete chartState.importedCandlesByBot[activeBot.id];
    delete chartState.importedSourceByBot[activeBot.id];
    setupTimeframePills(activeBot);
    renderHero(); renderBots(); renderConfigForm(); renderConfigPreview();
    void initChart(activeBot.id);
  };

  applyButton.onclick = () => {
    const nextSymbol = String(symbolInput.value || bot.symbol).trim().toUpperCase();
    const nextTimeframe = String(timeframeInput.value || bot.timeframe).trim();
    const nextTp = Math.max(0.1, parseLocaleNumber(tpInput.value, bot.tp));
    const nextSl = Math.max(0.1, parseLocaleNumber(slInput.value, bot.sl));
    const nextThreshold = Math.max(1, Math.min(99, parseLocaleNumber(thresholdInput.value, bot.threshold)));
    const symbolChanged = nextSymbol && nextSymbol !== bot.symbol;
    const timeframeChanged = nextTimeframe && nextTimeframe !== bot.timeframe;

    if (nextSymbol) bot.symbol = nextSymbol;
    if (nextTimeframe) bot.timeframe = nextTimeframe;
    bot.tp = +nextTp.toFixed(2);
    bot.sl = +nextSl.toFixed(2);
    bot.threshold = Math.round(nextThreshold);

    if (symbolChanged || timeframeChanged) {
      delete chartState.importedCandlesByBot[bot.id];
      delete chartState.importedSourceByBot[bot.id];
      delete chartState.fullHistoryByBot[bot.id];
    }

    feedback.className = 'param-feedback good';
    feedback.textContent = `Applied ${bot.symbol} ${bot.timeframe}, TP ${bot.tp}%, SL ${bot.sl}%, threshold ${bot.threshold}. Replay + performance updated.`;
    void saveSettings();
    renderHero();
    renderBots();
    renderConfigForm();
    renderConfigPreview();
    void initChart(bot.id);
  };

  optimizeButton.onclick = async () => {
    // Always fetch maximum bars for optimizer so results are based on rich data
    feedback.className = 'param-feedback';
    feedback.textContent = 'Fetching data for optimizer…';
    optimizeButton.disabled = true;
    let source;
    try {
      const market = await fetchBinanceKlines(bot, 12000, chartState.marketType);
      source = { candles: market.candles, volumes: market.volumes };
    } catch {
      source = chartState.data
        ? { candles: chartState.data.candles, volumes: chartState.data.volumes }
        : (chartState.importedCandlesByBot[bot.id] || generateChartBars(bot, Math.max(2000, getDesiredHistoryBars())));
    } finally {
      optimizeButton.disabled = false;
    }
    feedback.textContent = `Running optimizer on ${source.candles.length} bars…`;
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
                const pkg = buildReplayPackageFromCandles(source.candles, source.volumes, testBot);
                const score = scoreOptimizationCandidate(pkg.summary);
                candidates.push({ tp, sl, threshold, bosConfType, tpType, summary: pkg.summary, score });
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
                  const pkg = buildReplayPackageFromCandles(source.candles, source.volumes, testBot);
                  const score = scoreOptimizationCandidate(pkg.summary);
                  candidates.push({ tp, sl, threshold, bosConfType, tpType, maxTrades, summary: pkg.summary, score });
                }
              }
            }
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
            const pkg = buildReplayPackageFromCandles(source.candles, source.volumes, testBot);
            const score = scoreOptimizationCandidate(pkg.summary);
            candidates.push({ tp, sl, threshold, summary: pkg.summary, score });
          }
        }
      }
    }

    candidates.sort((a, b) => b.score - a.score);
    const best = candidates[0];

    if (!best) {
      feedback.className = 'param-feedback warn';
      feedback.textContent = 'AI optimize could not evaluate candidate sets.';
      renderOptimizerResults([], bot, tpInput, slInput, thresholdInput, feedback, source);
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
    const bestLabel = isBOSBest
      ? `Swing ${best.threshold} / ${best.bosConfType} / ${best.tpType}${bot.strategy === 'b5s' ? ` / ${best.maxTrades ?? 3}T` : ''}`
      : `TP ${best.tp}% / SL ${best.sl}% / Th ${best.threshold}`;
    feedback.className = 'param-feedback good';
    feedback.textContent = `AI best: ${bestLabel} -> ${formatPercent(best.summary.netPl)} net, ${best.summary.maxDrawdown.toFixed(2)}% DD, ${best.summary.winRate.toFixed(2)}% WR.`;
    void saveSettings();
    renderOptimizerResults(candidates, bot, tpInput, slInput, thresholdInput, feedback, source);
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
  renderStrategyStatsBoard();
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
  renderStrategyStatsBoard();
}

function renderLiveEquity(currentTime) {
  const svg = document.getElementById('live-equity-svg');
  const stats = document.getElementById('live-equity-stats');
  if (!svg || !stats || !chartState.replayEquityTimeline.length) return;

  const points = chartState.replayEquityTimeline.filter((p) => p.time <= currentTime);
  if (!points.length) return;

  const width = 620;
  const height = 180;
  const padding = 14;
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
      <strong>${currentEquity.toFixed(2)}</strong>
    </article>
    <article class="live-stat">
      <span class="mini-label">Net P/L</span>
      <strong class="${metricClass(netPl)}">${formatPercent(netPl)}</strong>
    </article>
    <article class="live-stat">
      <span class="mini-label">Closed / Wins</span>
      <strong>${closedTrades.length} / ${wins}</strong>
    </article>
    <article class="live-stat">
      <span class="mini-label">Max Drawdown</span>
      <strong class="is-negative">${maxDd.toFixed(2)}%</strong>
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

function renderStrategyStatsBoard() {
  const board = document.getElementById('strategy-stats-board');
  if (!board || !chartState.data?.summary) return;

  const summary = chartState.data.summary;
  const pfText = Number.isFinite(summary.profitFactor) ? summary.profitFactor.toFixed(2) : '-';
  const rows = [
    ['Trades', String(summary.trades), ''],
    ['WR%', `${summary.winRate.toFixed(1)}%`, metricClass(summary.winRate - 50)],
    ['PF', pfText, summary.profitFactor >= 1 ? 'is-positive' : 'is-negative'],
    ['P/L%', `${summary.netPl.toFixed(2)}%`, metricClass(summary.netPl)],
    ['AD%', `${summary.maxDrawdown.toFixed(2)}%`, 'is-negative'],
    ['Wins / Losses', `${summary.wins} / ${summary.losses}`, ''],
  ];

  board.innerHTML = `
    <div class="strategy-stats-header">
      <div class="strategy-stats-cell">Arbitrage Bot</div>
      <div class="strategy-stats-cell" style="text-align:right;">Stats</div>
    </div>
    ${rows
      .map(
        ([label, value, tone]) => `
          <div class="strategy-stats-row">
            <div class="strategy-stats-cell strategy-label">${label}</div>
            <div class="strategy-stats-cell strategy-value ${tone}">${value}</div>
          </div>
        `
      )
      .join('')}
  `;
}

function renderAll() {
  renderBots();
  renderConfigForm();
  renderConfigPreview();
  renderStrategyStatsBoard();
  refreshTradeRelayPanel();
}

// ── Supabase ──────────────────────────────────────────────────────────────────

const SUPABASE_URL = 'https://ohguikmqxuhujqrcnuqi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_4mpeCY3NhZ4Y3VT26Ar7uA_w16L8MEO';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const STORAGE_KEY = 'signal-engine-bots-v1'; // offline fallback

function botToRow(bot) {
  return {
    id: bot.id,
    config: {
      name: bot.name, symbol: bot.symbol, timeframe: bot.timeframe,
      webhookKey: bot.webhookKey, tradeRelayUrl: bot.tradeRelayUrl,
      tradeRelayWebhookCode: bot.tradeRelayWebhookCode,
      tp: bot.tp, sl: bot.sl, threshold: bot.threshold,
      source1: bot.source1, source2: bot.source2,
      source3: bot.source3, source4: bot.source4,
      autoSignal: !!bot.autoSignal,
      winRate: bot.winRate, netPl: bot.netPl, drawdown: bot.drawdown, trades: bot.trades,
    },
  };
}

function applyBotRow(row) {
  const bot = state.bots.find((b) => b.id === row.id);
  if (!bot || !row.config) return;
  const editable = ['name', 'symbol', 'timeframe', 'webhookKey', 'tradeRelayUrl',
    'tradeRelayWebhookCode', 'tp', 'sl', 'threshold',
    'source1', 'source2', 'source3', 'source4', 'autoSignal',
    'winRate', 'netPl', 'drawdown', 'trades'];
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

function setupSaveButton() {
  const btn = document.getElementById('settings-save-btn');
  const feedback = document.getElementById('settings-save-feedback');
  if (!btn || !feedback) return;
  btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.textContent = 'Saving…';
    const ok = await saveSettings();
    btn.disabled = false;
    btn.textContent = 'Save Settings';
    feedback.textContent = ok ? '✓ Saved to cloud' : '✗ Could not save';
    feedback.className = `settings-save-feedback ${ok ? 'save-ok' : 'save-err'}`;
    clearTimeout(btn._saveTimer);
    btn._saveTimer = setTimeout(() => { feedback.textContent = ''; }, 3000);
    refreshTradeRelayPanel();
  });
}

// Bootstrap: load settings first, then render
loadSavedSettings().then(() => {
  renderAll();
  renderSignalTable();
  updateStatusDots();
  setupTradeLogCollapse();
  setupTradeViewToggle();
  setupTradeRelayTestPanel();
  setupSaveButton();
  const refreshBtn = document.getElementById('signal-log-refresh-btn');
  if (refreshBtn) refreshBtn.addEventListener('click', () => renderSignalTable());
  requestAnimationFrame(() => void initChart(state.selectedBotId));
});
