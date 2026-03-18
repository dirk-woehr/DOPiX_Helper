const getStencilById = (stencils, stencilId) => {

  const stencil = stencils.find(sten => {
    return sten.getAttribute("id") === stencilId;
  });

  return stencil;
}

const buildtreeNode = (stencils, nodeName) => {
  const treeNode = {
    name: nodeName
  }
  const stencil = getStencilById(stencils, nodeName);
  if(stencil) {
    treeNode.children = [];
    const stencilentries = Array.from(stencil.getElementsByTagName("stencilentry"));
    stencilentries.forEach(entry => {
      const entryId = entry.getAttribute("refid");
      console.log({entry, entryId})
      treeNode.children.push(buildtreeNode(stencils, entryId));
    }) 
  }

  return treeNode;
}

const createTreeView = (xmlDoc) => {
  const stencils = Array.from(xmlDoc.getElementsByTagName("stencil"));
  let stencilTree = buildtreeNode(stencils, txkName);
  console.log({stencilTree});
}