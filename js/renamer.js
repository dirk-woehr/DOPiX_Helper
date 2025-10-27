const namedElements = [
  {
    shortcut: "TTR",
    name: "Testtreiber",
  },
  {
    shortcut: "TTD",
    name: "Testtreiber Daten",
  },
  {
    shortcut: "RUF",
    name: "Rufobjekt",
  },
  {
    shortcut: "DVL",
    name: "DVL",
  },
  {
    shortcut: "LAY",
    name: "Layout",
  },
  {
    shortcut: "TXK",
    name: "Textkörper",
  },
  {
    shortcut: "ASL",
    name: "ASL",
  },
  {
    shortcut: "END",
    name: "END",
  },
];

const refreshNames = (baseName, reanimgGrid, namedElements) => {
  const baseNameValue = baseName.value;

  reanimgGrid.innerHTML = "";

  if(!baseNameValue.includes("TTR")) {
  return;
  }

  namedElements.forEach(element => {
  const type = document.createElement("div");
  type.classList.add("type");
  type.innerHTML = element.shortcut;
  reanimgGrid.append(type);
  
  const name = document.createElement("div");
  name.classList.add("name");
  const newName = baseNameValue.replace("TTR", element.shortcut);
  name.innerHTML = newName;
  reanimgGrid.append(name);
  
  const button = document.createElement("button");
  button.innerHTML = "Copy " + element.shortcut + " name";
  reanimgGrid.append(button);
  
  button.addEventListener("click", () => {
    console.log("Added: " + newName);
    navigator.clipboard.writeText(newName);
  });
  });
}

document.addEventListener("DOMContentLoaded", function() {
  const reanimgGrid = document.getElementById("reanimgGrid");
  const baseName = document.getElementById("baseName");

  baseName.addEventListener("input", () => {
  refreshNames(baseName, reanimgGrid, namedElements);
  })

  refreshNames(baseName, reanimgGrid, namedElements);

  
});
