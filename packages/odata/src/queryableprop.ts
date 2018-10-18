export interface QueryableInterface {
    readonly queryableInterface: unique symbol;
}

export interface QueryableProp<
    PropType,
    Expandable extends boolean,
    DefaultSelected extends boolean,
    Selected extends boolean,
    Expanded extends boolean> {
    readonly symbol: unique symbol;
    readonly propType: PropType;
    readonly expandable: Expandable;
    readonly defaultSelected: DefaultSelected;
    readonly selected: Selected;
    readonly expanded: Expanded;
}

export interface QueryableCompositeProp<
    PropType,
    ParentProp extends string,
    ChildProp extends string,
    DefaultSelected extends boolean,
    Selected extends boolean,
    Expanded extends boolean> {
    readonly symbol: unique symbol;
    readonly propType: PropType;
    readonly parentProp: ParentProp;
    readonly childProp: ChildProp;
    readonly defaultSelected: DefaultSelected;
    readonly selected: Selected;
    readonly expanded: Expanded;
}

export type QueryableSelectableKeys<T> = T extends (infer A)[] ? QueryableSelectableKeysImpl<A> : QueryableSelectableKeysImpl<T>;
type QueryableSelectableKeysImpl<T> = {
    [U in keyof T]:
        T[U] extends QueryableCompositeProp<infer _PropType, infer _ParentProp, infer _ChildProp, infer _DefaultSelected, infer _Selected, false> ?
            never :
            T[U] extends symbol ?
                never :
                U;
}[keyof T];

export type QueryableSelect<T, K extends QueryableSelectableKeys<T>> = T extends (infer A)[] ? QueryableSelectImpl<A, K & QueryableSelectableKeys<A>>[] : QueryableSelectImpl<T, K>;
type QueryableSelectImpl<T, K extends QueryableSelectableKeys<T>> = T extends QueryableInterface ? {
    [U in keyof T]:
        U extends K ?
            T[U] extends QueryableProp<infer PropType, infer Expandable, infer _DefaultSelected, infer _Selected, infer Expanded> ?
                QueryableProp<PropType, Expandable, false, true, Expanded> :
                T[U] extends QueryableCompositeProp<infer PropType, infer ParentProp, infer ChildProp, infer _DefaultSelected, infer _Selected, true> ?
                    QueryableCompositeProp<PropType, ParentProp, ChildProp, false, true, true> :
                    T[U] :
            T[U];
} : T;

export type QueryableExpandableKeys<T> = T extends (infer A)[] ? QueryableExpandableKeysImpl<A> : QueryableExpandableKeysImpl<T>;
type QueryableExpandableKeysImpl<T> = {
    [U in keyof T]:
        T[U] extends QueryableProp<infer _PropType, false, infer _DefaultSelected, infer _Selected, infer _Expanded> ?
            never:
            T[U] extends QueryableCompositeProp<infer _PropType, infer _ParentProp, infer _ChildProp, infer _DefaultSelected, infer _Selected, infer _Expanded> ?
                never :
                T[U] extends symbol ?
                    never :
                    U;
}[keyof T];

export type QueryableExpand<T, K extends QueryableExpandableKeys<T>> = T extends (infer A)[] ? QueryableExpandImpl<A, K & QueryableExpandableKeys<A>>[] : QueryableExpandImpl<T, K>;
type QueryableExpandImpl<T, K extends QueryableExpandableKeys<T>> = T extends QueryableInterface ? {
    [U in keyof T]:
        U extends K ?
            T[U] extends QueryableProp<infer PropType, true, infer DefaultSelected, infer Selected, infer _Expanded> ?
                QueryableProp<PropType, true, DefaultSelected, Selected, true> :
                T[U] :
            T[U] extends QueryableCompositeProp<infer PropType, infer ParentProp, infer ChildProp, infer DefaultSelected, infer Selected, infer _Expanded> ?
                ParentProp extends K ?
                    QueryableCompositeProp<PropType, ParentProp, ChildProp, DefaultSelected, Selected, true> :
                    T[U] :
                T[U];
} : T;

export type QueryableSelectedProps<T> = T extends (infer A)[] ? QueryableSelectedPropsImpl<A> : QueryableSelectedPropsImpl<T>;
type QueryableSelectedPropsImpl<T> = {
    [U in keyof T]:
        U extends string ?
            T[U] extends QueryableProp<infer _PropType, infer _Expandable, true, infer _Selected, infer _Expanded> ?
                U :
                T[U] extends QueryableProp<infer _PropType, infer _Expandable, infer _DefaultSelected, true, infer _Expanded> ?
                    U :
                    T[U] extends QueryableCompositeProp<infer _PropType, infer _ParentProp, infer _ChildProp, infer _DefaultSelected, infer _Selected, infer _Expanded> ?
                        never :
                        T[U] extends symbol ?
                            never :
                            U :
            never;
}[keyof T];

export type QueryableSelectedCompositeChildProps<T, ParentProp extends string> = T extends (infer A)[] ?
    QueryableSelectedCompositeChildPropsImpl<A, ParentProp> :
    QueryableSelectedCompositeChildPropsImpl<T, ParentProp>;
type QueryableSelectedCompositeChildPropsImpl<T, ParentProp extends string> = {
    [U in keyof T]:
        T[U] extends QueryableCompositeProp<infer _PropType, ParentProp, infer ChildProp, true, infer _Selected, true> ?
            ChildProp :
            T[U] extends QueryableCompositeProp<infer _PropType, ParentProp, infer ChildProp, false, true, true> ?
                ChildProp :
                never;
}[keyof T];

export type QueryableCompositePropType<T, ParentProp extends string, ChildProp extends string> = T extends (infer A)[] ?
    QueryableCompositePropTypeImpl<A, ParentProp, ChildProp> :
    QueryableCompositePropTypeImpl<T, ParentProp, ChildProp>;
type QueryableCompositePropTypeImpl<T, ParentProp extends string, ChildProp extends string> = {
    [U in keyof T]:
        T[U] extends QueryableCompositeProp<infer PropType, ParentProp, ChildProp, infer _DefaultSelected, infer _Selected, infer _Expandable> ?
            PropType :
            never;
}[keyof T];

export type QueryableGet<T> =
    T extends QueryableInterface ?
        (T extends (infer A)[] ? QueryableGetImpl<A>[] : QueryableGetImpl<T>) :
        T;
type QueryableGetImpl<T> = {
    [U in QueryableSelectedProps<T>]:
        T[U] extends QueryableProp<infer PropType, false, infer _DefaultSelected, infer _Selected, infer _Expanded> ?
            PropType :
            T[U] extends QueryableProp<infer PropType, true, infer _DefaultSelected, infer _Selected, false> ?
                PropType :
                T[U] extends QueryableProp<infer PropType, true, infer _DefaultSelected, infer _Selected, true> ?
                    {
                        [V in QueryableSelectedCompositeChildProps<T, U>]: QueryableCompositePropType<T, U, V>;
                    } & PropType :
                    T[U]
};

export type QueryableOrderableKeys<T> = T extends (infer A)[] ? keyof A : keyof T;
