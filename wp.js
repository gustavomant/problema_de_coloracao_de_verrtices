const { processAllInstances } = require('./graph-coloring');
const { instances } = require('./graph-instances.config');

function welshPowellColoring(adjList, numVertices) {
  const degrees = adjList.map((neighbors, i) => ({ 
    vertex: i, 
    degree: neighbors.size 
  }));
  
  degrees.sort((a, b) => b.degree - a.degree);
  const sortedVertices = degrees.map(obj => obj.vertex);

  const colors = Array(numVertices).fill(-1);
  let currentColor = 0;

  while (colors.includes(-1)) {
    for (const vertex of sortedVertices) {
      if (colors[vertex] === -1) {
        let canColor = true;
        for (const neighbor of adjList[vertex]) {
          if (colors[neighbor] === currentColor) {
            canColor = false;
            break;
          }
        }
        if (canColor) colors[vertex] = currentColor;
      }
    }
    currentColor++;
  }

  return colors;
}

processAllInstances(instances, welshPowellColoring, 'wp');