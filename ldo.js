const { processAllInstances } = require('./graph-coloring');
const { instances } = require('./graph-instances.config');

function largestDegreeOrderingColoring(adjList, numVertices) {
  const colors = Array(numVertices).fill(-1);
  const degrees = adjList.map((neighbors, i) => ({ vertex: i, degree: neighbors.size }));
  degrees.sort((a, b) => b.degree - a.degree);

  let colorSet = 0;
  for (const { vertex } of degrees) {
    const usedColors = new Set();
    for (const neighbor of adjList[vertex]) {
      if (colors[neighbor] !== -1) usedColors.add(colors[neighbor]);
    }

    let color = 0;
    while (usedColors.has(color)) color++;
    
    colors[vertex] = color;
    if (color >= colorSet) colorSet = color + 1;
  }

  return colors;
}

processAllInstances(instances, largestDegreeOrderingColoring, 'ldo');