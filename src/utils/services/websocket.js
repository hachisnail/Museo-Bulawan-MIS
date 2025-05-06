let socketRef = null;
let isConnectedRef = { current: false };
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const baseReconnectDelay = 1000;

export const connectWebSocket = (onDataChange, onRefresh) => {
  if (isConnectedRef.current && socketRef) {
    // console.log('WebSocket already connected');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    // console.error('No token found, unable to connect to WebSocket');
    return;
  }

  if (socketRef) {
    socketRef.close();
  }

  const isSecure = window.location.protocol === 'https:';
  const protocol = isSecure ? 'wss' : 'ws';
  const hostname = window.location.hostname;
  const port = isSecure ? '' : ':5000';
  
  const wsUrl = `${protocol}://${hostname}${port}/?token=${token}`;
  
  console.log("Connecting to WebSocket:", wsUrl);
  const socket = new WebSocket(wsUrl);
  
  // const socket = new WebSocket(
  //   `${protocol}://${hostname}${port ? `:${port}` : ''}/?token=${token}`
  // );



  socket.onopen = () => {
    console.log('WebSocket connected successfully');
    isConnectedRef.current = true;
    reconnectAttempts = 0;
    socketRef = socket;
    socket.send('ping');
  };

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      
      if (message.type === 'data-change') {
        // console.log('Data change received:', message);
        if (typeof onDataChange === 'function') {
          onDataChange(message);
        }
      } else if (event.data === 'refresh') {
        console.log('Refresh command received');
        if (typeof onRefresh === 'function') {
          onRefresh();
        }
      } else if (event.data === 'pong') {
        // console.log('Pong received');
      }
    } catch (e) {
      // console.log('WebSocket message:', event.data);
    }
  };

  socket.onerror = (error) => {
    // console.error('WebSocket error:', error);
    isConnectedRef.current = false;
  };

  socket.onclose = (event) => {
    // console.log('WebSocket closed:', event.code, event.reason);
    isConnectedRef.current = false;
    
    if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
      const delay = baseReconnectDelay * Math.pow(2, reconnectAttempts);
      reconnectAttempts++;
      
      // console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttempts})`);
      setTimeout(() => connectWebSocket(onDataChange, onRefresh), delay);
    }
  };
};

export const closeWebSocket = () => {
  if (socketRef) {
    socketRef.close(1000, 'Manual disconnect');
    socketRef = null;
    isConnectedRef.current = false;
  }
};

let connectionPromise = null;
export const ensureWebSocketConnection = (onDataChange, onRefresh) => {
  if (!connectionPromise) {
    connectionPromise = new Promise((resolve) => {
      connectWebSocket(onDataChange, () => {
        if (onRefresh) onRefresh();
        resolve();
      });
    }).finally(() => {
      connectionPromise = null;
    });
  }
  return connectionPromise;
};