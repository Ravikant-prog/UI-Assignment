let data;
let types = {};
const table = document.querySelector("table");
const headKeys = ["name", "icao", "iata", "elevation", "type"];

const getData = async () => {
  const res = await fetch("./data/airports.json");
  data = await res.json();
  getTypes(data);
  createTypesFilter();
  createHeads(headKeys);
  populateTable(data.splice(0, 10));
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

const onFilterChange = (by) => {
  console.log(by);
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
