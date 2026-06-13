const socket = io('http://localhost:3000');
var chatForm = document.getElementById("chat-form");

var chatMessages = document.querySelector(".chat-messages");
var msg = document.getElementById("msg");
var roomName = document.getElementById("room-name");
var userList = document.getElementById("users");
const{username , room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})



socket.emit("joinRoom", {username, room});
socket.on("usersInRoom", ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
})

socket.on("message", (msg) => {
    console.log(msg);
    sendMsg(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    socket.emit("chatMessage", msg);
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
})

function sendMsg(message) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    chatMessages.appendChild(div);
}


function outputRoomName(room) {
    roomName.innerHTML = room;
}

function outputUsers(users) {
    userList.innerHTML = `
   ${users.map(user => `<li>${user.username}</li>`).join('')}
   `
}