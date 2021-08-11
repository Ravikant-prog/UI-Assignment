let data
const table = document.querySelector("table")
const headKeys = ["name", "icao", "type"]

const getData = async () => {
    const res = await fetch("./data/airports.json");
    data = await res.json();
    createHeads(headKeys);
    populateTable(data)
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
