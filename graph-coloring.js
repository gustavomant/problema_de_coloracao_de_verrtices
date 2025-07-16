const fs = require('fs');
const path = require('path');

// Função para garantir que o diretório existe
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Função para carregar o grafo CORRIGIDA
const loadGraph = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const edges = [];
    let numVertices = 0;

    for (const line of lines) {
      if (line.startsWith('p edge') || line.startsWith('p col')) {
        const parts = line.trim().split(/\s+/);
        numVertices = parseInt(parts[2], 10);
      } else if (line.startsWith('e')) {
        const parts = line.trim().split(/\s+/);
        edges.push([parseInt(parts[1], 10) - 1, parseInt(parts[2], 10) - 1]);
      }
    }

    const adjList = Array.from({ length: numVertices }, () => new Set());
    for (const [u, v] of edges) {
      adjList[u].add(v);
      adjList[v].add(u);
    }

    return { 
      adjList, 
      numVertices, 
      numEdges: edges.length,
      success: true
    };
  } catch (error) {
    console.error(`Erro ao carregar grafo: ${filePath}`, error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Função para salvar resultados
const saveResults = (algorithmName, results) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputDir = path.join(__dirname, 'results');
  ensureDir(outputDir);
  
  const filename = `${algorithmName}_results_${timestamp}.json`;
  const filePath = path.join(outputDir, filename);
  
  fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
  console.log(`Resultados salvos em: ${filePath}`);
};

// Função para extrair número de vértices de forma segura
const getVertices = (name) => {
  const matches = name.match(/\d+/g);
  return matches ? parseInt(matches[0]) || 0 : 0;
};

// Função principal CORRIGIDA
const processAllInstances = (instances, coloringAlgorithm, algorithmName) => {
  const results = [];
  
  // Ordena instâncias pelo número de vértices estimado
  const sortedInstances = [...instances].sort((a, b) => {
    return getVertices(a.name) - getVertices(b.name);
  });

  for (const instance of sortedInstances) {
    const startTime = Date.now();
    const instanceResult = {
      algoritmo: algorithmName,
      instancia: instance.name,
      arquivo: instance.file,
      vertices: 0,
      arestas: 0,
      cores: 0,
      tempo_ms: 0,
      coloracao: []
    };
    
    try {
      const filePath = path.join(__dirname, 'col', instance.file);
      const graphData = loadGraph(filePath);
      
      if (!graphData.success) {
        throw new Error(graphData.error || 'Erro desconhecido ao carregar grafo');
      }

      const { adjList, numVertices, numEdges } = graphData;
      
      const coloring = coloringAlgorithm(adjList, numVertices);
      const numColors = Math.max(...coloring) + 1;
      
      instanceResult.vertices = numVertices;
      instanceResult.arestas = numEdges;
      instanceResult.cores = numColors;
      instanceResult.tempo_ms = Date.now() - startTime;
      
      if (numVertices <= 250) {
        instanceResult.coloracao = coloring.map((cor, indice) => ({
          vertice: indice + 1,
          cor
        }));
      }
      
    } catch (error) {
      instanceResult.erro = error.message;
      console.error(`Falha ao processar ${instance.name}:`, error.message);
    }
    
    results.push(instanceResult);
    console.log(`Processado: ${instance.name} | Cores: ${instanceResult.cores} | Tempo: ${instanceResult.tempo_ms}ms`);
  }

  saveResults(algorithmName, results);
  return results;
};

module.exports = { 
  processAllInstances, 
  loadGraph,
  saveResults
};