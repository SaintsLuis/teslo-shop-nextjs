// Peso Dominicano
// export const currencyFormat = (value: number) => {
//   return new Intl.NumberFormat('es-DO', {
//     style: 'currency',
//     currency: 'DOP',
//     currencyDisplay: 'symbol',
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(value)
// }

// Dolar
export const currencyFormat = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}
