export function getEnumValues(anyEnum: object) {
  return Object.values(anyEnum).filter((el) => !isNaN(Number(el)));
}
