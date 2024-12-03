import { RabbitMQLib } from "@repo/rabbitmq/rabbit";
import prismaClient from "@repo/db/client"
const processMessage = async (message: string) => {

    const {senderId,content,roomId} = JSON.parse(message)
    await prismaClient.message.create({ data: { content,senderId,roomId } });
};

(async () => {
    await RabbitMQLib.connectQueue();
    await RabbitMQLib.dequeue(processMessage);
    process.on("SIGINT", async () => {
        console.log("Received SIGINT, shutting down...");
        await RabbitMQLib.close();
        process.exit(0);
    });

    process.on("SIGTERM", async () => {
        console.log("Received SIGTERM, shutting down...");
        await RabbitMQLib.close();
        process.exit(0);
    });
})();