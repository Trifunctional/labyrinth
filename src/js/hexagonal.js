function index(x, y) {
	if (x < 0 || x >= cols || y < 0 || y >= rows) return -1;
    return rows * x + y;
}

function removeWalls(a, b) {
	let x = a.cX - b.cX;
	let y = a.cY - b.cY;
	if (x == 1 && y == 1) {
		a.walls[2] = false;
		b.walls[5] = false;
	} else if (x == -1 && y == -1) {
		a.walls[5] = false;
		b.walls[2] = false;
	} else if (x == -1) {
		a.walls[4] = false;
		b.walls[1] = false;
	} else if (x == 1) {
		a.walls[1] = false;
		b.walls[4] = false;
	} else if (y == -1) {
		a.walls[0] = false;
		b.walls[3] = false;
	} else if (y == 1) {
		a.walls[3] = false;
		b.walls[0] = false;
	}
}

class Cell {
	constructor(cX, cY, count, gridOffset) {
		this.cX = cX;
		this.cY = cY;
		this.walls = [true, true, true, true, true, true]; // N, NE, SE, S, SW, NW
		this.visited = false;
		this.offset = count * radius;
		this.gridOffset = gridOffset;
	}
	show() {
		let x = this.cX * radius * 2 + 4 + radius - this.offset / 4.25;
		let y = this.cY * radius * 2 - this.offset + 1 + this.gridOffset;
		stroke('white');
		strokeWeight(2);
		this.walls[0] && drawNorthWall(x, y, radius * 1.15);
		this.walls[1] && drawNorthEastWall(x, y, radius * 1.15);
		this.walls[2] && drawSouthEastWall(x, y, radius * 1.15);
		this.walls[3] && drawSouthWall(x, y, radius * 1.15);
		this.walls[4] && drawSouthWestWall(x, y, radius * 1.15);
		this.walls[5] && drawNorthWestWall(x, y, radius * 1.15);

		fill(0, 0);
        this.visited && fill(30);
		if (this == grid[0]) {
			fill('blue');
		}
		if (this == grid[grid.length - 1]) {
			fill('red');
		}
		noStroke();
		drawHexagon(x, y, radius * 1.1);
	}
	highlight() {
		let x = this.cX * radius * 2 + 4 + radius - this.offset / 4.25;
		let y = this.cY * radius * 2 - this.offset + 1 + this.gridOffset;
		fill('yellow');
		noStroke();
		drawHexagon(x, y, radius);
	}
    checkNeighbors() {
        let neighbors = [];
		let x = this.cX;
		let y = this.cY;

		let north = grid[index(x, y - 1)];
		let northEast = grid[index(x + 1, y)];
		let southEast = grid[index(x + 1, y + 1)];
		let south = grid[index(x, y + 1)];
		let southWest = grid[index(x - 1, y)];
		let northWest = grid[index(x - 1, y - 1)];

        north && (north.visited || neighbors.push(north));
		northEast && (northEast.visited || neighbors.push(northEast));
		southEast && (southEast.visited || neighbors.push(southEast));
		south && (south.visited || neighbors.push(south));
		southWest && (southWest.visited || neighbors.push(southWest));
		northWest && (northWest.visited || neighbors.push(northWest));

		if (neighbors.length > 0) {
			return random(neighbors);
		} else {
			return undefined;
		}
	}
}

grid = [];
let count = 0;
let rows = 13;
let cols = 25;
let radius;
let current;
let stack = [];
let done = false;
let gridOffset;

