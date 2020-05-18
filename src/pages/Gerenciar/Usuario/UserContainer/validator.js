export const validator = (name, value) => {
  switch (name) {
    case "email":
      // eslint-disable-next-line no-useless-escape
      if (!/^[\w_\-\.]+@[\w_\-\.]{2,}\.[\w]{2,}(\.[\w])?/.test(value))
        return true;
      break;

    case "nome":
      if (value === "") return true;
      break;

    case "senha":
    case "confirmarSenha":
      if (value === "") return true;
      if (value.length < 5) return true;
      break;

    case "telefone":
      if (value === "") return true;
      value = value.replace(/\D/gi, "");
      if (value.length < 10 || value.length > 11) return true;
      break;

    default:
      return false;
  }
  return false;
};

export const masks = (name, value) => {
  switch (name) {
    case "telefone":
      value = value.replace(/\D/gi, "");
      value = value.slice(0, 11);

      const length = value.length;

      if (length > 2 && length <= 6)
        value = value.replace(/(\d{2})(\d{4})?/, "($1) $2");

      if (length > 6 && length < 11)
        value = value.replace(/(\d{2})(\d{4})(\d{1,4})/, "($1) $2-$3");

      if (length === 11)
        value = value.replace(/(\d{2})(\d{5})(\d{1,4})/, "($1) $2-$3");

      return { name, value };

    case "nome":
      value = value.replace(/\W/gi, "");
      value = value.slice(0, 30);

      return { name, value };

    case "senha":
    case "confirmarSenha":
      value = value.replace(/\W/gi, "");
      value = value.slice(0, 10);

      return { name, value };

    case "descricao":
      value = value.replace(/\W/gi, "");
      value = value.slice(0, 50);

      return { name, value };
    case "email":
      value = value.replace(/\s/, "");
      value = value.slice(0, 40);
      return { name, value };

    case "equacao":
      value = value.replace(/[^(X|\d|*|/|\-\.|+|(|)\s))]/gi, "");

      return { name, value };

    case "grupo":
      value = value.replace(/\W/, "");
      value = value.slice(0, 40);
      return { name, value };

    default:
      return { name, value };
  }
};
