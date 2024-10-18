const express = require('express');
const {Server} = require('socket.io');
const app = express();
const io=new Server(5550,{
    cors:{
        origin:['http://localhost:5500','http://127.0.0.1:5500']
    }
});

const port=5500;

app.set('view engine','ejs');

app.get('/',(req,res)=>{
    res.render('index');
});

app.listen(port,()=>{
    console.log("Server is running on port "+port);
});

const width=10;
const height=10;
const zoneSize=7;
io.on('connection',(socket)=>{
    console.log(`User ${io.engine.clientsCount} connected`);
    socket.emit('game-start',{width});
    socket.mines=[];
    for(let i=0;i<width;i++){
        for(let j=0;j<height;j++){
            socket.mines.push(Math.random()<0.1?1:0);
        }
    }
    console.log(socket.mines);
    socket.board=Array(width*height).fill(0);
    for(let i=0;i<width;i++){
        for(let j=0;j<height;j++){
            
            //if it is not the first column
            if(0<i){
                //if the cell to the left is a mine
                if(socket.mines[(i-1)*height+j]){
                    socket.board[i*height+j]++;
                }
                //if it is not the first cell
                if(0<j){
                    //if the cell up and left is a mine
                    if(socket.mines[(i-1)*height+j-1]){
                        socket.board[i*height+j]++;
                    }
                }//if it is not the bottom left cell
                if(j<height-1){
                    //if the cell left and down is a mine
                    if(socket.mines[(i-1)*height+j+1]){
                        socket.board[i*height+j]++;
                    }                        
                }
            }
            //if it is not the right hand column
            if(i<width-1){
                //if the cell to the right is a mine
                if(socket.mines[(i+1)*height+j])
                socket.board[i*height+j]++;
                //if it is not the right hand most cell in the first row
                if(0<j){
                    //if the cell up and right is a mine
                    if(socket.mines[(i+1)*height+j-1]){
                        socket.board[i*height+j]++;
                    }
                }//if it is not the bottom right cell
                if(j<height-1){
                    //if the cell down and right is a mine
                    if(socket.mines[(i+1)*height+j+1]){
                        socket.board[i*height+j]++;
                    }
                }
            }
            //if it is not the first row
            if(0<j){
                //if the cell above is a mine
                if(socket.mines[i*height+j-1])
                socket.board[i*height+j]++;
            }
            //if it is not the bottom row
            if(j<height-1){
                //if the cell below is a mine
                if(socket.mines[i*height+j+1])
                socket.board[i*height+j]++;
            }
        }
    }

    socket.on('clear-tile',(coords)=>{
        const number=socket.board[coords.x*height+coords.y];
        const mine=socket.mines[coords.x*height+coords.y];
        socket.emit('result',{number,mine,coords});
    });

});
