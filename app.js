import { log } from "console";
import express from "express";
import { shortenedRoutes } from "./routes/shortner.routes.js";

const app = express();
const port = 3002;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs"); //tells Express to use EJS for rendering views.

//express router
// app.use(router);
app.use(shortenedRoutes);

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
