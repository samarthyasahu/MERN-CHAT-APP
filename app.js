const express = require("express");
const app = express();
const errorHandlers = require("./handlers/errorHandlers");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Setup Cors origin
app.use(require("cors")());

//import routers
app.use("/user", require("./routes/user"));
app.use("/chatroom", require("./routes/chatroom"));

//Error handlers
app.use(errorHandlers.notFound);
app.use(errorHandlers.mongoseErrors);
if (process.env.ENV === "DEVELOPMENT") {
  app.use(errorHandlers.developmentErrors);
} else {
  app.use(errorHandlers.productionErrors);
}

module.exports = app;
