let data;
let types = {};
let currentFilters = [];
let currentData
const table = document.querySelector("table");
const headKeys = ["name", "icao", "iata", "elevation", "latitude", "longitude", "type"];

const getData = async () => {
  const res = await fetch("./data/airports.json");
  data = await res.json();
  getTypes(data);
  data =data.splice(0,10)
  createTypesFilter();
  populateTable(data);
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
    checkbox.value = false;
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
  populateTable(currentData);
};

const onFilterChange = (type) => {
  if (!types[type]) return false;
  const found = currentFilters.indexOf(type);
  if (found < 0) {
    currentFilters.push(type);
  } else {
    currentFilters.splice(found, 1);
  }
  applyFilter();
};

const createHeads = (heads) => {
  const thead = table.createTHead();
  const row = thead.insertRow();
  heads.forEach((head) => {
    let th = document.createElement("th");
    let text = document.createTextNode(head);
    th.appendChild(text);
    row.appendChild(th);
  });
};

const populateTable = (data) => {
  table.innerHTML = "";
  createHeads(headKeys);
  data.forEach((ele) => {
    let row = table.insertRow();
    for (let key of headKeys) {
      let cell = row.insertCell();
      let text = document.createTextNode(ele[key]);
      cell.appendChild(text);
    }
  });
};

getData();
