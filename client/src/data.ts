
// Adding key-value pairs
const mocked =[
  ["StarID", "ProperName", "X", "Y", "Z"],
  ["1", "Andreas", "282.43485", "0.00449", "5.36884"],
  ["2", "Rory", "43.04329", "0.00285", "-15.24144"],
  ["3", "Mortimer", "277.11358", "0.02422", "223.27753"],
  ["3", "mortimer", "277.11358", "0.02422", "223.27753"],
  ["4", "Bailee", "79.62896", "0.01164", "-101.53103"],
  ["5", "Zita", "264.58918", "0.04601", "-226.71007"],
  ["6", "Araceli", "53.06535", "0.0168", "3.66089"],
  ["7", "Casey", "52.95794", "0.02084", "19.31343"],
  ["8", "Eura", "174.01562", "0.08288", "84.44669"],
  ["9", "Aracely", "166.9363", "0.10297", "123.9143"],
  ["10", "Destany", "58.65441", "0.03711", "-72.08957"],
  ["11", "Cael", "159.15237", "0.1036", "170.31215"],
  ["12", "Kaleigh", "199.36567", "0.14237", "-144.63632"],
  ["13", "Nikhil", "264.5403", "0.19243", "-110.08871"],
  ["14", "Elex", "195.69077", "0.16486", "-1.23101"],
  ["15", "Nataly", "258.01976", "0.22655", "316.26412"],
  ["16", "Channie", "124.20847", "0.11077", "-104.93583"],
  ["17", "Jered", "1084.53445", "0.97309", "-1543.94618"],
  ["18", "Less", "50.05006", "0.04641", "-3.54701"],
  ["19", "Jerel", "190.46888", "0.17724", "150.44538"],
  ["20", "Sandi", "85.20962", "0.09361", "37.10201"],
  ["21", "Lesa", "169.56332", "0.19602", "23.85242"],
  ["22", "Paul", "145.72842", "0.17838", "-169.738"],
];

export async function getTable(label: string): Promise<string[][]> {
  if (label == "Mocked Star Data") {
    return mocked;
  }
  if (label == "Empty Table") {
    return [];
  }
  try {
    const loadResponse = await fetch(
      "http://localhost:3232/getData?filepath=" + label
    );
    const loadJson = await loadResponse.json();
    const result: string = loadJson.result;
    if (result !== "error") {
      const data: string[][] = loadJson.content;
      return data;
    }
  } catch (error) {
    throw new Error("Error in fetch");
  }
  throw new Error("File " + label + " not found");
}