import "./ui.css";

document.getElementById("populate").onclick = async () => {
  const textbox = document.getElementById("url") as HTMLInputElement;
  const url = String(textbox.value);

  const res = await fetch(url);
  if (!res.ok) return; // TODO: Handle error
  
  const body = await res.json();
  parent.postMessage({ pluginMessage: { type: "populate", body } }, "*");
};

document.getElementById("undo").onclick = () => {
  parent.postMessage({ pluginMessage: { type: "undo" } }, "*");
};
