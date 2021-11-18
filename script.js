var canvas = document.getElementById('chess')

class Piece{
    speed = 1.5
    constructor(CTX, name, img, pos){
        this.name = name
        this.img= img
        this.pos = pos
        this.CTX = CTX
    }
    draw(){
        this.CTX.canvas.drawImage(this.img, (this.pos[0])*this.CTX.size, (this.pos[1]-1)*this.CTX.size, this.CTX.size, this.CTX.size)
    }
    lerp(fPos){
        this.pos = [
            this.pos[0]+(fPos[0]-this.pos[0])*this.speed,
            this.pos[1]+(fPos[1]-this.pos[1])*this.speed
        ]
    }

}

class Chessboard{
    CTX = {
        canvas : null,
        board : {
            1:null,
            2:null,
            3:null,
            4:null,
            5:null,
            6:null,
            7:null,
            8:null,
        },
        size : 300/9,
        loaded : 0
    }
    
    constructor(canvas){      
        this.CTX.canvas = canvas.getContext('2d') 
    }
    drawBoard(){
        for (let x = 0; x < 8; x++) {
            
            for (let y = 0; y < 8; y++) {
                
                this.CTX.canvas.fillStyle = (x+y)%2 ? 'white' : 'black'
                this.CTX.canvas.fillRect(x*this.CTX.size, y*this.CTX.size, this.CTX.size, this.CTX.size)
            }
        }
        Object.values(this.CTX.board).forEach((row)=>{
            row.forEach((piece)=>{
                if(piece === null)
                    return
                piece.draw()
            })
        })

    }
    loadBoard({player, position}){
        Object.keys(position).forEach((row) => {
            if(position[row]===null){
                this.CTX.board[row] = [null, null, null, null, null, null, null, null]
                return
            }
            this.CTX.board[row] = []
            if(Array.isArray(position[row])){
                position[row].forEach((pieceImg, col)=>{
                    if(pieceImg === null){
                        return
                    }
                    let image = new Image()
                    image.src= pieceImg
                    let name = pieceImg.split('/')[pieceImg.split('/').length-1].split('.')[0]
                    this.CTX.loaded++
                    image.onload = ()=>{
                        let piece = new Piece(this.CTX, name, image, [col, row])
                        this.CTX.board[row][col] = piece
                        this.CTX.loaded--
                    }
                    
                })
            }else{
                let image = new Image()
                image.src= position[row]
                let name = position[row].split('/')[position[row].split('/').length-1].split('.')[0]
                image.onload= ()=>{
                    for (let i = 0; i < 8; i++) {
                        let piece = new Piece(this.CTX, name, image, [i, row])
                        this.CTX.board[row].push(piece)
                    }
                }
            }
        })

        this.CTX.canvas.font = '20px serif';
        for (let i = 0; i < 8; i++) {
            this.CTX.canvas.fillText(String.fromCharCode(i+"a".charCodeAt(0)), 300/9*(((player=="white")?i:8-i-1)+0.35), 300/9*8.5);
            this.CTX.canvas.fillText(i+1, 300/9*8.5, 300/9*(((player=="white")?8-i-1:i)+0.8));
        }

    }
    // movePiece(coord){
    movePiece(coord, fCoord){

        coord = [ coord[0], coord[1]-1]
        fCoord = [ fCoord[0], fCoord[1]-1]
        // findPiece()
        // console.log(this.CTX.board)
        // console.log(this.CTX.board[1])
        // console.log(this.CTX.board[1][1])
        let piece = this.CTX.board[coord[0]][coord[1]]
        // console.log(piece)
        // movePiece()
            // - move in board
                this.CTX.board[coord[0]][coord[1]] = null
                this.CTX.board[fCoord[0]][fCoord[1]] = piece

            // - move piece position
                piece.pos(fCoord)
            
    }
    analyzeMove(move){
        // W1.Nxe4#
        move = move.split('.')
        let turn = move[0][0].toLowerCase()
        move = move[1]
        if(move[move.length-1] === "=")
            console.log("draw") 
        if(move[move.length-1] === "#")
            console.log("chessmate");

        let name = (move[0].charCodeAt(0)>="A".charCodeAt(0)) ? (()=>{
            return move[0].toLowerCase()
            })() 
        : 'p'
        
        name = turn+name
        // findByName()
        let capture = false
        if( move.includes('x'))
            capture = true
        console.log("capture")
        let pos = move.match(/([a-h])?([a-z][0-9])/)
        let fPos = pos[2]
        let startRow= pos[1]
        console.log(name, pos)
        this.findPiece(name, startRow, fPos, capture)
    }
    findPiece(name, startRow, fPos, capture){
        let possibilities = []
        let possibility= []
        let i =0
        switch (name[1]) {
            //pion
            case 'p':
                possibilities = [
                    {
                        minmax:[0,0],
                        possibilities : [
                            [-1, -1],
                            [+1, -1]
                        ]
                    },
                    {
                        minmax : [1,2],
                        possibilities : [0, -i]
                    }
                ]

                if(capture){
                    possibility = possibilities[0]
                }else{
                    possibility = possibilities[1]
                }
                break;
            //tour
            case 'r':
                possibilities = [
                    {
                        minmax : [-8,8],
                        possibilities :[
                            [0, i],
                            [i, 0]
                        ]
                    }
                ]
                break;
            //fou
            case 'b':
                possibilities = [
                    {
                        minmax : [-8,8],
                        possibilities :[
                            [i, i]                        ]
                    }
                ]
                
                break;
            //cavalier
            case 'n':
                possibilities = [
                    {
                        minmax : [0,0],
                        possibilities :[
                            [-1, 2],
                            [-1, -2],
                            [1, 2],
                            [1, -2],
                            [2, 1],
                            [2, -1],
                            [-2, -1],
                            [-2, 1],
                        ]
                    }
                ]
                break;
            //dame
            case 'q':
                possibilities = [
                    {
                        minmax : [-8,8],
                        possibilities :[
                            [0, i],
                            [i, 0],
                            [i, i]
                        ]
                    }
                ]
                break;
            //roi
            case 'k':
                max = 1
                possibilities = [
                    {
                        minmax : [0,1],
                        possibilities :[
                            [0, i],
                            [i, 0],
                            [i, i]
                        ]
                    }
                ]
                break;
        
            default:
                break;
        }
    }
    animate(){
        if(this.CTX.loaded ==0){
            this.CTX.canvas.clearRect(0, 0, this.case*8, this.case*8)
            this.drawBoard()
            // chessboard.movePiece([1,2], [1,3]);
        }
    }
}


