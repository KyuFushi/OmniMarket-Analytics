export type MarketplaceKey = 'all' | 'mercadoLivre' | 'amazon' | 'shopee' | 'ebay'

type MarketplaceDefinition = {
  key: Exclude<MarketplaceKey, 'all'>
  label: string
  revenueMultiplier: number
  unitsMultiplier: number
  ticketOffset: number
  conversionOffset: number
  productNames: string[]
}

export type SalesRecord = {
  marketplace: MarketplaceKey
  marketplaceLabel: string
  dateKey: string
  label: string
  revenue: number
  unitsSold: number
  averageTicket: number
  conversionRate: number
  topProduct: string
  topProductUnits: number
}

export type DashboardFilters = {
  periodDays?: number
  marketplace?: MarketplaceKey
}

const MARKETPLACES: MarketplaceDefinition[] = [
  {
    key: 'mercadoLivre',
    label: 'Mercado Livre',
    revenueMultiplier: 1.08,
    unitsMultiplier: 1.05,
    ticketOffset: 2,
    conversionOffset: 0.18,
    productNames: ['Power Bank', 'Bluetooth Earbuds', 'Fast Charger', 'Phone Stand'],
  },
  {
    key: 'amazon',
    label: 'Amazon',
    revenueMultiplier: 1.22,
    unitsMultiplier: 1.1,
    ticketOffset: 7,
    conversionOffset: 0.26,
    productNames: ['Smart Lamp', 'USB Hub', 'Mechanical Keyboard', 'Laptop Sleeve'],
  },
  {
    key: 'shopee',
    label: 'Shopee',
    revenueMultiplier: 0.88,
    unitsMultiplier: 1.16,
    ticketOffset: -4,
    conversionOffset: 0.12,
    productNames: ['Mini Tripod', 'Phone Case', 'Cable Kit', 'Desk Organizer'],
  },
  {
    key: 'ebay',
    label: 'eBay',
    revenueMultiplier: 1.03,
    unitsMultiplier: 0.92,
    ticketOffset: 10,
    conversionOffset: -0.08,
    productNames: ['Vintage Camera Strap', 'Retro Mouse', 'Collector Mug', 'Game Controller'],
  },
]

function formatPeriodLabel(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function roundToTwo(value: number) {
  return Math.round(value * 100) / 100
}

function buildMarketplaceRows(definition: MarketplaceDefinition, totalDays: number): SalesRecord[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const rows: SalesRecord[] = []

  for (let index = 0; index < totalDays; index += 1) {
    const daysAgo = totalDays - index - 1
    const date = new Date(today)
    date.setDate(today.getDate() - daysAgo)

    const weekday = date.getDay()
    const weekdayBoostMap = [0.84, 0.96, 1.01, 1.05, 1.08, 1.17, 1.24]
    const weekdayBoost = weekdayBoostMap[weekday] ?? 1
    const trend = 1 + index * 0.0016
    const seasonalWave = 1 + Math.sin(index / 10 + definition.revenueMultiplier) * 0.12

    const baseUnits = 14 + (index % 5)
    const unitsSold = Math.max(
      6,
      Math.round(baseUnits * weekdayBoost * seasonalWave * trend * definition.unitsMultiplier),
    )

    const averageTicket = roundToTwo(
      36 +
        definition.ticketOffset +
        (index % 7) * 2.35 +
        Math.cos(index / 11 + definition.unitsMultiplier) * 3.2,
    )

    const revenue = Math.round(unitsSold * averageTicket * definition.revenueMultiplier)
    const conversionRate = roundToTwo(
      Math.min(6.4, 2.1 + definition.conversionOffset + index * 0.003 + weekdayBoost * 0.5),
    )

    const productNames = definition.productNames
    const productIndex = Math.floor(index / 16) % productNames.length
    const topProduct = productNames[productIndex] ?? productNames[0] ?? 'Top product'
    const topProductUnits = Math.max(3, Math.round(unitsSold * (0.32 + (index % 4) * 0.05)))

    rows.push({
      marketplace: definition.key,
      marketplaceLabel: definition.label,
      dateKey: date.toISOString().slice(0, 10),
      label: formatPeriodLabel(date),
      revenue,
      unitsSold,
      averageTicket,
      conversionRate,
      topProduct,
      topProductUnits,
    })
  }

  return rows
}

function buildMarketplaceDataset(totalDays = 400) {
  const data = MARKETPLACES.flatMap((marketplace) => buildMarketplaceRows(marketplace, totalDays))
  return {
    data,
    marketplaces: MARKETPLACES.map(({ key, label }) => ({ key, label })),
  }
}

const dataset = buildMarketplaceDataset()

export const marketplaceOptions = [{ key: 'all', label: 'All marketplaces' } as const, ...dataset.marketplaces]
export const marketplaceMockData = dataset.data

function getWindowSize(periodDays: number | undefined) {
  return Math.min(365, Math.max(7, periodDays ?? 30))
}

function aggregateAllMarketplaces(rows: SalesRecord[]) {
  const grouped = new Map<string, SalesRecord[]>()

  for (const row of rows) {
    const current = grouped.get(row.dateKey) ?? []
    current.push(row)
    grouped.set(row.dateKey, current)
  }

  const sortedDates = Array.from(grouped.keys()).sort((a, b) => a.localeCompare(b))

  return sortedDates.map((dateKey) => {
    const dateRows = grouped.get(dateKey) ?? []
    const first = dateRows[0]

    if (!first) {
      throw new Error('Missing marketplace rows for aggregate date')
    }

    const revenue = dateRows.reduce((sum, row) => sum + row.revenue, 0)
    const unitsSold = dateRows.reduce((sum, row) => sum + row.unitsSold, 0)
    const averageTicket = unitsSold === 0 ? 0 : roundToTwo(revenue / unitsSold)
    const conversionRate = roundToTwo(
      dateRows.reduce((sum, row) => sum + row.conversionRate, 0) / dateRows.length,
    )

    const topRow = [...dateRows].sort((a, b) => b.topProductUnits - a.topProductUnits)[0] ?? first

    return {
      marketplace: 'all' as const,
      marketplaceLabel: 'All marketplaces',
      dateKey,
      label: first.label,
      revenue,
      unitsSold,
      averageTicket,
      conversionRate,
      topProduct: topRow.topProduct,
      topProductUnits: topRow.topProductUnits,
    }
  })
}

function getScopedRows(marketplace: MarketplaceKey) {
  if (marketplace === 'all') {
    return aggregateAllMarketplaces(marketplaceMockData)
  }

  return marketplaceMockData.filter((row) => row.marketplace === marketplace)
}

export function getMarketplaceWindow(filters: DashboardFilters) {
  const periodDays = getWindowSize(filters.periodDays)
  const marketplace = filters.marketplace ?? 'all'
  const scopedRows = getScopedRows(marketplace)
  return scopedRows.slice(-periodDays)
}

export function getPreviousMarketplaceWindow(filters: DashboardFilters) {
  const periodDays = getWindowSize(filters.periodDays)
  const marketplace = filters.marketplace ?? 'all'
  const scopedRows = getScopedRows(marketplace)
  const endIndex = Math.max(0, scopedRows.length - periodDays)
  const startIndex = Math.max(0, endIndex - periodDays)
  return scopedRows.slice(startIndex, endIndex)
}
