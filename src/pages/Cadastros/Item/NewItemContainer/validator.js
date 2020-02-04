import * as cnpjLib from "@fnando/cnpj";
import * as cpfLib from "@fnando/cpf";

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
