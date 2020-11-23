import * as cnpjLib from "@fnando/cnpj";
import * as cpfLib from "@fnando/cpf";

export const validator = (name, value) => {
  switch (name) {
    case "codigo":
      if (value === "" || /\D/.test(value)) return true;
      break;

    case "razaosocial":
      if (value === "") return true;
      break;

    case "cnpjModal":
    case "cnpj":
      if (value === "") return true;
      if (!cnpjLib.isValid(value) && !cpfLib.isValid(value)) return true;
      break;

    default:
      return false;
  }
  return false;
};

export const masks = (name, value) => {
  let length = NaN;
  switch (name) {
    case "codigo":
      value = value.replace(/\D/gi, "");
      // value = value.slice(0, 11);

      return { name, value };

    case "cnpjModal":
    case "cnpj":
      value = value.replace(/\D/gi, "");
      value = value.slice(0, 14);

      length = value.length;

      if (length > 3 && length <= 6)
        value = value.replace(/(\d{3})(\d{1,3})/, "$1.$2");
      if (length > 6 && length <= 9)
        value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
      if (length > 9 && length <= 11)
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
      if (length > 11 && length <= 12)
        value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, "$1.$2.$3/$4");
      if (length > 12)
        value = value.replace(
          /(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/,
          "$1.$2.$3/$4-$5"
        );

      return { name, value };

    default:
      return { name, value };
  }
};
