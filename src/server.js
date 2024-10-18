const express = require('express');
const {Server} = require('socket.io');
const seedrandom = require('seedrandom');
const app = express();
const io=new Server(5550,{
    cors:{
        origin:['http://localhost:5500','http://127.0.0.1:5500','http://192.168.1.76:5500','http://192.168.1.108:5500','http://192.168.1.115:5500']
    }
});
class Zone {
    constructor(size, probability, topLeftCorner, upReference, downReference, leftReference, rightReference, storage,randomNumberGenerator) {
        this.upReference=upReference;
        this.downReference=downReference;
        this.leftReference=leftReference;
        this.rightReference=rightReference;
        this.size=size;
        this.topLeftCorner=topLeftCorner;
        this.storage=storage;
        this.randomNumberGenerator=randomNumberGenerator;

        if(upReference!=null){
            upReference.downReference=this;
        }
        if(downReference!=null){
            downReference.upReference=this;
        }
        if(leftReference!=null){
            leftReference.rightReference=this;
        }
        if(rightReference!=null){
            rightReference.leftReference=this;
        }

        this.probability=probability;
        this.mines=[];
            
        const topRight=(size-1)*size;
        const topLeft=0;
        const bottomLeft=size-1;
        const bottomRight=size*size-1;

        const innerTopLeft=size+1;
        const innerTopRight=(size-2)*size+1;
        const innerBottomLeft=2*size-2;
        const innerBottomRight=(size-1)*size-2;

        for(let i=0;i<zoneSize;i++){
            for(let j=0;j<zoneSize;j++){
                this.mines.push(randomNumberGenerator()<probability?1:0);
            }
        }        
        this.board=Array(size*size).fill(0);
        for(let i=1;i<size-1;i++){
            for(let j=1;j<size-1;j++){
                if(this.mines[(i-1)*size+j-1]){                    
                    this.board[i*size+j]++
                }
                if(this.mines[(i-1)*size+j]){                    
                    this.board[i*size+j]++
                }
                if(this.mines[(i-1)*size+j+1]){                    
                    this.board[i*size+j]++
                }
                if(this.mines[i*size+j-1]){                    
                    this.board[i*size+j]++
                }
                if(this.mines[i*size+j+1]){                    
                    this.board[i*size+j]++
                }
                if(this.mines[(i+1)*size+j-1]){                    
                    this.board[i*size+j]++
                }
                if(this.mines[(i+1)*size+j]){                    
                    this.board[i*size+j]++
                }
                if(this.mines[(i+1)*size+j+1]){                    
                    this.board[i*size+j]++
                }
            }
        }
        
        if(upReference!=null){
            //calculate the top row for THIS zone
            for(let i=1;i<size-1;i++){
                if(upReference.mines[(i-1)*size+size-1]){
                    this.board[i*size]++;
                }
                if(upReference.mines[i*size+size-1]){
                    this.board[i*size]++;
                }
                if(upReference.mines[(i+1)*size+size-1]){
                    this.board[i*size]++;
                }
                if(this.mines[(i-1)*size]){
                    this.board[i*size]++;
                }
                if(this.mines[(i+1)*size]){
                    this.board[i*size]++;
                }
                if(this.mines[(i-1)*size+1]){
                    this.board[i*size]++;
                }
                if(this.mines[i*size+1]){
                    this.board[i*size]++;
                }
                if(this.mines[(i+1)*size+1]){
                    this.board[i*size]++;
                }
            }
            //calculate the bottom row for the Zone ABOVE
            
            for(let i=1;i<size-1;i++){
                if(this.mines[(i-1)*size]){
                    upReference.board[i*size+size-1]++;
                }
                if(this.mines[i*size]){
                    upReference.board[i*size+size-1]++;
                }
                if(this.mines[(i+1)*size]){
                    upReference.board[i*size+size-1]++;
                }
                if(upReference.mines[(i+1)*size+size-2]){
                    upReference.board[i*size+size-1]++;
                }
                if(upReference.mines[i*size+size-2]){
                    upReference.board[i*size+size-1]++;
                }
                if(upReference.mines[(i-1)*size+size-2]){
                    upReference.board[i*size+size-1]++;
                }
                if(upReference.mines[(i-1)*size+size-1]){
                    upReference.board[i*size+size-1]++;
                }
                if(upReference.mines[(i+1)*size+size-1]){
                    upReference.board[i*size+size-1]++;
                }
            }

        }

        if(downReference!=null){

            //calculate the bottom row for THIS zone
            for(let i=1;i<size-1;i++){
                if(downReference.mines[(i-1)*size]){
                    this.board[i*size+size-1]++;
                }
                if(downReference.mines[i*size]){
                    this.board[i*size+size-1]++;
                }
                if(downReference.mines[(i+1)*size]){
                    this.board[i*size+size-1]++;
                }
                if(this.mines[(i-1)*size+size-1]){
                    this.board[i*size+size-1]++;
                }
                if(this.mines[(i+1)*size+size-1]){
                    this.board[i*size+size-1]++;
                }
                if(this.mines[(i-1)*size+size-2]){
                    this.board[i*size+size-1]++;
                }
                if(this.mines[i*size+size-2]){
                    this.board[i*size+size-1]++;
                }
                if(this.mines[(i+1)*size+size-2]){
                    this.board[i*size+size-1]++;
                }
            }
            //calculate the top row for the Zone BELOW
            
            for(let i=1;i<size-1;i++){
                if(this.mines[(i-1)*size+size-1]){
                    downReference.board[i*size]++;
                }
                if(this.mines[i*size+size-1]){
                    downReference.board[i*size]++;
                }
                if(this.mines[(i+1)*size+size-1]){
                    downReference.board[i*size]++;
                }
                if(downReference.mines[(i-1)*size]){
                    downReference.board[i*size]++;
                }
                if(downReference.mines[(i+1)*size]){
                    downReference.board[i*size]++;
                }
                if(downReference.mines[(i-1)*size+1]){
                    downReference.board[i*size]++;
                }
                if(downReference.mines[i*size+1]){
                    downReference.board[i*size]++;
                }
                if(downReference.mines[(i+1)*size+1]){
                    downReference.board[i*size]++;
                }
            }
        }

        if(leftReference!=null){
            //calculate the left column for THIS zone
            for(let i=1;i<size-1;i++){
                if(leftReference.mines[(size-1)*size+i-1]){
                    this.board[i]++;
                }
                if(leftReference.mines[(size-1)*size+i]){
                    this.board[i]++;
                }
                if(leftReference.mines[(size-1)*size+i+1]){
                    this.board[i]++;
                }
                if(this.mines[i-1]){
                    this.board[i]++;
                }
                if(this.mines[i+1]){
                    this.board[i]++;
                }
                if(this.mines[size+i-1]){
                    this.board[i]++;
                }
                if(this.mines[size+i]){
                    this.board[i]++;
                }
                if(this.mines[size+i+1]){
                    this.board[i]++;
                }
            }
            //calculate the right column for the Zone TO THE LEFT
            
            for(let i=1;i<size-1;i++){
                if(this.mines[i-1]){
                    leftReference.board[(size-1)*size+i]++;
                }
                if(this.mines[i]){
                    leftReference.board[(size-1)*size+i]++;
                }
                if(this.mines[i+1]){
                    leftReference.board[(size-1)*size+i]++;
                }
                if(leftReference.mines[(size-1)*size+i-1]){
                    leftReference.board[(size-1)*size+i]++;
                }
                if(leftReference.mines[(size-1)*size+i+1]){
                    leftReference.board[(size-1)*size+i]++;
                }
                if(leftReference.mines[(size-2)*size+i-1]){
                    leftReference.board[(size-1)*size+i]++;
                }
                if(leftReference.mines[(size-2)*size+i]){
                    leftReference.board[(size-1)*size+i]++;
                }
                if(leftReference.mines[(size-2)*size+i+1]){
                    leftReference.board[(size-1)*size+i]++;
                }
            }
        }

        if(rightReference!=null){
            
            //calculate the righthand column for THIS zone
            for(let i=1;i<size-1;i++){
                if(rightReference.mines[i-1]){
                    this.board[(size-1)*size+i]++;
                }
                if(rightReference.mines[i]){
                    this.board[(size-1)*size+i]++;
                }
                if(rightReference.mines[i+1]){
                    this.board[(size-1)*size+i]++;
                }
                if(this.mines[(size-1)*size+i-1]){
                    this.board[(size-1)*size+i]++;
                }
                if(this.mines[(size-1)*size+i+1]){
                    this.board[(size-1)*size+i]++;
                }
                if(this.mines[(size-2)*size+i-1]){
                    this.board[(size-1)*size+i]++;
                }
                if(this.mines[(size-2)*size+i]){
                    this.board[(size-1)*size+i]++;
                }
                if(this.mines[(size-2)*size+i+1]){
                    this.board[(size-1)*size+i]++;
                }
            }
            //calculate the left column for the Zone TO THE RIGHT
            
            for(let i=1;i<size-1;i++){
                if(this.mines[(size-1)*size+i-1]){
                    rightReference.board[i]++;
                }
                if(this.mines[(size-1)*size+i]){
                    rightReference.board[i]++;
                }
                if(this.mines[(size-1)*size+i+1]){
                    rightReference.board[i]++;
                }
                if(rightReference.mines[i-1]){
                    rightReference.board[i]++;
                }
                if(rightReference.mines[i+1]){
                    rightReference.board[i]++;
                }
                if(rightReference.mines[size+i-1]){
                    rightReference.board[i]++;
                }
                if(rightReference.mines[size+i]){
                    rightReference.board[i]++;
                }
                if(rightReference.mines[size+i+1]){
                    rightReference.board[i]++;
                }
            }
        }

        if(upReference!=null && leftReference!=null && upReference.leftReference!=null){
            const topLeftGroup=this.calculateCount4Corners(upReference.leftReference,upReference,leftReference,this);
            this.board[0]=topLeftGroup.topLeftOfBottomRight;
            upReference.board[bottomLeft]=topLeftGroup.bottomLeftOfTopRight;
            leftReference.board[(this.size-1)*this.size]=topLeftGroup.topRightOfBottomLeft;
            upReference.leftReference.board[this.size*this.size-1]=topLeftGroup.bottomRightOfTopLeft;   
        }

        if(upReference!=null && rightReference!=null && upReference.rightReference!=null){
            const topRightGroup=this.calculateCount4Corners(upReference,upReference.rightReference,this,rightReference);
            this.board[topRight]=topRightGroup.topRightOfBottomLeft;
            upReference.board[bottomRight]=topRightGroup.bottomRightOfTopLeft;
            rightReference.board[topLeft]=topRightGroup.topLeftOfBottomRight;
            upReference.rightReference.board[bottomLeft]=topRightGroup.bottomLeftOfTopRight;
        }

        if(downReference!=null && leftReference!=null && downReference.leftReference!=null){
            const bottomLeftGroup=this.calculateCount4Corners(leftReference,this,downReference.leftReference,downReference);
            this.board[bottomLeft]=bottomLeftGroup.bottomLeftOfTopRight;
            leftReference.board[bottomRight]=bottomLeftGroup.bottomRightOfTopLeft;
            downReference.board[topLeft]=bottomLeftGroup.topLeftOfBottomRight;
            downReference.leftReference.board[topRight]=bottomLeftGroup.topRightOfBottomLeft;
        }

        if(downReference!=null && rightReference!=null && downReference.rightReference!=null){
            const bottomRightGroup=this.calculateCount4Corners(this,rightReference,downReference,downReference.rightReference);
            this.board[bottomRight]=bottomRightGroup.bottomRightOfTopLeft;
            rightReference.board[bottomLeft]=bottomRightGroup.bottomLeftOfTopRight;
            downReference.board[topRight]=bottomRightGroup.topRightOfBottomLeft;
            downReference.rightReference.board[topLeft]=bottomRightGroup.topLeftOfBottomRight;
        }

    }

