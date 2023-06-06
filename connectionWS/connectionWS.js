import { aWss } from "../index.js";

let rooms = [];

const connectionWS = async (ws, req) => {
  ws.on("message", (msg) => {
    msg = JSON.parse(msg);
    console.log(rooms);
    switch (msg.event) {
      case "message":
        broadcastMessage(ws, msg);
        break;
      case "connection":
        broadcastConnection(ws, msg);
        break;
    }
  });
  ws.on("close", (code, reason) => {
    //msg = JSON.parse(msg);
    let clientsConnect = [];
    aWss.clients.forEach((cl) => clientsConnect.push(cl.name));
    rooms.forEach((el) => {
      el.clients = el.clients.filter((client) => clientsConnect.includes(client.name));
      if (el.clients.length) {
        el.clients[0].socket.send(
          JSON.stringify({
            event: "opponentLeave",
          })
        );
      }
      console.log("CLOSE NOW ROOM", el);
    });
  });
};

const broadcastMessage = async (ws, msg) => {
  console.log("SEND MSG", msg);
  rooms.forEach((el) => {
    if (el.room === msg.room) {
      el.clients.forEach((client) => {
        if (client.name !== msg.name) {
          client.socket.send(JSON.stringify(msg));
        }
      });
    }
  });
};

const broadcastConnection = (ws, msg) => {
  ws.name = msg.name;
  if (!rooms.filter((el) => el.room === msg.room).length) {
    //new room
    rooms.push({
      room: msg.room,
      clients: [{ name: msg.name, socket: ws }],
    });
    console.log("NEW ROOM CREATED");
  } else {
    // exist room
    rooms.forEach((el) => {
      //find room
      if (el.room === msg.room) {
        console.log("FIND ROOM", el);
        //add new client
        if (
          !el.clients.filter((client) => client.name === msg.name).length &&
          el.clients.length < 2
        ) {
          el.clients.push({ name: msg.name, socket: ws });
          console.log("ADD NEW CLIENT", el.room);
        } else if (
          !el.clients.filter((client) => client.name === msg.name).length &&
          el.clients.length === 2
        ) {
          console.log("FULL ROOM");
          ws.send(
            JSON.stringify({
              event: "info",
              content: "Sorry this room is already full",
            })
          );
        } else {
          // change exist client
          console.log("Client EXIST");
          el.clients = el.clients.map((client) => {
            if (client.name === msg.name) {
              return { name: msg.name, socket: ws };
            }
            return client;
          });
        }
        if (el.clients.length === 2) {
          el.clients.forEach((client) => {
            client.socket.send(
              JSON.stringify({
                event: "canStart",
              })
            );
          });
        }
      }
    });
  }
  console.log("rooms", rooms);
};

export default connectionWS;
