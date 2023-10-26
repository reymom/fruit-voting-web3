import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import * as dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT ? process.env.PORT : 8080;

const server: Application = express();
server.use(cors({ origin: "*" }));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

function middleware(req: Request, res: Response, next: NextFunction) {
  next();
}

server.use(middleware);

server.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}\n`);
});

export default server;
