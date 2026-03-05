// Circuit Simulation Engine
// Simple DC circuit solver using graph traversal and Ohm's law
window.CircuitSim = (function () {
  const Types = {
    BATTERY: 'battery', RESISTOR: 'resistor', LED: 'led',
    BUZZER: 'buzzer', SWITCH: 'switch', CAPACITOR: 'capacitor',
    TRANSISTOR: 'transistor', MOTOR: 'motor', PHOTORESISTOR: 'photoresistor',
    POTENTIOMETER: 'potentiometer'
  };

  class Circuit {
    constructor() {
      this.components = [];
      this.wires = [];
    }

    addComponent(comp) {
      this.components.push(comp);
      return comp;
    }

    addWire(a, b) {
      if (a === b) return false;
      if (this.wires.some(w =>
        (w[0] === a && w[1] === b) || (w[0] === b && w[1] === a)
      )) return false;
      this.wires.push([a, b]);
      return true;
    }

    removeWire(a, b) {
      this.wires = this.wires.filter(w =>
        !((w[0] === a && w[1] === b) || (w[0] === b && w[1] === a))
      );
    }

    clearWires() {
      this.wires = [];
    }

    // Union-Find to group terminals connected by wires
    buildNodeGroups() {
      const parent = {};
      const find = (x) => {
        if (!(x in parent)) parent[x] = x;
        if (parent[x] !== x) parent[x] = find(parent[x]);
        return parent[x];
      };
      const union = (a, b) => { parent[find(a)] = find(b); };

      for (const comp of this.components) {
        for (const t of comp.terminals) find(t);
      }
      for (const [a, b] of this.wires) {
        union(a, b);
      }
      return { find };
    }

    // Get effective resistance for a component
    getResistance(comp) {
      switch (comp.type) {
        case Types.RESISTOR: return comp.resistance || 1000;
        case Types.LED: return 200;
        case Types.BUZZER: return 100;
        case Types.MOTOR: return 80;
        case Types.PHOTORESISTOR: return comp.resistance || 5000;
        case Types.POTENTIOMETER: return comp.resistance || 1000;
        case Types.SWITCH: return comp.closed ? 0.1 : 1e9;
        case Types.CAPACITOR: return comp.charged ? 1e9 : 150;
        case Types.TRANSISTOR: return comp.baseActive ? 15 : 1e9;
        default: return 0.1;
      }
    }

    // Find all simple paths from startNode to endNode through components
    findPaths(startNode, endNode, nodeOf) {
      // Build component graph: node → [{ comp, otherNode }]
      const graph = new Map();
      const addEdge = (nA, nB, comp) => {
        if (!graph.has(nA)) graph.set(nA, []);
        graph.get(nA).push({ comp, node: nB });
        if (!graph.has(nB)) graph.set(nB, []);
        graph.get(nB).push({ comp, node: nA });
      };

      for (const comp of this.components) {
        if (comp.type === Types.BATTERY) continue;
        if (comp.terminals.length >= 2) {
          const nA = nodeOf(comp.terminals[0]);
          const nB = nodeOf(comp.terminals[1]);
          if (nA !== nB) addEdge(nA, nB, comp);
        }
      }

      const allPaths = [];
      const usedComps = new Set();

      const dfs = (node, path) => {
        if (node === endNode) {
          allPaths.push([...path]);
          return;
        }
        if (allPaths.length > 50) return; // safety limit
        for (const edge of (graph.get(node) || [])) {
          if (usedComps.has(edge.comp.id)) continue;
          usedComps.add(edge.comp.id);
          path.push(edge.comp);
          dfs(edge.node, path);
          path.pop();
          usedComps.delete(edge.comp.id);
        }
      };

      dfs(startNode, []);
      return allPaths;
    }

    // Check if transistor base is powered
    checkTransistors(nodeOf, battery) {
      if (!battery) return;
      const posNode = nodeOf(battery.terminals[0]);
      const negNode = nodeOf(battery.terminals[1]);

      for (const comp of this.components) {
        if (comp.type !== Types.TRANSISTOR) continue;
        // Terminal 0 = Base, 1 = Collector, 2 = Emitter
        const baseNode = nodeOf(comp.terminals[0]);
        // Check if base connects to battery+ through any resistor path
        // Simple check: is base in same node group as battery+?
        // Or connected through components to battery+ while emitter connects to battery-
        const emitterNode = nodeOf(comp.terminals[2]);

        // Simplified: check if there's a component path from battery+ to base
        // and emitter connects (possibly through components) to battery-
        const basePaths = this.findPaths(posNode, baseNode, nodeOf);
        const emitterPaths = this.findPaths(emitterNode, negNode, nodeOf);
        comp.baseActive = basePaths.length > 0 && emitterPaths.length > 0;
        // Also active if base directly connected to posNode
        if (baseNode === posNode && emitterNode === negNode) comp.baseActive = true;
      }
    }

    // Main solve method
    solve() {
      const { find } = this.buildNodeGroups();

      const results = new Map();
      for (const comp of this.components) {
        results.set(comp.id, { current: 0, voltage: 0, active: false });
      }

      const battery = this.components.find(c => c.type === Types.BATTERY);
      if (!battery) return results;

      const posNode = find(battery.terminals[0]);
      const negNode = find(battery.terminals[1]);

      if (posNode === negNode) {
        // Short circuit
        results.set(battery.id, { current: 999, voltage: battery.voltage, active: true, shortCircuit: true });
        return results;
      }

      const voltage = battery.voltage || 9;

      // Check transistor base connections first
      this.checkTransistors(find, battery);

      // Find all paths from battery+ to battery-
      const paths = this.findPaths(posNode, negNode, find);

      for (const path of paths) {
        let totalR = 0;
        let blocked = false;

        for (const comp of path) {
          const r = this.getResistance(comp);
          if (r >= 1e8) { blocked = true; break; }
          totalR += r;
        }

        if (blocked || totalR <= 0) continue;

        const current = voltage / totalR;

        for (const comp of path) {
          const prev = results.get(comp.id);
          prev.current += current;
          prev.voltage = current * this.getResistance(comp);
          prev.active = true;
          results.set(comp.id, prev);
        }

        const bResult = results.get(battery.id);
        bResult.current += current;
        bResult.voltage = voltage;
        bResult.active = true;
      }

      return results;
    }
  }

  return { Circuit, Types };
})();
