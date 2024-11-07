var canvas = document.createElement('canvas');
ctx = canvas.getContext('2d');
const intro = document.getElementById("intro");
const spinningLoc = document.getElementById("spinningLoc");


let grid = [];
let row = 40;
let col = 50;
let h = 0;

let sizeMultiplier = 0.5;

let width = intro.clientWidth;
let height = intro.clientHeight;

canvas.width = width;
canvas.height = height;

let gridSize = ((canvas.width / col) + (canvas.height / row)) / 2 * 0.5;

for (let c = 0; c < col; c++) {
    grid[c] = [];
    for (let r = 0; r < row; r++) {
        grid[c][r] = h;
    }
}

drawGrid();

intro.addEventListener('mousemove', function(event){
    let x = event.pageX - intro.offsetLeft;
    let y = event.pageY - intro.offsetTop;
    let c = clamp(Math.round(((x) / width) * col), 0, col - 1);
    let r = clamp(Math.round((y / height) * row), 0, row - 1)
    grid[c][r] = 1;
    drawGrid();
    //ctx.fillStyle = "#AAFF22";
    //ctx.fillRect(c / col * canvas.width, r / row * canvas.height, gridSize, gridSize);
    //ctx.fillStyle = "#FF1010";
    //ctx.fillRect(x, y, 10, 10);
    //ctx.fillStyle = "#FF10FF";
    //ctx.fillRect(x + intro.offsetLeft, y + intro.offsetTop, 10, 10);
    applyToBackground();
});

spinningLoc.addEventListener('click', function(){
    fillWith(0);
    drawGrid();
    applyToBackground();
});

window.addEventListener('resize', refreshValues);

setInterval(update, 300);

function clamp(value, min, max) {
    return Math.min(max, Math.max(value, min));
}

function refreshValues() {
    width = intro.clientWidth;
    height = intro.clientHeight;

    canvas.width = width;
    canvas.height = height;

    gridSize = ((canvas.width / col) + (canvas.height / row)) / 2 * 0.5;
}

function update() {
    let newGrid = [];
    for (let c = 0; c < col; c++) {
        newGrid[c] = [];
        for (let r = 0; r < row; r++) {
            newGrid[c][r] = grid[c][r];
        }
    }

    for(let c = 0; c < col; c++) {
        for(let r = 0; r < row; r++) {
            let neighbours = countNeighboursAt(c, r);
            let alive = grid[c][r];
            if (alive) {
                if (neighbours < 2 || neighbours > 3) {
                    newGrid[c][r] = 0;
                }
            }
            else {
                if (neighbours == 3) {
                    newGrid[c][r] = 1;
                }
            }
        }
    }

    for (let c = 0; c < col; c++) {
        grid[c] = [];
        for (let r = 0; r < row; r++) {
            grid[c][r] = newGrid[c][r];
        }
    }
    
    drawGrid();
}

function countNeighboursAt(c, r) {
    let count = 0;
    if (c <= 0 || c >= col - 1 || r <= 0 || r >= row - 1) {
        return 0;
    }
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            if (x == y && x == 0) {
                continue;
            }
            count += grid[c + x][r + y];
        }
    }
    return count;
}

function fillWith(value) {
    for (let c = 0; c < col; c++) {
        for (let r = 0; r < row; r++) {
            grid[c][r] = value;
        }
    }
}

function drawGrid() {
    ctx.fillStyle = "#101010";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#202020";
    for (let c = 0; c < col; c++) {
        for (let r = 0; r < row; r++) {
            if (grid[c][r] == 1) {
                ctx.fillRect(c / col * canvas.width, r / row * canvas.height, gridSize, gridSize);
            }
        }
    }
    applyToBackground();
}

function applyToBackground() {
    // canvas.toBlob((blob) => {
    //     const url = URL.createObjectURL(blob);
        
    //     intro.style.background = 'url(' + url + ')';

    // });
    intro.style.background = 'url(' + canvas.toDataURL() + ')';
    intro.style.backgroundSize = "contain";
    intro.style.backgroundRepeat = "no-repeat";
    //intro.style.backgroundSize = width + "px" + " " + height + "px";
}