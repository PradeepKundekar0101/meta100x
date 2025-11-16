import amqp from "amqplib";

const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";

export class RabbitMQLib {
  static channel: amqp.Channel | null = null;
  static connection: amqp.Connection | null = null;

  static async connectQueue(retryCount = 5, retryDelay = 5000): Promise<void> {
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
  }

  static async enqueue(message: string): Promise<void> {
    if (!this.channel) {
      throw new Error("RabbitMQ channel is not initialized.");
    }
    this.channel.sendToQueue("messages", Buffer.from(message));
  }

  static async dequeue(
    processMessage: (message: string) => Promise<void>,
  ): Promise<void> {
    if (!this.channel) {
      throw new Error("RabbitMQ channel is not initialized.");
    }

    await this.channel.consume(
      "messages",
      async (msg) => {
        if (msg) {
          const messageContent = msg.content.toString();
          try {
            await processMessage(messageContent);
            this.channel?.ack(msg);
          } catch (error) {
            console.error("Error processing message:", error);
            this.channel?.nack(msg);
          }
        }
      },
      { noAck: false },
    );
  }

  static async close(): Promise<void> {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
    console.log("RabbitMQ connection closed.");
  }
}
