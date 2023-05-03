var tile;
var tileGrass;
var tileTrees;
var tileForest; 
var tileSandTown;
var tileGrassRocks;
var tileSandMine;
var tileWater;
var tileOasis;
var tileGrassTown;
var tileSwamp;
var tileSwampGrass;
var tileSnowForest;
var tileIceWater;
var tileSand;
var tileSnow;
var tileSnowTown;

const BODYMARGIN = 2 * 20;

//for drawMap
const R = 16;
const A = 2 * Math.PI / 6;
const cosA = Math.cos(A);
const sinA = Math.sin(A);
const startOffsetY = (-1) * R;
const startOffsetX = (-1) * R;

//for waveFunctionCollapse and drawMap
var arr = []
const PADDING = 3;
var winMax
var seed

//for user input
var seedDisplay
var userInput

function preload() {
  tileGrass = loadImage('assets/sprite_00.png');
  tileTrees = loadImage('assets/sprite_01.png');
  tileForest = loadImage('assets/sprite_02.png');
  tileSandTown = loadImage('assets/sprite_03.png');
  tileGrassRocks = loadImage('assets/sprite_04.png');
  tileSandMine = loadImage('assets/sprite_05.png');
  tileWater = loadImage('assets/sprite_06.png');
  tileOasis = loadImage('assets/sprite_07.png');
  tileGrassTown = loadImage('assets/sprite_08.png');
  tileSwamp = loadImage('assets/sprite_09.png');
  tileSwampGrass = loadImage('assets/sprite_10.png');
  tileSnowForest = loadImage('assets/sprite_11.png');
  tileIceWater = loadImage('assets/sprite_12.png');
  tileSand = loadImage('assets/sprite_13.png');
  tileSnow = loadImage('assets/sprite_14.png');
  tileSnowTown = loadImage('assets/sprite_15.png');
}

function setup() {
  seed = generateSeed(8);
  winMax = Math.max(document.body.offsetHeight, windowHeight);
  var cnv = createCanvas(document.body.clientWidth, winMax);
  background(color(0, 0, 0));
  cnv.position(0, 0);

  arr = waveFunctionCollapse(seed, width, height);
  console.log(arr);
  drawMap(arr);


  seedDisplay = select('.seedDisplay')
  seedDisplay.html(`current seed is: <strong>${seed}</strong>`);

  userInput = select('input');
  userInput.input(onInput);


}

function onInput() {
  seed = this.value();
  arr = waveFunctionCollapse(seed, width, height);
  drawMap(arr);
  seedDisplay.html(`current seed is -  <strong>${seed}</strong>`)
}

function windowResized() {
  if (windowHeight > document.body.offsetHeight) {
    winMax = windowHeight;
  } else {
    winMax = document.body.offsetHeight + BODYMARGIN;
  }
  resizeCanvas(document.body.clientWidth, winMax);
  arr = waveFunctionCollapse(seed, width, height);
  drawMap(arr);
}

function drawMap(arr) {
  let countY = 0;
  let countX = 0;
  let tile = tileGrass;
  for (let y = startOffsetY; y + R * sinA < height + R && countY < arr.length; y += R * sinA) {
    countX = 0;
    let j = 0;
    for (let x = startOffsetX; x < width + 2 * R; x += R * (1 + cosA), y += (-1) ** j++ * R * sinA) {
      tile = convertToTile(arr[countY][countX]);
      image(tile, x, y);
      countX++;
    }
    
    if (j % 2 == 0) {
      y += (-1) ** j++ * R * sinA;
    }
    
    countY++;  
  }
}

function waveFunctionCollapse(seed, maxWidth, maxHeight) {
  let m = calculateArrayX(maxWidth) + PADDING;
  let n = calculateArrayY(maxHeight) + PADDING;
  if (m < 2 + PADDING || n < 2 + PADDING) {
    console.log("window is too small");
    return null;
  }
  else {
    let rand = createRandFunc(seed)
    let arr = new Array(n).fill().map(() => Array(m));
    //get firt 0,0 tile
    arr[0][0] = Math.floor(rand() * TileType.length);
    // get first column
    for (let i = 1; i < arr.length; i++) {
      arr[i][0] = getNextTileSingle(rand, arr[i - 1][0]);
    }
    //get first row
    for (let j = 1; j < arr[0].length; j++) {
      arr[0][j] = getNextTileSingle(rand, arr[0][j - 1]);
    }
    // finish rest of array
    const lookupTable = new Map();
    for (let i = 1; i < arr.length; i++) {
      for (let j = 1; j < arr[0].length; j++) {
        arr[i][j] = getNextTileDouble(rand, arr[i - 1][j], arr[i][j - 1], lookupTable);
      }
    }
    return arr;
  }
}