var canvas = document.getElementById('chess')

class Piece{
    speed = 1.5
    constructor(CTX, img, pos){
        this.img= img
        this.pos = pos
        this.CTX = CTX
    }
    draw(){
        this.CTX.canvas.drawImage(this.img, (this.pos[0])*this.CTX.size, (this.pos[1]-1)*this.CTX.size, this.CTX.size, this.CTX.size)
    }
    lerp(fPos){
        this.pos = [
            this.pos[0]+(fPos[0]-this.pos[0])*speed,
            this.pos[1]+(fPos[1]-this.pos[1])*speed
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
        size : 300/8
    }
    
    constructor(canvas){      
        this.CTX.canvas = canvas.getContext('2d') 
    }
    drawBoard(){
        for (let x = 0; x <= 8; x++) {
            
            for (let y = 0; y <= 8; y++) {
                
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
    loadBoard(position){
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
                    image.onload = ()=>{

                        let piece = new Piece(this.CTX, image, [col, row])
                        this.CTX.board[row].push(piece)
                    }
                })
            }else{
                let image = new Image()
                image.src= position[row]
                image.onload= ()=>{
                    for (let i = 0; i < 8; i++) {
                        let piece = new Piece(this.CTX, image, [i, row])
                        this.CTX.board[row].push(piece)
                    }
                }
            }
        })
    }
    movePiece(coord, fCoord){
        // findPiece()
        console.log(this.CTX.board)
        let piece = this.CTX.board[coord[0]][coord[1]]
        console.log(piece)
        // movePiece()
            // - move in board
                this.CTX.board[coord[0]][coord[1]] = null
                this.CTX.board[fCoord[0]][fCoord[1]] = piece

            // - move piece position
                piece.lerp(fCoord)
            
    }
    animate(){
        this.CTX.canvas.clearRect(0, 0, this.case*8, this.case*8)
        this.drawBoard()
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
    {
        1: [IMG_PIECES.br, IMG_PIECES.bn, IMG_PIECES.bb, IMG_PIECES.bq, IMG_PIECES.bk, IMG_PIECES.bb, IMG_PIECES.bn, IMG_PIECES.br],
        2: IMG_PIECES.bp,
        3: null,
        4: null,
        5: null,
        6: null,
        7: IMG_PIECES.wp,
        8: [IMG_PIECES.wr, IMG_PIECES.wn, IMG_PIECES.wb, IMG_PIECES.wq, IMG_PIECES.wk, IMG_PIECES.wb, IMG_PIECES.wn, IMG_PIECES.wr],
    },
    player_black:{
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
let chessboard = new Chessboard(canvas)
chessboard.loadBoard(POSITION.player_white)
chessboard.drawBoard()


// Rotate
    // chessboard.ctx.translate(300/2, 300/2)
    // chessboard.ctx.rotate(180 * Math.PI / 180)
    // chessboard.ctx.translate(-300/2, -300/2)

// chessboard.clear()


chessboard.movePiece([1,2], [1,3]);

let animate = ()=>{
    chessboard.animate()
    window.requestAnimationFrame(animate)
}
window.requestAnimationFrame(animate)
