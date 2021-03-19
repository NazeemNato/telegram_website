const socket = io();
const bodyDiv = document.getElementById("container");

if (USERNAME === ":no_username_home") {
  bodyDiv.innerHTML =
    "Hey 👋, Please visit website from <a href='http://t.me/some_random_magic_bot'>telegram bot</a>🤖";
} else {
  bodyDiv.innerHTML = `Hola 👋, ${USERNAME}`;
  socket.on("message", (msg) => {
    if (msg.username === USERNAME) {
      if (msg.type === "background") {
        document.body.style.backgroundColor = msg.body;
      }
      if (msg.type === "body_text") {
        bodyDiv.innerHTML = msg.body;
      }
    }
  });
}
