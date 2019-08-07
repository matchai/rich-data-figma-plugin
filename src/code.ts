figma.showUI(__html__);

figma.ui.onmessage = async msg => {
  if (msg.type === "populate") {
    const instanceNodes = figma.currentPage.findAll(
      node => node.type === "INSTANCE"
    ) as InstanceNode[];

    // Keep a count of the number of instances per component
    type componentIndexMap = Map<ComponentNode, number>;
    const componentIndices: componentIndexMap = new Map();

    instanceNodes.forEach(instanceNode => {
      // Replace the empty `[]` in all instance nodes with incrementing indices
      const currentVal = componentIndices.get(instanceNode.masterComponent) || 0;
      const textNodes = findTextNodes(instanceNode);
      textNodes.forEach(textNode => replacePlaceholder(textNode, msg.body, currentVal));

      // Increment number in map
      componentIndices.set(instanceNode.masterComponent, currentVal + 1);
    });

    // const textNodes = figma.currentPage.findAll(
    //   node => node.type === "TEXT"
    // ) as TextNode[];
    // if (textNodes.length == 0) return;

    // textNodes.map(node => replacePlaceholder(node, msg.body));
  }
};

function findTextNodes(rootNode: ChildrenMixin) {
  return rootNode.findAll(
    node => node.type === "TEXT"
  ) as TextNode[];
}

/**
 * Replace placeholder text values preceeded with a `$` with the value at the
 * associated json path. Replace square-brackets with incrementing indices
 */
async function replacePlaceholder(node: TextNode, json: Object, index: number = 0): Promise<null> {
  if (!node.characters.startsWith("$")) return;
  // Remove "$" from start
  let path = node.characters.slice(1);
  // Populate empty square-brackets with the provided index
  path = path.replace("[]", `[${index}]`);

  const objValue = get(json, path);
  if (objValue == null) return;

  await figma.loadFontAsync(node.fontName as FontName);
  node.characters = String(objValue);
}

/**
 * Equivalent to _.get from lodash
 */
function get(obj, path, def = null) {
	var fullPath = path
		.replace(/\[/g, '.')
		.replace(/]/g, '')
		.split('.')
		.filter(Boolean);

	return fullPath.every(everyFunc) ? obj : def;

	function everyFunc(step) {
		return !(step && (obj = obj[step]) === undefined);
	}
}
