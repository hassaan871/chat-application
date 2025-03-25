require('dotenv').config();

const connectdb = require('./db/connectdb');
const userRoute = require('./routes/user.routes');
const User = require('./models/user.model');
const Chat = require('./models/chat.model');

const app = require('express')();
const http = require('http').Server(app);

const PORT = process.env.PORT || 8000;

app.use('/', userRoute);

const io = require('socket.io')(http);
let usp = io.of('/user-namespace');

usp.on('connection', async (socket) => {
    console.log('User connected');
    // console.log(socket.handshake.auth.token);
    const userId = socket.handshake.auth.token;
    await User.findByIdAndUpdate({ _id: userId }, { $set: { is_online: '1' } });

    // user boadcast online status
    socket.broadcast.emit('getOnlineUser', { user_id: userId });

    socket.on('disconnect', async () => {
        console.log('User disconnected');
        const userId = socket.handshake.auth.token;
        await User.findByIdAndUpdate({ _id: userId }, { $set: { is_online: '0' } });

        // user boadcast offline status
        socket.broadcast.emit('getOfflineUser', { user_id: userId });

    });

    //chatting implementation
    socket.on('newChat', function (data) {
        socket.broadcast.emit('loadNewChat', data);
    });

    //load old chats
    socket.on('existsChat', async function (data) {
        const chats = await Chat.find({
            $or: [
                {
                    sender_id: data.sender_id,
                    receiver_id: data.receiver_id
                },
                {
                    sender_id: data.receiver_id,
                    receiver_id: data.sender_id
                }
            ]
        });

        socket.emit('loadChats', { chats: chats });
    });
});

connectdb()
    .then(() => {
        http.listen(PORT, () => {
            console.log(`Server is running on PORT: ${PORT}`);
        })
    })
    .catch((err) => {
        console.error(`Error while starting the server: ${err}`)
    })
