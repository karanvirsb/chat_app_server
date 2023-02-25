function DBUpdateStr(args: { [key: string]: any }) {
  const updateArr: string[] = [];
}

function DBUpdateStrBroker(key: string, value: unknown) {
  if (typeof value === "string") {
    return StringToDBString(key, value);
  } else if (typeof value === "boolean") {
    return BooleanToDBBoolean(key, `${value}`);
  } else if (typeof value === "number") {
    return NumberToDBNumber(key, value);
  } else if (value instanceof Date) {
    return DateToDBDate(key, value);
  } else if (value === null) {
    return NullToDBNull(key);
  } else {
    return Array.isArray(value) ? ArrayToDBArray(key, value) : "";
  }
}

// String -> 'add'
export function StringToDBString(key: string, value: string): string {
  return `'${key}' = "${value}"`;
}
// Date -> to_timestamp(date.getTime()/1000)
export function DateToDBDate(key: string, value: Date): string {
  return `'${key}' = to_timestamp(${value.getTime()}/1000)`;
}
// Number -> add
export function NumberToDBNumber(key: string, value: number): string {
  return `'${key}' = ${value}`;
}
// Boolean -> uppercase
export function BooleanToDBBoolean(key: string, value: string): string {
  // true -> TRUE
  // false -> FALSE
  return `'${key}' = ${value.toUpperCase()}`;
}
// Array -> '{join(", ")}'
export function ArrayToDBArray(key: string, value: unknown[]): string {
  const arrToStringArr = value.map((value) => `${value}`);
  return `'${key}' = '{${value.join(", ")}}'`;
}
// Null -> NULL
export function NullToDBNull(key: string): string {
  return `'${key}' = NULL`;
}
