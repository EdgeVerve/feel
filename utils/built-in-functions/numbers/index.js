const decimal = (n, scale) => n.toFixed(scale);

const floor = n => Math.floor(n);

const ceiling = n => Math.ceil(n);

module.exports = {
  decimal,
  floor,
  ceiling,
};
