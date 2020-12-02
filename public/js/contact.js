

function sendMessage() {
    var socket = io('http://192.168.0.12:8000');
    socket.emit("messageSent", {
        "name": document.getElementById("name").value,
        "email": document.getElementById("email").value,
        "subject": document.getElementById("subject").value,
        "message": document.getElementById("message").value
    });
}