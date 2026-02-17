let setParameters = undefined;
let objects = undefined;
let variables = undefined;

const colspan = 4;

const parseXML = (xmlString) => {
  const table = document.getElementById("table");
  
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  
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
    
    logicElements.forEach((logicElement) => {
      // get executionContext from logic
      // if not available from documentObject
      const executionContext = logicElement
        .getElementsByTagName("executionContext")[0]
        ?.getAttribute("pointInTime") 
        ?? documentObject
        .getElementsByTagName("executionContext")[0]
        ?.getAttribute("pointInTime");
      
      extractParametersFromLogicElement(
        executionContext,
        logicElement,
        parameters
      )  
    });
  
    createResultTable(
      parameters,
      table,
      index === 0,
      objectId,
      localName
    );
  });

  createObjectRows(table);

  createVariableRows(table, variables, setParameters);

}

document.addEventListener("DOMContentLoaded", function() {  
  setParameters = new Set();
  objects = {};

  const btnCheck = document.getElementById('btnCheck');
  const fileInput = document.getElementById("fileInput");

  fileInput.addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (!file) return;
    readFile(file, btnCheck);
  });

  if(fileInput.files.length > 0) {
    readFile(fileInput.files[0], btnCheck);
  } else {
    btnCheck.disabled = true;
  }
  
  
  btnCheck.addEventListener("click", () => {
    parseXML(xmlString);
  });
});