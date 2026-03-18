const typeNames = {
  executionContext: {
    onDocumentPreparation: "Vor der Bausteinauswahl",
    onComponentSelection: "Beim Auswählen in der Bausteinauswahl",
    onComponentDeSelection: "Beim Abwählen in der Bausteinauswahl",
  },
  logicType: {
    basiclogic: "Basislogik",
    extendedlogic: "Erweiterte Logik",
  },
  logicSubType: {
    condition: "Bedingung",
    action: "Aktion/Befehl"
  }
}

const cellColors = {
  "J": "true",
  "N": "false",
  "X": "execute",
  "-": "unused",
}

const sortExecutionContextKeys = (keys) => {
  const onDocumentPreparation = [];
  const onComponentSelection = [];
  const onComponentDeSelection = [];

  keys.forEach(key => {
    if(key.startsWith("onDocumentPreparation")) {
      onDocumentPreparation.push(key);
    }
    if(key.startsWith("onComponentSelection")) {
      onComponentSelection.push(key);
    }
    if(key.startsWith("onComponentDeSelection")) {
      onComponentDeSelection.push(key);
    }
  });

  return [
    ...onDocumentPreparation,
    ...onComponentSelection,
    ...onComponentDeSelection,
  ]
}

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
  parameters,
  logicMatrix
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
              [executionContext, logicTypeString, logicSubTypeString, index],
              logicString,
              parameters,
            );
            if(logicTypeString === "extendedlogic") {
              const logicMapping = logicSubTypeElement.getAttribute("mapping").split("");
              logicMatrix[logicSubTypeString].push([logicString, ...logicMapping]);
            }
          };
        });
      });
    }
  });
}

/*
 * Collects variables from logic string
 * adds them to parameters collection
 * and marks them as used, if already collected
 * @param { string } pathToLogicString - path to the logic string
 * @param { string } logicString - logic string
 * @param { Object } parameters - logic string
*/

const collectParametersFromLogic = (
  logicPathKeys,
  logicString,
  parameters,
) => {
  
  const [executionContext, logicTypeString, logicSubTypeString, index] = logicPathKeys;
  const pathToLogicString =  executionContext + " | " + logicTypeString + " | " + logicSubTypeString + " | " + index;  
  const matches = logicString.match(/&[A-Z0-9_]*/g);
  if(matches && matches.length) {
    matches.forEach((match) => {
      const param = match.replace("&", "");
      if(parameters[param] !== undefined) {
        if(parameters[param].logic[pathToLogicString] === undefined) {
          parameters[param].logic[pathToLogicString] = {
              logicString,
              logicPathKeys
            };
        }
      } else {
        parameters[param] = {
          inParam: false,
          inText: false,
          logic: {
            [pathToLogicString]: {
              logicString,
              logicPathKeys
            }
          }
        }
      }
    });
  }
}

/**
 * Appends a tag to a parent child
 * @param { string } content - text for the tsg
 * @param { HTMLElement } parent - parent to append the tag to
 * @param { string[] } [classList] - list of HTML classes
*/
const appendTag = (content, parent, classList) => {
  const tag = document.createElement("div");
  tag.classList.add(...classList, "tag");
  tag.innerHTML = content;
  parent.appendChild(tag);
}

/**
 * Translates type IDs to text
 * @param { string } typeID - text for the tag
 * @param { string } type - parent to append the tag to
 * @param { string[] } [classList] - list of HTML classes
*/
const translateTypeID = (type, typeID) => {
  return typeNames[type][typeID];
}

