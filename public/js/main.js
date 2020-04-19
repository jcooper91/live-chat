const chatForm = document.getElementById('chat-form')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
const chatMessages = document.querySelector('.chat-messages')
const timestamp = Date.now() / 1000 | 0
const token = '123456789'

// get username and room from url 
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
console.log(username, room)
const socket = io()

 // Join chat 
 socket.emit('joinRoom', { username, room })

 firebase.database().ref("users").push().set({
    "sender": username,
    "room": room,
    timestamp,
    token
})

 // Get room and users 
 socket.on('roomUsers', ({ room, users }) => {
     outputRoomName(room)
     outputUsers(users)
 })

// Messsage from server
socket.on('message', message => {
    console.log(message)
    outputMessage(message)

    firebase.database().ref("messages").push().set({
        "message": message
    })

    // Scroll down to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight
})

// Message submit 
chatForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const msg = e.target.elements.msg.value

    // emit message to server
    socket.emit('chatMessage', msg)

    e.target.elements.msg.value = ''
    e.target.elements.msg.focus
})

// Output message to the DOM
function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}

// Add room name to DOM 
function outputRoomName(room) {
    roomName.innerText = room
}

// Add users to DOM 
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}