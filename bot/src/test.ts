import Bull from "bull";

const queue = new Bull("test", {
  redis: {
    host: "localhost",
    port: 6379,
    password: "e4bb7f7655d08be68a906c445465d50b",
  },
});

queue.process("*", async (job) => {
  console.log(job.data);
});

const options = {
  repeat: {
    every: 1000,
  },
  jobId: "uuid",
};
(async () => {
  await queue.add({ a: 2 }, options);
})();

setTimeout(async () => {
  console.log("Stop!");
  await queue.removeRepeatable({
    ...options.repeat,
    jobId: options.jobId,
  });
}, 5000);
