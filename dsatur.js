const { processAllInstances } = require('./graph-coloring');
const { instances } = require('./graph-instances.config');

function dsaturColoring(adjList, numVertices) {
  const colors = Array(numVertices).fill(-1);
  const saturation = Array(numVertices).fill(0);
  const uncolored = new Set([...Array(numVertices).keys()]);

  // Inicializa graus
  const degrees = adjList.map((neighbors, i) => neighbors.size);

  // Primeiro vértice: maior grau
  let maxDegreeVertex = 0;
  for (let i = 1; i < numVertices; i++) {
    if (degrees[i] > degrees[maxDegreeVertex]) {
      maxDegreeVertex = i;
    }
  }

  colors[maxDegreeVertex] = 0;
  uncolored.delete(maxDegreeVertex);

  // Atualiza saturação dos vizinhos
  for (const neighbor of adjList[maxDegreeVertex]) {
    saturation[neighbor] = 1;
  }

  while (uncolored.size > 0) {
    // Encontra vértice não colorido com maior saturação (desempate por maior grau)
    let selected = -1;
    let maxSaturation = -1;
    let maxDegree = -1;

    for (const vertex of uncolored) {
      if (saturation[vertex] > maxSaturation || 
         (saturation[vertex] === maxSaturation && degrees[vertex] > maxDegree)) {
        selected = vertex;
        maxSaturation = saturation[vertex];
        maxDegree = degrees[vertex];
      }
    }

    // Encontra menor cor disponível
    const usedColors = new Set();
    for (const neighbor of adjList[selected]) {
      if (colors[neighbor] !== -1) {
        usedColors.add(colors[neighbor]);
      }
    }

    let color = 0;
    while (usedColors.has(color)) color++;

    colors[selected] = color;
    uncolored.delete(selected);

    // Atualiza saturação dos vizinhos
    for (const neighbor of adjList[selected]) {
      if (colors[neighbor] === -1) {
        const neighborColors = new Set();
        for (const n of adjList[neighbor]) {
          if (colors[n] !== -1) {
            neighborColors.add(colors[n]);
          }
        }
        saturation[neighbor] = neighborColors.size;
      }
    }
  }

  return colors;
}

processAllInstances(instances, dsaturColoring, 'dsatur');