import { useState, useCallback } from "react"
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts"
import type { PriceHistory } from "../types/crypto"

interface Props {
  data: PriceHistory[]
  /** Símbolo de la crypto (para id único del gradiente y contexto) */
  symbol?: string
}

interface TooltipPayloadItem {
  value?: number | string
  payload?: { fullDate?: string; price_usd?: number }
}

interface ActivePoint {
  fullDate: string
  price_usd: number
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function ChartTooltip({
  active,
  payload,
  onActivePoint,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
  onActivePoint?: (point: ActivePoint | null) => void
}) {
  if (!payload?.length || !payload[0].payload?.fullDate) {
    onActivePoint?.(null)
    return null
  }
  const rawPrice = payload[0].value ?? payload[0].payload?.price_usd
  const price = rawPrice !== undefined && rawPrice !== null ? Number(rawPrice) : NaN
  const fullDate = payload[0].payload!.fullDate!

  if (active && Number.isFinite(price)) {
    onActivePoint?.({ fullDate, price_usd: price })
  } else {
    onActivePoint?.(null)
  }

  if (!active) return null

  const priceFormatted = Number.isFinite(price) ? formatPrice(price) : "—"
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-date">{formatTooltipDate(fullDate)}</div>
      <div className="chart-tooltip-price">Precio: {priceFormatted}</div>
    </div>
  )
}

function formatAxisDate(recordedAt: string): string {
  const d = new Date(recordedAt)
  return d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  })
}

function formatTooltipDate(recordedAt: string): string {
  const d = new Date(recordedAt)
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export default function CryptoChart({ data, symbol = "chart" }: Props) {
  const [activePoint, setActivePoint] = useState<ActivePoint | null>(null)
  const handleActivePoint = useCallback((point: ActivePoint | null) => {
    setActivePoint((prev) => {
      if (point === null) return null
      if (prev?.fullDate === point.fullDate && prev?.price_usd === point.price_usd)
        return prev
      return point
    })
  }, [])

  if (!data || data.length === 0) {
    return (
      <div className="crypto-chart-wrap">
        <p className="chart-empty">No hay datos históricos disponibles para este rango.</p>
      </div>
    )
  }

  const formattedData = data.map((item) => {
    const priceUsd = Number(item.price_usd)
    return {
      ...item,
      price_usd: priceUsd,
      dateLabel: formatAxisDate(item.recorded_at),
      fullDate: item.recorded_at,
    }
  })

  const firstPrice = formattedData[0].price_usd
  const lastPrice = formattedData[formattedData.length - 1].price_usd
  const minPrice = Math.min(...formattedData.map((d) => d.price_usd))
  const maxPrice = Math.max(...formattedData.map((d) => d.price_usd))
  const periodChange =
    firstPrice > 0 ? ((lastPrice - firstPrice) / firstPrice) * 100 : 0
  const isPositive = lastPrice >= firstPrice

  const firstDate = formattedData[0].fullDate
  const lastDate = formattedData[formattedData.length - 1].fullDate
  const rangeLabel = `${formatAxisDate(firstDate)} – ${formatAxisDate(lastDate)}`

  const gradientId = `colorPrice-${symbol.replace(/\W/g, "")}`

  const displayPoint = activePoint ?? {
    fullDate: lastDate,
    price_usd: lastPrice,
  }

  return (
    <div className="crypto-chart-wrap">
      <div className="chart-timeline-header">
        <span className="chart-range-label" title="Rango de tiempo de los datos">
          Rango: {rangeLabel}
        </span>
      </div>

      <div className="chart-dynamic-price" aria-live="polite">
        <span className="chart-dynamic-date">
          {formatTooltipDate(displayPoint.fullDate)}
        </span>
        <span className="chart-dynamic-value">
          {formatPrice(displayPoint.price_usd)}
        </span>
      </div>

      <div className="chart-period-summary">
        <span className={isPositive ? "positive" : "negative"}>
          Rendimiento en el período: {isPositive ? "+" : ""}
          {periodChange.toFixed(2)}%
        </span>
        <span className="chart-sep">·</span>
        <span>Mín: ${minPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        <span className="chart-sep">·</span>
        <span>Máx: ${maxPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
      </div>

      <div className="chart-responsive">
        <ResponsiveContainer width="100%" minHeight={280}>
          <AreaChart
            data={formattedData}
            margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isPositive ? "#16c784" : "#ea3943"}
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor={isPositive ? "#16c784" : "#ea3943"}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

            <XAxis
              dataKey="dateLabel"
              tick={{ fontSize: 11, fill: "#64748b" }}
              minTickGap={24}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={{ stroke: "#e2e8f0" }}
            />

            <YAxis
              dataKey="price_usd"
              tickFormatter={(value) =>
                `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
              }
              width={56}
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              domain={["auto", "auto"]}
            />

            <Tooltip
              content={<ChartTooltip onActivePoint={handleActivePoint} />}
              cursor={{ stroke: "#94a3b8", strokeWidth: 1, strokeDasharray: "4 2" }}
            />

            <Area
              type="monotone"
              dataKey="price_usd"
              stroke={isPositive ? "#16c784" : "#ea3943"}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
