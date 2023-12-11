type CapitalizeFirstLetter<S extends string> = S extends `${infer First}${infer Rest}` ? `${Uppercase<First>}${Rest}` : S;

export type PrefixType<Prefix extends string, T extends Record<string, any>> = {
    [K in keyof T as `${Prefix}${CapitalizeFirstLetter<K & string>}`]: T[K]
};

type LowercaseFirstChar<S extends string> = S extends `${infer F}${infer R}` ? `${Lowercase<F>}${R}` : S;
type WithoutPrefix<P extends string, T> = {
  [K in keyof T as K extends `${P}${infer S}` ? LowercaseFirstChar<S> : never]: T[K]
};

export function getPrefixProps<P extends string, T extends Record<string, any>>(
  prefix: P, 
  props: T
): Partial<WithoutPrefix<P, T>> {
  const result: Partial<Record<string, any>> = {};
  const prefixLength = prefix.length;

  for (const key in props) {
    if (props.hasOwnProperty(key) && key.startsWith(prefix)) {
      const newKey = key.charAt(prefixLength).toLowerCase() + key.slice(prefixLength + 1);
      result[newKey] = props[key];
    }
  }

  return result as Partial<WithoutPrefix<P, T>>;
}
