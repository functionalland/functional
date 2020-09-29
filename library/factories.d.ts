export interface TypeRepresentationPrototype<T> {
  from(propertyCollection: Record<string, any>): T;
  is<Z>(container: Z): boolean;
  toString(): string;
}

export interface SumTypeRepresentationPrototype<T> {
  from(propertyCollection: Record<string, any>): T;
  is<Z>(container: Z): boolean;
  toString(): string;
}

export function factorizeType<T>(
  typeName: string,
  propertyNameList: string[],
): T;

export function factorizeSumType<T>(
  typeName: string,
  propertyNameListByTag: Record<string, string[]>,
): T;
