

function sendMessage() {
    var socket = io('http://localhost');
    socket.emit("messageSent", {
        "name": document.getElementById("name").value,
        "email": document.getElementById("email").value,
        "subject": document.getElementById("subject").value,
        "message": document.getElementById("message").value
    });
}