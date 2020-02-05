export const masks = (name, value) => {
  let length = NaN;
  switch (name) {
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