    mine(x,y){

        if(x<1 && this.leftReference==null){
            let oppositeSide=null;
            oppositeSide=this.upReference?.leftReference?.leftReference?.downReference;//TODO improve path finding to neighbours
            if(oppositeSide==null){
                oppositeSide=this.downReference?.leftReference?.leftReference?.upReference;
            }
            const upRef=this.upReference!=null?this.upReference.leftReference:null;
            const downRef=this.downReference!=null?this.downReference.leftReference:null;  
            this.leftReference=new Zone(this.size,this.probability,{x:this.topLeftCorner.x-this.size,y:this.topLeftCorner.y},upRef,downRef,oppositeSide,this,this.storage,this.randomNumberGenerator);
            this.storage.push(this.leftReference);
        }
        if(x>=this.size-2 && this.rightReference==null){
            let oppositeSide=null;
            oppositeSide=this.upReference?.rightReference?.rightReference?.downReference;//TODO improve path finding to neighbours
            if(oppositeSide==null){
                oppositeSide=this.downReference?.rightReference?.rightReference?.upReference;
            }
            const upRef=this.upReference!=null?this.upReference.rightReference:null;
            const downRef=this.downReference!=null?this.downReference.rightReference:null;
            
            this.rightReference=new Zone(this.size,this.probability,{x:this.topLeftCorner.x+this.size,y:this.topLeftCorner.y},upRef,downRef,this,oppositeSide,this.storage,this.randomNumberGenerator);
            this.storage.push(this.rightReference);
        }
        if(y<1 && this.upReference==null){
            let oppositeSide=null;
            oppositeSide=this.leftReference?.upReference?.upReference?.rightReference;//TODO improve path finding to neighbours
            if(oppositeSide==null){
                oppositeSide=this.rightReference?.upReference?.upReference?.leftReference;
            }
            const leftRef=this.leftReference!=null?this.leftReference.upReference:null;
            const rightRef=this.rightReference!=null?this.rightReference.upReference:null;
            this.upReference=new Zone(this.size,this.probability-0.05,{x:this.topLeftCorner.x,y:this.topLeftCorner.y-this.size},oppositeSide,this,leftRef,rightRef,this.storage,this.randomNumberGenerator);
            this.storage.push(this.upReference);
        }
        if(y>=this.size-2 && this.downReference==null){
            let oppositeSide=null;
            oppositeSide=this.leftReference?.downReference?.downReference?.rightReference;//TODO improve path finding to neighbours
            if(oppositeSide==null){
                oppositeSide=this.rightReference?.downReference?.downReference?.leftReference;
            }
            const leftRef=this.leftReference!=null?this.leftReference.downReference:null;
            const rightRef=this.rightReference!=null?this.rightReference.downReference:null;
            this.downReference=new Zone(this.size,this.probability+0.05,{x:this.topLeftCorner.x,y:this.topLeftCorner.y+this.size},this,oppositeSide,leftRef,rightRef,this.storage,this.randomNumberGenerator);
            this.storage.push(this.downReference);
        }

        if(x<1 && y<1 && this.upReference.leftReference==null){
            //if x<1 and y<1 checks have been made above that upReference and leftReference!= null, if they were they have been created
            let leftRef=this.leftReference.leftReference!=null?this.leftReference.leftReference.upReference:null;
            let rightRef=this.upReference;
            let downRef=this.leftReference;
            let upRef=this.upReference.upReference!=null?this.upReference.upReference.leftReference:null;

            this.upReference.leftReference=new Zone(this.size,this.probability-0.05,{x:this.topLeftCorner.x-this.size,y:this.topLeftCorner.y-this.size},upRef,downRef,leftRef,rightRef,this.storage,this.randomNumberGenerator);
            this.storage.push(this.upReference.leftReference);
        }

        if(x<1 && y>=this.size-2 && this.downReference.leftReference==null){
            //if x<1 and y>=size-2 checks have been made above that downReference and leftReference!= null, if they were they have been created
            let leftRef=this.leftReference.leftReference!=null?this.leftReference.leftReference.downReference:null;
            let rightRef=this.downReference;
            let downRef=this.downReference.downReference!=null?this.downReference.downReference.leftReference:null;
            let upRef=this.leftReference;

            this.downReference.leftReference=new Zone(this.size,this.probability+0.05,{x:this.topLeftCorner.x-this.size,y:this.topLeftCorner.y+this.size},upRef,downRef,leftRef,rightRef,this.storage,this.randomNumberGenerator);
            this.storage.push(this.downReference.leftReference);
        }

        if(x>=this.size-2 && y<1 && this.upReference.rightReference==null){
            //if x>=size-2 and y<1 checks have been made above that upReference and rightReference!= null, if they were they have been created
            let leftRef=this.upReference;
            let rightRef=this.rightReference.rightReference!=null?this.rightReference.rightReference.upReference:null;
            let downRef=this.rightReference;
            let upRef=this.upReference.upReference!=null?this.upReference.upReference.rightReference:null;

            this.upReference.rightReference=new Zone(this.size,this.probability-0.05,{x:this.topLeftCorner.x+this.size,y:this.topLeftCorner.y-this.size},upRef,downRef,leftRef,rightRef,this.storage,this.randomNumberGenerator);
            this.storage.push(this.upReference.rightReference);
        }

        if(x>=this.size-2 && y>=this.size-2 && this.downReference.rightReference==null){
            //if x<1 and y<1 checks have been made above that upReference and leftReference!= null, if they were they have been created
            let leftRef=this.downReference;
            let rightRef=this.rightReference.rightReference!=null?this.rightReference.rightReference.downReference:null;
            let downRef=this.downReference.downReference!=null?this.downReference.downReference.rightReference:null;
            let upRef=this.rightReference;

            this.downReference.rightReference=new Zone(this.size,this.probability+0.05,{x:this.topLeftCorner.x+this.size,y:this.topLeftCorner.y+this.size},upRef,downRef,leftRef,rightRef,this.storage,this.randomNumberGenerator);
            this.storage.push(this.downReference.rightReference);
        }

        return {
            x:x+this.topLeftCorner.x,
            y:y+this.topLeftCorner.y,
            count:this.board[x*this.size+y],
            mine:this.mines[x*this.size+y]?true:false 
        }
    }

