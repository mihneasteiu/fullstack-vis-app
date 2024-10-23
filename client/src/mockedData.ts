
// Define a Map where keys are strings and values are 2D arrays of numbers
const map = new Map<string, string[][]>();

// Adding key-value pairs
map.set("Star Data", [
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
  ["22", "Paul", "145.72842", "0.17838", "-169.738"]
]);

map.set("just text", [
  ["StarID", "ProperName"],
  ["1", "Andreas"],
  ["2", "Rory"],
  ["3", "Mortimer"]
]);

map.set("Student Records", [
  ["Name", "Math", "Physics", "English", "Chemistry", "Biology", "History", "Geography"],
  ["Student_1", "72", "87", "60", "68", "75", "82", "70"],
  ["Student_2", "96", "75", "70", "85", "88", "91", "80"],
  ["Student_3", "63", "66", "83", "71", "65", "78", "77"],
  ["Student_4", "84", "66", "59", "80", "81", "69", "85"],
  ["Student_5", "57", "79", "71", "55", "66", "73", "62"]
]);

map.set("Empty Table", [[]]);
map.set("RI Income by Race", [
  ["Race", "ID Year", "Year", "Household Income by Race", "Household Income by Race Moe", "Geography", "ID Geography", "Slug Geography"],
  ["Total", "2020", "2020", "85413", "6122", "Bristol County, RI", "05000US44001", "bristol-county-ri"],
  ["Total", "2020", "2020", "75857", "2022", "Kent County, RI", "05000US44003", "kent-county-ri"],
  ["Total", "2020", "2020", "84282", "2629", "Newport County, RI", "05000US44005", "newport-county-ri"],
  ["Total", "2020", "2020", "62323", "1270", "Providence County, RI", "05000US44007", "providence-county-ri"],
  ["Total", "2020", "2020", "86970", "3651", "Washington County, RI", "05000US44009", "washington-county-ri"],
  ["White", "2020", "2020", "85359", "6432", "Bristol County, RI", "05000US44001", "bristol-county-ri"],
  ["White", "2020", "2020", "75408", "2311", "Kent County, RI", "05000US44003", "kent-county-ri"],
  ["White", "2020", "2020", "87407", "3706", "Newport County, RI", "05000US44005", "newport-county-ri"],
  ["White", "2020", "2020", "67639", "1255", "Providence County, RI", "05000US44007", "providence-county-ri"],
  ["White", "2020", "2020", "88147", "3942", "Washington County, RI", "05000US44009", "washington-county-ri"],
  ["Black", "2020", "2020", "72443", "54768", "Bristol County, RI", "05000US44001", "bristol-county-ri"],
  ["Black", "2020", "2020", "100375", "20176", "Kent County, RI", "05000US44003", "kent-county-ri"],
  ["Black", "2020", "2020", "46622", "14559", "Newport County, RI", "05000US44005", "newport-county-ri"],
  ["Black", "2020", "2020", "46084", "3384", "Providence County, RI", "05000US44007", "providence-county-ri"],
  ["Black", "2020", "2020", "45849", "6614", "Washington County, RI", "05000US44009", "washington-county-ri"]])

export function getTable(label:string) {
    const matrixA = map.get(label);
    return matrixA;
}