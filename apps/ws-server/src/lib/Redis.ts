import Redis from "ioredis";

export class RedisClient {
  private static publisher: Redis | null = null;
  private static subscriber: Redis | null = null;

  private static getUrl() {
    return process.env.REDIS_URL || "redis://localhost:6379";
  }

  static getPublisher = () => {
    if (this.publisher) {
      return this.publisher;
    }
    return (this.publisher = new Redis(this.getUrl()));
  };
  static getSubscriber = () => {
    if (this.subscriber) {
      return this.subscriber;
    }
    return (this.subscriber = new Redis(this.getUrl()));
  };
}
