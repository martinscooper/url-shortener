import express from "express";
import { redirect, createHash, getAll } from "./handlers.js";
import asyncHandler from "express-async-handler";
import morgan from "morgan";

export const createServer = () => {
  const server = express();
  const port = process.env.PORT || "3000";
  const serverDomain = process.env.DOMAIN || "localhost";

  if (process.env.NODE_ENV === "dev") {
    server.use(morgan("dev"));
  }

  server.use(express.urlencoded({ extended: false }));
  server.use(express.json());
  server.use(express.static("public"));

  server.post("/api/create", asyncHandler(createHash));
  server.get("/:id", asyncHandler(redirect));

  if (process.env.NODE_ENV === "dev") {
    server.get("/api/getall", asyncHandler(getAll));
  }

  server.listen(port, serverDomain, () =>
    console.log(`Listening on ${serverDomain}:${port} ...`)
  );
};
