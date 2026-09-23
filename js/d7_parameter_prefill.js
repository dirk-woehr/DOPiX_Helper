

document.addEventListener("DOMContentLoaded", function() {
  const fileInput = document.getElementById("fileInput");
  const btnCreate = document.getElementById("btnCreate");
  const xmlOutput = document.getElementById("xmlOutput");
  const btnCopy = document.getElementById("btnCopy");

  activateFileDialog(btnCreate, fileInput, "documentString");

  btnCopy.addEventListener("click", () => {
    navigator.clipboard.writeText(xmlOutput.innerText);
  })

  btnCreate.addEventListener("click", () => {

    const {documentString} = window;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(documentString, "text/xml");
    
    const paragraphs = Array.from(xmlDoc.getElementsByTagName("paragraph"));
    const stencils = Array.from(xmlDoc.getElementsByTagName("stencil"));
    const applications = Array.from(xmlDoc.getElementsByTagName("application"));

    const variables = Array.from(xmlDoc.getElementsByTagName("variable"));

    const allParamElements = [];
    const documentObjects = [...paragraphs, ...stencils, ...applications];
    documentObjects.forEach(documentObject => {
      const paramElements = documentObject.getElementsByTagName("variabletypeentry");
      allParamElements.push(...Array.from(paramElements));
    })

    console.log(variables, allParamElements);

    const relevantFormats = ["alphanumeric", "date", "mask"];

    const allVariables = {};

    let textNum = 0;
    let numValue = 12;
    let numValueDecimal = -10;
    let currentDate = new Date(Date.now());

    const xmlVariables = new Map();
    xmlVariables.set("firstRow", "");

    [...allParamElements, ...variables].forEach(variable => {
      const format = variable.getAttribute("format");
      const id = variable.getAttribute("id") ?? variable.getAttribute("refid");

      
      if(!xmlVariables.has(id) && id) {
        if(relevantFormats.includes(format) && id.includes("_INT_")) {
          console.log({variable});
          let value = "";
          switch (format) {
            case "alphanumeric":
              value = "Test " + ++textNum;
              break;
            case "date":            
              value = currentDate.toLocaleDateString('de-DE');
              currentDate.setDate(currentDate.getDate() + 1);
              break;
            case "mask":
              numValue = numValue + 111;
              numValueDecimal = numValueDecimal + 11;
              if(numValueDecimal > 99) numValueDecimal = numValueDecimal - 100;
              value = numValue + "," + numValueDecimal.toString().padStart(2, '0');
              break;        
            default:
              // maybe do something later
              break;
          }
          xmlVariables.set(id, `    <var v="${value}" id="${id}" />`)
        }
      }
    })
    xmlOutput.innerText = xmlVariables.values().join("\n");
  })

});