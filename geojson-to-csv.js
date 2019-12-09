const fs = require('fs');
const path = require('path');
const topojson = require('topojson');
const {csvParse, mean} = require('d3');
const {createArrayCsvWriter} = require('csv-writer');
const {
  YEAR_RANGE: [START_YEAR],
  FAULTY_DISTRICTS,
  FAULTY_YEARS,
} = require('./constants');

const SOURCE_FOLDER = './gemeinden-years-topo';
const DEST_FOLDER = './gemeinden-data';
const ID_KEY = 'RS';

if (!fs.existsSync(DEST_FOLDER)) {
  fs.mkdirSync(DEST_FOLDER);
}

// Read all files in directory and extract data to be written to csv
const filenames = fs.readdirSync(SOURCE_FOLDER);
const header = [
  'id',
  'name',
  'zone',
  'min',
  'max',
  'minYear',
  'maxYear',
  'mean',
  ...Array.from(Array(filenames.length).keys()).map((i) => i + START_YEAR),
];

const districts = {};

const getValue = (props, key) => {
  return props[key] !== null ? Math.round(props[key] * 10) / 100 : null;
};

const parseFeature = (feature, year) => {
  const {properties} = feature;
  const id = properties[ID_KEY];
  const isFaultyDistrict = FAULTY_DISTRICTS.indexOf(id) >= 0;
  const isFaultyYear = year - START_YEAR < FAULTY_YEARS;
  const isFaulty = isFaultyDistrict && isFaultyYear;
  const value = isFaulty ? null : getValue(properties, '_mean');

  if (!districts[id]) {
    districts[id] = {
      id,
      name: properties.GEN,
      values: [value],
      min: value === null ? Infinity : value,
      max: value === null ? -Infinity : value,
      minYear: year,
      maxYear: year,
    };
  } else {
    const district = districts[id];
    const newMin = value === null ? false : value < district.min;
    const newMax = value === null ? false : value > district.max;
    district.values.push(value);
    district.min = newMin ? value : district.min;
    district.max = newMax ? value : district.max;
    district.minYear = newMin ? year : district.minYear;
    district.maxYear = newMax ? year : district.maxYear;
  }
};


const writeCsv = (header, data) => {
  const fileName = `gemeinden-temperature.csv`;
  const folderName = './';

  const formatted = data.map((d) => [
    d.id,
    d.name,
    d.zone,
    parseFloat(d.min).toFixed(1),
    parseFloat(d.max).toFixed(1),
    d.minYear,
    d.maxYear,
    parseFloat(mean(d.values)).toFixed(1),
    ...d.values,
  ]);

  createArrayCsvWriter({
    path: path.join(DEST_FOLDER, fileName),
    header: header,
  })
    .writeRecords(formatted)
    .then(() => console.log(`Wrote ${fileName} to ${folderName}`));
};

filenames.forEach((filename, i) => {
  console.log(`Processing ${filename}`);
  const raw = fs.readFileSync(`./${SOURCE_FOLDER}/${filename}`, 'utf-8');
  const parsed = JSON.parse(raw);
  const geojson = topojson.feature(parsed, parsed.objects['districts']);
  geojson.features.forEach((f, j) => {
    parseFeature(f, i + START_YEAR);
  });
});

const sortedDistricts = Object.keys(districts)
  .map((key) => districts[key])
  .filter((d) => d.values.some((v) => v !== null))
  .sort((a, b) => b.lat - a.lat);

writeCsv(header, sortedDistricts);
