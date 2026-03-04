const applicationTypes = [
  {
    name: "_TTR_",
    target: "_TTD_",
    var: "DOPREQUEST"
  },
  {
    name: "_TTD_",
    target: "_RUF_",
  },
  {
    name: "_RUF_",
    target: "_DVL_",
    var: "DOPDOCID"
  },
  {
    name: "_DVL_",
    target: "_TXK_",
    var: "DOPDOCID"
  },
]

/**
 * Check if reference matches parent
 * @param { Object } reference - The reference
 * @param { string } rufObject - The rufObject in process
 */

const checkReference = (reference, rufObject) => {
  const appType = applicationTypes.find(type => {
    return reference.parent.search(type.name) > -1;
  });

  if(appType.name === "_TTD_") {
    return reference.target === rufObject
  };

  const requiredRef = reference.parent.replace(appType.name, appType.target);
  return reference.target === requiredRef;
}

/**
 * collect and check references in standard layout 
 * @param { XMLDocument } xmlDoc - The XML Document
 * @param { HTMLTableElement } table - The target table
 */

const collectReferences = (xmlDoc, table) => {
  const references = []  
  const parser = new DOMParser();
  let rufObject;

  const stencils = Array.from(xmlDoc.getElementsByTagName("stencil"));
  const applications = Array.from(xmlDoc.getElementsByTagName("application"));
  
  applications.forEach(application => {
    const objectId = application.getAttribute("id");
    applicationTypes.forEach(appType => {
      if(objectId.search(appType.name) > -1) {
        if(appType.name === "_RUF_") rufObject = objectId;
        const variabletypeentries = Array.from(application.getElementsByTagName("variabletypeentry"));
        const variabletypeentry = variabletypeentries.find(vartypeentry => {
          return vartypeentry.getAttribute("refid") === appType.var;
        });
        
        const target = variabletypeentry ? variabletypeentry.getAttribute("defaultvalue") : "Report ID Missing in: " + objectId
        references.push({
          parent: objectId,
          target: target
        })
      };
    })
  })
  
  stencils.forEach(stencil => {
    const objectId = stencil.getAttribute("id");
    applicationTypes.forEach(appType => {
      if(objectId.search(appType.name) > -1) {
        const stencilentries = Array.from(stencil.getElementsByTagName("stencilentry"));
        const stencilentry = stencilentries.find(stentry => {
          return stentry.getAttribute("refid").search("_TXK_") > -1;
        });
        
        const target = stencilentry ? stencilentry.getAttribute("refid") : "Report ID Missing in: " + objectId
        references.push({
          parent: objectId,
          target: target
        })
      };
    })
  })
  
  // Collect TTDs
  const infos = Array.from(xmlDoc.getElementsByTagName("info"));
  
  infos.forEach((info) => {
    const objectId = info.getAttribute("id");
    if(objectId.search("_TTD_") > -1) {
      const textcontent = info.getElementsByTagName("textcontent")[0];
      const cdataContent = textcontent.textContent.trim();
      const innerDoc = parser.parseFromString(cdataContent, "application/xml");
      const tfos = Array.from( innerDoc.getElementsByTagName("tfo"));
      const controlTFO = tfos.find(tfo => {
        return tfo.getAttribute("n") === "CONTROL";
      });
      let attributes = Array.from(controlTFO.getElementsByTagName("attr"));
      let reportId;
      if(attributes.length > 0) {
        const attribute = attributes.find(attr => {
          return attr.getAttribute("n") === "reportid";
        });
        reportId = attribute.getAttribute("v");
      } else {
        const attribute = Array.from(controlTFO.getElementsByTagName("attrs"))[0];
        reportId = attribute.getAttribute("reportid");
      }
      
      references.push({
        parent: objectId,
        target: reportId
      })
    }
  });

  const trReferencesHead = document.createElement("tr");
  const thReferences = document.createElement("th");
  thReferences.innerHTML = "Verweise";
  thReferences.setAttribute("colspan", colspan);
  thReferences.classList.add("columnHeadMain");
  trReferencesHead.appendChild(thReferences);
  table.appendChild(trReferencesHead);

  const headRow = document.createElement("tr");

  const thReferenceParent = document.createElement("th");
  thReferenceParent.innerHTML = "Parent-Objekt";
  thReferenceParent.setAttribute("colspan", 2);
  thReferenceParent.classList.add("columnHead");  
  headRow.appendChild(thReferenceParent);
  
  const thReferenceTo = document.createElement("th");
  thReferenceTo.setAttribute("colspan", colspan - 2);
  thReferenceTo.innerHTML = "Verweist auf";
  thReferenceTo.classList.add("columnHead");
  headRow.appendChild(thReferenceTo);

  table.appendChild(headRow);

  let isEven = false;

  references.forEach(reference => {    
    // create reference row
    const tr = document.createElement("tr");
    if(isEven) {
      tr.classList.add("even");
    }
    isEven = !isEven;

    // create parent cell
    const tdPar = document.createElement("td");
    tdPar.setAttribute("colspan", 2);
    const spanRef = document.createElement("span");
    const cssClass = checkReference(reference, rufObject) ? "correct" : "incorrect";
    spanRef.classList.add(cssClass);
    spanRef.innerHTML = reference.parent;
    tdPar.appendChild(spanRef);
    tr.appendChild(tdPar);
    
    // create references cell
    const tdRef = document.createElement("td");
    tdRef.setAttribute("colspan", colspan - 2);
    tdRef.innerHTML = reference.target;
    tr.appendChild(tdRef);

    table.appendChild(tr);

  })
}