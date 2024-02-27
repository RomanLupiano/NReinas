let N = 4
let board = [];
let boardElement = document.getElementById("board");
let btnSolve = document.getElementById("solve");
isBoardClean = true
isSolving = false
animationTime = 200
var audioSuccess = new Audio('./media/success.mp3'); //Sound Effect from Pixabay
var audioError = new Audio('./media/error.wav');


//Default status
modifyGrid()
modifyBoard()


//board related
function modifyBoard(){
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

function cleanBoard() {
    for(var y = 0; y < N; y++){
        for(var x = 0; x < N; x++){
            board[x][y] = 0;
            let cell = document.getElementById(y*N + x)
            cell.innerText = ""
            cell.style.color = ""
        }
    }
}

function modifyGrid() {
    let size = boardElement.offsetWidth - 6
    boardElement.style.gridTemplateColumns = "repeat("+ N +", " + size/N + "px)" 
    boardElement.style.gridTemplateRows = "repeat("+ N +", " + size/N + "px)" 
    boardElement.style.fontSize = size/N + "px"
}

addEventListener("resize", (event) => {});
onresize = (event) => {modifyGrid()};



//Sliders
var Nslider = document.getElementById("Nslider");
var Noutput = document.getElementById("Nvalue");

var timeSlider = document.getElementById("timeSlider");
var timeOutput = document.getElementById("timeValue");

Nslider.oninput = function() {
Noutput.textContent = "Valor de N = " + this.value
  N = this.value
  modifyGrid()
  modifyBoard()
}

timeSlider.oninput = function() {
    timeOutput.textContent = "Tiempo de animación = " + this.value + "ms"
    animationTime = this.value
}



//Solution related
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
 
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function solveNQUtil(board, col) {
    if (col >= N)
        return true;

    for (let i = 0; i < N; i++) {
        let cell = document.getElementById(i * N + col);
        cell.textContent = "\u265B";
        await sleep(animationTime);

        if (isSafe(board, i, col) == true) {
            board[i][col] = 1;

            if (await solveNQUtil(board, col + 1) == true) {
                return true;
            }

            board[i][col] = 0;
        }
        
        cell.textContent = " ";
    }
    return false;
}


async function solveNQueen(){
    cleanBoard()
    btnSolve.disabled = true;
    Nslider.disabled = true;
    Noutput.textContent = "Valor de N no modificable durante ejecución"

    if( await solveNQUtil(board, 0) == false){
        audioError.play()
    } else {
        printSolution(board)
        audioSuccess.play()
    }

    btnSolve.disabled = false;
    Nslider.disabled = false;
    Noutput.textContent = "Valor de N = " + N
}