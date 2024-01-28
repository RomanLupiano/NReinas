const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

const queenpass = async () => {
    for (let index = 0; index < 16; index++) {
        let test = document.getElementById(index)
        test.textContent = "\u265B"
        await sleep(1000);
        test.textContent = ""
    }
}

//queenpass()

let N = 4
 
function printSolution(board)
{
    for(let i = 0; i < N; i++)
    {
        for(let j = 0; j < N; j++)
        {
            if(board[i][j] == 1){
                let test = document.getElementById(i*4 + j)
                test.textContent = "\u265B"
            }
        }
    }
}
 
function isSafe(board, row, col)
{
     for(let i = 0; i < col; i++){
        if(board[row][i] == 1)
            return false 
    }
 
    for (i = row, j = col; i >= 0 && j >= 0; i--, j--)
        if (board[i][j])
            return false
 
    for (i = row, j = col; j >= 0 && i < N; i++, j--)
        if (board[i][j])
            return false
 
    return true
}
 
function solveNQUtil(board, col){
    if(col >= N)
        return true
 
    for(let i=0;i<N;i++){
 
        if(isSafe(board, i, col)==true){
             
            board[i][col] = 1
 
            if(solveNQUtil(board, col + 1) == true)
                return true

            board[i][col] = 0
        }
    }
    return false
}
 
function solveNQueen(){
    let board =[[0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]]

    if(solveNQUtil(board, 0) == false){
        console.log("Solution does not exist")
        return false
    }

    printSolution(board)
    return true
}




var slider = document.getElementById("myRange");
var output = document.getElementById("value");

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.textContent = "N = " + this.value
  changeN(this.value)
}


function changeN(value) {
    let board = document.getElementById("board")
    switch (value) {
        case "5":
            board.style.gridTemplateColumns = "repeat(5, 160px)" 
            board.style.gridTemplateRows = "repeat(5, 160px)" 
        break;

        case "6":
            board.style.gridTemplateColumns = "repeat(6, 133px)" 
            board.style.gridTemplateRows = "repeat(6, 133px)" 
        break; 

        case "7":
            board.style.gridTemplateColumns = "repeat(7, 114px)" 
            board.style.gridTemplateRows = "repeat(7, 114px)" 
        break;

        case "8":
            board.style.gridTemplateColumns = "repeat(8, 100px)" 
            board.style.gridTemplateRows = "repeat(8, 100px)" 
        break;

        case "9":
            board.style.gridTemplateColumns = "repeat(9, 89px)" 
            board.style.gridTemplateRows = "repeat(9, 89px)" 
        break;

        case "10":
            board.style.gridTemplateColumns = "repeat(10, 80px)" 
            board.style.gridTemplateRows = "repeat(10, 80px)" 
        break;

        default:
            board.style.gridTemplateColumns = "repeat(4, 200px)" 
            board.style.gridTemplateRows = "repeat(4, 200px)" 
        break ;
    }
}
