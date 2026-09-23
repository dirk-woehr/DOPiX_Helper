const namedElements = [
  {
    shortcut: "TXK",
    name: "Textkörper",
  },
  {
    shortcut: "DVL",
    name: "DVL",
  },
  {
    shortcut: "RUF",
    name: "Rufobjekt",
  },
  {
    shortcut: "TTD",
    name: "Testtreiber Daten",
  },
  {
    shortcut: "TTR",
    name: "Testtreiber",
  },
/*   {
    shortcut: "LAY",
    name: "Layout",
  },
  {
    shortcut: "ASL",
    name: "ASL",
  },
  {
    shortcut: "END",
    name: "END",
  }, */
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
      navigator.clipboard.writeText(newName);
    });

    const prefix = baseNameValue.split("_TTR_")[0];
    prefixParagraph.innerText = prefix;
  });
}

document.addEventListener("DOMContentLoaded", function() {
  const prefixParagraph = document.getElementById("prefixParagraph");
  const objectType = document.getElementById("objectType");
  const objectName = document.getElementById("objectName");
  const btnCopyObjectName = document.getElementById("btnCopyObjectName");

  const reanimgGrid = document.getElementById("reanimgGrid");
  const baseName = document.getElementById("baseName");
  const btnDescription = document.getElementById("btnDescription");
  const description = document.getElementById("description");

  baseName.addEventListener("input", () => {
    refreshNames(baseName, reanimgGrid, namedElements);
  })

  refreshNames(baseName, reanimgGrid, namedElements);

  btnDescription.addEventListener("click", () => {
    navigator.clipboard.writeText(description.value);
  })

  btnCopyObjectName.addEventListener("click", () => {
    navigator.clipboard.writeText(`${prefixParagraph.innerHTML}_${objectType.value}_${objectName.value}`);
  })
})