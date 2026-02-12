const buildPath = (variablePath, xpathExpressionOutput) => {
  const variableElements = variablePath.split(".");
  const xpathBits = [];
  variableElements.forEach((element, index) => {
    if(index < variableElements.length -1) {
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

const openXML = (xmlFileName, xpathExpression) => {
  fetch("/xml/" + xmlFileName)
  .then(response => response.text())
  .then(xmlString => {
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
    console.log({xmlDoc, xpathExpression, xpathResult: xpathResult});

    xpathValue.innerHTML = xpathResult;

  })
  .catch(err => console.error(err));
}

document.addEventListener("DOMContentLoaded", function() {

  const xpathExpressionOutput = document.getElementById("xpathExpressionOutput");
  const xpathValue = document.getElementById("xpathValue");
  const btnBuild = document.getElementById("btnBuild");
  
  btnBuild.addEventListener("click", () => {
    const variablePath = document.getElementById("variablePath").value;
    const xmlFileName = document.getElementById("xmlFileName").value;
    if(variablePath && variablePath.length > 0) {
      const xpathExpression = buildPath(variablePath, xpathExpressionOutput);
      if(xmlFileName && xmlFileName.length > 1) {
        openXML(xmlFileName, xpathExpression, xpathValue)
      } else {
        xpathExpressionOutput.innerHTML = "Filename fehlt"
      }
    } else {
      xpathExpressionOutput.innerHTML = "Variablenpfad fehlt"
    }
  })
  
});