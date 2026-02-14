let xmlString = undefined;

/**
 * @param { File } file - file from file input
*/

const readFile = (file, button) => {
    const reader = new FileReader();

    reader.onload = function(e) {
      xmlString = e.target.result;
      button.disabled = xmlString.length < 1;
    };
    reader.readAsText(file);
}