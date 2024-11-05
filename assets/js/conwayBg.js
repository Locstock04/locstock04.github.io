var canvas = document.createElement('canvas');
ctx = canvas.getContext('2d');
const intro = document.getElementById("intro");



let grid = [];
let row = 50;
let col = 50;
let h = 0;

let width = intro.clientWidth;
let height = intro.clientHeight;

canvas.width = width;
canvas.height = height;


// Loop to initialize 2D array elements.
for (let i = 0; i < row; i++) {
    grid[i] = [];
    for (let j = 0; j < col; j++) {
        grid[i][j] = h;
    }
}


drawGrid(col, row, 30);





intro.addEventListener('mousemove', function(event){
    //flipSpot(event); 
    let c = clamp(Math.floor((event.offsetX / width) * col), 0, col - 1);
    let r = clamp(Math.floor((event.offsetY / height) * row), 0, row - 1)
    grid[c][r] = 1;
    drawGrid(col, row, 30);
})

setInterval(update, 1000);

function clamp(value, min, max) {
    return Math.min(max, Math.max(value, min));
}

function update() {
    let newGrid = grid;

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
    grid = newGrid;

    drawGrid(col, row, 30);
}

function countNeighboursAt(c, r) {
    let count = 0;
    for (let x = -1; x <= 1; x++) {
        if (c + x < 0 || c + x > col - 1) {
            count--;
            continue;
        }
        for (let y = -1; y <= 1; y++) {
            if (r + y < 0 || r + y > row - 1) {
                count--;
                continue; 
            }
            if (x == y && x == 0) {
                continue;
            }
            count += grid[c + x][r + y];
        }
    }
    return count;
}

function fillWhite() {
    for (let c = 0; c < grid.length; c++) {
        for (let r = 0; r < grid.length; r++) {
            grid[c][r] = 1;
        }
    }
}

function drawGrid(cCount, rCount, size) {
    
    for (let c = 0; c < cCount ; c++) {
        for (let r = 0; r < rCount; r++) {
            if (grid[c][r] == 1) {
                ctx.fillStyle = "#202020";
            }
            else {
                 ctx.fillStyle = "#101010";
            }
            ctx.fillRect(c / cCount * canvas.width , r / rCount * canvas.height, size, size);
        }
    }
    // canvas.toBlob((blob) => {
    //     const url = URL.createObjectURL(blob);
        
    //     intro.style.background = 'url(' + url + ')';

    // });
    intro.style.background = 'url(' + canvas.toDataURL() + ')';
    // intro.style.backgroundSize = "cover";
    intro.style.backgroundRepeat = "no-repeat";
    //intro.style.backgroundSize = width + "px" + " " + height + "px";
}
