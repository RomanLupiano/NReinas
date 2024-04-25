let N = 4
let board = [];
let boardElement = document.getElementById("board");

let btnSolve = document.getElementById("solve");
let btnStop = document.getElementById("stop");
let btnCancel = document.getElementById("cancel");
let btnNext = document.getElementById("next");

let seekNextSolution = false;
let isBoardClean = true
let isSolving = false
let canContinue = true
let animationTime = 300
var audioSuccess = new Audio('./media/success.mp3'); //Sound Effect from Pixabay
var audioError = new Audio('./media/error.wav');

let result = []

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

function paintBoard() {
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            let cell = document.getElementById(i * N + j);
            if (cell.className == "white") {
                cell.style.backgroundColor = white;
            } else {
                cell.style.backgroundColor = green;
            }
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
        if ((index * N + j) == (i * N + j))
            continue
        cell = document.getElementById(index * N + j)
        paintCell(cell, lightRed, red)
    }

    for (let index = 0; index < N; index++) {
        if ((i * N + index) == (i * N + j))
        continue
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

let white = "#fffefe"
let lightRed = "#ff0000";
let red = "#ff9999"
let green = "#7FFFD4";


function paintCell(cell, x , y) {
    backgroundColor = cell.style.backgroundColor
    
    let matches = backgroundColor.match(/\d+/g);
    let r = parseInt(matches[0]);
    let g = parseInt(matches[1]);
    let b = parseInt(matches[2]);

    if (g !== 0){
        cell.style.backgroundColor = "#fffefe"
    }
    calcularColor(cell)
}

//TODO: Botones de calcelar busqueda y de seguir buscando soluciones



function calcularColor(cell) {
    let factor = 0.04;
    backgroundColor = cell.style.backgroundColor
    
    let matches = backgroundColor.match(/\d+/g);
    let r = parseInt(matches[0]);
    let g = parseInt(matches[1]);
    let b = parseInt(matches[2]);
    
    r = r - Math.round(factor * 255);
    g = 0;
    b = 0;

    cell.style.backgroundColor = `rgb(${r- Math.round(factor * 255)}, ${g}, ${b})`;
  }
  
function solve() {
    cleanBoard();
    solveNQueen();
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
    if (col == N){
        return true;
    }

    for (let i = 0; i < N; i++) {
        let cell = document.getElementById(i * N + col);
        cell.textContent = "\u265B";
        await waitFor(_ => canContinue === true);
        await sleep(animationTime);

        if (isSafe(board, i, col) == true) {
            board[i][col] = 1;
            paintBoard()

            paintBoardQueens()
            
            if (await solveNQUtil(board, col + 1) == true) {
                solutionReached()
                await waitFor(_ => seekNextSolution === true)
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


async function userInput(){
    if (seekNextSolution){
        seekNextSolution = false;
        return true;
    }
}

async function setCanContinue(){
    canContinue = !canContinue;
    if (canContinue) {
        btnStop.value = "Detener";
        btnCancel.hidden = true;
    } else {
        btnStop.value = "Continuar";
        btnCancel.hidden = false;

    }
}

async function setSeekNextSolution(){
    seekNextSolution = !seekNextSolution;
    btnNext.hidden = true;
    btnCancel.hidden = true;
    btnStop.hidden = false;
}

function solutionReached() {
    audioSuccess.play()
    seekNextSolution = false;
    btnNext.hidden = false;
    btnCancel.hidden = false;
    btnStop.hidden = true;
}

function calcelSearch(){
    cleanBoard();
    btnCancel.hidden = true;
    btnNext.hidden = true;
    btnSolve.hidden = false;
    Nslider.disabled = false;
    Noutput.textContent = "Valor de N = " + N;
}

async function solveNQueen(){
    adjustFontSize()
    btnSolve.hidden = true;
    Nslider.disabled = true;
    btnStop.hidden = false;
    Noutput.textContent = "Valor de N no modificable durante ejecución"
    
    if(await solveNQUtil(board, 0) == false){
        audioError.play()
    }

    btnSolve.hidden = false;
    Nslider.disabled = false;
    btnStop.hidden = true;
    Noutput.textContent = "Valor de N = " + N;
}