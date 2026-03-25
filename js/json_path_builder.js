const readPath = (jsonObject, pathElements) => {
  if (!pathElements || typeof pathElements !== 'string') return "undefined";

  const keys = pathElements.split(/[.[\]]+/).filter(Boolean);

  const result = keys.reduce((currentLevel, key) => {
    // return undefined for missing or invalid keys
    if (currentLevel === null || currentLevel === undefined) {
      return undefined;
    }    
    return currentLevel[key];
  }, jsonObject);

  // return stringified result
  if (result === undefined) {
    return "undefined";
  }

  if (typeof result === 'string') {
    return result;
  }

  return JSON.stringify(result, null, 2);
}

const addEventToButton = (button, type) => {
  button.addEventListener("click", () => {
    switch (type) {
      case "add":
        addVarContainer();
        break;
      case "remove":
        button.parentNode.parentNode.remove();
        break;
    }
  });
}

const addVarContainer = () => {
  const formContainer = document.querySelector(".formContainer");

  const template = document.getElementById('rowTemplate');
  const varInstance = document.importNode(template.content, true);
  
  const btnAdd = varInstance.querySelector(".btnAdd");
  const btnRemove = varInstance.querySelector(".btnRemove");

  addEventToButton(btnAdd, "add");
  addEventToButton(btnRemove, "remove");

  formContainer.appendChild(varInstance);
}

const openJSON = (documentString) => {
  
  try {
    return JSON.parse(documentString);    
  } catch (error) {
    alert("Invalid JSON file");
    return undefined;
  }
}

document.addEventListener("DOMContentLoaded", function () {

  const fileInput = document.getElementById("fileInput");
  const btnBuild = document.getElementById("btnBuild");

  const ogAdd = document.getElementById("ogAdd");
  addEventToButton(ogAdd, "add");

  btnBuild.disabled = true;

  activateFileDialog(btnBuild, fileInput, "documentString");
  
  btnBuild.addEventListener("click", () => {    
    const varContainers = Array.from(document.getElementsByClassName("varContainer"));
    
    const jsonObject = openJSON(window.documentString)
    if(!jsonObject) return;
    
    varContainers.forEach((varContainer) => {
      const jsonPathValue = varContainer.getElementsByClassName("jsonPathValue")[0];
      const variablePath = varContainer.getElementsByClassName("variablePath")[0].value;
  
      if (variablePath && variablePath.length > 0) {
        jsonPathValue.innerHTML = readPath(jsonObject, variablePath);
      }
    });
  });
});