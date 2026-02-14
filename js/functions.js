document.addEventListener("DOMContentLoaded", function() {

  const selector = document.getElementById('selector');
  const btnAdd = document.getElementById('btnAdd');
  let counter = 0;
  
  functions.forEach((fnct, index) => {
    const option = document.createElement("option");
    option.setAttribute("name", fnct.name);
    if(index === 0) {
      option.setAttribute("selected", "selected");
    }
    option.innerHTML = fnct.name;
    selector.appendChild(option);
  });

  btnAdd.addEventListener("click", () => {
    const fields = [];
    const selection = selector.value;
    const fnct = functions.find((currentFnct) => {
      return currentFnct.name === selection;
    })
    const fnctId = fnct.name + counter++;

    fnct.fields.forEach((field, index) => {
      fields.push({
        type: "field",
        field
      })
    });

    createRow(name, counter, fields)
    
  })
  
});