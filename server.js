const express = require("express");

const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const ServerRouter = require("./server.routes");
const LoginRouter = require("./users/login.routes");

const dotres = require("dotenv").config();
if (dotres.error) {
  throw dotres.error;
}

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// ensure headers are sent with request to backend
app.use(
  cors({
    origin: [process.env.FRONT_URL, "http://localhost:3000"],
    credentials: true,
  })
);

app.use("/api", [LoginRouter, ServerRouter]);

app.use("/static", express.static("./public"));

// choose to re-route to front-end
//
// app.get("/*", (req, res) => {
//   res.sendFile(
//     path.resolve(__dirname) + (process.env.NODE_ENV === "production")
//       ? "client/dist"
//       : "/client/public" + "/index.html"
//   );
// });

app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), () => {
  console.log("Server is listening to port 3000");
});
