export const validator = (name, value) => {
  switch (name) {
    case "grupo":
    case "equacao":
      if (value === "") return true;
      break;

    default:
      return false;
  }
  return false;
};

export const masks = (name, value) => {
  switch (name) {
    case "equacao":
      value = value.replace(/[^(X|\d|*|/|\-\.|+|(|)\s))]/gi, "");

      return { name, value };
    default:
      return { name, value };
  }
};