function setup() {
	const lab = $("#labyrinth");
    createCanvas(lab.width(), lab.height()).parent("labyrinth");

	radius = Math.floor(lab.height() / cols / 2);
	gridOffset = Math.floor(lab.height() / 2);
	
	for (let x = 0; x < cols; x++) {
		for (let y = 0; y < rows; y++) {
			grid.push(new Cell(x, y, count, gridOffset));
		}
		count++;
	}

	current = grid[0];
	strokeWeight(1);
	strokeCap(ROUND);
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

		if (keyCode == 16) {
			if (keyIsDown(LEFT_ARROW)) {
				let x = current.cX;
				let y = current.cY;
				let northWest = grid[index(x - 1, y - 1)];
				northWest && (current.walls[5] || (current = northWest));
			}
	
			if (keyIsDown(RIGHT_ARROW)) {
				let x = current.cX;
				let y = current.cY;
				let northEast = grid[index(x + 1, y)];
				northEast && (current.walls[1] || (current = northEast));
			}
		}

		if (keyIsDown(LEFT_ARROW)) {
			let x = current.cX;
			let y = current.cY;
			let southWest = grid[index(x - 1, y)];
			southWest && (current.walls[4] || (current = southWest));
		}

		if (keyIsDown(RIGHT_ARROW)) {
			let x = current.cX;
			let y = current.cY;
			let southEast = grid[index(x + 1, y + 1)];
			southEast && (current.walls[2] || (current = southEast));
		}

		if (keyIsDown(UP_ARROW)) {
			let x = current.cX;
			let y = current.cY;
			let north = grid[index(x, y - 1)];
			north && (current.walls[0] || (current = north));
		}

		if (keyIsDown(DOWN_ARROW)) {
			let x = current.cX;
			let y = current.cY;
			let south = grid[index(x, y + 1)];
			south && (current.walls[3] || (current = south));
		}
	}
}

function drawHexagon(cX, cY, r){
	beginShape();
	for(let a = 0; a < TAU; a += TAU / 6){
	  	vertex(cX + r * cos(a), cY + r * sin(a));
	}
	endShape(CLOSE);
}

function drawNorthWestWall(cX, cY, r){
	beginShape();
	let a = 0;
	vertex(cX + r * cos(a), cY + r * sin(a));
	a += TAU / 6;
	vertex(cX + r * cos(a), cY + r * sin(a));
	endShape();
}

function drawNorthWall(cX, cY, r){
	beginShape();
	let a = 0;
	a += TAU / 6;
	vertex(cX + r * cos(a), cY + r * sin(a));
	a += TAU / 6;
	vertex(cX + r * cos(a), cY + r * sin(a));
	endShape();
}

function drawNorthEastWall(cX, cY, r){
	beginShape();
	let a = 0;
	a += TAU / 6;
	a += TAU / 6;
	vertex(cX + r * cos(a), cY + r * sin(a));
	a += TAU / 6;
	vertex(cX + r * cos(a), cY + r * sin(a));
	endShape();
}

function drawSouthEastWall(cX, cY, r){
	beginShape();
	let a = 0;
	a += TAU / 6;
	a += TAU / 6;
	a += TAU / 6;
	vertex(cX + r * cos(a), cY + r * sin(a));
	a += TAU / 6;
	vertex(cX + r * cos(a), cY + r * sin(a));
	endShape();
}

function drawSouthWall(cX, cY, r){
	beginShape();
	let a = 0;
	a += TAU / 6;
	a += TAU / 6;
	a += TAU / 6;
	a += TAU / 6;
	vertex(cX + r * cos(a), cY + r * sin(a));
	a += TAU / 6;
	vertex(cX + r * cos(a), cY + r * sin(a));
	endShape();
}

function drawSouthWestWall(cX, cY, r){
	beginShape();
	let a = 0;
	a += TAU / 6;
	a += TAU / 6;
	a += TAU / 6;
	a += TAU / 6;
	a += TAU / 6;
	vertex(cX + r * cos(a), cY + r * sin(a));
	a += TAU / 6;
	vertex(cX + r * cos(a), cY + r * sin(a));
	endShape();
}

function doubleClicked() {
	saveCanvas(canvas, `maze${rows}x${cols}`, "png");
}

function keyPressed() {
	if (keyCode == 32) {
		saveCanvas(canvas, `maze${rows}x${cols}`, "png");
	}
}