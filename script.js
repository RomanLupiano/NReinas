let N = 4
let board = [];
let boardElement = document.getElementById("board");
let btnSolve = document.getElementById("solve");
let btnStop = document.getElementById("stop");
let btnClean = document.getElementById("clean");
let btnCancel = document.getElementById("cancel");
let isBoardClean = true
let isSolving = false
let canContinue = true
animationTime = 300
var audioSuccess = new Audio('./media/success.mp3'); //Sound Effect from Pixabay
var audioError = new Audio('./media/error.wav');


//Default status
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
    modifyGrid()
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
    paintBoard()
}

function modifyGrid() {
    boardElement.style.gridTemplateColumns = "repeat("+ N +", 1fr)"
    boardElement.style.gridTemplateRows = "repeat("+ N +", 1fr)" 
}

addEventListener("resize", (event) => {});
onresize = (event) => {adjustFontSize()};

function adjustFontSize() {
    var contenedor = document.getElementById(0);
    var fontSize = contenedor.offsetWidth / 1.5 ; // ajusta según sea necesario
    boardElement.style.fontSize = fontSize + 'px';
}
  
window.onresize = function() {
    adjustFontSize(); // Ajustar el tamaño de la fuente cuando se cambie el tamaño del div
};

window.onload = function() {
    adjustFontSize(); // Ajustar el tamaño de la fuente inicialmente
};

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

function waitFor(conditionFunction) {
    const poll = resolve => {
      if(conditionFunction()) resolve();
      else setTimeout(_ => poll(resolve), 400);
    }
  
    return new Promise(poll);
}

async function solveNQUtil(board, col) {
    adjustFontSize()
    if (col >= N)
        return true;

    for (let i = 0; i < N; i++) {
        let cell = document.getElementById(i * N + col);
        cell.textContent = "\u265B";
        await waitFor(_ => canContinue === true);
        await sleep(animationTime);

        if (isSafe(board, i, col) == true) {
            board[i][col] = 1;
            paintBoardQueens()
            
            if (await solveNQUtil(board, col + 1) == true) {
                return true;
            }

            board[i][col] = 0;
            paintBoard()
            paintBoardQueens()
        }
        
        await waitFor(_ => canContinue === true);
        cell.textContent = "";
    }
    return false;
}

async function setCanContinue(){
    canContinue = !canContinue;
    if (canContinue) {
        btnStop.value = "Detener";
        //btnCancel.hidden = true;
    } else {
        btnStop.value = "Continuar";
        //btnCancel.hidden = false;

    }
}

async function solveNQueen(){
    cleanBoard()
    btnSolve.disabled = true;
    btnSolve.value = "Resolviendo..."
    Nslider.disabled = true;
    btnStop.hidden = false;
    btnClean.hidden = true;
    Noutput.textContent = "Valor de N no modificable durante ejecución"
    
    if( await solveNQUtil(board, 0) == false){
        audioError.play()
    } else {
        printSolution(board)
        audioSuccess.play()
    }



    btnSolve.disabled = false;
    btnSolve.value = "Resolver"
    Nslider.disabled = false;
    btnStop.hidden = true;
    btnClean.hidden = false;
    Noutput.textContent = "Valor de N = " + N
}

function paintBoard() {
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            let cell = document.getElementById(i * N + j);
            paintCell(cell, "white", green);
        }
    }
}

function paintBoardQueens() {
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            if (board[i][j] === 1) paintQueenAttack(i, j)
        }
    }
}

function paintQueenAttack(i, j) {
    for (let index = 0; index < N; index++) {
        cell = document.getElementById(index * N + j)
        paintCell(cell, lightRed, red)
    
        cell = document.getElementById(i * N + index)
        paintCell(cell, lightRed, red)
    }

    //diagonal inferior izquierda
    for (x = i+1, y = j-1; y >= 0 && x < N; x++, y--) {
        cell = document.getElementById(x * N + y)
        paintCell(cell, lightRed, red)
    }

    //diagonal inferior derecha
    for (x = i+1, y = j+1; y < N && x < N; x++, y++) {
        cell = document.getElementById(x * N + y)
        paintCell(cell, lightRed, red)
    }

    //diagonal superior izquierda
    for (x = i-1, y = j-1; y >= 0 && x >= 0; x--, y--) {
        cell = document.getElementById(x * N + y)
        paintCell(cell, lightRed, red)
    }

    //diagonal superior derecha
    for (x = i-1, y = j+1; y < N && x >= 0; x--, y++) {
        cell = document.getElementById(x * N + y)
        paintCell(cell, lightRed, red)
    }

    //TODO: mejorar el código del pintado de diagonales.
}

let lightRed = "#ff0000";
let red = "#ff9999"
let green = "#7FFFD4";


function paintCell(cell, colForWhite, colForBlack) {
    if (cell.className == "white") {
        cell.style.backgroundColor = colForWhite;
    } else {
        cell.style.backgroundColor = colForBlack;
    }
}

//TODO: Botones de calcelar busqueda y de seguir buscando soluciones