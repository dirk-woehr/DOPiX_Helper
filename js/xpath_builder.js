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

const openXML = (xmlString, xpathExpression) => {
  const xpathValue = document.getElementById("xpathValue");
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

  const xpathExpressionOutput = document.getElementById("xpathExpressionOutput");
  const xpathValue = document.getElementById("xpathValue");
  const btnBuild = document.getElementById("btnBuild");
  btnBuild.disabled = true;
  
  document.getElementById("fileInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (!file) return;
    readFile(file, btnBuild);
  });

  if(fileInput.files.length > 0) {
    readFile(fileInput.files[0], btnBuild);
  } else {
    btnCheck.disabled = true;
  }
  
  btnBuild.addEventListener("click", () => {

    xpathExpressionOutput.classList.remove("error");

    const variablePath = document.getElementById("variablePath").value;
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
  })

});