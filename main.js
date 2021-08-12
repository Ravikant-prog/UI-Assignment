let data;
let types = {}; // to store unique types from the data
let currentFilters = JSON.parse(localStorage.getItem("filters")) || [];
let currentData;
let rowStart = 0;
let rowCount = +localStorage.getItem("rowCount") || 4;
const table = document.querySelector("table");
const para = document.querySelector("#paging");
const headKeys = [
  "name",
  "icao",
  "iata",
  "elevation",
  "latitude",
  "longitude",
  "type",
];                                                        // keys from data to display as table column

const setRowCount = (count) => {
  count = +document.querySelector("#rowCount").value || 4; //set rowCount to 4 if nothing provided
  if (count < 1) {
    alert("Count needs to be atleast 1");
    return;
  }
  rowCount = count;
  rowStart = 0;
  populateTable();
  localStorage.setItem("rowCount", rowCount); 
};

const getData = async () => {
  const res = await fetch("./data/airports.json");         // fetching data from JSON file
  data = await res.json();
  currentData = [...data];
  getTypes(data);                                          // collect types from data
  createTypesFilter();                                     // create checkbox for types
  applyFilter();                                           // apply initial filter   
  populateTable();                                         // create table with current data
};

const getTypes = (data) => {
  data.forEach((ele) => {
    if (!types[ele.type]) types[ele.type] = 1;
  });
};

const createTypesFilter = () => {
  Object.keys(types).forEach((type) => {
    const filterDiv = document.querySelector(".filters");
    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.name = type;
    checkbox.checked = currentFilters.includes(type);
    checkbox.id = type;
    checkbox.onchange = () => onFilterChange(type);
    const label = document.createElement("label");

    label.appendChild(document.createTextNode(type));
    filterDiv.appendChild(checkbox);
    filterDiv.appendChild(label);
  });
};

const applyFilter = () => {
  if (currentFilters.length !== 0)
    currentData = data.filter((ele) => currentFilters.includes(ele["type"]));
  else currentData = [...data];
  populateTable();
};

const onFilterChange = (type) => {
  rowStart = 0;
  if (!types[type]) return false;
  const found = currentFilters.indexOf(type);
  if (found < 0) {
    currentFilters.push(type);
  } else {
    currentFilters.splice(found, 1);
  }
  localStorage.setItem("filters", JSON.stringify(currentFilters));
  applyFilter();
};

const createHeads = (heads) => {                       // set column names
  const thead = table.createTHead();
  const row = thead.insertRow();
  heads.forEach((head) => {
    let th = document.createElement("th");
    let text = document.createTextNode(head);
    th.appendChild(text);
    row.appendChild(th);
  });
};

const populateTable = () => {
  table.innerHTML = "";                                // reset table before re-populating
  createHeads(headKeys);
  currentData.slice(rowStart, rowStart + rowCount).forEach((ele) => {
    let row = table.insertRow();
    for (let key of headKeys) {
      let cell = row.insertCell();
      let text = document.createTextNode(ele[key]);
      cell.appendChild(text);
    }
  });
  para.innerHTML = formPageInfo();
};

const searchByFilter = () => {
  rowStart = 0;
  const query = document.querySelector("#searchbox").value;
  if (query === "") {
    currentData = [...data];
  } else {
    currentData = data.filter((ele) =>
      ele["name"].toLowerCase().includes(query.toLowerCase())
    );
  }
  populateTable();
};

const navigate = (towards) => {
  if (towards > 0) {                                   // when user presses next 
    newRowStart = rowStart + rowCount;
  } else {                                             // when user presses previous
    newRowStart = rowStart - rowCount;
  }
  if (newRowStart > -1 && newRowStart < currentData.length) {
    rowStart = newRowStart;
    populateTable();
  }
};

const formPageInfo = () => {
  let rowEnd = rowStart+rowCount;
  if(rowStart+rowCount>currentData.length) rowEnd = currentData.length;
  return `Showing <b>${rowStart + 1} - ${rowEnd}</b> of <b>${
    currentData.length
  }</b> rows`;
};

getData();
