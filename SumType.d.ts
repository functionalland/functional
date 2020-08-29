declare class TypeRep {
    is(container: SumTypeRep): boolean
    toString(): string
    static is(container: SumTypeRep): boolean
    static toString(): string
}

declare class SumTypeRep {
    from(propertyCollection: Record<string, any>): Function
    is(container: SumTypeRep): boolean
    toString(): string
    static is(container: SumTypeRep): boolean
    static toString(): string
}

export function factorizeType <T extends TypeRep>(typeName: string, propertyNameList: string[]): T;
export function factorizeSumType <T extends SumTypeRep>(typeName: string, propertyNameListByTag: Record<string, string[]>): T;
