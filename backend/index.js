const express = require('express');
const app = express();
const http = require('http');
const cors= require('cors');
const session = require('express-session');
app.set(express.static('public'));
app.set('view engine','ejs');
app.set('views','views');
app.use(cors());
app.use(session({
    secret:'session',
    resave:false,
    saveUninitialized:false
}));
const server = http.Server(app);
server.listen('3000',()=>{
    console.log('Server listening to 3000');
});

const io = require('socket.io')(server);
io.on('connection',(socket)=>{
    console.log('Socket connected');
    socket.on('disconnected',(e)=>{
        console.log('Socket disconnected');
    })
})