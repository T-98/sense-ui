// src/services/WebSocketService.js

class WebSocketService {
    constructor(url) {
        this.url = url;
        this.ws = null;
        this.listeners = [];
    }

    connect() {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
            console.log('WebSocket connected');
        };

        this.ws.onmessage = (message) => {
            const data = message.data;
            console.log('WebSocket message received:', data);
            this.listeners.forEach((callback) => callback(data));
        };

        this.ws.onclose = () => {
            console.log('WebSocket disconnected. Reconnecting in 5 seconds...');
            setTimeout(() => this.connect(), 5000);
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.ws.close();
        };
    }

    addListener(callback) {
        this.listeners.push(callback);
    }

    removeListener(callback) {
        this.listeners = this.listeners.filter((cb) => cb !== callback);
    }
}

export default WebSocketService;
