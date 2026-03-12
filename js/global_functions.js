let documentString = undefined;

/**
 * @param { File } file - file from file input
 * @param { HTMLButtonElement } button - Button to trigger file dialog
*/

const readFile = (file, button) => {
    const reader = new FileReader();

    reader.onload = function(e) {
      documentString = e.target.result;
      button.disabled = documentString.length < 1;
    };
    reader.readAsText(file);
}

/**
 * @param { HTMLButtonElement } button - Button to trigger file dialog
 * @param { HTMLInputElement } fileInput - file from file input
*/

const activateFileDialog = (button, fileInput) => {
  fileInput.addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (!file) return;
    readFile(file, button);
  });

  if(fileInput.files.length > 0) {
    readFile(fileInput.files[0], btnCheck);
  } else {
    button.disabled = true;
  }
}

/**
 * Add leading zeroes to numbers
 * @param { number } num - number to pad
 * @param { number } places - number of digits to
 * @returns { string } String with the number plus added zeroes
 */
const zeroPad = (num, places) => String(num).padStart(places, '0');

//   addAnchor(thObjectId, "usedObjects", {top: "-25px"});
const addAnchor = (parent, id, offset) => {
  const anchor = document.createElement("div");
  anchor.id = id;
  anchor.classList.add("anchor");
  if(offset) {
    const offsetStyles = [];
    Object.keys(offset).forEach(key => {
      offsetStyles.push(key + ": " + offset[key]);
    })
    anchor.setAttribute("style", offsetStyles.join("; "));
    parent.appendChild(anchor);
  }
}