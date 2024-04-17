import schedule from 'node-schedule'
import { deletingEmptyOrders } from './deletingEmptyOrders.js';
import { changeStatusForFinisedOrders } from './changeStatusForFinisedOrders.js';


export const crons = () => {
    schedule.scheduleJob('0 0 * * * *', () => deletingEmptyOrders())
    schedule.scheduleJob('*/56 * * * * *', () => changeStatusForFinisedOrders())
}