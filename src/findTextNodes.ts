// Instance text nodes
// Text nodes outside an instance (or master)

// This is a generator that recursively produces all the nodes in subtree
// starting at the given node
function* walkTree(node, inInstance = false) {
  yield { node, inInstance };
  let children = node.children;
  if (children) {
    for (let child of children) {
      // Skip master components
      if (child.type === "COMPONENT") {
        continue;
      }
      yield* walkTree(child, inInstance || node.type === "INSTANCE");
    }
  }
}

// Keep a count of the number of instances per component
type componentIndexMap = Map<ComponentNode, number>;
const componentIndices: componentIndexMap = new Map();

function getIndex(instanceNode: InstanceNode) {
  const currentVal = componentIndices.get(instanceNode.masterComponent) || 0;
  componentIndices.set(instanceNode.masterComponent, currentVal + 1);
  return currentVal;
}

export default function findTextNodes(rootNode: BaseNode) {
  const walker = walkTree(rootNode);
  const nodes: { index: number; node: TextNode }[] = [];
  let currentInstanceIndex = null;

  for (const { node, inInstance } of walker) {
    if (node.type === "INSTANCE") {
      currentInstanceIndex = getIndex(node);
    } else if (node.type === "TEXT") {
      nodes.push({
        index: inInstance ? currentInstanceIndex : 0,
        node
      });
    }
  }

  return nodes;
}
