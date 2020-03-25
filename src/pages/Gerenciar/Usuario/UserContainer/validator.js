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

    case "senha":
    case "email":
      value = value.replace(/\s/, "");
      return { name, value };

    default:
      return { name, value };
  }
};
