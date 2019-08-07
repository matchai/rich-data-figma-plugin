import get from "dash-get";
figma.showUI(__html__);

figma.ui.onmessage = async msg => {
  if (msg.type === "populate") {
    const textNodes = figma.currentPage.findAll(
      node => node.type === "TEXT"
    ) as TextNode[];
    if (textNodes.length == 0) return;

    textNodes.map(node => replacePlaceholder(node, msg.body));
  }
};

// Replace placeholder text values preceeded with a `$` with the value at the
// equivalent json path
async function replacePlaceholder(node: TextNode, json: Object): Promise<null> {
  if (!node.characters.startsWith("$")) return;
  // Remove "$" from start
  const path = node.characters.slice(1);

  const objValue = get(json, path);
  if (objValue == null) return;

  await figma.loadFontAsync(node.fontName as FontName);
  node.characters = String(objValue);
}
