import dotenv from "dotenv";
dotenv.config();
import { Connection } from "./database/conn.js";
import { app } from "./app.js";

let port = process.env.PORT || 3000;


Connection().then(() => {
    app.listen(port, () => {
        console.log(port);
    })
}).catch(err => {
    app.on('error', (error) => {
        console.log(error);
        throw error
    })
})