const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $todayDate = document.querySelector('#today')

// Templates
const adminMessageTemplate = document.querySelector('#adminmessage-template').innerHTML
const sendMessageTemplate = document.querySelector('#sendmessage-template').innerHTML
const receiveMessageTemplate = document.querySelector('#receivemessage-template').innerHTML

// Options
const {username, userno, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

socket.on('adminMessage', (message) => {
    const html = Mustache.render(adminMessageTemplate, {
        message: message.text
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('message', (message) => {
    console.log(message)

    if(socket.id === message.id) {
        const html = Mustache.render(sendMessageTemplate, {
            message: message.text,
            createdAt: moment(message.createdAt).format('hh:mm')
        })
        $messages.insertAdjacentHTML('beforeend', html)
        window.scrollTo(0,document.body.scrollHeight)
    } else {
        const html = Mustache.render(receiveMessageTemplate, {
            message: message.text,
            createdAt: moment(message.createdAt).format('hh:mm'),
            username: message.username,
            userno: message.userno 
        })
        $messages.insertAdjacentHTML('beforeend', html)
        window.scrollTo(0,document.body.scrollHeight)
    }
})

$messageForm.addEventListener('submit', (e)=> {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {
        // enable
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error) {
            return console.log(error)
        }

        console.log('Message Delivered!')
    })
})

socket.emit('join', {username, userno, room}, (error) => {
    if(error) {
        alert(error)
        window.close()
    }
})

const date = new Date()
const today = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const todate = date.getDate()
    const day = date.getDay()
    const week = new Array('일', '월', '화', '수', '목', '금', '토');

    return `${year}년 ${month + 1}월 ${todate}일 ${week[day]}요일`
}


$todayDate.innerHTML += `${today(date)}`;


