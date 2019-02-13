// const substring = (text, start, length) => length ? text.substr(start - 1, length) : text.substr(start - 1); // eslint-disable-line no-confusing-arrow
const substring = (text, start, length) => {
  if (length && start > -1) {
    return text.substr(start - 1, length);
  } else if (length && start <= -1) {
    return text.substr(start, length);
  } else if (start > -1) {
    return text.substr(start - 1);
  }

  return text.substr(start);
};
const stringLength = text => text.length;

const upperCase = text => text.toUpperCase();

const lowerCase = text => text.toLowerCase();

const substringBefore = (text, match) => {
  const idx = text.indexOf(match);
  return idx !== -1 ? text.substring(0, idx) : '';
};

const substringAfter = (text, match) => {
  const idx = text.indexOf(match);
  return idx !== -1 ? text.substring(idx + match.length) : '';
};

const replace = (input, pattern, replacement, flags) => {
  const regEx = new RegExp(pattern, flags);
  return input.replace(regEx, replacement);
};

const contains = (text, match) => text.indexOf(match) > -1;

const startsWith = (text, match) => text.startsWith(match);

const endsWith = (text, match) => text.endsWith(match);

const matches = (text, pattern, flags) => {
  const rgx = new RegExp(pattern, flags);
  return rgx.test(text);
};

module.exports = {
  substring,
  'string length': stringLength,
  'upper case': upperCase,
  'lower case': lowerCase,
  'substring before': substringBefore,
  'substring after': substringAfter,
  replace,
  contains,
  'starts with': startsWith,
  'ends with': endsWith,
  matches,
};
