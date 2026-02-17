const buildPath = (variablePath, xpathExpressionOutput) => {
  const variableElements = variablePath.split(".");
  const xpathBits = [];
  variableElements.forEach((element, index) => {
    if (index < variableElements.length - 1) {
      // add TFOs
      xpathBits.push('*[local-name()="tfo"][@n="' + element + '"]');
    } else {
      // add variable
      xpathBits.push('*[local-name()="attr"][@n="' + element + '"]');
    }
  });

  const xpathExpression = "//" + xpathBits.join("/") + "/@v";
  xpathExpressionOutput.innerHTML = xpathExpression;

  return xpathExpression;

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
  
  console.log({varInstance, template});
  const btnAdd = varInstance.querySelector(".btnAdd");
  const btnRemove = varInstance.querySelector(".btnRemove");
  
  addEventToButton(btnAdd, "add");
  addEventToButton(btnRemove, "remove");

  formContainer.appendChild(varInstance);
}

const openXML = (xmlString, xpathExpression, xpathValue) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  const xpathResult = xmlDoc.evaluate(
    xpathExpression,
    xmlDoc,
    null,
    XPathResult.STRING_TYPE,
    null,
  ).stringValue;

  xpathValue.innerHTML = xpathResult;
}

document.addEventListener("DOMContentLoaded", function () {

  const btnBuild = document.getElementById("btnBuild");
  const formContainer = document.getElementsByClassName("formContainer")[0];

  const ogAdd = document.getElementById("ogAdd");
  addEventToButton(ogAdd, "add");

  btnBuild.disabled = true;
  
  document.getElementById("fileInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (!file) return;
    readFile(file, btnBuild);
  });
  
  if(fileInput.files.length > 0) {
    readFile(fileInput.files[0], btnBuild);
  } else {
    btnBuild.disabled = true;
  }
  
  btnBuild.addEventListener("click", () => {    
    const varContainers = Array.from(document.getElementsByClassName("varContainer"));
    varContainers.forEach((varContainer) => {
      const xpathExpressionOutput = varContainer.getElementsByClassName("xpathExpression")[0];
      const xpathValue = varContainer.getElementsByClassName("xpathValue")[0];
      const variablePath = varContainer.getElementsByClassName("variablePath")[0].value;
      xpathExpressionOutput.classList.remove("error");

      console.log({varContainer});
  
      if (variablePath && variablePath.length > 0) {
        const xpathExpression = buildPath(variablePath, xpathExpressionOutput);
        if (xmlString && xmlString.length > 1) {
          openXML(xmlString, xpathExpression, xpathValue)
        } else {
          xpathExpressionOutput.classList.add("error");
          xpathExpressionOutput.innerHTML = "Filename fehlt"
        }
      } else {
        xpathExpressionOutput.classList.add("error");
        xpathExpressionOutput.innerHTML = "Variablenpfad fehlt"
      }
    });
  })

});