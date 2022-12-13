import { CronJob } from 'cron'
import { updateChartHistory } from '../services/coins.history.service';
import { updateCurrencyMarketData } from "../services/coins.market.service";
import Logger from "./logger";

export const updateCoinsData = () => {
    //At every 30 seconds.
   /* new CronJob('*!/30 * * * * *', async () =>{
       await updateCurrencyMarketData()
           .catch(err => Logger.error(`Failed to udpate currency market data: ${err}`));
    }).start();
*/
    //At every 40th minute.
    new CronJob('*/40 * * * *', async () =>{
        await updateChartHistory(1)
            .catch(err =>  Logger.error(`Failed to udpate currency market data: ${err}`));
    }).start();

    //At minute 10 past every 2nd hour.
    new CronJob('10 */2 * * * ', async () => {
        await updateChartHistory(7)
            .catch(err =>  Logger.error(`Error when updating week requests: '${err.message}`));
    }).start();

    //At minute 30 past every 12th hour
    new CronJob('30 */12 * * *', async () => {
        await updateChartHistory(30)
            .catch(err =>  Logger.error(`Error when updating month requests: '${err.message}`));
    }).start();

    //At minute 15 past every 24th hour.
    new CronJob('10 */24 * * *', async () => {
        await updateChartHistory(365)
            .catch(err =>  Logger.error(`Error when updating year requests: '${err.message}`));
    }).start();
}
