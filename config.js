/*
const TileType = {
  0: "grass",
  1: "trees",
  2: "forest",
  3: "sandTown",
  4: "grassRocks",
  5: "sandMine",
  6: "water",
  7: "oasis",
  8: "grassTown",
  9: "swamp",
  10: "swampGrass",
  11: "snowForest",
  12: "iceWater",
  13: "sand",
  14: "snow",
  15: "snowTown"
};
*/

const TileType = [
  "grass", "trees", "forest", "sandTown", "grassRocks", "sandMine", "water", "oasis",
   "grassTown", "swamp", "swampGrass", "snowForest", "iceWater", "sand", "snow",
    "snowTown"
  ]

const TileNeighbors = {
  "grass": [0, 0, 0, 0, 0, 1, 4, 6, 10, 13, 14],
  "trees": [0, 0, 0, 1, 2, 4],
  "forest": [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4],
  "sandTown": [5, 13, 13, 13, 13],
  "grassRocks": [0, 0, 0, 0, 1, 2, 2, 4],
  "sandMine": [13],
  "water": [0, 6, 6, 6, 6, 6, 6, 12, 12],
  "oasis": [13],
  "grassTown": [0, 1],
  "swamp": [10],
  "swampGrass": [0, 10, 10, 10, 10],
  "snowForest": [14, 14, 14, 15],
  "iceWater": [6, 6, 6, 6, 12, 14],
  "sand": [0, 0, 0, 0, 0, 3, 5, 7, 13, 13, 13, 13, 13, 13, 13],
  "snow": [0, 11, 12, 12, 12, 14, 14, 14, 14, 14, 14, 15],
  "snowTown": [14]
};
