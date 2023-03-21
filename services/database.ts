import CurrencyMarket from "../models/currencyMarket";
import CurrencyHistory from "../models/currencyHistory";
import { getCoinsCodeStringByValue } from "../enums/coin-enums";
import {addNewCurrencyMarketCoin, getMarketCoinGeckosIds, requestMarketsCoingeckoData} from "./coins.market.service";
import { initailUpdateOfTheDatabase } from "./coins.history.service";
import logger from "../utils/logger";

export async function checkMarketAndHistoryDatabase() {
    try {
        let currencyMarket = await CurrencyMarket.find({}),
            currencyHistory = await CurrencyHistory.find({});

        let coins = await getMarketCoinGeckosIds()
            .catch((err)=> {
                throw new Error(err);
            });

        const trimArray = coins.map((coin: string) => {
            return coin.trim();
        });

        let uniqueCoins = [...new Set(trimArray)];

        if(currencyMarket && currencyMarket.length == 0) {
            let data = await requestMarketsCoingeckoData(uniqueCoins);

            for (const item of data) {
                await addNewCurrencyMarketCoin(item)
            }
        }

        if( currencyHistory && currencyHistory.length == 0 ) {
            await initailUpdateOfTheDatabase(uniqueCoins)
                .catch(err => {
                    throw new Error(err);
                });
        }

    } catch (err) {
        logger.error(err)
    }
}

