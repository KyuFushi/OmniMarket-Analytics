import {
  getMarketplaceWindow,
  getPreviousMarketplaceWindow,
  marketplaceOptions,
  type MarketplaceKey,
} from './mockData'

type Params = {
  periodDays?: number
  marketplace?: MarketplaceKey
}

type DashboardMetric = {
  label: string
  value: number
  formattedValue: string
  delta: number | null
  formattedDelta: string | null
}

type ChartPoint = {
  marketplace: Exclude<MarketplaceKey, 'all'>
  marketplaceLabel: string
  label: string
  revenue: number
  unitsSold: number
  averageTicket: number
  conversionRate: number
  topProduct: string
  topProductUnits: number
}

type SummaryItem = {
  label: string
  value: string
}

type ProductHighlight = {
  name: string
  units: number
}

type DashboardResponse = {
  source: 'mock'
  periodDays: number
  selectedMarketplace: MarketplaceKey
  selectedMarketplaceLabel: string
  marketplaceOptions: Array<{ key: MarketplaceKey; label: string }>
  metrics: {
    revenue: DashboardMetric
    unitsSold: DashboardMetric
    averageTicket: DashboardMetric
    conversionRate: DashboardMetric
  }
  charts: {
    performance: ChartPoint[]
  }
  summary: SummaryItem[]
  currentHighlight: ProductHighlight
  table: ChartPoint[]
  notes: string[]
}

function formatCurrency(value: number, digits = 0) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}

function formatInteger(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`
}

function calculateDelta(current: number, previous: number) {
  if (previous === 0) {
    return 0
  }

  return ((current - previous) / previous) * 100
}

function sumBy<T>(rows: T[], getValue: (row: T) => number) {
  return rows.reduce((sum, row) => sum + getValue(row), 0)
}

function averageBy<T>(rows: T[], getValue: (row: T) => number) {
  if (rows.length === 0) {
    return 0
  }

  return sumBy(rows, getValue) / rows.length
}

function getMarketplaceLabel(marketplace: MarketplaceKey) {
  const match = marketplaceOptions.find((option) => option.key === marketplace)
  return match?.label ?? 'All marketplaces'
}

export default async function getPerformanceDashboard(req: { params: Params; user: User }): Promise<DashboardResponse> {
  const periodDays = req.params.periodDays ?? 30
  const selectedMarketplace = req.params.marketplace ?? 'all'
  const rows = getMarketplaceWindow({ periodDays, marketplace: selectedMarketplace })
  const previousRows = getPreviousMarketplaceWindow({ periodDays, marketplace: selectedMarketplace })
  const current = rows[rows.length - 1]
  const first = rows[0]

  if (!current || !first || rows.length === 0) {
    throw new Error('Not enough data to build the dashboard')
  }

  const revenueTotal = sumBy(rows, (row) => row.revenue)
  const previousRevenueTotal = sumBy(previousRows, (row) => row.revenue)
  const unitsTotal = sumBy(rows, (row) => row.unitsSold)
  const previousUnitsTotal = sumBy(previousRows, (row) => row.unitsSold)
  const averageTicket = averageBy(rows, (row) => row.averageTicket)
  const conversionRate = averageBy(rows, (row) => row.conversionRate)
  const growthTotal = calculateDelta(current.revenue, first.revenue)

  const revenueDelta = calculateDelta(revenueTotal, previousRevenueTotal)
  const unitsDelta = calculateDelta(unitsTotal, previousUnitsTotal)
  const marketplaceLabel = getMarketplaceLabel(selectedMarketplace)

  return {
    source: 'mock',
    periodDays,
    selectedMarketplace,
    selectedMarketplaceLabel: marketplaceLabel,
    marketplaceOptions,
    metrics: {
      revenue: {
        label: `${periodDays}d revenue`,
        value: revenueTotal,
        formattedValue: formatCurrency(revenueTotal),
        delta: revenueDelta,
        formattedDelta: formatPercent(revenueDelta),
      },
      unitsSold: {
        label: `${periodDays}d units sold`,
        value: unitsTotal,
        formattedValue: formatInteger(unitsTotal),
        delta: unitsDelta,
        formattedDelta: formatPercent(unitsDelta),
      },
      averageTicket: {
        label: `${periodDays}d average order`,
        value: averageTicket,
        formattedValue: formatCurrency(averageTicket, 2),
        delta: null,
        formattedDelta: null,
      },
      conversionRate: {
        label: `${periodDays}d conversion`,
        value: conversionRate,
        formattedValue: formatPercent(conversionRate),
        delta: null,
        formattedDelta: null,
      },
    },
    charts: {
      performance: rows,
    },
    summary: [
      {
        label: `${periodDays}-day revenue total`,
        value: formatCurrency(revenueTotal),
      },
      {
        label: `${periodDays}-day unit volume`,
        value: formatInteger(unitsTotal),
      },
      {
        label: 'Growth inside selected window',
        value: formatPercent(growthTotal),
      },
    ],
    currentHighlight: {
      name: current.topProduct,
      units: current.topProductUnits,
    },
    table: rows,
    notes: [
      'The dashboard now supports mock performance data for multiple marketplaces, which makes the project easier to demo publicly on GitHub.',
      'You can later replace the mock layer with real marketplace connectors without rewriting the interface.',
    ],
  }
}
