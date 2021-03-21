const socket = io();
const bodyDiv = document.getElementById("container");

// ref: https://stackoverflow.com/questions/44195322/a-plain-javascript-way-to-decode-html-entities-works-on-both-browsers-and-node
const decodeHtml = (encodedString) => {
  let translate_re = /&(nbsp|amp|quot|lt|gt);/g;
  let translate = {
    nbsp: " ",
    amp: "&",
    quot: '"',
    lt: "<",
    gt: ">",
  };
  return encodedString
    .replace(translate_re, (_, entity) => {
      return translate[entity];
    })
    .replace(/&#(\d+);/gi, (_, numStr) => {
      var num = parseInt(numStr, 10);
      return String.fromCharCode(num);
    });
};

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
    // Color section
    document.body.style.backgroundColor = BACKGROUND;
    bodyDiv.style.color = getContrast(BACKGROUND);

    // Text
    let decode = decodeHtml(BODYTEXT);
    // let regex = /^\{"html"-" \}\}$/i;
    // console.log(regex.test(decode))
    // console.log(decode)
    let html = decode.replace('{"html":"','').replace('"}','').trim()
    bodyDiv.innerHTML = html;

    // Socket
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
