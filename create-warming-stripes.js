/*
 * Generates warming stripes pngs for each district
 */
const gm = require('gm').subClass({imageMagick: true});
const fs = require('fs');
const path = require('path');
const {csvParse, scaleQuantize, mean} = require('d3');
const {
  FIRST_REF_YEAR,
  LAST_REF_YEAR,
  SCALE_DEVIATION,
  WARMING_COLORS,
} = require('./constants');

const STRIPE_WIDTH = 6;
const HEIGHT = 300;
const DEST_FOLDER = './gemeinden-stripes';

if (!fs.existsSync(DEST_FOLDER)) {
  fs.mkdirSync(DEST_FOLDER);
}

const scale = scaleQuantize().range(WARMING_COLORS);

const districts = csvParse(
  fs.readFileSync(
    path.resolve(__dirname, `./gemeinden-data/gemeinden-temperature.csv`),
    'utf-8',
  ),
).map((d) => {
  const years = Object.keys(d)
    .map((key) => parseInt(key))
    .filter((key) => !isNaN(key))
    .map((key) => parseFloat(d[key]));

  return {
    id: d.id,
    years,
  };
});

const generateImage = ({id, years}, dI) => {
  const img = gm(years.length * STRIPE_WIDTH, HEIGHT, '#fff');
  const average = mean(years.slice(FIRST_REF_YEAR, LAST_REF_YEAR));

  scale.domain([average - SCALE_DEVIATION, average + SCALE_DEVIATION]);

  years.forEach((y, i) => {
    const color = isNaN(y) ? '#d8d8d8' : scale(y);

    img
      .fill(color)
      .drawRectangle(i * STRIPE_WIDTH, 0, (i + 1) * STRIPE_WIDTH - 1, HEIGHT);
  });

  img.write(`${DEST_FOLDER}/${id}.png`, function(err) {
    if (!err) console.log(`Wrote image for ${id}`);
    if (err) console.log(err);
    if (districts.length > dI + 1) generateImage(districts[dI + 1], dI + 1);
  });
};

generateImage(districts[0], 0);
