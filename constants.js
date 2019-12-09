const WARMING_COLORS = [
  '#08306b',
  '#08519c',
  '#2171b5',
  '#4292c6',
  '#6baed6',
  '#9ecae1',
  '#c6dbef',
  '#deebf7',
  '#fee0d2',
  '#fcbba1',
  '#fc9272',
  '#fb6a4a',
  '#ef3b2c',
  '#cb181d',
  '#a50f15',
  '#67000d',
];

const YEAR_RANGE = [1881, 2018];
const REFERENCE_RANGE = [1961, 1990];
const FIRST_REF_YEAR = REFERENCE_RANGE[0] - YEAR_RANGE[0];
const LAST_REF_YEAR = REFERENCE_RANGE[1] - YEAR_RANGE[0] + 1;
const DOMAIN_DEVIATION = 2.5;
const SCALE_DEVIATION =
  DOMAIN_DEVIATION + (2 * DOMAIN_DEVIATION) / WARMING_COLORS.length;

/*
 * These districts have faulty values for the first 10 years. This is probably caused by
 * weather stations that have been moved during those years which caused inconsistencies in
 * measurements and interpolation.
 */
const FAULTY_DISTRICTS = [
  '82355006',
  '82355005',
  '82355004',
  '82355002',
  '82350065',
  '82350080',
  '82365007',
  '81150050',
  '81155001',
  '82355008',
  '82365005',
  '82355001',
  '81150041',
  '82310000',
  '82355007',
  '84360049',
  '82360004',
  '81155003',
  '82365001',
  '97765737',
  '81155002',
  '81150042',
  '97805745',
  '84360094',
  '82360046',
  '81155005',
  '81150052',
  '81150029',
  '82360072',
  '53340002',
  '53340036',
  '53340016',
  '97765738',
  '82360030',
  '97800133',
  '82355003',
  '97800117',
  '91800118',
  '53340004',
  '82375005',
  '97805742',
  '97800132',
  '97800124',
  '53340032',
  '97800115',
  '53340024',
  '53340012',
  '82360070',
];

const FAULTY_YEARS = 10;
const FAULTY_COLOR = '#d8d8d8';

module.exports = {
  YEAR_RANGE,
  REFERENCE_RANGE,
  FIRST_REF_YEAR,
  LAST_REF_YEAR,
  SCALE_DEVIATION,
  WARMING_COLORS,
  FAULTY_DISTRICTS,
  FAULTY_YEARS,
  FAULTY_COLOR
};