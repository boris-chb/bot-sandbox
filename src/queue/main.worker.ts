import { connection } from "@/queue/redis";
import { Worker } from "bullmq";

export const mainWorker = new Worker(
  "main-queue",
  async (job) => {
    if ((await job.isCompleted()) || (await job.isFailed())) {
      return;
    }
  },
  { connection }
);

if (!mainWorker.isRunning()) {
  mainWorker.run();
}
