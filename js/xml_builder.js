const prettifyXml = (sourceXML) => {
  console.log('### method called');
  const xmlDoc = new DOMParser().parseFromString(sourceXML, 'application/xml');
  console.log('### sourceXML parsed');
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
  console.log('### xsltDoc created');
  console.log({xsltDoc})
  
  const xsltProcessor = new XSLTProcessor();
  console.log('### xsltProcessor created');
  xsltProcessor.importStylesheet(xsltDoc);  
  console.log('### xsltProcessor stylesheet imported');
  
  const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
  console.log('### resultDoc created');
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
      console.log({element, newNode, xmlDoc});
  
      if(previousNode) {
        previousNode.appendChild(newNode);
      } else {
        initialNode = newNode;
      }

      previousNode = newNode;
    });
    const resultXml = new XMLSerializer().serializeToString(initialNode);
    console.log({resultXml});
    console.log({initialNode, nodes: prettifyXml(resultXml)});  
  };
  
  createXMLbutton.addEventListener('click', () => {
    createXML();
  });
  
});