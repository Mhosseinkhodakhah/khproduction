import adminLogsModel from "../DB/adminLogger";
import userLogsModel from "../DB/models";
import mqConnection from "./rabbitMq.service";


const handleIncomingNotification = async (msg: string, type: number) => {
    try {
        const parsedMessage = JSON.parse(msg);
        console.log(parsedMessage)
        if (type == 0) {                               // when user logs wants make logs
            const data = parsedMessage;
            const newLog = await userLogsModel.create(data)
        }
        if (type == 1) {                                   // when admin logs wants make logs
            const data = parsedMessage;
            const newLog = await adminLogsModel.create(data)
        }
        console.log(`Received Notification`, parsedMessage);
    } catch (error) {
        console.error(`Error While Parsing the message`);
    }
};


const listen = async () => {
    await mqConnection.connect();
    await mqConnection.consume(handleIncomingNotification);
};


export default listen;
