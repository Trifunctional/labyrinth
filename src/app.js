function index(x, y) {
	if (x < 0 || x >= rows || y < 0 || y >= cols) return -1;
    return rows * x + y;
}

function addWalls(a, b) {
	let x = a.x - b.x;
	let y = a.y - b.y;
    if  (a.subdivA == true && b.subdivB == true || a.subdivB == true && b.subdivA == true) {
        if (x === 1) {
            if (a.first == true && b.first == true) {
                a.walls[3] = false;
                b.walls[1] = false;
            } else {
                a.walls[3] = true;
                b.walls[1] = true;
            }
        } else if (x === -1) {
            if (a.first == true && b.first == true) {
                a.walls[1] = false;
                b.walls[3] = false;
            } else {
                a.walls[1] = true;
                b.walls[3] = true;
            }
        } else if (y === 1) {
            if (a.first == true && b.first == true) {
                a.walls[0] = false;
                b.walls[2] = false;
            } else {
                a.walls[0] = true;
                b.walls[2] = true;
            }
        } else if (y === -1) {
            if (a.first == true && b.first == true) {
                a.walls[2] = false;
                b.walls[0] = false;
            } else {
                a.walls[2] = true;
                b.walls[0] = true;
            }
        }
    }
}

class Cell {
    constructor(x, y) {
        this.x = x;
		this.y = y;
		this.walls = [false, false, false, false]; // North, East, South, West
        this.visited = false;
        this.subdivA = false;
        this.subdivB = false;
        this.first = false;
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
        this.subdivA && fill('blue');
        this.subdivB && fill('red');
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
    checkNeighborsA() {
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

        if (first == false && north == this.subdivB) {
            first = true;
            this.first = true;
            north.first = true;
            if (neighbors.length > 0) {
                return neighbors;
            } else {
                return undefined;
            }
        } else if (first == false && east == this.subdivB) {
            first = true;
            this.first = true;
            east.first = true;
            if (neighbors.length > 0) {
                return neighbors;
            } else {
                return undefined;
            }
        } else if (first == false && south == this.subdivB) {
            first = true;
            this.first = true;
            south.first = true;
            if (neighbors.length > 0) {
                return neighbors;
            } else {
                return undefined;
            }
        } else if (first == false && west == this.subdivB) {
            first = true;
            this.first = true;
            west.first = true;
            if (neighbors.length > 0) {
                return neighbors;
            } else {
                return undefined;
            }
        } else if (neighbors.length > 0) {
			return neighbors;
		} else {
			return undefined;
		}
	}
    checkNeighborsB() {
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

		if (first == false && north == this.subdivA) {
            first = true;
            this.first = true;
            north.first = true;
            if (neighbors.length > 0) {
                return neighbors;
            } else {
                return undefined;
            }
        } else if (first == false && east == this.subdivA) {
            first = true;
            this.first = true;
            east.first = true;
            if (neighbors.length > 0) {
                return neighbors;
            } else {
                return undefined;
            }
        } else if (first == false && south == this.subdivA) {
            first = true;
            this.first = true;
            south.first = true;
            if (neighbors.length > 0) {
                return neighbors;
            } else {
                return undefined;
            }
        } else if (first == false && west == this.subdivA) {
            first = true;
            this.first = true;
            west.first = true;
            if (neighbors.length > 0) {
                return neighbors;
            } else {
                return undefined;
            }
        } else if (neighbors.length > 0) {
			return neighbors;
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
let neighborsArrayA = [];
let neighborsArrayB = [];
let set = [];
let first = false;

function setup() {
    const lab = $("#labyrinth");
    createCanvas(lab.width(), lab.height()).parent("labyrinth");

    edges = floor(width / cols);

	for (let x = 0; x < rows; x++) {
		for (let y = 0; y < cols; y++) {
			grid.push(new Cell(x, y));
		}
	}

    let a = random(grid);
    let b = random(grid);

    a.subdivA = true;
    b.subdivB = true;

    a.visited = true;
    b.visited = true;

    set.push(a);
    set.push(b);

    c = random(set);
    current = set.splice(index(c), 1);

    strokeWeight(1);
	strokeCap(SQUARE);
}

function draw() {
    let done = true;
    for (let i = 0; i < grid.length; i++) {
        if (i.subdivA == false && i.subdivB == false) {
            done = false;
        }
    }

    background(30);

    for (let i = 0; i < grid.length; i++) {
        grid[i].show();
    }
    current.visited = true;
    current.highlight();
    if (!done) {
        if (current.subdivA) {
            neighborsArrayA = current.checkNeighborsA();
            for (i = 0; i < neighborsArrayA; i++) {
                set.push(neighborsArrayA[i]);
            }
            let next = random(set);
            if (next) {
                next.subdivA = true;
                next.visited = true;
                set.splice(index(current), 1);
                addWalls(current, next);
                current = next;
            } else {
                if (set.length > 0) {
                    current = set.pop();
                } else {
                    done = true;
                    frameRate(20);
                }
            }
        }
        if (current.subdivB) {
            neighborsArrayB = current.checkNeighborsB();
            for (i = 0; i < neighborsArrayB; i++) {
                set.push(neighborsArrayB[i]);
            }
            let next = random(set);
            if (next) {
                next.subdivB = true;
                next.visited = true;
                set.splice(index(current), 1);
                addWalls(current, next);
                current = next;
            } else {
                if (set.length > 0) {
                    current = set.pop();
                } else {
                    done = true;
                    frameRate(20);
                }
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