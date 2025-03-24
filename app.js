require('dotenv').config();

const connectdb = require('./db/connectdb');
const userRoute = require('./routes/user.routes');
const User = require('./models/user.model');

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
    await User.findByIdAndUpdate({_id: userId}, {$set: {is_online: '1'}});

    socket.on('disconnect', async () => {
        console.log('User disconnected');
        const userId = socket.handshake.auth.token;
        await User.findByIdAndUpdate({_id: userId}, {$set: {is_online: '0'}});
    });
    
});

connectdb()
.then(()=>{
    http.listen(PORT, ()=>{
        console.log(`Server is running on PORT: ${PORT}`);
    })
})
.catch((err)=>{
    console.error(`Error while starting the server: ${err}`)
})
