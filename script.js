let N = 4
let board = [];
let boardElement = document.getElementById("board");
isBoardClean = true

function modifyBoard(){
    boardElement.textContent = ''
    board = []
    for(var y = 0; y < N; y++){
        var row = new Array(N);
        for(var x = 0; x < N; x++){
            var cell = {};
            cell.element = document.createElement("div")
            cell.element.id = y*N + x; 
            cell.element.addEventListener('click', function() {
                cellClicked(this.id)
            });
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

function cellClicked(id){
    cell = document.getElementById(id)
    if (cell.textContent == "") {
        cell.textContent = "\u265B"
        board[Math.floor(id/N)][id%N] = 1
    } else {
        cell.textContent = ""
        board[Math.floor(id/N)][id%N] = 0
    }
    console.table(board)
}

function modifyGrid() {
    let board = document.getElementById("board")
    board.style.gridTemplateColumns = "repeat("+ N +", " + 800/N + "px)" 
    board.style.gridTemplateRows = "repeat("+ N +", " + 800/N + "px)" 
}

var slider = document.getElementById("myRange");
var output = document.getElementById("value");

slider.oninput = function() {
  output.textContent = "N = " + this.value
  N = this.value
  modifyGrid()
  modifyBoard()
}

//Default status
modifyGrid()
modifyBoard()
 

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
    if(solveNQUtil(board, 0) == false){
        alert("No existe solución");
        return false
    }

    printSolution(board)
    console.table(board)

    isBoardClean = false
    return true
}