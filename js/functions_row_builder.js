const createRow = (counter, name, fields) => {
  const tbody = document.getElementById("functionsTable");
  const row = document.createElement("tr");
  row.setAttribute("id", "row_" + id);
  tbody.appendChild(row);

  const headCell = document.createElement("th");
  row.appendChild(headCell);
  
  const title = document.createElement("p");
  title.innerHTML = "Funktion";
  headCell.appendChild(title);

  const functionName = document.createElement("p");
  functionName.innerHTML = ""
}