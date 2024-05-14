function index(x, y) {
	if (x < 0 || x >= rows || y < 0 || y >= cols) return -1;
    return rows * x + y;
}

function removeWalls(a, b) {
	let x = a.x - b.x;
	let y = a.y - b.y;
	if (x === 1 && y === -1) {
		a.walls[2] = false;
		b.walls[0] = false;
	} else if (x === 1 && y === 1) {
		a.walls[3] = false;
		b.walls[1] = false;
	} else if (x === -1 && y === 1) {
		a.walls[0] = false;
		b.walls[2] = false;
	} else if (x === -1 && y === -1) {
		a.walls[1] = false;
		b.walls[3] = false;
	}
}

class Cell {
    constructor(x, y) {
        this.x = x;
		this.y = y;
		this.walls = [true, true, true, true,]; // NorthEast, SouthEast, SouthWest, NorthWest
        this.visited = false;
    }
    show() {
		let x = this.x * edges + 1;
		let y = this.y * edges + 1;
		stroke(50);
		strokeWeight(2);
		
        this.walls[0] && line(x + edges / 2, y, x + edges, y + edges / 2);
        this.walls[1] && line(x + edges, y + edges / 2, x + edges / 2, y + edges);
        this.walls[2] && line(x + edges / 2, y + edges, x, y + edges / 2);
        this.walls[3] && line(x, y + edges / 2, x + edges / 2, y);

		stroke('green');
		strokeWeight(edges / 8 * 5);
		
		!this.walls[0] && line(x + edges / 2, y + edges / 2, x + edges, y);
        !this.walls[1] && line(x + edges / 2, y + edges / 2, x + edges, y + edges);
		!this.walls[2] && line(x + edges / 2, y + edges / 2, x, y + edges);
        !this.walls[3] && line(x + edges / 2, y + edges / 2, x, y);

		fill(0, 0);
        this.visited && fill('green');
		noStroke();
		beginShape();
        vertex(x + edges / 2, y + 2);
        vertex(x + edges - 2, y + edges / 2);
        vertex(x + edges / 2, y + edges - 2);
        vertex(x + 2, y + edges / 2);
        endShape(CLOSE);
	}
	highlight() {
		let x = this.x * edges + 1;
		let y = this.y * edges + 1;
		fill('yellow');
		noStroke();
		beginShape();
        vertex(x + edges / 2, y + 2);
        vertex(x + edges - 2, y + edges / 2);
        vertex(x + edges / 2, y + edges - 2);
        vertex(x + 2, y + edges / 2);
        endShape(CLOSE);
	}
    checkNeighbors() {
        let neighbors = [];
		let x = this.x;
		let y = this.y;

        let northEast = grid[index(x + 1, y - 1)];
		let southEast = grid[index(x + 1, y + 1)];
		let southWest = grid[index(x - 1, y + 1)];
		let northWest = grid[index(x - 1, y - 1)];

        northEast && (northEast.visited || neighbors.push(northEast));
		southEast && (southEast.visited || neighbors.push(southEast));
		southWest && (southWest.visited || neighbors.push(southWest));
		northWest && (northWest.visited || neighbors.push(northWest));

		if (neighbors.length > 0) {
			return random(neighbors);
		} else {
			return undefined;
		}
	}
}

let grid = [];
let cols = 40;
let rows = cols;
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
    
    background('black');

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
			let southWest = grid[index(x - 1, y + 1)];
			southWest && (current.walls[2] || (current = southWest));
		}

		if (keyIsDown(RIGHT_ARROW)) {
			let x = current.x;
			let y = current.y;
			let northEast = grid[index(x + 1, y - 1)];
			northEast && (current.walls[0] || (current = northEast));
		}

		if (keyIsDown(UP_ARROW)) {
			let x = current.x;
			let y = current.y;
			let northWest = grid[index(x - 1, y - 1)];
			northWest && (current.walls[3] || (current = northWest));
		}

		if (keyIsDown(DOWN_ARROW)) {
			let x = current.x;
			let y = current.y;
			let southEast = grid[index(x + 1, y + 1)];
			southEast && (current.walls[1] || (current = southEast));
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