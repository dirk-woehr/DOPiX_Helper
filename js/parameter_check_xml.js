let setParameters, objects, variables, txkName;

const colspan = 4;

const parseXML = (documentString) => {
  const table = document.getElementById("table");
  // clear select
  const objectSelect = document.getElementById("objectSelect");
  
  setParameters = new Set();
  objects = {};

  objectSelect.innerHTML = "";
  // add base select
  const baseOption = document.createElement("option");
  baseOption.innerHTML = "Objekt wählen...";
  baseOption.setAttribute("value", "header");
  objectSelect.appendChild(baseOption);
  // add event listener
  objectSelect.addEventListener("change", (select) => {
    const targetId = select.target.value;
    const url = location.href;
    location.href = "#" + targetId;
    history.replaceState(null,null,url);
  })
  
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(documentString, "text/xml");
  
  const paragraphs = Array.from(xmlDoc.getElementsByTagName("paragraph"));
  const stencils = Array.from(xmlDoc.getElementsByTagName("stencil"));
  const applications = Array.from(xmlDoc.getElementsByTagName("application"));
  const variables = Array.from(xmlDoc.getElementsByTagName("variable"));
  
  stencils.forEach((stencil) => {
    const stencilentries = Array.from(stencil.getElementsByTagName("stencilentry"));
    const stencilId = stencil.getAttribute("id");
    stencilentries.forEach((stencilentry) => {
      const entryId = stencilentry.getAttribute("refid");
      if(objects[entryId] === undefined) {
        objects[entryId] = {
          isUsed: true,
          isInProcess: false,
          references: new Set().add(stencilId),
          tfoReferences: {},
        }
      } else {
        objects[entryId].references.add(stencilId)
      }
    });
  });

  const documentObjects = [...paragraphs, ...stencils, ...applications];
  
  documentObjects.forEach((documentObject, index) => {
    const localName = documentObject.localName;
    const objectId = documentObject.getAttribute("id");

    if(objects[objectId] !== undefined) {
      objects[objectId].isInProcess = true;
    } else {
      objects[objectId] = {
        isUsed: false,
        isInProcess: true,
        references: new Set(),
        tfoReferences: {},
      }
    }

    const parameters = {};
    // Get all parameters from document
    const paramElements = documentObject.getElementsByTagName("variabletypeentry");
    collectParameters(paramElements, parameters);
  
    const textcontent = documentObject.getElementsByTagName("textcontent")[0]?.innerHTML;
    
    // find variables in text content
    if(textcontent !== undefined && textcontent.length > 0) {
      extractParametersFromText(textcontent, parameters);
    }

    
    // find variables in Logic
    const logicElements = Array.from(documentObject.getElementsByTagName("logic"));
    const logicMatrix = {
      condition: [],
      action: []
    }

    logicElements.forEach((logicElement) => {
      // get executionContext from logic
      // if not available from documentObject
      const executionContext = logicElement
      .getElementsByTagName("executionContext")[0]
      ?.getAttribute("pointInTime") 
      ?? documentObject
      .getElementsByTagName("executionContext")[0]
      ?.getAttribute("pointInTime");
      
      const tfoReference = logicElement.getAttribute("tforeference")
      if(tfoReference) {
        objects[objectId].tfoReferences[executionContext] = tfoReference;
      }

      extractParametersFromLogicElement(
        executionContext,
        logicElement,
        parameters,
        logicMatrix
      )  
    });
  
    // add option for current object
    const objectOption = document.createElement("option");
    objectOption.innerHTML = objectId;
    objectOption.setAttribute("value", objectId);
    objectSelect.appendChild(objectOption);

    createResultTable(
      parameters,
      table,
      index === 0,
      objectId,
      localName,
      logicMatrix
    );
  });

  createObjectRows(table);

  createVariableRows(table, variables);

  collectReferences(xmlDoc, table);

  createTreeView(xmlDoc, txkName);

}

document.addEventListener("DOMContentLoaded", function() {  

  const btnCheck = document.getElementById('btnCheck');
  const fileInput = document.getElementById("fileInput");

  activateFileDialog(btnCheck, fileInput, "documentString");  
  
  btnCheck.addEventListener("click", () => {
    parseXML(window.documentString);
  });
});