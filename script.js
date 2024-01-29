let N = 4
let board = [];
let boardElement = document.getElementById("board");
isBoardClean = true

function modifyBoard(N){
    boardElement.textContent = ''
    board = []
    for(var y = 0; y < N; y++){
        var row = new Array(N);
        for(var x = 0; x < N; x++){
            var cell = {};
            cell.element = document.createElement("div")
            cell.element.id = y*N + x; 
            if(y%2 ==  x%2)
            {
                cell.element.className = "white";
            }
            else 
            {
                cell.element.className = "black";
            }
            boardElement.appendChild(cell.element);
            row[x] = 0;
        }
        board.push(row)
    }
}

function modifyGrid(value) {
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

var slider = document.getElementById("myRange");
var output = document.getElementById("value");

slider.oninput = function() {
  output.textContent = "N = " + this.value
  N = this.value
  modifyGrid(this.value)
  modifyBoard(this.value)
}

//Default status
modifyGrid(4)
modifyBoard(4)
 


function printSolution(board)
{
    for(let i = 0; i < N; i++)
    {
        for(let j = 0; j < N; j++)
        {
            if(board[i][j] == 1){
                let test = document.getElementById(i*N + j)
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
    if (!isBoardClean) modifyBoard(N);
    if(solveNQUtil(board, 0) == false){
        console.log("Solution does not exist")
        return false
    }

    printSolution(board)
    isBoardClean = false
    return true
}