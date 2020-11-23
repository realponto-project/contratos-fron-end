export const validator = (name, value) => {
  switch (name) {
    case "nome":
    case "tipo":
    case "codigo":
    case "descricao":
      if (value === "") return true;
      break;

    default:
      return false;
  }
  return false;
};

export const masks = (name, value) => {
  switch (name) {
    case "name":
      value = value.slice(0, 30);

      return { name, value };

    case "codigo":
      value = value.replace(/\D/gi, "");
      value = value.slice(0, 5);

      return { name, value };

    case "custoAnual":
    case "custoMensal":
      // value = value.replace(/\D/gi, "");

      const valueArray = value.split(".", 2);

      valueArray[0] = valueArray[0].slice(0, 5);

      value = valueArray[0];

      if (valueArray.length > 1) {
        valueArray[1] = valueArray[1].slice(0, 2);
        value = value + "." + valueArray[1];
      }

      // value = parseFloat(value).toFixed(2);

      return { name, value };

    case "descricao":
      value = value.slice(0, 50);

      return { name, value };

    case "emailContato":
      // value = value.replace(/\W/gi, "");
      value = value.slice(0, 40);

      return { name, value };

    default:
      return { name, value };
  }
};
