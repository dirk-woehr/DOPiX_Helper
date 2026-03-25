/**
 * @param { File } file - file from file input
 * @param { HTMLButtonElement } button - Button to trigger file dialog
*/

const readFile = (file, button, stringKey) => {
    const reader = new FileReader();

    reader.onload = function(e) {
      window[stringKey] = e.target.result;
      button.disabled = window[stringKey].length < 1;
    };
    reader.readAsText(file);
}

/**
 * @param { HTMLButtonElement } button - Button to trigger file dialog
 * @param { HTMLInputElement } fileInput - file from file input
*/

const activateFileDialog = (button, fileInput, stringKey) => {
  fileInput.addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (!file) return;
    readFile(file, button, stringKey);
  });

  if(fileInput.files.length > 0) {
    readFile(fileInput.files[0], btnCheck, stringKey);
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

function prettyPrintXml(xml, indentSize = 2) {
  const indentChar = ' '.repeat(indentSize);
  let formatted = '';
  let indentLevel = 0;

  // Tokens: Tags, Kommentare, CDATA, Text
  const tokens = xml
    .replace(/>\s*</g, '><') // Whitespace zwischen Tags entfernen
    .replace(/</g, '~::~<')  // Split-Marker
    .split('~::~');

  tokens.forEach(token => {
    if (!token) return;

    const isClosingTag = /^<\/.+>/.test(token);
    const isSelfClosing = /\/>$/.test(token);
    const isOpeningTag = /^<[^!?\/].*>/.test(token) && !isSelfClosing;
    const isComment = /^<!--/.test(token);
    const isCDATA = /^<!\[CDATA\[/.test(token);
    const isDeclaration = /^<\?xml/.test(token);

    if (isClosingTag) {
      indentLevel--;
    }

    formatted += indentChar.repeat(indentLevel) + token.trim() + '\n';

    if (isOpeningTag && !isClosingTag) {
      indentLevel++;
    }

    // Kommentare / CDATA / XML-Decl → keine Änderung der Einrückung
    if (isComment || isCDATA || isDeclaration) {
      // nichts tun
    }
  });

  return formatted.trim();
}