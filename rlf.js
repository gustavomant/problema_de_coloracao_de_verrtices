const { processAllInstances } = require('./graph-coloring');
const { instances } = require('./graph-instances.config');

function rlfColoring(adjList, numVertices) {
  const colors = Array(numVertices).fill(-1);
  const uncolored = new Set([...Array(numVertices).keys()]);
  let currentColor = 0;

  while (uncolored.size > 0) {
    // Seleciona vértice com maior grau
    let maxDegreeVertex = -1;
    let maxDegree = -1;
    for (const v of uncolored) {
      if (adjList[v].size > maxDegree) {
        maxDegree = adjList[v].size;
        maxDegreeVertex = v;
      }
    }

    const colorGroup = new Set([maxDegreeVertex]);
    const U = new Set(adjList[maxDegreeVertex]);
    const Vprime = new Set();

    // Preenche V' com vértices não adjacentes ao grupo atual
    for (const v of uncolored) {
      if (v !== maxDegreeVertex && !U.has(v)) {
        Vprime.add(v);
      }
    }

    uncolored.delete(maxDegreeVertex);

    while (Vprime.size > 0) {
      let bestVertex = -1;
      let maxAdjToU = -1;
      let maxDegreeVprime = -1;

      for (const v of Vprime) {
        let adjCount = 0;
        for (const n of adjList[v]) {
          if (U.has(n)) adjCount++;
        }

        if (adjCount > maxAdjToU || 
            (adjCount === maxAdjToU && adjList[v].size > maxDegreeVprime)) {
          maxAdjToU = adjCount;
          maxDegreeVprime = adjList[v].size;
          bestVertex = v;
        }
      }

      if (bestVertex === -1) break;

      colorGroup.add(bestVertex);
      uncolored.delete(bestVertex);
      Vprime.delete(bestVertex);

      for (const n of adjList[bestVertex]) {
        U.add(n);
      }

      // Remove de V' os que agora são adjacentes
      for (const v of Array.from(Vprime)) {
        if (U.has(v)) {
          Vprime.delete(v);
        }
      }
    }

    // Aplica a cor
    for (const v of colorGroup) {
      colors[v] = currentColor;
    }

    currentColor++;
  }

  return colors;
}

processAllInstances(instances, rlfColoring, 'rlf');