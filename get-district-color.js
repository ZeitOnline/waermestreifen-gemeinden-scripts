/* 
* Script used by `create-warming-maps.sh` to get a color value given a year and a geojson feature
* I probably could have just written everything as a node script but I just had too much fun creating
* maps using commandline tools...
*/

const fs = require('fs');
const d3 = require('d3');
const {csvParse, mean} = require('d3');
const path = require('path');
const {
  FIRST_REF_YEAR,
  LAST_REF_YEAR,
  SCALE_DEVIATION,
  WARMING_COLORS,
  FAULTY_COLOR
} = require('./constants');

const scale = d3.scaleQuantize().range(WARMING_COLORS);

const districts = csvParse(
  fs.readFileSync(
    path.resolve(__dirname, `./gemeinden-data/gemeinden-temperature.csv`),
    'utf-8',
  ),
).map((d, i) => {
  const years = Object.keys(d)
    .map((key) => parseInt(key))
    .filter((key) => !isNaN(key))
    .map((key) => parseFloat(d[key]));

  const refYears = years.slice(FIRST_REF_YEAR, LAST_REF_YEAR);

  return {
    years,
    id: d.id,
    name: d.name,
    mean: mean(refYears),
  };
});

module.exports = (f, i) => {
  const d = districts.find((d) => d.id === f.properties.RS);
  // Because of very weird bug we have to check every time if d exists. Not sure what causes this
  const value = d ? d.years[i] : 0;
  const domain = d
    ? [d.mean - SCALE_DEVIATION, d.mean + SCALE_DEVIATION]
    : [0, 1];
  const color = isNaN(value) ? FAULTY_COLOR : scale.domain(domain)(value);
  return color;
};
