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
  
    // find variables in Logic
    const logicElements = Array.from(documentObject.getElementsByTagName("logic"));
  
    logicElements.forEach((logicElement) => {
      const executionContext = logicElement
        .getElementsByTagName("executionContext")[0]
        ?.getAttribute("pointInTime");
      
      extractParametersFromLogicElement(
        executionContext,
        logicElement,
        parameters
      )  
    });
  
    createResultTable(parameters, table, index === 0, objectId);
  });
  
}

const openXML = (xmlFilePath) => {
  fetch("/xml/" + xmlFilePath)
  .then(response => response.text())
  .then(xmlString => {
    parseXML(xmlString);
  })
  .catch(err => console.error(err));
}

document.addEventListener("DOMContentLoaded", function() {
 const pathToXML = document.getElementById('pathToXML');
 const btnCheck = document.getElementById('btnCheck');

 btnCheck.addEventListener("click", () => {
  const xmlDoc = openXML( pathToXML.value);
 });
});