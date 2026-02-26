let xmlString = undefined;

/**
 * @param { File } file - file from file input
 * @param { HTMLElement } button - Button to trigger file dialog
*/

const readFile = (file, button) => {
    const reader = new FileReader();

    reader.onload = function(e) {
      xmlString = e.target.result;
      button.disabled = xmlString.length < 1;
    };
    reader.readAsText(file);
}

/**
 * Add leading zeroes to numbers
 * @param { number } num - number to pad
 * @param { number } places - number of digits to
 * @returns { string } String with the number plus added zeroes
 */
const zeroPad = (num, places) => String(num).padStart(places, '0');