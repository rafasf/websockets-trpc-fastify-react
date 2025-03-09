import Redis from "ioredis";
import { envConfig } from "./infra/env.server";

const payloadOne = [
  {
    id: "1",
    name: "Leanne Graham",
    bio: "Multi-layered client-server neural-net",
  },
  {
    id: "2",
    name: "Ervin Howell",
    bio: "Proactive didactic contingency",
  },
  {
    id: "3",
    name: "Clementine Bauch",
    bio: "Face to face bifurcated interface",
  },
  {
    id: "4",
    name: "Patricia Lebsack",
    bio: "Multi-tiered zero tolerance productivity",
  },
];

const payloadTwo = [
  {
    id: "5",
    name: "Chelsey Dietrich",
    bio: "User-centric fault-tolerant solution",
  },
  {
    id: "6",
    name: "Mrs. Dennis Schulist",
    bio: "Synchronised bottom-line interface",
  },
  {
    id: "7",
    name: "Kurtis Weissnat",
    bio: "Configurable multimedia task-force",
  },
  {
    id: "8",
    name: "Nicholas Runolfsdottir V",
    bio: "Implemented secondary concept",
  },
  {
    id: "9",
    name: "Glenna Reichert",
    bio: "Switchable contextually-based project",
  },
  {
    id: "10",
    name: "Clementina DuBuque",
    bio: "Centralized empowering task-force",
  },
];

const client = new Redis(envConfig.VALKEY_URL);

const payloads = [payloadOne, payloadTwo];

async function updateRedis() {
  const randomIndex = Math.floor(Math.random() * payloads.length);
  const randomPayload = payloads[randomIndex];
  console.log(`Publishing random payload (index: ${randomIndex})`);
  client.publish("list-1", JSON.stringify(randomPayload));
}

const interval = setInterval(updateRedis, 3000);

process.on("SIGINT", async () => {
  clearInterval(interval);
  await client.quit();
  console.log("Redis connection closed");
  process.exit(0);
});

updateRedis();
