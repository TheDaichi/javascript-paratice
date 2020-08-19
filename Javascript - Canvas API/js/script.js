const { Engine, Render, Runner, World, Bodies } = Matter;

// Configuration
const width = 800;
const height = 800;
const cells = 3;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
  // Canvas
  element: document.body,
  engine: engine,
  options: {
    // wireframes: false,
    width,
    height,
  },
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Drag & Drop
// World.add(
//   world,
//   MouseConstraint.create(engine, {
//     mouse: Mouse.create(render.canvas),
//   })
// );

// x-axis, y-axis, l, b
const shape = Bodies.rectangle(200, 200, 50, 50, {
  // Stop Gravity
  isStatic: true,
});

// Walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 40, height, { isStatic: true }),
];

World.add(world, walls);

// Random Shapes
// for (let i = 0; i < 20; i++) {
//   World.add(
//     world,
//     Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 50, {
//       isStatic: false,
//     })
//   );
//   World.add(
//     world,
//     Bodies.circle(Math.random() * width, Math.random() * height, 30, {
//       isStatic: false,
//     })
//   );
// }

/**
 * Maze Generation
 * Grid
 * ----------------------------
 * |   F   |    F    |   F    |
 * ----------------------------
 * |   F   |    F    |   F    |
 * ----------------------------
 * |   F   |    F    |   F    |
 * ----------------------------
 */
const grid = Array(cells)
  .fill(null)
  .map(() => Array(cells).fill(false));

const verticals = Array(cells)
  .fill(null)
  .map(() => Array(cells - 1).fill(false));

const horizontals = Array(cells - 1)
  .fill(null)
  .map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

const stepThroughCell = (row, column) => {
  // Visted Cell in grid at [row][column]
  if (grid[row][column]) {
    return;
  }
  // Mark Cell in grid visited
  grid[row][column] = true;

  /**
   * Neighbours
   * row - 1, column
   * row, column - 1
   * row, column + 1
   * row + 1, column
   */

  const neighbours = shuffleArray([
    [row - 1, column, "up"],
    [row, column - 1, "left"],
    [row, column + 1, "right"],
    [row + 1, column, "down"],
  ]);

  // Movement Direction
  for (let neighbour of neighbours) {
    const [nextRow, nextColumn, direction] = neighbour;
    // Out of bounds for grid
    if (
      nextRow < 0 ||
      nextRow >= cells ||
      nextColumn < 0 ||
      nextColumn >= cells
    ) {
      continue;
    }

    // Visited neighbour
    if (grid[nextRow][nextColumn]) {
      continue;
    }

    // Updating verticals and horizontals arrays
    if (direction === "left") {
      verticals[row][column - 1] = true;
    } else if (direction === "right") {
      verticals[row][column + 1] = true;
    } else if (direction === "up") {
      horizontals[row - 1][column] = true;
    } else if (direction === "down") {
      horizontals[row][column] = true;
    }
    // Visit that next cell
    stepThroughCell(nextRow, nextColumn);
  }
};

stepThroughCell(startRow, startColumn);

horizontals.forEach((row) => {
  row.forEach((open) => {
    if (open) {
      return;
    }
    
  });
});

verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }
  });
});
