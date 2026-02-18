import axios from 'axios'

export const cmcClient = axios.create({
  baseURL: 'https://pro-api.coinmarketcap.com/v1/',
  headers: {
    'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY
  }
})