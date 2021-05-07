const { TeamSpeakClient } = require("node-ts");
const handlePrivateMessage = require("./message_handler");

let botname = "MusicBot";
let clientname = "DJ Yo";

async function main(host, login = "", password = "") {
  const client = new TeamSpeakClient(host);

  process.on("uncaughtException", function (err) {
    console.log("Caught exception: ", err);
    sendChannelMessage(client, "Music bot restarted.");
    process.exit();
  });

  client.on("error", (e) => console.error(e));

  await client.connect();
  await client.send("use", { sid: 1 });

  await client.send("login", {
    client_login_name: login,
    client_login_password: password,
  });
  await client.send("clientupdate", { client_nickname: botname });

  // register notifications when user sends private message
  await client.send("servernotifyregister", {
    event: "textprivate",
  });

  // register notifications when user sends message on normal channel
  // await client.send("servernotifyregister", {
  //     event: "textchannel"
  // });

  // register server events notifications
  // await client.send("servernotifyregister", {
  //     event: "server"
  // });

  // await client.send("servernotifyregister", {
  //     event: "channel",
  //     id: 0 // listen to all channels
  // });

  const clientlist = await client.send("clientlist");

  // listening for client to connect to the server
  await client.on("cliententerview", async (data) => {
    await welcomeMessage(client, data[0]);
  });

  let musicBotInfo = clientlist.response.find(
    (obj) => obj.client_nickname === clientname
  );

  if (musicBotInfo) {
    await moveAdminTo(client, musicBotInfo.cid);
    sendChannelMessage(client, "Music bot successfully started.");
  } else {
    console.error(`${clientname} not found`);
  }

  // listening for messages
  client.on("textmessage", (data) => {
    if (!data[0] || data[0].invokeruid === "serveradmin")
      //ignore messages from serveradmin
      return;
    else if (data[0].targetmode === 1) handlePrivateMessage(client, data[0]);
  });

  // keeping connection alive every 4 min
  setInterval(() => {
    client.send("version");
  }, 240000);
}

main("ts3.ns3.tscast.net:2032").catch((err) => {
  console.error("An error occurred: ");
  console.error(err);
});
