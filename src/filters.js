import numeral from "numeral";
// Como es una libreria no se pone el @ o la direccion.

const dollarFilter = function (value) {
  if (!value) {
    return "$ 0.00";
  }

  return numeral(value).format("($ 0.00 a)");
};

const porcentFilter = function (value) {
  if (!value) {
    return "0%";
  }

  return `${Number(value).toFixed(2)}%`;
  //Numbers: Para convertilo a numero en caso venga en String
  //toFixed: Para mostrar 2 decimales

  //return numeral(value).format(`${Number(value).toFixed(2)}%`)
};

export { dollarFilter };
export { porcentFilter };
