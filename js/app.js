// counter for sliding blocks
var cnt = 0;

// Priority Queue sorted by cost
const q = new PriorityQueue((a, b) => b.cost < a.cost);

// SlidingBlock class
var SlidingBlock = function() {
  cnt += 1;
  this.id = cnt;
  this.disc = [[], [], []];
  this.esx = 0;
  this.esy = 0;
  this.cost = 0;
  this.moves = []; // moves to achieve this sliding block
};

// init will be used only once
SlidingBlock.prototype.init = function() {
  this.disc = [[0, 3, 6], [1, 4, 7], [2, 5, 8]];
};

// instead of copy constructor
SlidingBlock.prototype.copy = function(other) {
  for (i = 0; i < 3; i += 1)
    for (j = 0; j < 3; j += 1) this.disc[i][j] = other.disc[i][j];
  for (i = 0; i < other.moves.length; i += 1) this.moves[i] = other.moves[i];
  this.esx = other.esx;
  this.esy = other.esy;
  this.cost = other.cost;
};

SlidingBlock.prototype.handleInput = function(direction) {
  if (direction) {
    var x0 = this.esx,
      x = x0, // old and new coords of empty slot
      y0 = this.esy,
      y = y0;
    if (direction == "left" && x0 > 0) x -= 1;
    if (direction == "right" && x0 < 2) x += 1;
    if (direction == "up" && y0 > 0) y -= 1;
    if (direction == "down" && y0 < 2) y += 1;
    this.disc[x0][y0] = this.disc[x][y];
    this.disc[x][y] = 0;
    this.esx = x;
    this.esy = y;
    if (x0 != x || y0 != y) {
      this.moves.push(direction);
      console.log("possible moves: " + this.getMove());
    }
    var t = new SlidingBlock();
    t.copy(this);
    q.push(t);
    this.setCost();
    this.render();
    this.log();
  }
};

SlidingBlock.prototype.render = function() {
  // ctx.strokeRect(0, 0, 302, 302);
  // ctx.fillRect(0, 0, 302, 302);
  for (i = 0; i < 3; i += 1) {
    for (j = 0; j < 3; j += 1) {
      ctx.clearRect(2 + i * 100, 2 + j * 100, 98, 98);
      if (this.disc[i][j] != 0)
        ctx.fillText(this.disc[i][j], 42 + i * 100, 62 + j * 100);
      else {
        ctx.strokeRect(6 + i * 100, 6 + j * 100, 90, 90);
        ctx.fillText(" ", 42 + i * 100, 62 + j * 100);
      }
    }
  }
};

SlidingBlock.prototype.grid = function() {
  return (
    "" +
    this.disc[0][0] +
    this.disc[0][1] +
    this.disc[0][2] +
    this.disc[1][0] +
    this.disc[1][1] +
    this.disc[1][2] +
    this.disc[2][0] +
    this.disc[2][1] +
    this.disc[2][2]
  );
};

SlidingBlock.prototype.log = function() {
  log.innerHTML = "<b>Log:</b><br/>" + this.moves;
  log2.innerHTML = // += '<br />'+this.moves;
    "<b>Status:</b> </br><i>id</i>: " +
    this.id +
    "; <i>empty slot</i> : (" +
    this.esx +
    ", " +
    this.esy +
    "); " +
    "<i>allowed moves</i>: " +
    this.getMove() +
    "</br>" +
    this.disc[0] +
    "</br>" +
    this.disc[1] +
    "</br>" +
    this.disc[2] +
    "</br><i>Cost</i>: " +
    Math.round(this.cost * 100) / 100;
};

SlidingBlock.prototype.reset = function(shuffle) {
  this.disc = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
  this.moves = [];
  log.innerHTML = "<b>Log:</b>";
  if (shuffle) {
    for (i = 0; i < 3; i += 1) {
      for (j = 0; j < 3; j += 1) {
        var ii = i + Math.floor(Math.random() * (3 - i));
        var jj = j + Math.floor(Math.random() * (3 - j));
        var tmp = this.disc[i][j];
        this.disc[i][j] = this.disc[ii][jj];
        this.disc[ii][jj] = tmp;
        if (this.disc[i][j] == 0) {
          this.esx = i;
          this.esy = j;
        }
      }
    }
  }
  this.render();
};

