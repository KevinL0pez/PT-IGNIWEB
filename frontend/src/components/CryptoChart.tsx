import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { PriceHistory } from "../types/crypto";

interface Props {
  data: PriceHistory[];
}

export default function CryptoChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="recorded_at" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="price_usd" />
      </LineChart>
    </ResponsiveContainer>
  );
}
