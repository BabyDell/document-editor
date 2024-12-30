const WebSocket = require('y-websocket/bin/utils').WebsocketServer

const port = 1234
const host = '0.0.0.0'

const wss = new WebSocket({ host, port })

console.log(`WebSocket server running on ws://${host}:${port}`)