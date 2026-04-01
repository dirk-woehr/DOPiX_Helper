/**
* Create Tree index for faster lookup
* @param { Object } tree - JSON-Object
* @param { string } basePath - String containing base path for Object
* @returns { Object } Map object for faster lookup
*/

function getJSONindex(tree, basePath = "") {
  let map = {};

  tree.forEach(node => {
    const currentPath = basePath + "/" + node.name;

    if (node.type === "file") {
      map[currentPath] = node;
    }

    if (node.children) {
      Object.assign(map, getJSONindex(node.children, currentPath));
    }
  });

  return map;
}