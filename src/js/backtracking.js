function index(x, y) {
	if (x < 0 || x >= rows || y < 0 || y >= cols) return -1;
    return rows * x + y;
}

function removeWalls(a, b) {
	let x = a.x - b.x;
	let y = a.y - b.y;
	if (x === 1) {
		a.walls[3] = false;
		b.walls[1] = false;
	} else if (x === -1) {
		a.walls[1] = false;
		b.walls[3] = false;
	} else if (y === 1) {
		a.walls[0] = false;
		b.walls[2] = false;
	} else if (y === -1) {
		a.walls[2] = false;
		b.walls[0] = false;
	}
}

class Cell {
    constructor(x, y) {
        this.x = x;
		this.y = y;
		this.walls = [true, true, true, true]; // North, East, South, West
        this.visited = false;
    }
    show() {
		let x = this.x * edges + 1;
		let y = this.y * edges + 1;
		stroke('white');
		strokeWeight(2);
		this.walls[0] && line(x, y, x + edges, y);
		this.walls[1] && line(x + edges, y, x + edges, y + edges);
		this.walls[2] && line(x, y + edges, x + edges, y + edges);
		this.walls[3] && line(x, y, x, y + edges);

		fill(0, 0);
        this.visited && fill('green');
		noStroke();
		square(x, y, edges);
	}
	highlight() {
		let x = this.x * edges + 3;
		let y = this.y * edges + 3;
		fill('yellow');
		noStroke();
		square(x, y, edges - 4);
	}
    checkNeighbors() {
        let neighbors = [];
		let x = this.x;
		let y = this.y;

		let north = grid[index(x, y - 1)];
		let east = grid[index(x + 1, y)];
		let south = grid[index(x, y + 1)];
		let west = grid[index(x - 1, y)];

        north && (north.visited || neighbors.push(north));
		east && (east.visited || neighbors.push(east));
		south && (south.visited || neighbors.push(south));
		west && (west.visited || neighbors.push(west));

		if (neighbors.length > 0) {
			return random(neighbors);
		} else {
			return undefined;
		}
	}
}

let grid = [];
const cols = 25;
const rows = cols;
let edges;
let current;
let stack = [];
let done = false;

function setup() {
    const lab = $("#labyrinth");
    createCanvas(lab.width(), lab.height()).parent("labyrinth");

    edges = floor(width / cols);

	for (let x = 0; x < rows; x++) {
		for (let y = 0; y < cols; y++) {
			grid.push(new Cell(x, y));
		}
	}

    current = grid[0];
    strokeWeight(1);
	strokeCap(SQUARE);
}

function draw() {
    
    background(30);

    for (let i = 0; i < grid.length; i++) {
        grid[i].show();
    }
    current.visited = true;
    current.highlight();
    if (!done) {
        let next = current.checkNeighbors();
        if (next) {
            next.visited = true;
            stack.push(current);
            removeWalls(current, next);
            current = next;
        } else {
            if (stack.length > 0) {
                current = stack.pop();
            } else {
                done = true;
                frameRate(20);
            }
        }
    } else {
		if (current.i == cols - 1 && current.j == rows - 1) {
			noLoop();
		}

		if (keyIsDown(LEFT_ARROW)) {
			let x = current.x;
			let y = current.y;
			let west = grid[index(x - 1, y)];
			west && (current.walls[3] || (current = west));
		}

		if (keyIsDown(RIGHT_ARROW)) {
			let x = current.x;
			let y = current.y;
			let east = grid[index(x + 1, y)];
			east && (current.walls[1] || (current = east));
		}

		if (keyIsDown(UP_ARROW)) {
			let x = current.x;
			let y = current.y;
			let north = grid[index(x, y - 1)];
			north && (current.walls[0] || (current = north));
		}

		if (keyIsDown(DOWN_ARROW)) {
			let x = current.x;
			let y = current.y;
			let south = grid[index(x, y + 1)];
			south && (current.walls[2] || (current = south));
		}
	}
}
function doubleClicked() {
	saveCanvas(canvas, `maze${rows}x${cols}`, "png");
}

function keyPressed() {
	if (keyCode == 32) {
		saveCanvas(canvas, `maze${rows}x${cols}`, "png");
	}
}