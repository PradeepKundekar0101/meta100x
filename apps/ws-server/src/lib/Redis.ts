import Redis from "ioredis";
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
export class RedisClient {
  private static publisher: Redis | null = null;
  private static subscriber: Redis | null = null;

  static getPublisher = () => {
    if (this.publisher) {
      return this.publisher;
    }
    return (this.publisher = new Redis(redisUrl));
  };
  static getSubscriber = () => {
    if (this.subscriber) {
      return this.subscriber;
    }
    return (this.subscriber = new Redis(redisUrl));
  };
}