/**
 * Translates type IDs to text
 * @param { Object } parameters - collection of parameters in use
 * @param { string } table - table to add rows
 * @param { boolean } clearTable - clear table before filling
 * @param { string } objectId - ID of DOPiX object
 * @param { string } objectType - Type of DOPiX object
*/
const createResultTable = (
  parameters, table,
  clearTable,
  objectId,
  objectType,
  logicMatrix
) => {
  if(clearTable) {
    table.innerHTML = "";
  }

  // create table head for objects
  const trObjectId = document.createElement("tr");
  const thObjectId = document.createElement("th");
  thObjectId.innerHTML = objectId;
  addAnchor(thObjectId, objectId, {top: "-96px"});
  thObjectId.setAttribute("colspan", colspan);
  thObjectId.classList.add("columnHeadMain");
  trObjectId.appendChild(thObjectId);
  table.appendChild(trObjectId);

  // collect parameter names
  const parameterNames = Object.keys(parameters);
  
  // create column heads
  if(parameterNames.length > 0) {
    const tfoRefs = Object.keys(objects[objectId].tfoReferences);
    tfoRefs.forEach((tfoRef, index) => {
      const trTfoRef = document.createElement("tr");
      const thTfoRefBlank = document.createElement("th");
      if(index === 0) {
        thTfoRefBlank.setAttribute("colspan", colspan - 2);
        trTfoRef.appendChild(thTfoRefBlank);

        const thTfoRefHead = document.createElement("th");
        thTfoRefHead.innerHTML = "TFO-Bezüge:"
        trTfoRef.appendChild(thTfoRefHead);
      } else {
        thTfoRefBlank.setAttribute("colspan", colspan - 1);
        trTfoRef.appendChild(thTfoRefBlank);
      }
      const thTfoRefContent = document.createElement("th");
      thTfoRefContent.classList.add("tfoRefContainer");
      appendTag(
        translateTypeID("executionContext", tfoRef),
        thTfoRefContent,
        ["tfoRef"]
      );
      thTfoRefContent.innerHTML += objects[objectId].tfoReferences[tfoRef]
      trTfoRef.appendChild(thTfoRefContent);
      table.appendChild(trTfoRef);
    });
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
    // creat single column head if no parameters exist
    const trNoLogic = document.createElement("tr");
    const thNoLogic = document.createElement("th");
    thNoLogic.innerHTML = "Keine Logik vorhanden";
    thNoLogic.classList.add("emptyLogik");
    thNoLogic.setAttribute("colspan", colspan);
    trNoLogic.appendChild(thNoLogic);
    table.appendChild(trNoLogic);
    return;
  }

  // even toggle for row classes
  let isEven = false;

  // create rows for parameters
  parameterNames.forEach((parameterName) => {
    const parameter = parameters[parameterName];
    const {inText: isUsedInText, logic} = parameter;
    const logicKeys = Object.keys(logic);
    const isUsed = isUsedInText || logicKeys.length > 0;
    const isSetOutsideStencil = objectType === "stencil" && setParameters.has(parameterName);
    const isSet = parameter.inParam || isSetOutsideStencil;
    
    
    // create parameter row
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
    
    // create logic cell
    const tdLog = document.createElement("td");
    tdLog.classList.add("tdLog");

    const logicCount = document.createElement("div");
    logicCount.innerHTML = Object.keys(logic).length;
    logicCount.classList.add("logicCount");
    logicCount.addEventListener("click", () => {
      const divLogs = tdLog.querySelectorAll("div.divLog");
      if(divLogs.length === 0) return;
      divLogs[0].classList.toggle("hide");
    });
    tdLog.appendChild(logicCount);

    if(Object.keys(logic).length > 0) {
      let executionContextMain = null;
      let logicTypeMain = null;
      let logicSubTypeMain = null;
      const divLog = document.createElement("div");
      divLog.classList.add("divLog", "hide");

      const sortedKeys = sortExecutionContextKeys(logicKeys);
      sortedKeys.forEach((logicKey) => {
        const {logicString, logicPathKeys} = logic[logicKey];
        const [executionContext, logicTypeString, logicSubTypeString, index] = logicPathKeys;
        
        const subGrid = document.createElement("div");
        subGrid.classList.add("subGrid");

        let addChildHeader = false;
        
        if(executionContext !== executionContextMain) {
          executionContextMain = executionContext;
          addChildHeader = true;
          const executionContextTag = document.createElement("div");
          executionContextTag.classList.add("executionContext");
          appendTag(
            translateTypeID("executionContext", executionContext),
            executionContextTag,
            ["executionContext", executionContext]
          );
          subGrid.appendChild(executionContextTag);
        }

        if(logicTypeString !== logicTypeMain || addChildHeader) {
          logicTypeMain = logicTypeString;
          addChildHeader = true;
          const logicTypeTag = document.createElement("div");
          logicTypeTag.classList.add("logicType");
          appendTag(
            translateTypeID("logicType", logicTypeString),
            logicTypeTag,
            ["logicType", executionContext]
          );
          subGrid.appendChild(logicTypeTag);
        }
        
        if(logicSubTypeString !== logicSubTypeMain || addChildHeader) {
          logicSubTypeMain = logicSubTypeString;
          const logicSubTypeTag = document.createElement("div");
          logicSubTypeTag.classList.add("logicSubType");
          appendTag(
            translateTypeID("logicSubType", logicSubTypeString),
            logicSubTypeTag,
            ["logicSubType", executionContext]
          );
          subGrid.appendChild(logicSubTypeTag);
        }

        const preLog = document.createElement("pre");
        preLog.classList.add("logicContent");
        preLog.innerHTML = zeroPad(index + 1, 2) + ": " + logicString;
        subGrid.appendChild(preLog);
        divLog.appendChild(subGrid);
      });
      tdLog.appendChild(divLog);
    }
    
    tr.appendChild(tdLog);

    // append row
    table.appendChild(tr);
  });

  // create logic matrix, if available
  const {condition: cons, action: acts} = logicMatrix;
  if(cons.length + acts.length > 0) {
    const columnCount = cons[0].length;    
    console.log({logicMatrix, cons, acts});

    // create matrix head
    const trMatrixHead = document.createElement("tr");
    const thMatrixHead = document.createElement("th");
    thMatrixHead.setAttribute("colspan", colspan);
    thMatrixHead.innerHTML = "Erweiterte Logik: Matrix";
    thMatrixHead.classList.add("matrixHead");

    thMatrixHead.addEventListener("click", (el) => {
      console.log({el, parent: el.target.parentElement});
      el.target.parentElement.nextSibling.querySelector(".matrixGrid").classList.toggle("hide");
    });

    trMatrixHead.appendChild(thMatrixHead);
    table.appendChild(trMatrixHead);

    // create matrix cell
    const trMatrix =document.createElement("tr");
    trMatrix.classList.add("matrixRow");
    const tdMatrix = document.createElement("td");
    tdMatrix.setAttribute("colspan", colspan);

    // create matrix grid
    const matrixGridContainer = document.createElement("div");
    matrixGridContainer.classList.add("matrixGridContainer");

    const matrixGrid = document.createElement("div");
    matrixGrid.classList.add("matrixGrid", "hide");
    const gridRowWidths = ["auto"];
    gridRowWidths.push(...Array(columnCount-1).fill("2rem"));
    console.log({gridRowWidths, columnCount});
    matrixGrid.setAttribute("style", `grid-template-columns: ${gridRowWidths.join(" ")};`);
    console.log({gridRowWidths, style: matrixGrid.getAttribute("style")});
    
    const createGridRow = (text, index) => {
      const elementType = index === 0 ? "pre" : "div";
      const cellClass = cellColors[text] ? cellColors[text] : "logic";
      const gridElement = document.createElement(elementType);
      gridElement.classList.add(cellClass);
      if(cellClass !== "logic") gridElement.classList.add("marker");
      gridElement.textContent = text;
      matrixGrid.appendChild(gridElement);
    }

    cons.forEach(condition => {
      condition.forEach((cell, index) => {
        createGridRow(cell, index);
      });      
    });
    
    acts.forEach(action => {
      action.forEach((cell, index) => {
        createGridRow(cell, index);
      });
    });

    matrixGridContainer.appendChild(matrixGrid);
    tdMatrix.appendChild(matrixGridContainer);
    trMatrix.appendChild(tdMatrix)

    table.appendChild(trMatrix);
  }
}

