// Vercel serverless entry. The handler lives in server/ so its packages resolve
// from server/node_modules. Locally, server/src/server.js is used instead.
export { default } from "../server/src/vercel.js";
