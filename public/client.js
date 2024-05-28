// const socket= io('http://localhost:8000');
const socket = io('http://localhost:8000');

//Get DOM elements in respective JS variable
const form = document.getElementById('send-container');
const messageInput= document.getElementById('messageInp');
const messageContainer= document.querySelector(".container");

//Audio that will play on recieving message
var audio = new Audio('tune.wav');

// function which will append event info to the container
const append = (message, position)=>{
    const messageElement= document.createElement('div')
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement)
    if(position=='left'){
        audio.play();
    }
}

//if the form gets submitted, send server the message
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, "right");
    socket.emit('send',message);
    messageInput.value = ''
})

//Ask new User for his/her name and let the server know
const name=prompt("Enter your name to join");
// socket.emit('new-user-join',name);
socket.emit('new-user-joined',name);

//if new user joins, recieve his/her name from the server
socket.on('user-joined',name=>{
    append(`${name} joined the chat`,'right')
})

//if server sends a message, recieve it 
socket.on('receive',data=>{
    append(`${data.name}: ${data.message}`, 'left')
})

// if a user left the chat, append the info to the container
socket.on('left',name=>{
    append(`${name} left the chat`, 'right')
})