const createObjectRows = (table) => {
  const trObjectUsage = document.createElement("tr");
  const thObjectId = document.createElement("th");
  thObjectId.innerHTML = "Verwendete Objekte";
  addAnchor(thObjectId, "usedObjects", {top: "-96px"});
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

const createVariableRows = (table, variables) => {
  const trVarObjects = document.createElement("tr");
  const thVarObjects = document.createElement("th");
  thVarObjects.innerHTML = "Variablen im Prozess";
  addAnchor(thVarObjects, "variables", {top: "-96px"});
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
  
  const thHidden = document.createElement("th");
  thHidden.innerHTML = "Ist unsichtbar";
  thHidden.classList.add("columnHead");
  headRow.appendChild(thHidden);
  
  const thBlank = document.createElement("th");
  thBlank.setAttribute("colspan", colspan-2);
  thBlank.classList.add("columnHead");
  headRow.appendChild(thBlank);

  table.appendChild(headRow);

  let isEven = false;

  variables.forEach((variable) => {
    const variableName = variable.getAttribute("id");
    const entrymode = variable.getAttribute("entrymode");
    const isUsed = setParameters.has(variableName);

    const trVar = document.createElement("tr");
    if(isEven) {
      trVar.classList.add("even");
    }
    isEven = !isEven;

    const isHidden = entrymode === "hidden";
    const cssClass = isHidden && isUsed ? "correct" : "incorrect";

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
    const tdEntrymode = document.createElement("td");
    tdEntrymode.innerHTML = isHidden ? "☑" : "☐";
    trVar.appendChild(tdEntrymode);

    // create param cell
    const tdBlank = document.createElement("td");
    tdBlank.setAttribute("colspan", colspan-3);
    trVar.appendChild(tdBlank);

    table.appendChild(trVar);

  });
}