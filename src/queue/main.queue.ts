import { Queue, QueueEvents } from "bullmq";
import { connection } from "@/queue/redis";

export const mainQueue = new Queue("main-queue", { connection });
export const mainQueueEvents = new QueueEvents("main-queue", { connection });
