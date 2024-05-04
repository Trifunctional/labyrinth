/**
 * @param left  32  5
 * @param dl    16  4
 * @param dr    8   3
 * @param right 4   2
 * @param ur    2   1
 * @param ul    1   0
 */

function setup() {
    const lab = $("#labyrinth");
    createCanvas(lab.width(), lab.height()).parent("labyrinth");
}

function draw() {
    background(30);
    let hexArr = [];
    createHexCells();
}

function moveToNextCell() {

}

function createHexCells() {
    const lab = $("#labyrinth");
    const hexSize = 20;
    const nSides = 6;
    const row1XStart = 26;
    const row1YStart = 23;
    const xInc = 60;
    const yInc = 17;
    let rowCount = 0;
    const yMaxOffset = 10;
    
    for (let y = row1YStart; y < lab.height() - yMaxOffset; y += yInc) {
        for (let x = row1XStart; x < lab.width(); x += xInc) {
            if (rowCount % 2 == 0) {
                drawPolygon(x, y, hexSize, nSides);
            } else {
                drawPolygon(x + hexSize * 1.5, y, hexSize, nSides);
            }
        }
        rowCount++;
    }
}

// Function that draws a hexagon (or any other regular polygon)
// centerX and centerY determine where the polygon is positioned
// the radius parameter determines the size of the enclosing circle
// numSides specifies the number of the polygon's sides
function drawPolygon(centerX, centerY, radius, numSides){

    stroke('rgba(100, 255, 100, 1)');
    strokeWeight(1);
    strokeJoin(ROUND);
    fill('rgba(100, 255, 120, .25)');

    // p5 already has some functionality for drawing more complex shapes
    // beginShape tells p5 that we'll be positioning some vertices in a bit
    beginShape()
  
    // This is where the heavy lifting happens
    // Make equiangular steps around the circle depending on the number of sides
    for(let a = 0; a < TAU; a+=TAU/numSides){
  
      // calculate the cartesian coordinates for a given angle and radius
      // and centered at the centerX and centerY coordinates
      var x = centerX + radius * cos(a)
      var y = centerY + radius * sin(a)
  
      // creating the vertex
      vertex(x, y)
    }
  
    // telling p5 that we are done positioning our vertices
    // and can now draw it to the canvas
    endShape(CLOSE)
}
