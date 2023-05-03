/*
  from: https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
  creates randomizing function that is seeded
  a: 32-bit seed
  return: random number generator function
*/
function mulberry32(a) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

/*
  from: https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
  generates 32-bit hash of str
  str: string
  return: 32-bit
*/
function cyrb128(str) {
  let h1 = 1779033703, h2 = 3144134277,
      h3 = 1013904242, h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
      k = str.charCodeAt(i);
      h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
      h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
      h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
      h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
}

/*
  str: string of intended seed
  return: random number generator function
*/
function createRandFunc(str) {
  var seeds = cyrb128(str);
  return mulberry32(seeds[0]);
}

/*
  uses Math.random to generate a seed string
  len: integer of length of desired seed
  return: seed string
*/
function generateSeed(len) {
  let str = "";
  const chars = "abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < len; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return str
}

/*
  generates next tile in row or column, given only one previous tile
  function randFunc: random number generating function
  int prevTile: integer of which type of tile in TileType
  return: integer of next tile type 
*/
function getNextTileSingle(randFunc, prevTile) {
  let index = Math.floor(randFunc() * TileNeighbors[TileType[prevTile]].length)
  let tile = TileNeighbors[TileType[prevTile]][index];
  return tile;
}

/*
  generates next tile in row based on intersection of possible tiles
  function randFunc: random number generating function
  int prevTileTop: integer of which type of tile in TileType that is above desired tile
  int prevTileLeft: integer of which type of tile in TileType that is left of desired tile
  lookupTable: javascript Map that stores previously calculated intersections
  return: integer of next tile type 
*/
function getNextTileDouble(randFunc, prevTileTop, prevTileLeft, lookupTable) {
  let lookupString = prevTileTop.toString();
  lookupString = lookupString.concat(prevTileLeft.toString());
  let lookupStringReverse = reverseString(lookupString);
  let intersection = null
  //first check lookupTable if there already exists a computed intersection
  if (lookupTable.get(lookupString) != null) {
    intersection = lookupTable.get(lookupString);
  } else if (lookupTable.get(lookupStringReverse) != null) {
    intersection = lookupTable.get(lookupStringReverse);
  } else {
    // add entry to lookupTable
    intersection = getIntersection(TileNeighbors[TileType[prevTileTop]], TileNeighbors[TileType[prevTileLeft]]);
    lookupTable.set(lookupString, intersection);
  }
  let index = Math.floor(randFunc() * intersection.length);
  return intersection[index];
}

/*
  num: integer index of TileType
  return: tile variable referencing tile image
*/
function convertToTile(num) {
  switch (TileType[num]) {
    case "grass":
      return tileGrass;
    case "trees":
      return tileTrees;
    case "forest":
      return tileForest;
    case "sandTown":
      return tileSandTown;
    case "grassRocks":
      return tileGrassRocks;
    case "sandMine":
      return tileSandMine;
    case "water":
      return tileWater;
    case "oasis":
      return tileOasis;
    case "grassTown":
      return tileGrassTown;
    case "swamp":
      return tileSwamp;
    case "swampGrass":
      return tileSwampGrass;
    case "snowForest":
      return tileSnowForest;
    case "iceWater":
      return tileIceWater;
    case "sand":
      return tileSand;
    case "snow":
      return tileSnow;
    case "snowTown":
      return tileSnowTown; 
  }
}

/*
  arrA: sorted integer array
  arrB: sorted integer array
  return: intersection integer array of both arrays with repeated values
  example: arrA = [0, 1, 2, 3, 3, 3, 4, 5, 6, 6]
           arrB = [-1, 3, 6, 8]
           returns: [3, 3, 3, 3, 6, 6, 6]
*/
function getIntersection(arrA, arrB) {
  let ptrA = 0;
  let ptrB = 0;
  let arr = [];
  while (ptrA < arrA.length && ptrB < arrB.length) {
    if (arrA[ptrA] > arrB[ptrB]) {
      ptrB++;
    } else if (arrA[ptrA] < arrB[ptrB]) {
      ptrA++;
    } else { //equal
      let value = arrA[ptrA];
      let count = 0;
      while (ptrA < arrA.length && arrA[ptrA] == value) {
        count++;
        ptrA++;
      }
      while (ptrB < arrB.length && arrB[ptrB] == value) {
        count++;
        ptrB++;
      }
      //now count has total number of same values
      let addon = new Array(count).fill(value);
      arr = arr.concat(addon);
    }
  }
  return arr;
}

function reverseString(str) {
  return str.split("").reverse().join("");
}

/*
  int maxHeight: canvas height in pixels
  return: number of hexagons that fit in canvas vertically
*/
function calculateArrayY(maxHeight) {
  //adding R*sinA to numerator for padding
  return Math.floor((maxHeight - startOffsetY + R + (R * sinA)) / (2 * R * sinA));
}

/*
  int maxWidth: canvas height in pixels
  return: number of hexagons that fit in canvas horizontally
*/
function calculateArrayX(maxWidth) {
  //adding R * (1 + cosA) to numerator for padding
  return Math.floor((maxWidth - startOffsetX + 2 * R + (R * (1 + cosA))) / (R * (1 + cosA)));
}
