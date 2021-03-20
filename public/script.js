const socket = io();
const bodyDiv = document.getElementById("container");

// ref: https://gomakethings.com/dynamically-changing-the-text-color-based-on-background-color-contrast-with-vanilla-js/
const getContrast = (hexcolor) => {
  if (hexcolor.slice(0, 1) === "#") {
    hexcolor = hexcolor.slice(1);
  }

  if (hexcolor.length === 3) {
    hexcolor = hexcolor
      .split("")
      .map(function (hex) {
        return hex + hex;
      })
      .join("");
  }

  var r = parseInt(hexcolor.substr(0, 2), 16);
  var g = parseInt(hexcolor.substr(2, 2), 16);
  var b = parseInt(hexcolor.substr(4, 2), 16);

  var yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128 ? "black" : "white";
};

if (USERNAME === ":no_username_home") {
  bodyDiv.innerHTML =
    "Hey 👋, Please visit website from <a href='http://t.me/some_random_magic_bot'>telegram bot</a>🤖";
} else {
  if (BACKGROUND && BODYTEXT) {
    document.body.style.backgroundColor = BACKGROUND;
    bodyDiv.style.color = getContrast(BACKGROUND);

    bodyDiv.innerHTML = BODYTEXT;
    socket.on("message", (msg) => {
      if (msg.username === USERNAME) {
        if (msg.type === "background") {
          document.body.style.backgroundColor = msg.body;
          bodyDiv.style.color = getContrast(msg.body);
        }

        if (msg.type === "body_text") {
          bodyDiv.innerHTML = msg.body;
        }
      }
    });
  } else {
    bodyDiv.innerHTML =
      "😥 No user found.\nPlease create account from our <a href='http://t.me/some_random_magic_bot'>telegram bot</a>🤖";
  }
}
