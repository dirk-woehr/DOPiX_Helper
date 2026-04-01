const prettifyXml = (sourceXML) => {
  const xmlDoc = new DOMParser().parseFromString(sourceXML, 'application/xml');
  const xsltDoc = new DOMParser().parseFromString([
    // describes how we want to modify the XML - indent everything
      '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
      '  <xsl:strip-space elements="*"/>',
      '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
      '    <xsl:value-of select="normalize-space(.)"/>',
      '  </xsl:template>',
      '  <xsl:template match="node()|@*">',
      '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
      '  </xsl:template>',
      '  <xsl:output indent="yes"/>',
      '</xsl:stylesheet>',
    ].join('\n'), 'application/xml');
  
  const xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(xsltDoc);
  
  const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
  const resultXml = new XMLSerializer().serializeToString(resultDoc);

  return resultXml;
}

document.addEventListener("DOMContentLoaded", function() {
  const pathInput = document.getElementById('pathInput');
  const valueInput = document.getElementById('valueInput');
  
  const createXMLbutton = document.getElementById('createXML');
  const copyXMLbutton = document.getElementById('copyXML');
  
  const createXML = () => {
    const path = pathInput.value;
    const value = valueInput.value;
  
    if (path.length === 0) return;
  
    const xmlDoc = document.implementation.createDocument(null, "base");
  
    let previousNode;
    let initialNode;
    
    const treeElements = path.split('.');
  
    treeElements.forEach((element, index) => {
      const nodeValue = index + 1 === treeElements.length ? value : "";
      let newNode = xmlDoc.createElement("tfo");
      newNode.setAttribute('n', element);
      newNode.setAttribute('v', nodeValue);
  
      if(previousNode) {
        previousNode.appendChild(newNode);
      } else {
        initialNode = newNode;
      }

      previousNode = newNode;
    });
    const resultXml = new XMLSerializer().serializeToString(initialNode);
  };
  
  createXMLbutton.addEventListener('click', () => {
    createXML();
  });
  
});