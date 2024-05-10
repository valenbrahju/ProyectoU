import { config } from "dotenv";
config();

export default {
    port : process.env.PORT,
    portbd : process.env.PORTBD,
    user : process.env.USER,
    password : process.env.PASSWORD,
    server : process.env.SERVER,
    database : process.env.DATABASE,
    secret : process.env.SECRET,
    tokenExpira : process.env.TOKEN_EXPIRA,
    cookieExpira : process.env.COOKIE_EXPIRA
}

try {
    config();
  } catch (error) {
    console.error("Error loading .env file:", error);
  }
