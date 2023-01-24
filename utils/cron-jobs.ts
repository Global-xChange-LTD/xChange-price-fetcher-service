import { CronJob } from 'cron'
import { updateChartHistory } from '../services/coins.history.service';
import { updateCurrencyMarketData } from "../services/coins.market.service";
import Logger from "./logger";

export const updateCoinsData = () => {
    //At every 43 seconds.
    new CronJob('*/30 * * * * *', async () =>{
       await updateCurrencyMarketData()
           .catch(err => Logger.error(`Failed to update second currency market data: ${err}`));
    }).start();

    //At every 43th minute.
    new CronJob('*/45 * * * *', async () =>{
        await updateChartHistory(1)
            .catch(err =>  Logger.error(`Failed to update day currency market data: ${err}`));
    }).start();

    //At minute 11 past every 2nd hour.
    new CronJob('10 */2 * * * ', async () => {
        await updateChartHistory(7)
            .catch(err =>  Logger.error(`Failed to update week market data: '${err.message}`));
    }).start();

    //At minute 31 past every 12th hour
    new CronJob('30 */12 * * *', async () => {
        await updateChartHistory(30)
            .catch(err =>  Logger.error(`Failed to update month market data: '${err.message}`));
    }).start();

    //At minute 3 past every 24th hour.
    new CronJob('15 */24 * * *', async () => {
        await updateChartHistory(365)
            .catch(err =>  Logger.error(`Failed to update year market data: '${err.message}`));
    }).start();
}
