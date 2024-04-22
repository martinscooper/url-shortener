import cluster from "cluster";
import { cpus as _cpus } from "os";
import { createServer } from "./serverFactory.js";

if (cluster.isPrimary) {
  const cpus = _cpus().length;

  console.log(`Forking for ${cpus} CPUs`);
  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }
} else {
  createServer();
}
