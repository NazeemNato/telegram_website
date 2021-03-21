const express = require("express");
const cors = require("cors");
const User = require("./model/User");

const app = express();

const PORT = 8080 || process.env.PORT;

app.use(cors());
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (_, res) => {
  res.redirect(`/:no_username_home`);
});

app.get("/:username", async (req, res) => {
  const { username } = req.params;
  if (username !== "no_username_home") {
    const user = await User.findOne({ username });
    if (user) {
      res.render("index", {
        userName: username,
        backgroundColor: user.background,
        bodyText: { html: user.body_text },
        metaDesc: user.meta
      });
    } else {
      res.render("index", {
        userName: username,
        backgroundColor: undefined,
        bodyText: undefined,
        metaDesc: "Create a simple single page website with the telegram bot builder. Choose a customizable background color and body content."
      });
    }
  } else {
    res.render("index", {
      userName: username,
      backgroundColor: undefined,
      bodyText: undefined,
      metaDesc: "Create a simple single page website with the telegram bot builder. Choose a customizable background color and body content."
    });
  }
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

const io = require("socket.io")(server);

io.on("connection", (_) => {
  console.log("a user connected");
});

module.exports = io;
