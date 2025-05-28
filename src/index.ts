import { Elysia } from "elysia";
import { resolveConfig } from "./config";

const config = await resolveConfig()

const app = new Elysia().get("/", () => "Hello Elysia").listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
