import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

client
  .$connect()
  .then(() => {
    console.log("DB connected");
  })
  .catch((e: any) => {
    console.log("Error connecting db");
    console.log(e);
  });
export default client;
