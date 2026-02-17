/**
 * collect parameters that are set in 
 * @param { string } paramElements - Elements containing set parameters
 * @param { string } parameters - Collection of used parameters
 */

const collectParameters = (paramElements, parameters) => {
  for (let elem of paramElements) {
    const parameter = elem.getAttribute("refid");
    parameters[parameter] = {
      inParam: true,
      inText: false,
      logic: {} 
    }
    setParameters.add(parameter);
  }
}

/**
 * Extracts variables text body
 * adds them to parameters collection
 * and marks them as used, if already collected
 * @param { string } logicString - The logic string
 */

const extractParametersFromText = (textcontent, parameters) => {
  const matches = textcontent.match(/&[A-Z0-9_]*\./g);
  if(matches && matches.length) {
    matches.forEach((match) => {
      const param = match.replace("&", "").replace(".", "");
      if(parameters[param] !== undefined) {
        parameters[param].inText = true;
      } else {
        parameters[param] = {
          inParam: false,
          inText: true,
          logic: {} 
        }
      }
    });
  }
}

/**
 * Goes through all logic strings of a logic element
 * @param { string } elementName - name of the logic element
 * @param { Object } logicElement - logic string
 * @param { Object } parameters - logic string
*/

const extractParametersFromLogicElement = (
  executionContext,
  logicElement,
  parameters
) => {
  const logicTypes = ["basiclogic", "extendedlogic"];
  logicTypes.forEach((logicTypeString) => {

    const logicType = logicElement.getElementsByTagName(logicTypeString)[0];

    if(logicType !== undefined) {
      const logicSubTypes = ["condition", "action"];
      logicSubTypes.forEach((logicSubTypeString) => {
        const logicSubTypeElements = Array.from(
          logicType.getElementsByTagName(logicSubTypeString)
        );
        logicSubTypeElements.forEach((logicSubTypeElement, index) => {
          const logicString = logicSubTypeElement.getAttribute("value");
          if(logicString && logicString.length > 0) {
            collectParametersFromLogic(
              executionContext + " | " + logicTypeString + " | " + logicSubTypeString + " | " + index + " | ",
              logicString,
              parameters
            );
          };
        });
      });
    }
  });
}

/**
 * Collects variables from logic string
 * adds them to parameters collection
 * and marks them as used, if already collected
 * @param { string } pathToLogicString - path to the logic string
 * @param { string } logicString - logic string
 * @param { Object } parameters - logic string
*/

const collectParametersFromLogic = (
  pathToLogicString,
  logicString,
  parameters
) => {
  const matches = logicString.match(/&[A-Z0-9_]*/g);
  if(matches && matches.length) {
    matches.forEach((match) => {
      const param = match.replace("&", "");
      if(parameters[param] !== undefined) {
        if(parameters[param].logic[pathToLogicString] === undefined) {
          parameters[param].logic[pathToLogicString] = logicString;
        }
      } else {
        parameters[param] = {
          inParam: false,
          inText: false,
          logic: {
            [pathToLogicString]: logicString
          }
        }
      }
    });
  }
}

const createResultTable = (parameters, table, clearTable, objectId, objectType) => {
  if(clearTable) {
    table.innerHTML = "";
  }

  console.table(parameters)

  const trObjectId = document.createElement("tr");
  const thObjectId = document.createElement("th");
  thObjectId.innerHTML = objectId;
  thObjectId.setAttribute("colspan", colspan);
  thObjectId.classList.add("columnHeadMain");
  trObjectId.appendChild(thObjectId);
  table.appendChild(trObjectId);

  
  const parameterNames = Object.keys(parameters);
  
  if(parameterNames.length > 0) {    
    const headRow = document.createElement("tr");
    const thVar = document.createElement("th");
    thVar.innerHTML = "Variable";
    thVar.classList.add("columnHead");
    headRow.appendChild(thVar);
    const thPar = document.createElement("th");
    thPar.innerHTML = "Parameter Gesetzt";
    thPar.classList.add("columnHead");
    headRow.appendChild(thPar);
    const thTxt = document.createElement("th");
    thTxt.innerHTML = "In Text verwendet";
    thTxt.classList.add("columnHead");
    headRow.appendChild(thTxt);
    const thLog = document.createElement("th");
    thLog.innerHTML = "Logik-Elemente";
    thLog.classList.add("columnHead");
    headRow.appendChild(thLog);
    table.appendChild(headRow);
  } else {
    const trNoLogic = document.createElement("tr");
    const thNoLogic = document.createElement("th");
    thNoLogic.innerHTML = "Keine Logik vorhanden";
    thNoLogic.classList.add("emptyLogik");
    thNoLogic.setAttribute("colspan", colspan);
    trNoLogic.appendChild(thNoLogic);
    table.appendChild(trNoLogic);
    return;

  }

  let isEven = false;

  if(objectType === "stencil") {
    console.log({parameterNames, objectId})
  }

  parameterNames.forEach((parameterName) => {
    const parameter = parameters[parameterName];
    const isUsedInText = parameter.inText;
    const logic = parameter.logic;
    const logicKeys = Object.keys(logic);
    const isUsed = isUsedInText || logicKeys.length > 0;
    const isSetOutsideStencil = objectType === "stencil" && setParameters.has(parameterName);
    const isSet = parameter.inParam || isSetOutsideStencil;
    
    
    // create row
    const tr = document.createElement("tr");
    if(isEven) {
      tr.classList.add("even");
    }
    isEven = !isEven;

    // create var cell
    const tdVar = document.createElement("td");
    const spanVar = document.createElement("span");
    const cssClass = isUsed && isSet ? "correct" : "incorrect";
    spanVar.innerHTML = parameterName;
    spanVar.classList.add(cssClass);
    tdVar.appendChild(spanVar);
    tr.appendChild(tdVar);
    
    // create param cell
    const tdPar = document.createElement("td");
    tdPar.innerHTML = isSet ? "☑" : "☐";
    tr.appendChild(tdPar);
    
    // create param cell
    const tdTxt = document.createElement("td");
    tdTxt.innerHTML = isUsedInText ? "☑" : "☐";
    tr.appendChild(tdTxt);
    
    // create param cell
    const tdLog = document.createElement("td");
    tdLog.classList.add("tdLog");
    tdLog.addEventListener("click", () => {
      const divLogs = tdLog.getElementsByTagName("div");
      if(divLogs.length === 0) return;
      divLogs[0].classList.toggle("hide");
    });
    const spanLog = document.createElement("span");
    spanLog.innerHTML = Object.keys(logic).length;
    tdLog.appendChild(spanLog);
    if(Object.keys(logic).length > 0) {
      const divLog = document.createElement("div");
      divLog.classList.add("divLog", "hide");
      logicKeys.forEach((logicKey) => {
        const preLog = document.createElement("pre");
        preLog.innerHTML = logicKey + "\n" + logic[logicKey];
        divLog.appendChild(preLog);
      });
      tdLog.appendChild(divLog);
    }
    
    tr.appendChild(tdLog);

    // append row
    table.appendChild(tr);
  });

}

