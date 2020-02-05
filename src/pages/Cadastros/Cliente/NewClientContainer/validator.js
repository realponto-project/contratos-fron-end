import * as cnpjLib from "@fnando/cnpj";
import * as cpfLib from "@fnando/cpf";

export const validator = (name, value) => {
  switch (name) {
    case "emailContato":
      // eslint-disable-next-line no-useless-escape
      if (!/^[\w_\-\.]+@[\w_\-\.]{2,}\.[\w]{2,}(\.[\w])?/.test(value))
        return true;
      break;

    case "nome":
    case "grupo":
    case "codigo":
    case "nomeContato":
    case "rua":
    case "bairro":
    case "cidade":
    case "uf":
      if (value === "") return true;
      break;

    case "cep":
      if (value === "") return true;
      if (value.replace(/\D/gi, "").length !== 8) return true;
      break;

    case "celularContato":
      if (value === "") return true;
      value = value.replace(/\D/gi, "");
      if (value.length !== 11) return true;
      break;

    case "telefoneContato":
      if (value === "") return true;
      value = value.replace(/\D/gi, "");
      if (value.length !== 10) return true;
      break;

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
    case "telefoneContato":
      value = value.replace(/\D/gi, "");
      value = value.slice(0, 10);

      length = value.length;

      if (length > 2 && length <= 6)
        value = value.replace(/(\d{2})(\d{4})?/, "($1) $2");

      if (length > 6)
        value = value.replace(/(\d{2})(\d{4})(\d{1,4})/, "($1) $2-$3");
      return { name, value };

    case "celularContato":
      value = value.replace(/\D/gi, "");
      value = value.slice(0, 11);

      length = value.length;

      if (length > 2 && length <= 7)
        value = value.replace(/(\d{2})(\d{4})?/, "($1) $2");

      if (length > 7)
        value = value.replace(/(\d{2})(\d{5})(\d{1,4})/, "($1) $2-$3");

      return { name, value };

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

    case "uf":
      value = value.replace(/\W|\d/g, "");
      value = value.slice(0, 2);
      value = value.toUpperCase();

      return { name, value };

    case "cep":
      value = value.replace(/\D/gi, "");
      value = value.slice(0, 8);

      if (value.length > 5) value = value.replace(/(\d{5})(\d{1,3})/, "$1-$2");

      return { name, value };
    default:
      return { name, value };
  }
};
