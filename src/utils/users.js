const users = []


const addUser = ({ id, username, userno, room }) => {
    if(!username || !room || !userno) {
        return {
            error: '잘못된 경로로 접근하셨습니다.'
        }
    }

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })
    
    if (existingUser) {
        return {
            error: '해당 이름의 채팅 참가자가 이미 존재합니다.'
        }
    }

    const user = { id, username, userno, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

module.exports = {
    addUser,
    removeUser,
    getUser
}