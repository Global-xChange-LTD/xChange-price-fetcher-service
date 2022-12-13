import mongoose from "mongoose";
import { DATABASE_NAME, DATABASE_URL } from "../config/config";
import Logger from "../utils/logger";
import { updateCoinsData } from "../utils/cron-jobs";
import { checkMarketAndHistoryDatabase } from "../services/database";

export async function connectToDatabases() {
    mongoose.connect((DATABASE_URL || 'mongodb://localhost/xchange_price_fetcher')!, {
        dbName: DATABASE_NAME || 'xchange_price_fetcher'
    })
        .then((res) => {
           Logger.info('database connected');
           checkMarketAndHistoryDatabase();
           updateCoinsData();
        })
        .catch((error) => {
            Logger.info('database error', error);
        });
}