    calculateCount4Corners(topLeft,topRight,bottomLeft,bottomRight){
        const result={bottomRightOfTopLeft:0,topLeftOfBottomRight:0,topRightOfBottomLeft:0,bottomLeftOfTopRight:0};
        //calculate the top left corner for bottomRight
        if(bottomRight.mines[1]){
            result.topLeftOfBottomRight++;
        }
        if(bottomRight.mines[this.size]){
            result.topLeftOfBottomRight++;
        }
        if(bottomRight.mines[this.size+1]){
            result.topLeftOfBottomRight++;
        }
        if(topRight.mines[this.size-1]){         
            result.topLeftOfBottomRight++;
        }
        if(topRight.mines[this.size*2-1]){                
            result.topLeftOfBottomRight++;
        }
        if(bottomLeft.mines[(this.size-1)*this.size]){                
            result.topLeftOfBottomRight++;
        }
        if(bottomLeft.mines[(this.size-1)*this.size+1]){                
            result.topLeftOfBottomRight++;
        }
        if(topLeft.mines[this.size*this.size-1]){
            result.topLeftOfBottomRight++;
        }

        //calculate the bottom left corner for topRight
        if(bottomRight.mines[0]){
            result.bottomLeftOfTopRight++;
        }
        if(bottomRight.mines[this.size]){
            result.bottomLeftOfTopRight++;
        }
        if(topRight.mines[this.size-2]){
            result.bottomLeftOfTopRight++;
        }
        if(topRight.mines[2*this.size-2]){                
            result.bottomLeftOfTopRight++;
        }
        if(topRight.mines[2*this.size-1]){                
            result.bottomLeftOfTopRight++;
        }
        if(bottomLeft.mines[(this.size-1)*this.size]){                
            result.bottomLeftOfTopRight++;
        }
        if(topLeft.mines[this.size*this.size-1]){                
            result.bottomLeftOfTopRight++;
        }
        if(topLeft.mines[this.size*this.size-2]){
            result.bottomLeftOfTopRight++;
        }            

        //calculate the top right corner for the bottomLeft
        if(bottomRight.mines[0]){
            result.topRightOfBottomLeft++;
        }
        if(bottomRight.mines[1]){
            result.topRightOfBottomLeft++;
        }
        if(topRight.mines[this.size-1]){
            result.topRightOfBottomLeft++;
        }
        if(bottomLeft.mines[(this.size-1)*this.size+1]){                
            result.topRightOfBottomLeft++;
        }
        if(bottomLeft.mines[(this.size-2)*this.size]){                
            result.topRightOfBottomLeft++;
        }
        if(bottomLeft.mines[(this.size-2)*this.size+1]){                
            result.topRightOfBottomLeft++;
        }
        if(topLeft.mines[this.size*this.size-1]){                
            result.topRightOfBottomLeft++;
        }
        if(topLeft.mines[(this.size-1)*this.size-1]){
            result.topRightOfBottomLeft++;
        }              

        //calculate the bottom right corner for topLeft
        if(bottomRight.mines[0]){
            result.bottomRightOfTopLeft++;
        }
        if(topRight.mines[this.size-1]){
            result.bottomRightOfTopLeft++;
        }
        if(topRight.mines[this.size-2]){
            result.bottomRightOfTopLeft++;
        }
        if(bottomLeft.mines[(this.size-1)*this.size]){                
            result.bottomRightOfTopLeft++;
        }
        if(bottomLeft.mines[(this.size-2)*this.size]){                
            result.bottomRightOfTopLeft++;
        }
        if(topLeft.mines[this.size*this.size-2]){                
            result.bottomRightOfTopLeft++;
        }
        if(topLeft.mines[(this.size-1)*this.size-1]){                
            result.bottomRightOfTopLeft++;
        }
        if(topLeft.mines[(this.size-1)*this.size-2]){
            result.bottomRightOfTopLeft++;
        }  
             
        return result;
    }
}

