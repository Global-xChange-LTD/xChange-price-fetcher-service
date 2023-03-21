import express, {NextFunction} from "express";
import Logger from "../utils/logger";
import HttpException from "../classes/HttpException";
import {
    addNewCurrencyHistoryCoin,
    getCoingeckoCoinsIdsFromDB,
    getCoinHistoryDataBasedOnDays, makeCoingeckoRequest, updateCoinHistoryData
} from "../services/coins.history.service";
import {COINGECKO_API_URL} from "../config/config";

export async function getCoinHystoryData(
    req: express.Request,
    res: express.Response,
    next: NextFunction
){

    const query = req.query;

    if (!query['days'] || !query['vs_currency'] || !req.originalUrl) {
        Logger.error('Missing one of params: `days, `vs_currency`, `url`');
        next(new HttpException(400, 'Missing one of params: `days, `vs_currency`, `url`'));
    }

    try {
        let coinId =  req.originalUrl.split("/")[2],
            days = query['days'],
            vs_currency = query['vs_currency'],
            coinsArrayInDB = await getCoingeckoCoinsIdsFromDB(),
            coinExists = false;

        if(coinsArrayInDB?.includes(coinId)) {
            coinExists = true
        }

        if(coinExists){
            // @ts-ignore
            await getCoinHistoryDataBasedOnDays(coinId, days.toString())
                .then((resp)=> {
                    if(resp.prices.length === 0) {
                        const url = `${COINGECKO_API_URL}${coinId}/market_chart?days=${days!.toString()}&vs_currency=${vs_currency}`;
                        makeCoingeckoRequest(url).then((response) => {
                            let result = resp;

                            if(response.length > 0) {
                                let keyForUpdate: string = '';
                                result = response;

                                switch (days) {
                                    case '1':
                                        keyForUpdate = 'dayHistoryData'
                                        break;
                                    case '7':
                                        keyForUpdate = 'weekHistoryData';
                                        break;
                                    case '30':
                                        keyForUpdate = 'monthHistoryData';
                                        break;
                                    case '365':
                                        keyForUpdate = 'yearHistoryData';
                                        break;
                                }

                                updateCoinHistoryData(coinId,result, keyForUpdate)
                            }

                            return res.status(200).json({prices: result});
                        });
                    } else {
                        return res.status(200).json(resp);
                    }
                });
        } else {
            let newRecord = await addNewCurrencyHistoryCoin(coinId, vs_currency)
                .catch(err => {
                    throw new Error(err);
                });

            // @ts-ignore
            await getCoinHistoryDataBasedOnDays(newRecord.id, days.toString())
                .then((resp)=>{
                    return res.status(200).json(resp);
                });
        }
    } catch (err: any) {
        next(new HttpException(500, err));
    }
}

