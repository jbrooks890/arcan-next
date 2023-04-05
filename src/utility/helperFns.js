// =========== MAKE SAFE ===========

export const makeSafe = str => {};

// =========== DEBOUNCE ===========

export const debounce = (fn, ms = 1000) => {
  // console.log("Running debounce");
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, args);
    }, ms);
  };
};

// =========== GET LETTER ===========

export const getLetter = n => {
  const first = "a".charCodeAt(0);
  const last = "z".charCodeAt(0);
  const length = last - first + 1; // letter range

  return String.fromCharCode(first + n).toUpperCase();
};

// =========== CAPITALIZE ===========

export const capitalize = str => str[0].toUpperCase() + str.slice(1);
