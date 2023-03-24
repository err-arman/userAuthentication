const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./router/router");
const app = express();
// doteenv and mongoose setup

dotenv.config();
mongoose.set("strictQuery", false);

// USE MIDDLEWARE START ----
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(router);

// USE MIDDLEWARE END ----

// SERVER START

const port = 4000;
mongoose
  .connect(process.env.mongoosePORT)
  .then(() => {
    app.listen(process.env.PORT || port, () => {
      console.log(`server listen on PORT ${process.env.PORT || port}`);
    });
  })
  .catch((e) => {
    console.log(`Server Error : ${e}`);
  });
// SERVER END
