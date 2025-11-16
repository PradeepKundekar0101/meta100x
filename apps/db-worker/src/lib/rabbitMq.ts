import amqp from "amqplib";
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";

export class RabbitMQLib {
  static channel: amqp.Channel | null = null;
  static connection: amqp.Connection | null = null;
  static connectQueue = async (retryCount = 2, retryDelay = 5000) => {
    while (retryCount > 0) {
      try {
        console.log("Attempting to connect to RabbitMQ...");
        this.connection = await amqp.connect(RABBITMQ_URL);
        this.channel = await this.connection.createChannel();
        await this.channel.assertQueue("messages", { durable: true });
        console.log("Connected to RabbitMQ successfully.");
        return;
      } catch (error) {
        console.error("RabbitMQ connection failed, retrying...", error);
        retryCount--;
        await new Promise((res) => setTimeout(res, retryDelay));
      }
    }
    console.error("Failed to connect to RabbitMQ after retries.");
    process.exit(1);
  };
  static enqueue = async (message: string) => {
    this.channel?.sendToQueue("messages", Buffer.from(message));
  };
}
