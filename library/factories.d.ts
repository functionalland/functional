export interface TypeRepresentationPrototype {
  from(propertyCollection: Record<string, any>): this;
  is<Z>(container: Z): boolean;
  toString(): string;
}

export interface SumTypeRepresentationPrototype {
  from(propertyCollection: Record<string, any>): this;
  fold(f: Record<string, Function>): this;
  is<Z>(container: Z): boolean;
  toString(): string;
}

export function factorizeType <T>(
  typeName: string,
  propertyNameList: string[],
): T;

export function factorizeSumType <T>(
  typeName: string,
  propertyNameListByTag: Record<string, string[]>
): T;
