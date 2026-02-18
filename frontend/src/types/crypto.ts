export interface Crypto {
  id: number;
  name: string;
  symbol: string;
  price_usd: number;
  percent_change_24h: number;
  volume_24h: number;
}

export interface PriceHistory {
  recorded_at: string;
  price_usd: number;
}