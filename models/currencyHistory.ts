const mongoose = require('mongoose');
const Schema = mongoose.Schema;
import { Document } from "mongoose";

export interface ICurrencyHistory extends Document {
    id: string,
    coingeckoCode: string,
    dayHistoryData: Array<string[]>,
    weekHistoryData: Array<string[]>,
    monthHistoryData: Array<string[]>,
    yearHistoryData: Array<string[]>
}

export const currencyHistorySchema = new Schema ({
        id: {
            type: String,
            required: true,
            unique: true
        },
        coingeckoCode: {
            type: String,
            unique: true,
            required: true
        },
        dayHistoryData: {
            type: Array,
            required: true
        },
        weekHistoryData: {
            type: Array,
            required: true
        },
        monthHistoryData: {
            type: Array,
            required: true
        },
        yearHistoryData: {
            type: Array,
            required: true
        }
    }, {
    timestamps: true,
    collection: 'CurrencyHistory'}
);

export default mongoose.model('CurrencyHistory', currencyHistorySchema);

