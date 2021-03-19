const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 8080 || process.env.PORT;

app.use(cors())
app.set("view engine", "ejs");
app.use(express.static("public"));


app.get("/", (_, res) => {
    res.redirect(`/:no_username_home`);
});

app.get("/:username", (req, res) => {
  res.render("index", { userName: req.params.username });
});

const server =
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
;
const io = require("socket.io")(server);

io.on("connection", (_) => {
    console.log('a user connected');
});


module.exports = io;
