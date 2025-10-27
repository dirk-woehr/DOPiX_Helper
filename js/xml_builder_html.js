let xmlResult = 'unset';

document.addEventListener("DOMContentLoaded", function() {
  const pathInput = document.getElementById('pathInput');
  const valueInput = document.getElementById('valueInput');
  
  const createXMLbutton = document.getElementById('createXML');
  const copyXMLbutton = document.getElementById('copyXML');
  
  const outputBox = document.getElementById('xmlOutput');

  const createXML = () => {
    const path = pathInput.value;
    const value = valueInput.value;
  
    if (path.length === 0) return;
  
    let previousNode;
    let initialNode;
    
    const treeElements = path.split('.');
  
    treeElements.forEach((element, index) => {
      const nodeValue = index + 1 === treeElements.length ? value : "";
      let newNode = document.createElement("tfo");
      newNode.setAttribute('n', element);
      newNode.setAttribute('v', nodeValue);
  
      if(previousNode) {
        previousNode.appendChild(newNode);
      } else {
        initialNode = newNode;
      }

      previousNode = newNode;
    });

    const nodeString = initialNode.outerHTML;
    
    const splitNodes = nodeString.split('><');
    const nodeCount = splitNodes.length / 2;

    if(nodeCount > 1) {
      xmlResult = splitNodes.join('>\n<');
     } else {
      xmlResult = nodeString;
    }

    outputBox.innerHTML = xmlResult;
    
  };
  
  createXMLbutton.addEventListener('click', () => {
    createXML();
  });
  
  copyXMLbutton.addEventListener("click", () => {
    navigator.clipboard.writeText(xmlResult);
  });
});
