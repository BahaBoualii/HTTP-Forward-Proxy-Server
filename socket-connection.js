const net = require('net')

function createSocketConnection(targetHost) {
    const client = new net.Socket();

    client.connect(targetHost, () => {
        console.log(`Connected to ${targetHost}:${targetPort}`)
    })

    client.on('data', (data) => {
        console.log('Received data from server:', data.toString());
    });
    
    client.on('error', (error) => {
        console.error('Connection error:', error);
    });
    
    client.on('close', () => {
        console.log('Connection closed');
    });
}

module.exports = {createSocketConnection}