const express = require('express')

const socketConnection = require("./socket-connection")

const app = express()
const port = 8080

app.get('/', (req, res) => {
    let targetHost = req.headers.host
    req.headers.connection = ""
    req.headers["X-Forwarded-For"] = '127.0.0.1'
    console.log(`Request received!!\n Target: ${targetHost}\n Client: 127.0.0.1`)
    socketClient = socketConnection.createSocketConnection(targetHost)
    res.send(socketConnection)
})

app.listen(port, () => {
    console.log(`HTTP Proxy listening on port 127.0.0.1:${port}`)
})