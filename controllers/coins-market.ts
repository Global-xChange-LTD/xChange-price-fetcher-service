import express, {NextFunction} from "express";
import Logger from "../utils/logger";
import HttpException from "../classes/HttpException";
import {COINGECKO_API_URL} from "../config/config";
import CurrencyMarket, {ICurrencyMarket} from "../models/currencyMarket";
import {FiatExchanges} from "../enums/coin-enums";
import {
    addNewCurrencyMarketCoin, getExchangeRate,
    getMarketCoinGeckosIds,
    requestMarketsCoingeckoData
} from "../services/coins.market.service";

export async function getCoinsMarketsData(
    req: express.Request,
    res: express.Response,
    next: NextFunction
){
    /*
     Return all object from the database that are containing in the string of coins/
    */
    const params = req.params;

    if (!params['ids'] || !params['vs_currency']) {
        Logger.error('Missing one of params: `coin ids, `vs_currency`');
        next(new HttpException(400, 'Missing one of params: `coin ids, `vs_currency'));
    }

    let idsFromQueary = params['ids'],
        // @ts-ignore
        vs_currency = params['vs_currency'].toString();

    if (idsFromQueary) {
        try {
            let idsStr = idsFromQueary.toString(),
                idsArrayFromQueary = idsStr.split(','),
                coinsfromDB = await getMarketCoinGeckosIds() || [],
                missingCoinArr: string[] = [];

            for (const item of idsArrayFromQueary) {
                if(coinsfromDB && !coinsfromDB.includes(item)){
                    missingCoinArr.push(item)
                }
            }

            if (missingCoinArr.length > 0) {
                //Add missing requested coin to database
                let url = `${COINGECKO_API_URL}coins/markets?ids=${missingCoinArr.join('%2C')}&vs_currency=${vs_currency}`,
                    data = await requestMarketsCoingeckoData(url);

                if(data) {
                    for (const item of data ) {
                       await addNewCurrencyMarketCoin(item);
                    }
                }
            }

            const records = await CurrencyMarket.find().where('id').in(idsArrayFromQueary).exec();

            if (vs_currency !== FiatExchanges.USD){
                let exchange_rate = await getExchangeRate(vs_currency.toUpperCase());

                for (const item of records ) {
                    item.current_price = (parseFloat(item.current_price) * exchange_rate).toString();
                    item.market_cap = (parseFloat(item.market_cap) * exchange_rate * exchange_rate).toString();
                    item.price_change_percentage_24h = (parseFloat(item.price_change_percentage_24h) * exchange_rate).toString();
                    item.market_cap_change_24h = (parseFloat(item.market_cap_change_24h)  * exchange_rate).toString();
                    item.market_cap_change_percentage_24h = (parseFloat(item.market_cap_change_percentage_24h) * exchange_rate).toString();
                    item.total_volume = (parseFloat(item.total_volume) * exchange_rate).toString();
                    item.circulating_supply = (parseFloat(item.circulating_supply) * exchange_rate).toString();
                }
            }

            res.status(200).json(records);
        } catch (err: any) {
            next(new HttpException(500, err));
        }
    }
    next();
}

