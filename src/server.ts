import express, { Application } from "express";
import Server from "./index";

const app: Application = express();
const server: Server = new Server(app);
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

//start(app, server, PORT)

export function start(app: Application, server: Server, port: number) {
    return app
        .listen(port, "localhost", function () {
            console.log(`Server is running on port ${port}.`);
        })
        .on("error", (err: any) => {
            if (err.code === "EADDRINUSE") {
                console.log(`Error: address already in use on port ${port}`);
            } else {
                console.log(err);
            }
        });
}

export function randomPort(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