let SET = {
    1 : ""
}
let IMG_PIECES = {
    wp : "img/"+SET["1"]+"wp.png",
    wr : "img/"+SET["1"]+"wr.png",
    wn : "img/"+SET["1"]+"wn.png",
    wb : "img/"+SET["1"]+"wb.png",
    wq : "img/"+SET["1"]+"wq.png",
    wk : "img/"+SET["1"]+"wk.png",
    bp : "img/"+SET["1"]+"bp.png",
    br : "img/"+SET["1"]+"br.png",
    bn : "img/"+SET["1"]+"bn.png",
    bb : "img/"+SET["1"]+"bb.png",
    bq : "img/"+SET["1"]+"bq.png",
    bk : "img/"+SET["1"]+"bk.png"
}

let POSITION = {
    player_white:
    {   player: "white",
        position : {
            1: [IMG_PIECES.br, IMG_PIECES.bn, IMG_PIECES.bb, IMG_PIECES.bq, IMG_PIECES.bk, IMG_PIECES.bb, IMG_PIECES.bn, IMG_PIECES.br],
            2: IMG_PIECES.bp,
            3: null,
            4: null,
            5: null,
            6: null,
            7: IMG_PIECES.wp,
            8: [IMG_PIECES.wr, IMG_PIECES.wn, IMG_PIECES.wb, IMG_PIECES.wq, IMG_PIECES.wk, IMG_PIECES.wb, IMG_PIECES.wn, IMG_PIECES.wr]
        }
    },
    player_black:{
        player : "black",
        position : {
            1: [IMG_PIECES.wr, IMG_PIECES.wn, IMG_PIECES.wb, IMG_PIECES.wk, IMG_PIECES.wq, IMG_PIECES.wb, IMG_PIECES.wn, IMG_PIECES.wr],
            2: IMG_PIECES.wp,
            3: null,
            4: null,
            5: null,
            6: null,
            7: IMG_PIECES.bp,
            8: [IMG_PIECES.br, IMG_PIECES.bn, IMG_PIECES.bb, IMG_PIECES.bk, IMG_PIECES.bq, IMG_PIECES.bb, IMG_PIECES.bn, IMG_PIECES.br]
        }
    }
}
let chessboard = new Chessboard(canvas)
chessboard.loadBoard(POSITION.player_black)


let animate = ()=>{
    chessboard.animate()
    window.requestAnimationFrame(animate)
}
window.requestAnimationFrame(animate)
