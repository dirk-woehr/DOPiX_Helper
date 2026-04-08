/**
* Create Tree index for faster lookup
* lookup with: `index["/b/file1.json"].content.id`
* @param { Object } tree - JSON-Object
* @param { string } basePath - String containing base path for Object
* @returns { Object } Map object for faster lookup
*/

/* const getJSONindex = (tree, basePath = "") => {
  let map = {};

  tree.forEach(node => {
    const currentPath = basePath + "/" + node.name;

    if (node.type === "file") {
      map[currentPath] = node;
    }

    if (node.children) {
      Object.assign(map, getJSONindex(node.children, currentPath));
    }
  });

  return map;
} */

const classNames = {
  "-info": "dopixInfo",
  "-application": "dopixApplication",
  "documenttype-": "d7documenttype",
  "frameelement-": "d7frameelement",
  "pagedefinition-": "d7pagedefinition",
  "presentation-": "d7presentation",
  "style-": "d7style",
  "subtemplate-": "d7subtemplate",
  "variable-": "d7variable",
}

const mapKeys = [
  ["block", "paragraph"],
  ["group", "stencil"],
  ["group", "application"],
]

const showErrorDialog = (title, description) => {
  const dialog = document.getElementById("errorDialog");
  const btnCloseError = document.getElementById("btnCloseError");
  const h1 = dialog.getElementsByTagName("h2")[0];
  const p = dialog.getElementsByTagName("p")[0];
  h1.innerText = title;
  p.innerText = description;
  dialog.showModal();
  btnCloseError.focus();
}

const addD7ObjectToCollection = (objects, object, objectType) => {
  objects[object.content.name] = {
    d7type: objectType,
    dopixType: "-",
  }
}

const compareTrees = () => {
  let jsonTree;
  try {
    jsonTree = JSON.parse(window.jsonTree);
  } catch (error) {
    showErrorDialog("Fehler beim Parsen", "JSON-Baum konnte nicht geparst werden.");
    return;
  }

  const sdk = jsonTree.find(object => {
    return object.name === "sdk";
  });

  console.log({sdk});
  
  const objects = {};
  sdk.children.forEach(objectType => {
    const {name: jsonType, children} = objectType;
    
    console.log({children});
    if(Array.isArray(children)) {
      children.forEach(child => {
        addD7ObjectToCollection(objects, child, jsonType, true);
      })
    } else {
      addD7ObjectToCollection(objects, children, jsonType, true);
    }
  });

  
  
  const parser = new DOMParser();
  let xmlTree = parser.parseFromString(window.xmlTree, "text/xml");
  
  const parseError = xmlTree.getElementsByTagName("parsererror");
  
  if (parseError.length > 0) {
    showErrorDialog("Fehler beim Parsen", "XML-Baum konnte nicht geparst werden.");
    return;
  }
  
  const objectContainer = Array.from(xmlTree.getElementsByTagName("data"))[0];
  console.log({objectContainer});
  Array.from(objectContainer.children).forEach(object => {
    console.log({object})
    // return tfo.tagName === "tfo" && tfo.getAttribute("n") !== "CONTROL";
    if(objects[object.getAttribute("id")]) {
      objects[object.getAttribute("id")].dopixType = object.tagName;
    } else {
      objects[object.getAttribute("id")] = {
        dopixType: object.tagName,
        d7type: "-",
      };
    }

  });
  const objectTable = [];
  Object.keys(objects).forEach(key => {
    const object = objects[key];
    const {d7type, dopixType} = object;
    objectTable.push({
      name: key,
      d7type,
      dopixType
    })
  });
  objectTable.sort(sortD7comparison);
  console.table(objectTable);
  buildD7table(objectTable);
  const sortKeys = objectTable.map(object => {
    const {name, d7type, dopixType} = object;
    return d7type + dopixType + name;
  });
  console.log({sortKeys});
}


const sortD7comparison = (a, b) => {
  const {name: nameA, d7type: d7typeA, dopixType: dopixTypeA} = a;
  const {name: nameB, d7type: d7typeB, dopixType: dopixTypeB} = b;
  const sortKeyA = d7typeA + dopixTypeA + nameA; 
  const sortKeyB = d7typeB + dopixTypeB + nameB; 
  if(sortKeyA < sortKeyB) {
    return -1;
  } else if(sortKeyA > sortKeyB) {
    return 1;
  }
  return 0;
}

document.addEventListener("DOMContentLoaded", function() {
  // colelct elements
  const fileInputD7 = document.getElementById("fileInputD7");
  const fileInputDOPiX = document.getElementById("fileInputDOPiX");
  const btnCompare = document.getElementById("btnCompare");
  const dialog = document.getElementById("errorDialog");
  const btnCloseError = document.getElementById("btnCloseError");
  btnCloseError.addEventListener("click", () => {
    dialog.close();
  });

  activateFileDialog(btnCompare, fileInputD7, "jsonTree");
  activateFileDialog(btnCompare, fileInputDOPiX, "xmlTree");

  btnCompare.addEventListener("click", () => {
    compareTrees();
  });
});

const getRowClass = (objectName, d7type, dopixType) => {
  if(objectName.startsWith("Z_ZZ_ZZ_")) {
    return "genericObject";
  }
  return classNames[d7type + dopixType];
}

const addRowClass = (row, objectName, d7type, dopixType) => {
  const rowClass = getRowClass(objectName, d7type, dopixType);
  if(rowClass !== undefined) {
    row.classList.add(rowClass)
  }
}

const buildD7table = (objectTable) => {
  const table = document.getElementById("d7table");
  const colspan = 3;
  let objectHead = "";
  let isEven = false;
  objectTable.forEach(object => {
    const {name, d7type, dopixType} = object;
    const currentObjectHead = d7type + dopixType;
    
    if(currentObjectHead !== objectHead) {
      const trObjHead = document.createElement("tr");
      addRowClass(trObjHead, "", d7type, dopixType);
      const thObjHead = document.createElement("th");  
      
      thObjHead.setAttribute("colspan", colspan);
      thObjHead.classList.add("columnHeadMain");
      thObjHead.innerText = object.d7type + " / " + object.dopixType;
      table.appendChild(trObjHead);
      trObjHead.appendChild(thObjHead);
      
      objectHead = currentObjectHead;
      isEven = false;
      
      const trObjNames = document.createElement("tr");
      addRowClass(trObjNames, "", d7type, dopixType);
      const thObjName = document.createElement("th");
      thObjName.classList.add("columnHead");
      const thD7type = document.createElement("th");
      thD7type.classList.add("columnHead");
      const thDopixtype = document.createElement("th");
      thDopixtype.classList.add("columnHead");

      thObjName.innerText = "Name";
      thD7type.innerText = "D7-Typ";
      thDopixtype.innerText = "DOPiX-Typ";

      trObjNames.append(thObjName, thD7type, thDopixtype);
      table.appendChild(trObjNames);
    }

    const trObjectValues = document.createElement("tr");
    addRowClass(trObjectValues, name, d7type, dopixType);
    if(isEven) {
      trObjectValues.classList.add("even");
    }

    const tdObjName = document.createElement("td");
    const tdObjD7type = document.createElement("td");
    const tdObjDopixType = document.createElement("td");

    tdObjName.innerText = name;
    tdObjD7type.innerText = d7type;
    tdObjDopixType.innerText = dopixType;

    trObjectValues.append(tdObjName, tdObjD7type, tdObjDopixType);

    table.appendChild(trObjectValues);

    isEven = !isEven;
  })
}