const createObjectRows = (table) => {
  const trObjectUsage = document.createElement("tr");
  const thObjectId = document.createElement("th");
  thObjectId.innerHTML = "Verwendete Objekte";
  thObjectId.setAttribute("colspan", colspan);
  thObjectId.classList.add("columnHeadMain");
  trObjectUsage.appendChild(thObjectId);
  table.appendChild(trObjectUsage);

  const headRow = document.createElement("tr");

  const thName = document.createElement("th");  
  thName.innerHTML = "Objektname";
  thName.classList.add("columnHead");  
  headRow.appendChild(thName);

  const thUsed = document.createElement("th");
  thUsed.innerHTML = "Wird verwendet";
  thUsed.classList.add("columnHead");
  headRow.appendChild(thUsed);

  const thInProcess = document.createElement("th");
  thInProcess.innerHTML = "Im Prozess";
  thInProcess.classList.add("columnHead");
  headRow.appendChild(thInProcess);

  const thHint = document.createElement("th");
  thHint.innerHTML = "Hinweis";
  thHint.classList.add("columnHead");
  headRow.appendChild(thHint);

  table.appendChild(headRow);

  let isEven = false;
  
  Object.keys(objects).forEach((objName) => {
    const obj = objects[objName];

    console.table({object: objects[objName]});

    const trObj = document.createElement("tr");
    if(isEven) {
      trObj.classList.add("even");
    }
    isEven = !isEven;

    const tdObjName = document.createElement("td");
    tdObjName.innerHTML = objName;
    trObj.appendChild(tdObjName);

    const tdObjUsed = document.createElement("td");
    tdObjUsed.innerHTML = obj.isUsed ? "☑" : "☐";;
    trObj.appendChild(tdObjUsed);

    const tdObjInProcess = document.createElement("td");
    tdObjInProcess.innerHTML = obj.isInProcess ? "☑" : "☐";;
    trObj.appendChild(tdObjInProcess);

    const tdObjDescription = document.createElement("td");
    if(!(obj.isUsed && obj.isInProcess)) {
      tdObjDescription.innerHTML = obj.isInProcess 
      ? "Objekt nicht verwendet" 
      : "Externes Objekt";
    }
    trObj.appendChild(tdObjDescription);

    table.appendChild(trObj);
  });

}

const createVariableRows = (table, variables, parameters) => {
  const trVarObjects = document.createElement("tr");
  const thVarObjects = document.createElement("th");
  thVarObjects.innerHTML = "Variablen im Prozess";
  thVarObjects.setAttribute("colspan", colspan);
  thVarObjects.classList.add("columnHeadMain");
  trVarObjects.appendChild(thVarObjects);
  table.appendChild(trVarObjects);
  
  const headRow = document.createElement("tr");
  
  const thName = document.createElement("th");  
  thName.innerHTML = "Variablenname";
  thName.classList.add("columnHead");  
  headRow.appendChild(thName);
  
  const thUsed = document.createElement("th");
  thUsed.innerHTML = "Wird verwendet";
  thUsed.classList.add("columnHead");
  headRow.appendChild(thUsed);
  
  const thBlank = document.createElement("th");
  thBlank.setAttribute("colspan", colspan-2);
  thBlank.classList.add("columnHead");
  headRow.appendChild(thBlank);

  table.appendChild(headRow);

  let isEven = false;

  variables.forEach((variable) => {
    const variableName = variable.getAttribute("id");
    const isUsed = parameters.has(variableName);

    const trVar = document.createElement("tr");
    if(isEven) {
      trVar.classList.add("even");
    }
    isEven = !isEven;

    const cssClass = isUsed ? "correct" : "incorrect";

    const tdVar = document.createElement("td");
    const spanVar = document.createElement("span");
    spanVar.innerHTML = variableName;
    spanVar.classList.add(cssClass);
    tdVar.appendChild(spanVar);
    trVar.appendChild(tdVar);

    // create param cell
    const tdUsed = document.createElement("td");
    tdUsed.innerHTML = isUsed ? "☑" : "☐";
    trVar.appendChild(tdUsed);

    // create param cell
    const tdBlank = document.createElement("td");
    tdBlank.setAttribute("colspan", colspan-2);
    trVar.appendChild(tdBlank);

    table.appendChild(trVar);

  });
}