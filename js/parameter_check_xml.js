const parseXML = (xmlString) => {
  const table = document.getElementById("table");
  
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  
  const paragraphs = Array.from(xmlDoc.getElementsByTagName("paragraph"));
  const stencils = Array.from(xmlDoc.getElementsByTagName("stencil"));
  const documentObjects = [...paragraphs, ...stencils];
  
  documentObjects.forEach((documentObject, index) => {
    const objectId = documentObject.getAttribute("id");
    const parameters = {};
    // Get all parameters from document
    const paramElements = documentObject.getElementsByTagName("variabletypeentry");
    collectParameters(paramElements, parameters);
  
    const textcontent = documentObject.getElementsByTagName("textcontent")[0]?.innerHTML;
    
    // find variables in text content
    if(textcontent !== undefined && textcontent.length > 0) {
      extractParametersFromText(textcontent, parameters);
    }

    const executionContext = documentObject
      .getElementsByTagName("executionContext")[0]
      ?.getAttribute("pointInTime");
  
    // find variables in Logic
    const logicElements = Array.from(documentObject.getElementsByTagName("logic"));
  
    logicElements.forEach((logicElement) => {
      
      extractParametersFromLogicElement(
        executionContext,
        logicElement,
        parameters
      )  
    });
  
    createResultTable(parameters, table, index === 0, objectId);
  });  
}

document.addEventListener("DOMContentLoaded", function() {  
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