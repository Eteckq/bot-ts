function handlePrivateMessage(client, message) {
  let { msg, invokername, invokerid } = message;
  msg = msg.toString().trim();
  console.log(
    `Private message received from ${invokername}[${invokerid}]: ${message}`
  );

  let [cmd /*, ...args*/] = msg.substring(1).split(" ");

  switch (cmd.toLowerCase()) {
    default:
      sendPrivateMessage(
        client,
        invokerid,
        `\n[b][color=#5D77FF]Hello ${invokername}![/color][/b] msg: ${msg} cmd: ${cmd}`
      );
      break;
    case "yt":
      if (args.length > 1) {
        getAndStartYTStream(args[0]);
      } else {
        sendPrivateMessage(
          client,
          invokerid,
          `\n[b][color=#5D77FF]Il manque l'url de la vidéo: yt UrlYt[/color][/b]`
        );
      }
  }
}

function getAndStartYTStream(url) {
  console.log("start " + url);
}

/**
 * @param {TeamSpeakClient} client
 * @param {number} target_id
 * @param {string} message
 * */
function sendPrivateMessage(client, target_id, message) {
  client
    .send("sendtextmessage", {
      targetmode: 1, //CLIENT
      target: target_id, //current serveradmin channel
      msg: message,
    })
    .catch(console.error);
}

module.exports = handlePrivateMessage;
