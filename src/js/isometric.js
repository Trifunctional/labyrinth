function index(x, y) {
	if (x < 0 || x >= rows || y < 0 || y >= cols) return -1;
    return rows * x + y;
}

function removeWalls(a, b) {
	let x = a.centerX - b.centerX;
	let y = a.centerY - b.centerY;
	if (x == 1 && y == 1) {
		a.northWall = false;
		b.southWall = false;
	} else if (x == -1 && y == -1) {
		a.southWall = false;
		b.northWall = false;
	} else if (x == 1) {
		a.westWall = false;
		b.eastWall = false;
	} else if (x == -1) {
		a.eastWall = false;
		b.westWall = false;
	}
}

class Cell {
    constructor(x, y, count, gridOffset) {
        this.centerX = x;
        this.centerY = y;

        this.vertexLeftX = x * edges - edges;
        this.vertexLeftY = y * edges - edges / 4;

        this.vertexTopX = x * edges;
        this.vertexTopY = y * edges - edges / 2;

        this.vertexRightX = x * edges + edges;
        this.vertexRightY = y * edges + edges / 4;

        this.vertexBottomX = x * edges;
        this.vertexBottomY = y * edges + edges / 2;

        this.northWall = true; // North = NW
        this.eastWall = true; // East = NE
        this.southWall = true; // South = SE
        this.westWall = true; // West = SW

        this.visited = false;

        this.offset = count * edges / 4;
        this.gridOffset = gridOffset;
    }
    show() {
		let xL = this.vertexLeftX + this.gridOffset / 1.5;
		let yL = this.vertexLeftY - this.offset + this.gridOffset;
        let xT = this.vertexTopX + this.gridOffset / 1.5;
		let yT = this.vertexTopY - this.offset + this.gridOffset;
        let xR = this.vertexRightX + this.gridOffset / 1.5;
		let yR = this.vertexRightY - this.offset + this.gridOffset;
        let xB = this.vertexBottomX + this.gridOffset / 1.5;
		let yB = this.vertexBottomY - this.offset + this.gridOffset;
		stroke('white');
		strokeWeight(2);
		this.northWall && line(xL, yL, xT, yT);
		this.eastWall && line(xT, yT, xR, yR);
		this.southWall && line(xR, yR, xB, yB);
		this.westWall && line(xB, yB, xL, yL);

		fill(0, 0);
        this.visited && fill('green');
		noStroke();
		beginShape();
        vertex(xL, yL);
        vertex(xT, yT);
        vertex(xR, yR);
        vertex(xB, yB);
        endShape(CLOSE);
	}
	highlight() {
		let xL = this.vertexLeftX + this.gridOffset / 1.5;
		let yL = this.vertexLeftY - this.offset + this.gridOffset;
        let xT = this.vertexTopX + this.gridOffset / 1.5;
		let yT = this.vertexTopY - this.offset + this.gridOffset;
        let xR = this.vertexRightX + this.gridOffset / 1.5;
		let yR = this.vertexRightY - this.offset + this.gridOffset;
        let xB = this.vertexBottomX + this.gridOffset / 1.5;
		let yB = this.vertexBottomY - this.offset + this.gridOffset;
		fill('yellow');
		noStroke();
		beginShape();
        vertex(xL, yL);
        vertex(xT, yT);
        vertex(xR, yR);
        vertex(xB, yB);
        endShape(CLOSE);
	}
    checkNeighbors() {
        let neighbors = [];
		let x = this.centerX;
		let y = this.centerY;

		let north = grid[index(x - 1, y - 1)];
		let east = grid[index(x + 1, y)];
		let south = grid[index(x + 1, y + 1)];
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
let cols = 25;
let rows = cols;
let edges;
let count = 0;
let current;
let stack = [];
let done = false;
let gridOffset;

function setup() {
    const lab = $("#labyrinth");
    createCanvas(lab.width(), lab.height()).parent("labyrinth");

    edges = Math.floor(lab.width() / cols - cols / 3);
    gridOffset = Math.floor(lab.width() / 4);
    
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            grid.push(new Cell(x, y, count, gridOffset));
        }
        count++;
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
			let x = current.centerX;
			let y = current.centerY;
			let west = grid[index(x - 1, y)];
			west && (current.westWall || (current = west));
		}

		if (keyIsDown(RIGHT_ARROW)) {
			let x = current.centerX;
			let y = current.centerY;
			let east = grid[index(x + 1, y)];
			east && (current.eastWall || (current = east));
		}

		if (keyIsDown(UP_ARROW)) {
			let x = current.centerX;
			let y = current.centerY;
			let north = grid[index(x - 1, y - 1)];
			north && (current.northWall || (current = north));
		}

		if (keyIsDown(DOWN_ARROW)) {
			let x = current.centerX;
			let y = current.centerY;
			let south = grid[index(x + 1, y + 1)];
			south && (current.southWall || (current = south));
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