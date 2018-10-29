"use strict";

const { BoardTiles, TileCoord, CoordComparator } = require("..types");

export const getGoalBoard = (width: number, height: number): BoardTiles => {
  const range: number = width * height;
  const goal: BoardTiles = [];

  for (let y = 0, n = 1; y < height; y++) {
    goal[y] = [];
    for (let x = 0; x < width; x++, n++) {
      goal[y][x] = n < range ? n : 0;
    }
  }

  return goal;
};

export const flattenBoard = (board: BoardTiles): Array<number> => {
  return board.reduce((prev, cur) => prev.concat(cur));
};

export const getZeroPosition = (board: BoardTiles): TileCoord => {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board.length; x++) {
      if (board[y][x] === 0) {
        return { x, y };
      }
    }
  }
  throw new Error("Board does not contain an empty tile.");
};

export const newBoardFromPosition = (
  reference: BoardTiles,
  position: TileCoord,
  oldPosition: TileCoord
): Board => {
  const tiles = reference;

  tiles[oldPosition.y][oldPosition.x] = tiles[position.y][position.x];
  tiles[position.y][position.x] = 0;
  return new Board(tiles, position);
};

export default class Board {
  /** Reference to the provided board */
  board: BoardTiles;

  /** The board height */
  height: number;

  /** The board width */
  width: number;

  /** Reference to the goal board */
  goal: BoardTiles;

  /** The current position of zero */
  zeroPosition: TileCoord;

  constructor(tiles: BoardTiles, position: ?TileCoord = null) {
    this.board = tiles;
    this.height = tiles.length;
    this.width = tiles[0].length;
    this.zeroPosition = position || getZeroPosition(this.board);
    this.goal = getGoalBoard(this.width, this.height);
  }

  toString(): string {
    return this.board
      .reduce((prev, cur) => `${prev}\n${cur.join(" ")}`, "")
      .replace("0", " ");
  }

  equals(other: Board): boolean {
    const otherBoard = flattenBoard(other.board);
    return flattenBoard(this.board).every((val, i) => val === otherBoard[i]);
  }

  hamming(moves: number = 0): number {
    return (
      flattenBoard(this.board).filter((n, idx) => {
        if (n === 0) {
          return false;
        }
        if (n !== idx + 1) {
          return true;
        }
      }).length + moves
    );
  }

  manhattan(moves: number = 0): number {
    const numTiles: number = this.height * this.width;
    let priority: number = moves;

    for (var i = 0; i < numTiles; i++) {
      const coords: CoordComparator = {};

      for (var y = 0; y < this.board.length; y++) {
        const boardX = this.board[y].indexOf(i);
        const goalX = this.goal[y].indexOf(i);
        if (boardX !== -1) {
          coords.board = { x: boardX, y };
        }
        if (goalX !== -1) {
          coords.goal = { x: goalX, y };
        }
        if (coords.hasOwnProperty("board") && coords.hasOwnProperty("goal")) {
          break;
        }
      }

      priority +=
        Math.abs(coords.board.x - coords.goal.x) +
        Math.abs(coords.board.y - coords.goal.y);
    }

    return priority;
  }

  getPriority(moves: number): number {
    const hamming = this.hamming(moves);
    const manhattan = this.manhattan(moves);
    return hamming > manhattan ? manhattan : hamming;
  }

  getNeighbors(): Array<Board> {
    const result = [];

    for (let i = 1; i > -2; i -= 2) {
      if (
        this.zeroPosition.x + i >= 0 &&
        this.zeroPosition.x + i < this.width
      ) {
        result.push(
          newBoardFromPosition(
            this.board,
            {
              x: this.zeroPosition.x + i,
              y: this.zeroPosition.y
            },
            this.zeroPosition
          )
        );
      }

      if (
        this.zeroPosition.y + i >= 0 &&
        this.zeroPosition.y + i < this.height
      ) {
        result.push(
          newBoardFromPosition(
            this.board,
            {
              x: this.zeroPosition.x,
              y: this.zeroPosition.y + i
            },
            this.zeroPosition
          )
        );
      }
    }

    return result;
  }
}
