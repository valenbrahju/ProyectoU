import { config } from "dotenv";
config()

export default {
    port : process.env.PORT,
    user : process.env.USER,
    password : process.env.PASSWORD,
    server : process.env.SERVER,
    database : process.env.DATABASE
}