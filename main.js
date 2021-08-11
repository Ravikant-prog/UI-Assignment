const getData = async () => {
    const res = await fetch("./data/airports.json");
    data = await res.json();
    console.log(data[0])
  };
  getData();