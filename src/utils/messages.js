const generateMessage = (text, id, username, userno) => {
    return {
        text, id, username, userno,
        createdAt: new Date().getTime()
    }
}

module.exports = generateMessage