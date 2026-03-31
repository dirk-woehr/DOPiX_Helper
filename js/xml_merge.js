const mergeXML = () => {4
  // parse XML documents
  const parser = new DOMParser();
  const xmlSource = parser.parseFromString(window.xmlSource, "text/xml");
  const xmlTarget = parser.parseFromString(window.xmlTarget, "text/xml");
  
 // collect tfos from source, exclude CONTROL tfo
  const textAppSource = xmlSource.getElementsByTagName("textApp")[0];
  const tfos = Array.from(textAppSource.children).filter(tfo => {
    return tfo.tagName === "tfo" && tfo.getAttribute("n") !== "CONTROL";
  });  

  // append tfos from source to target
  const textApp = xmlTarget.getElementsByTagName("textApp")[0];
  tfos.forEach(tfo => {
    textApp.appendChild(tfo);
  });

  // serialize new XML to string
  const xmlSerializer = new XMLSerializer();
  window.serializedJSON = xmlSerializer.serializeToString(xmlTarget);

  // activate copy button
  btnCopyString.disabled = false;
}

document.addEventListener("DOMContentLoaded", function() {
  // colelct elements
  const fileInputSource = document.getElementById("fileInputSource");
  const fileInputTarget = document.getElementById("fileInputTarget");
  const btnCheck = document.getElementById("btnCheck");
  const btnCopyString = document.getElementById("btnCopyString");

  activateFileDialog(btnCheck, fileInputSource, "xmlSource");
  activateFileDialog(btnCheck, fileInputTarget, "xmlTarget");

  btnCheck.addEventListener("click", () => {
    mergeXML(btnCopyString);
  });

  // prettify & copy serialized XML string
  btnCopyString.addEventListener("click", () => {
    navigator.clipboard.writeText(prettyPrintXml(window.serializedJSON, 2));
  });
});