const socket = new WebSocket('ws://localhost:1279');

socket.addEventListener('open', function (event) {
  console.log('scanner is connected');
})

socket.addEventListener('message', function (event) {
  console.log('Notification:', event.data);
})
