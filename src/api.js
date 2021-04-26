const url = "https://api.coincap.io/v2/assets?limit=20";

function getAssets() {
  return fetch(`${url}`) //Nos trae 20 critpomendas
    .then((res) => res.json()) //Queremos la respuesta en formato json
    .then((res) => res.data);
}

//Funcion para que nos de los detalles de cada criptomoneda
function getAsset(coin) {
  return fetch(`https://api.coincap.io/v2/assets/${coin}`)
    .then((res) => res.json())
    .then((res) => res.data);
}

//Obteniendo datos para hacer calculos
function getAssetHistory(coin) {
  const now = new Date();
  // Nos da la hora y fecha de este momento
  const end = now.getTime();
  // Se guarda en end la hora de este momento
  // getTime: devuelve el valor numerico de la hora especificada en Date
  now.setDate(now.getDate() - 1);
  // Cambiamos el dpia de hoy, por el día de ayer
  // setDate: Cambia el dia que especificamos
  // getDate: Nos da el día del mes de hoy
  const start = now.getTime();
  //Gurdamos en start la hora de hoy menos un día.

  return (
    fetch(
      `https://api.coincap.io/v2/assets/${coin}/history?interval=h1&start=${start}&end=${end}`
    )
      // Obtenemos solamente 24 valores correspondientes al dia de ayer
      .then((res) => res.json())
      .then((res) => res.data)
  );
}

function getMarkets(coin) {
  return (
    fetch(`https://api.coincap.io/v2/assets/${coin}/markets?limit=5`)
      // Nos da una lista de mercados para una monede en particular
      // Agregamos un limit para las 5 mejores ofertas
      .then((res) => res.json())
      .then((res) => res.data)
  );
}

// Esta funcion nos sirve para obtener las urls de cada moneda
function getExchange(id) {
  // Nos devolvera un Exchange a partir de un ID y ese Id probablemente venga desde el endpoint de Marckets
  return fetch(`https://api.coincap.io/v2/exchanges/${id}`)
    .then((res) => res.json())
    .then((res) => res.data);
}

export default {
  getAssets,
  getAsset,
  getAssetHistory,
  getMarkets,
  getExchange,
};
