const WebSocket = require('ws');

const PORT = process.env.PORT || 8080;
const TOKEN = process.env.TOKEN || 'LACC2024';

const server = new WebSocket.Server({ port: PORT });
const connections = new Set();

server.on('connection', (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get('token');
    if (token !== TOKEN) {
        ws.close();
        return;
    }
    connections.add(ws);
    ws.on('message', (data) => {
        const msg = data.toString();
        connections.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(msg);
            }
        });
    });
    ws.on('close', () => connections.delete(ws));
});

console.log(`LACC relay running on port ${PORT}`);