SlidingBlock.prototype.setCost = function() {
  var h1 = 0,
    h2 = 0;
  //setting heuristic 1 => number of misplaced blocks
  //setting heuristic 2 => distance of the node to its block
  for (i = 0; i < 3; i += 1) {
    for (j = 0; j < 3; j += 1) {
      var val = this.disc[i][j];
      if (val != 3 * j + i && val != 0) {
        h1 += 1;
        var expPosX = val % 3;
        var expPosY = val / 3;
        h2 += Math.abs(i - expPosX) + Math.abs(j - expPosY);
      }
    }
  }
  this.cost = Math.max(h1, h2) + this.moves.length;
};

// all movement for current state
SlidingBlock.prototype.getMove = function() {
  var x0 = this.esx,
    y0 = this.esy;
  var movements = [];
  if (x0 > 0) movements.push("left");
  if (x0 < 2) movements.push("right");
  if (y0 > 0) movements.push("up");
  if (y0 < 2) movements.push("down");
  return movements;
};

SlidingBlock.prototype.makeMove = function(move) {
  if (move.length == 0) {
    var moves = this.getMove();
    var randPointIndex = Math.floor(Math.random() * moves.length);
    this.makeMove(moves[randPointIndex]);
  } else {
    console.log("Bot moves: " + move);
    this.handleInput(move);
  }
  this.setCost();
};

SlidingBlock.prototype.solved = function() {
  for (i = 0; i < 3; i += 1)
    for (j = 0; j < 3; j += 1) if (this.disc[i][j] != j * 3 + i) return false;
  return true;
};

block = new SlidingBlock();
block.init();
q.push(block);
start = new SlidingBlock();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener("keyup", function(e) {
  var allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
  };
  block.handleInput(allowedKeys[e.keyCode]);
});

function reset() {
  block.reset(true);
  block.log();
}

function move() {
  block.makeMove("");
  block.log();
}

function solve() {
  // reset moves for current state before solving
  block.moves = [];
  // saving start state
  start.copy(block);

  // Priority Queue for all sliding blocks
  const queue = new PriorityQueue((a, b) => b.cost > a.cost);
  //
  var explored = new Set();
  //
  var expanded = [];
  // placing current state in Priority Queue
  queue.push(block);

  var node = new SlidingBlock();
  node.copy(block);
  // we are ready fo explore all neigbours of node, so its allmost explored
  explored.add(node.grid());
  console.log(explored);
  while (!node.solved() && !queue.isEmpty() && cnt < 362880) {
    // 9! steps in worst case
    cnt += 1;
    // pop sli
    node = queue.pop();
    console.log(
      "cnt = " +
        cnt +
        "; heap size = " +
        queue.size() +
        (node.solved() ? "; !!!OK!!!" : "; ---not ok---")
    );
    console.log(node);
    expanded.push(node.grid());
    var moves = node.getMove();
    console.log("Trying to iterate moves from: " + moves);

    for (var i = 0; i < moves.length; i += 1) {
      var tempBlock = new SlidingBlock();
      tempBlock.copy(node);
      tempBlock.makeMove(moves[i]);

      if (!explored.has(tempBlock.grid())) {
        console.log(tempBlock);
        queue.push(tempBlock);
        explored.add(node.grid());
        console.log(explored);
      }
    }
  }
  while (!q.isEmpty()) {
    console.log(q.pop());
  }
  node.log();
  node.render();
  log.innerHTML = "<b>Log:</b>";
  if (node.solved()) log.innerHTML += "solved";
  sol.innerHTML += node.moves;
  block.copy(start);
  block.render();
}
