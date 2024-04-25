let N = 4
let animationTime = 300;
let fontSizeFactor = 0.6;
let board = [];
const boardElement = document.getElementById("board");

const btnSolve = document.getElementById("solve");
const btnStop = document.getElementById("stop");
const btnCancel = document.getElementById("cancel");
const btnNext = document.getElementById("next");
const divAgregative = document.getElementById("contAgregative");

const Nslider = document.getElementById("Nslider");
const Noutput = document.getElementById("Nvalue");

const timeSlider = document.getElementById("timeSlider");
const timeOutput = document.getElementById("timeValue");

let seekNextSolution = false;
let canContinue = true;
let cancel = false;

let seeAttack = true;
let seeAgregative = false;

const white = "#fffefe"
const green = "#7FFFD4";
const lightRed = "#ff0000";
const red = "#ff9999"
let ColorFactor = 0.2;

let sound = true;
const audioSuccess = new Audio('./media/success.mp3'); //Sound Effect from Pixabay
const audioError = new Audio('./media/error.wav');


//Default status
modifyBoard();



//// Board related ////
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
        }
    }
    paintBoard()
}

function modifyGrid() {
    boardElement.style.gridTemplateColumns = "repeat("+ N +", 1fr)"
    boardElement.style.gridTemplateRows = "repeat("+ N +", 1fr)" 
}

function adjustFontSize() {
    let contenedor = document.getElementById(0);
    let fontSize = contenedor.offsetWidth * fontSizeFactor ;
    boardElement.style.fontSize = fontSize + 'px';
}
  
window.onresize = function() {
    adjustFontSize(); // Ajustar el tamaño de la fuente cuando se cambie el tamaño del div
};

window.onload = function() {
    adjustFontSize(); // Ajustar el tamaño de la fuente inicialmente
};



//// Sliders related ////
Nslider.oninput = function() {
Noutput.textContent = "Valor de N = " + this.value;
  N = this.value;
  modifyBoard();
}

timeSlider.oninput = function() {
    timeOutput.textContent = "Tiempo de animación = " + this.value + "ms";
    animationTime = this.value;
}



//// Paint realted ////
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

function paintQueens() {
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            if (board[i][j] === 1) paintQueenAttack(i, j)
        }
    }
}

function paint(){
    paintBoard();
    paintQueens();
}

function paintQueenAttack(i, j) {
    const directions = [
        [-1, 0], [1, 0], // arriba, abajo
        [0, -1], [0, 1], // izquierda, derecha
        [-1, -1], [-1, 1], // diagonal superior izquierda, diagonal superior derecha
        [1, -1], [1, 1] // diagonal inferior izquierda, diagonal inferior derecha
    ];

    for (const [directionx, directiony] of directions) {
        let x = i + directionx;
        let y = j + directiony;
        
        while (x >= 0 && x < N && y >= 0 && y < N) {
            const cell = document.getElementById(x * N + y);
            paintCell(cell);
            x += directionx;
            y += directiony;
        }
    }
}

function paintCell(cell) {
    backgroundColor = cell.style.backgroundColor;

    if (seeAgregative) {
        let matches = backgroundColor.match(/\d+/g);
        let g = parseInt(matches[1]);
    
        if (g !== 0){
            cell.style.backgroundColor = "#fffefe";
        }
        calcularColor(cell);
    } else {
        if (cell.className == "white") {
            cell.style.backgroundColor = lightRed;
        } else {
            cell.style.backgroundColor = red;
        }
    }
}

function calcularColor(cell) {
    backgroundColor = cell.style.backgroundColor
    
    let matches = backgroundColor.match(/\d+/g);
    let r = parseInt(matches[0]);
    let g = parseInt(matches[1]);
    let b = parseInt(matches[2]);
    
    r = r - Math.round(ColorFactor * 255);
    g = 0;
    b = 0;

    cell.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
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




//// Solution related ////
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

async function backtracking(board, col) {
    if (cancel) {
        return;
    }

    if (col == N) {
        solutionReached();
        return true;
    }

    for (let i = 0; i < N; i++) {
        if (cancel) {
            return;
        }

        let cell = document.getElementById(i * N + col);
        cell.textContent = "\u265B";
        await waitFor(_ => canContinue === true);
        await sleep(animationTime);

        
        if (isSafe(board, i, col) == true) {
            board[i][col] = 1;
            if (seeAttack) 
                paint();
            
            if (await backtracking(board, col + 1) == true) {
                await waitFor(_ => seekNextSolution === true);
            }

            board[i][col] = 0;
            if (seeAttack) 
                paint();
        }
        
        await waitFor(_ => canContinue === true);
        cell.textContent = "";
    }
    return false;
}

async function solveNQueen(){
    adjustFontSize()
    cancel = false;
    btnSolve.hidden = true;
    Nslider.disabled = true;
    btnStop.hidden = false;
    Noutput.textContent = "Valor de N no modificable durante ejecución"
    
    if(await backtracking(board, 0) == false){
        playAudio(audioError);
    }

    cancel = false;
    btnSolve.hidden = false;
    Nslider.disabled = false;
    btnStop.hidden = true;
    Noutput.textContent = "Valor de N = " + N;
}

function solve() {
    cleanBoard();
    solveNQueen();
}


//// Button realted ////
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

function setAttack(){
    seeAttack = !seeAttack;
    if (!seeAttack) {
        paintBoard();
        divAgregative.hidden = true;
    } else {
        paintQueens();
        divAgregative.hidden = false;

    }
}

function setAgregative() {
    seeAgregative = !seeAgregative;
    if (!seeAgregative) {
        paintBoard();
    }
    paintQueens();
}

async function setSeekNextSolution(){
    seekNextSolution = !seekNextSolution;
    if (seekNextSolution) {
        btnNext.hidden = true;
        btnCancel.hidden = true;
        btnStop.hidden = false;
    }
}

function solutionReached() {
    playAudio(audioSuccess);
    seekNextSolution = false;
    btnStop.hidden = true;
    btnNext.hidden = false;
    btnCancel.hidden = false;
}

function setSound() {
    sound = !sound;
}

async function calcelSearch(){
    btnCancel.hidden = true;
    btnNext.hidden = true;
    btnSolve.hidden = false;
    btnSolve.disabled = true;
    btnSolve.value = "Cargando...";
    Nslider.disabled = false;
    btnStop.hidden = true;
    canContinue = true;
    cancel = true;
    Noutput.textContent = "Valor de N = " + N;
    cleanBoard();
    await sleep(300);
    btnSolve.value = "Resolver";
    btnSolve.disabled = false;
}

function playAudio(audio){
    if (sound) {
        audio.play();
    }
}