import CurrencyMarket from "../models/currencyMarket";
import CurrencyHistory from "../models/currencyHistory";
import {getCoinsCodeStringByValue} from "../enums/coin-enums";
import {addNewCurrencyMarketCoin, requestMarketsCoingeckoData} from "./coins.market.service";
import {initailUpdateOfTheDatabase} from "./coins.history.service";
import Logger from "../utils/logger";
import { COINGECKO_API_URL } from "../config/config";

export async function checkMarketAndHistoryDatabase() {
    try {
        let currencyMarket = await CurrencyMarket.find({}),
            currencyHistory = await CurrencyHistory.find({}),
            apiUrl = 'https://api.coingecko.com/api/v3/';

        if(currencyMarket && currencyMarket.length == 0) {
            let coinsArr = await getCoinsCodeStringByValue(),
                url = `${apiUrl}coins/markets?ids=${coinsArr.join('%2C')}&vs_currency=usd`,
                data = await requestMarketsCoingeckoData(url);

            for (const item of data) {
                await addNewCurrencyMarketCoin(item)
            }
        }

        if( currencyHistory && currencyHistory.length === 0 ) {
            let coinsEnumArr = await getCoinsCodeStringByValue();

            await initailUpdateOfTheDatabase(coinsEnumArr)
                .catch(err => {
                    throw new Error(err);
                })
        }
    } catch (err) {
        Logger.error(err)
    }

}

