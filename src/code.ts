import findTextNodes from "./findTextNodes";
figma.showUI(__html__);

figma.ui.onmessage = async msg => {
  if (msg.type === "populate") {
    const textNodes = findTextNodes(figma.currentPage);
    textNodes.forEach(textNode => replacePlaceholder(textNode, msg.body));
  }

  if (msg.type === "reset") {
    const textNodes = findTextNodes(figma.currentPage);
    textNodes.forEach(({ node }) => resetPlaceholder(node));
  }
};

/**
 * Replace placeholder text values preceeded with a `$` with the value at the
 * associated json path. Replace square-brackets with incrementing indices
 */
async function replacePlaceholder({ node, index }, json: Object) {
  if (!node.characters.startsWith("$")) return;
  // Remove "$" from start
  const jsonPath = node.characters.slice(1);
  // Populate empty square-brackets with the provided index
  const indexedPath = jsonPath.replace("[]", `[${index}]`);

  const objValue = get(json, indexedPath);
  if (objValue == null) return;
  setJsonPath(node, jsonPath);

  await figma.loadFontAsync(node.fontName as FontName);
  node.characters = String(objValue);
}

async function resetPlaceholder(node: TextNode) {
  const jsonPath = getJsonPath(node);
  if (jsonPath === "") return;

  await figma.loadFontAsync(node.fontName as FontName);
  node.characters = String("$" + jsonPath);
}

/**
 * Equivalent to _.get from lodash
 */
function get(obj, path, def = null) {
  var fullPath = path
    .replace(/\[/g, ".")
    .replace(/]/g, "")
    .split(".")
    .filter(Boolean);

  return fullPath.every(everyFunc) ? obj : def;

  function everyFunc(step) {
    return !(step && (obj = obj[step]) === undefined);
  }
}

function setPluginData(node: BaseNode, key, value) {
  node.setSharedPluginData("turtle", key, value);
  console.log({ node });
}

function getPluginData(node: BaseNode, key) {
  return node.getSharedPluginData("turtle", key);
}

function setJsonPath(node: BaseNode, value) {
  setPluginData(node, "jsonPath", value);
}

function getJsonPath(node: BaseNode) {
  return getPluginData(node, "jsonPath");
}
