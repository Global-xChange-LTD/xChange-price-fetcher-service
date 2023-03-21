import express, {NextFunction} from "express";
import Logger from "../utils/logger";
import HttpException from "../classes/HttpException";
import CurrencyMarket from "../models/currencyMarket";
import {
    addNewCurrencyMarketCoin,
    getMarketCoinGeckosIds,
    requestMarketsCoingeckoData
} from "../services/coins.market.service";

export async function getCoinsMarketsData(
    req: express.Request,
    res: express.Response,
    next: NextFunction
){
    const query = req.query;

    if (!query['ids']) {
        Logger.error('Missing param: `coin ids');
        next(new HttpException(400, 'Missing param: `coin ids'));
    }

    if (!query['vs_currency']) {
        Logger.error('Missing param: `vs_currency');
        next(new HttpException(400, 'Missing param: `coin ids'));
    }

    let idsFromQueary = query['ids'],
        // @ts-ignore
        vs_currency = query['vs_currency'] ?  query['vs_currency'].toString() : 'usd';


    if(idsFromQueary) {
        try {
            let idsStr = idsFromQueary.toString(),
                idsArrayFromQueary = idsStr.split(','),
                coinsfromDB = await getMarketCoinGeckosIds(),
                missingCoinArr: string[] = [];

            const trimArray = idsArrayFromQueary.map((coin: string) => {
                return coin.trim();
            });

            let uniqueCoinsFromQueary = [...new Set(trimArray)];

            for (const item of uniqueCoinsFromQueary) {
                if(coinsfromDB && !coinsfromDB.includes(item)){
                    missingCoinArr.push(item)
                }
            }

            if(missingCoinArr.length > 0) {
                //Add missing requested coin to database
                let data = await requestMarketsCoingeckoData(missingCoinArr);

                if(data) {
                    for (const item of data){
                        await addNewCurrencyMarketCoin(item);
                    }
                }
            }

            const records = await CurrencyMarket.find({exchange_rate: vs_currency}).where('id').in(uniqueCoinsFromQueary).exec();

            res.status(200).json(records);
        } catch (err: any) {
            next(new HttpException(500, err));
        }
    }
}

