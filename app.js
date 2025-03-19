require('dotenv').config();

const connectdb = require('./db/connectdb');

const app = require('express')();
const http = require('http').Server(app);

const PORT = process.env.PORT || 8000;

connectdb()
.then(()=>{
    http.listen(PORT, ()=>{
        console.log(`Server is running on PORT: ${PORT}`);
    })
})
.catch((err)=>{
    console.error(`Error while starting the server: ${err}`)
})
