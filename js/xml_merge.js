const mergeXML = () => {
  const parser = new DOMParser();

  const xmlSource = parser.parseFromString(window.xmlSource, "text/xml");
  const xmlTarget = parser.parseFromString(window.xmlTarget, "text/xml");
  
  const tfos = Array.from(xmlSource.getElementsByTagName("tfo")).filter(tfo => {
    return tfo.getAttribute("n") !== "CONTROL";
  });

  const textApp = xmlTarget.getElementsByTagName("textApp")[0];
  tfos.forEach(tfo => {
    textApp.appendChild(tfo);
  });

  const xmlSerializer = new XMLSerializer();
  window.serializedJSON = xmlSerializer.serializeToString(xmlTarget);

  btnCopyString.disabled = false;

  console.log({tfos, xmlTarget});
}

document.addEventListener("DOMContentLoaded", function() {
  console.log("yes, ready")
  const fileInputSource = document.getElementById("fileInputSource");
  const fileInputTarget = document.getElementById("fileInputTarget");
  const btnCheck = document.getElementById("btnCheck");
  const btnCopyString = document.getElementById("btnCopyString");

  activateFileDialog(btnCheck, fileInputSource, "xmlSource");
  activateFileDialog(btnCheck, fileInputTarget, "xmlTarget");

  btnCheck.addEventListener("click", () => {
    mergeXML(btnCopyString);
  });

  btnCopyString.addEventListener("click", () => {
    navigator.clipboard.writeText( prettyPrintXml(window.serializedJSON));
  });
});