const express = require('express')

const net = require('net')

const app = net.createServer()

const port = 8080

app.on("connection", (clientToProxySocket) => {
    console.log("client connected to Proxy")
    clientToProxySocket.once("data", (data) => {
        let isConnectionTLS = data.toString().indexOf("CONNECT") !== -1;
        let serverPort = 80;
        let serverAddress;

        if (isConnectionTLS) {
            serverPort = 433
            serverAddress = data
                .toString()
                .split("CONNECT")[1]
                .split(" ")[1]
                .split(":")[0];
        } else {
            serverAddress = data
                .toString()
                .split("Host: ")[1]
                .split("\\n")[0];
        }
        
        let proxyToServerSocket = net.createConnection(
            {
                host: serverAddress,
                port: serverPort,
            }, 
            () => {
                console.log("Proxy connected to server")
            }
        );

    if (isConnectionTLS) {
        clientToProxySocket.write("HTTP/1.1 200 OK\\r\\n\\n")
    } else {
        proxyToServerSocket.write(data)
    }

    clientToProxySocket.pipe(proxyToServerSocket)
    proxyToServerSocket.pipe(clientToProxySocket)

    proxyToServerSocket.on("error", (err) => {
        console.log("Proxy to server error")
        console.log(err)
    })

    clientToProxySocket.on("error", (err) => {
        console.log("Client to proxy error")
        console.log(err)
    })

    app.on("close", () => {
        console.log("Connection is closed")
        });
    })
})


app.listen({ host: "0.0.0.0", port: port }, () => {
    console.log(`HTTP Proxy running on PORT: ${port}`)
})