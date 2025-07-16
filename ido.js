const { processAllInstances } = require('./graph-coloring');
const { instances } = require('./graph-instances.config');

function incidenceDegreeOrderingColoring(adjList, numVertices) {
  const colors = Array(numVertices).fill(-1);
  const degrees = adjList.map((neighbors, i) => ({ 
    vertex: i, 
    degree: neighbors.size 
  }));

  const uncolored = new Set([...Array(numVertices).keys()]);
  let currentColor = 0;

  // Passo 1: Seleciona vértice de maior grau
  degrees.sort((a, b) => b.degree - a.degree);
  colors[degrees[0].vertex] = currentColor;
  uncolored.delete(degrees[0].vertex);
  currentColor++;

  while (uncolored.size > 0) {
    // Passo 2: Conta vizinhos coloridos
    const candidates = [];
    for (const vertex of uncolored) {
      let coloredNeighbors = 0;
      for (const neighbor of adjList[vertex]) {
        if (colors[neighbor] !== -1) coloredNeighbors++;
      }
      candidates.push({
        vertex,
        coloredNeighbors,
        degree: adjList[vertex].size
      });
    }

    // Ordena por vizinhos coloridos (decrescente) e grau (decrescente)
    candidates.sort((a, b) => 
      b.coloredNeighbors - a.coloredNeighbors || b.degree - a.degree
    );

    const selected = candidates[0].vertex;

    // Passo 3: Tenta atribuir cor existente
    const usedColors = new Set();
    for (const neighbor of adjList[selected]) {
      if (colors[neighbor] !== -1) usedColors.add(colors[neighbor]);
    }

    let color = 0;
    while (usedColors.has(color)) color++;

    colors[selected] = color;
    if (color >= currentColor) currentColor = color + 1;
    uncolored.delete(selected);
  }

  return colors;
}

processAllInstances(instances, incidenceDegreeOrderingColoring, 'ido');