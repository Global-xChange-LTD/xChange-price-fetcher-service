const mongoose = require('mongoose');
const Schema = mongoose.Schema;
import { Document } from "mongoose";

export interface ICurrencyMarket extends Document  {
    id: string,
    name: string
    symbol: string,
    current_price: string,
    market_cap: string,
    price_change_percentage_24h: string,
    market_cap_change_24h: string,
    market_cap_change_percentage_24h: string,
    total_volume: string,
    circulating_supply: string,
    exchange_rate: string
}

export const currencyMarketSchema = new Schema ({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    current_price: {
        type: Number,
        required: true,
        float: true
    },
    market_cap: {
        type: Number,
        float: true
    },
    price_change_percentage_24h: {
        type: Number,
        float: true
    },
    market_cap_change_24h: {
        type: Number,
        float: true
    },
    market_cap_change_percentage_24h: {
        type: Number,
        float: true
    },
    total_volume: {
        type: Number,
        float: true
    },
    circulating_supply: {
        type: Number,
        float: true
    },
    exchange_rate: {
        type: String,
        required: true

    }
}, {
    timestamps: true,
    collection: "CurrencyMarket"
}
);

export default mongoose.model('CurrencyMarket', currencyMarketSchema);

