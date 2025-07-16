const { processAllInstances } = require('./graph-coloring');
const { instances } = require('./graph-instances.config');

function firstFitColoring(adjList, numVertices) {
  const colors = Array(numVertices).fill(-1);
  colors[0] = 0; // Primeiro vértice recebe a primeira cor

  for (let u = 1; u < numVertices; u++) {
    const usedColors = new Set();

    for (const neighbor of adjList[u]) {
      if (colors[neighbor] !== -1) {
        usedColors.add(colors[neighbor]);
      }
    }

    let color = 0;
    while (usedColors.has(color)) {
      color++;
    }

    colors[u] = color;
  }

  return colors;
}

processAllInstances(instances, firstFitColoring, 'ff');