const port=5500;

app.set('view engine','ejs');

app.use(express.static('./'));

app.get('/',(req,res)=>{
    res.render('index');
    console.log(req.socket.remoteAddress);
});


app.listen(port,()=>{
    console.log("Server is running on port "+port);
});

const width=10;
const height=10;
const zoneSize=7;
io.on('connection',(socket)=>{
    const zones=[];
    console.log(`User ${io.engine.clientsCount} connected`);
    let rng;

    socket.on('start-game',seed=>{
        const cleanSeed=seed.replace(/[^a-zA-Z0-9]/g, '');
        rng=seedrandom(cleanSeed);
        socket.zone=new Zone(7,0,{x:0,y:-zoneSize},null,null,null,null,zones,rng);
        socket.zone.mine(4,5);
        socket.emit('game-start',{zoneSize});
        console.log(`User ${io.engine.clientsCount} started game with seed: ${cleanSeed}`);        
    });

    socket.on('mine-this',coords=>{
        let zoneReference=socket.zone.downReference;
        const xFactor=Math.floor(coords.x/zoneSize);
        const yFactor=Math.floor(coords.y/zoneSize);
        let i=0;
        let notFound=true;
        do{
            if(zones[i].topLeftCorner.x==xFactor*zoneSize && zones[i].topLeftCorner.y==yFactor*zoneSize){
                zoneReference=zones[i];
                notFound=false;
            }
            i++;
        }while(i<zones.length && notFound);
        const xRemainder=coords.x>=0?coords.x%zoneSize:zoneSize+((coords.x+1)%zoneSize-1);
        const yRemainder=coords.y%zoneSize;
        
        socket.emit('mine-result',zoneReference.mine(xRemainder,yRemainder));
    });

});



