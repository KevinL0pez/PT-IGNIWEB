import {
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Area,
    AreaChart
  } from "recharts";
  import type { PriceHistory } from "../types/crypto";
  
  interface Props {
    data: PriceHistory[];
  }
  
  export default function CryptoChart({ data }: Props) {
  
    if (!data || data.length === 0) {
      return <p style={{ textAlign: "center" }}>No hay datos históricos disponibles</p>;
    }
  
    // Formatear datos
    const formattedData = data.map(item => ({
      ...item,
      date: new Date(item.recorded_at).toLocaleDateString(),
    }));
  
    const firstPrice = formattedData[0].price_usd;
    const lastPrice = formattedData[formattedData.length - 1].price_usd;
    const isPositive = lastPrice >= firstPrice;
  
    return (
      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isPositive ? "#16c784" : "#ea3943"}
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor={isPositive ? "#16c784" : "#ea3943"}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
  
            <CartesianGrid strokeDasharray="3 3" />
  
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              minTickGap={20}
            />
  
            <YAxis
              tickFormatter={(value) =>
                `$${Number(value).toLocaleString()}`
              }
              width={80}
            />
  
            <Tooltip
              formatter={(value: number | undefined) =>
                value != null
                  ? `$${Number(value).toLocaleString(undefined, {
                      minimumFractionDigits: 2
                    })}`
                  : "—"
              }
              labelStyle={{ fontWeight: "bold" }}
            />
  
            <Area
              type="monotone"
              dataKey="price_usd"
              stroke={isPositive ? "#16c784" : "#ea3943"}
              fillOpacity={1}
              fill="url(#colorPrice)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }