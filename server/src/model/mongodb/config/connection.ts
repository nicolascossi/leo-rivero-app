import { DB_HOST, DB_PASS, DB_PORT, DB_USER } from "@config/consts";
import mongoose from "mongoose";

const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}${typeof DB_PORT !== "string" ? ":" + DB_PORT : ""}/try?retryWrites=true&w=majority`;

mongoose.connect(uri)
  .then((db) => {
    console.log(`The database: ${db.connection.host} Has been connected succesfully`);
  })
  .catch((error) => {
    console.log("The database had an error:", error);
  });
