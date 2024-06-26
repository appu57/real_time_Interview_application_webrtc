const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const session = require('express-session');
const executeCode = require('./routes/executeCode');
app.set(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(cors());
app.use(session({
  secret: 'session',
  resave: false,
  saveUninitialized: false
}));
const server = http.Server(app);
server.listen('3000', () => {
  console.log('Server listening to 3000');
});
app.use('/execute',executeCode); 
const io = require('socket.io')(server);
io.on('connection', (socket) => {
  
  socket.on('code_changes',(e)=>{
    const {language,value,cb,to}=e;
    console.log(e);
    io.to(to).emit('code_changes_acceped',{...e})
  })
  socket.on('join Room', (e) => {
    const socketId = socket.id;
    const rooms = io.sockets.adapter.rooms;
    const roomExists = rooms.get(e.roomId);
    if (roomExists != undefined && roomExists.size==1) {
      io.to(e.roomId).emit('user_joined', { userId: socketId });//once when a user logs in he will join room then when other user joins the event is emitted to the room members
    }
    socket.join(e.roomId);//first emit to members of the room and then join so event is not emitted back to login user
  });
  socket.on('send_offer', (e) => {
    console.log(e);
    const socketId = socket.id;
    const { to, offer } = e;
    io.to(to).emit('receive_offer', { from: socketId, offer: offer });
  });
  socket.on('send_answer', (e) => {
    console.log(e);
    const socketId = socket.id;
    const { to, answer } = e;
    io.to(to).emit('receive_answer', { from: socketId, answer: answer });
  });
  socket.on('negotiation', (e) => {
    const { to, offer } = e;
    io.to(to).emit('negotiation', { from: socket.id, offer: offer })
  });
  socket.on('negotiation_completed', (e) => {
    const { to, answer } = e;
    io.to(to).emit('negotiation_completed', { from: socket.id, answer });
  });
  socket.on('playground__change',(e)=>{
    io.to(e.to).emit('playground__change',{...e});
  })
  socket.on('close', (e) => {
    console.log('Socket disconnected');
  })
})
