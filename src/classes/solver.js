//checks if the puzzle is possible
"use strict";

const Board = require("./board");

export type SolverState = {
  board: Board,
  moves: number,
  previous: ?SolverState
};

export type SolverSolution = {
  states: Array<SolverState>,
  moves: number,
  solvable: boolean,
  context: Solver
};

export type PriorityQueueItem = {
  priority: number,
  board: Board
};

//if not solvable

export class NotSolvableError extends Error {
  solver: SolverSolution;
  constructor(solver: SolverSolution) {
    super("Board not solvable!");
    this.name = this.constructor.name;
    this.solver = solver;
  }
}

export const hasBoardBeenUsed = (
  board: Board,
  queue: Array<SolverState>
): boolean => {
  return !queue.every(state => !board.equals(state.board));
};

export default class Solver {
  /** The starting board we are solving for */
  start: Board;

  /** The goal board we are trying to get to */
  goal: Board;

  /** The Solvers moves queue */
  // history: Array<SolverState>;

  constructor(initial: Board) {
    this.start = initial;
    this.goal = new Board(initial.goal);
  }

  solve(): Promise<?SolverSolution> {
    let state: SolverState = {
      board: this.start,
      moves: 0,
      previous: null
    };
    const history: Array<SolverState> = [state];

    return new Promise((resolve, reject) => {
      try {
        while (!state.board.equals(this.goal)) {
          state = this.getNextMove(state, history);
          history.push(state);
        }
        resolve({
          states: history,
          moves: state.moves,
          context: this,
          solvable: true
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  getNextMove(state: SolverState, history: Array<SolverState>): SolverState {
    const neighbors = state.board
      .getNeighbors()
      .filter(board => !hasBoardBeenUsed(board, history));
    const priority = this.createPriorityQueue(neighbors, state.moves);

    if (priority.length < 1) {
      throw new NotSolvableError({
        states: history,
        moves: state.moves,
        context: this,
        solvable: false
      });
    }

    // Return a new state
    return {
      board: priority[0].board,
      moves: state.moves + 1,
      previous: state
    };
  }

  createPriorityQueue(
    boards: Array<Board>,
    moves: number
  ): Array<PriorityQueueItem> {
    return boards
      .map(board => ({
        priority: board.getPriority(moves),
        board: board
      }))
      .sort((a, b) => a.priority - b.priority);
  }
}
