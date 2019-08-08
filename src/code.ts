import findTextNodes from "./findTextNodes";
figma.showUI(__html__);

figma.ui.onmessage = async msg => {
  if (msg.type === "populate") {
    const textNodes = findTextNodes(figma.currentPage);
    textNodes.map(textNode => replacePlaceholder(textNode, msg.body));
  }
};

/**
 * Replace placeholder text values preceeded with a `$` with the value at the
 * associated json path. Replace square-brackets with incrementing indices
 */
async function replacePlaceholder({ node, index }, json: Object) {
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
    .replace(/\[/g, ".")
    .replace(/]/g, "")
    .split(".")
    .filter(Boolean);

  return fullPath.every(everyFunc) ? obj : def;

  function everyFunc(step) {
    return !(step && (obj = obj[step]) === undefined);
  }
}
