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
      treeNode.children.push(buildtreeNode(stencils, entryId));
    }) 
  }

  return treeNode;
}

const createTreeView = (xmlDoc) => {
  const stencils = Array.from(xmlDoc.getElementsByTagName("stencil"));
  let stencilTree = buildtreeNode(stencils, txkName);

  const container = document.getElementById("tree");
  container.innerHTML = "";
  renderTreeToContainer(stencilTree, container);
}

/**
 * Rendert einen treeNode als HTML-Baum
 * @param {Object} node - treeNode
 * @returns {HTMLElement}
 */
function renderTree(node) {
  const li = document.createElement("li");
  li.textContent = node.name;

  if (node.children && node.children.length > 0) {
    const ul = document.createElement("ul");

    node.children.forEach(child => {
      ul.appendChild(renderTree(child)); // Rekursion
    });

    li.appendChild(ul);
  }

  return li;
}

/**
 * Startfunktion für Root-Rendering
 * @param {Object} tree - treeNode
 * @param {HTMLElement} container
 */
function renderTreeToContainer(tree, container) {
  const rootUl = document.createElement("ul");
  rootUl.appendChild(renderTree(tree));
  container.appendChild(rootUl);
}

/**
 * Rendert einen Baumknoten rekursiv
 */
function renderTree(node) {
  const li = document.createElement("li");

  // Label
  const span = document.createElement("span");
  span.classList.add("tree-label");
  const linkToElement = document.createElement("a");
  linkToElement.setAttribute("href", "#" + node.name)
  linkToElement.textContent = node.name;

  li.appendChild(span);
  li.appendChild(linkToElement);

  if (node.children && node.children.length > 0) {
    const ul = document.createElement("ul");
    ul.classList.add("collapsed");

    node.children.forEach(child => {
      ul.appendChild(renderTree(child));
    });

    // Klick zum Ein-/Ausklappen
    span.classList.add("has-children");
    span.addEventListener("click", () => {
      ul.classList.toggle("collapsed");
      span.classList.toggle("expanded");
    });

    li.appendChild(ul);
  }

  return li;
}

/**
 * Startfunktion
 */
function renderTreeToContainer(tree, container) {
  const rootUl = document.createElement("ul");
  rootUl.classList.add("tree-root");

  rootUl.appendChild(renderTree(tree));
  container.appendChild(rootUl);
}





