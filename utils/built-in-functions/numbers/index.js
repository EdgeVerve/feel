const decimal = (n, scale) => {
  const pow = 10 ** scale;
  return Math.round(n * pow) / pow;
};

const floor = n => Math.floor(n);

const ceiling = n => Math.ceil(n);

module.exports = {
  decimal,
  floor,
  ceiling,
};
