export interface QueryableInterface<P, S extends keyof P, E extends keyof P> {
    readonly queryableInterface: unique symbol;
    readonly typeProps: P;
    readonly selectedProps: S;
    readonly expandedProps: E;
}

export interface QueryableProp<
    PropType,
    Expandable extends boolean> {
    readonly symbol: unique symbol;
    readonly propType: PropType;
    readonly expandable: Expandable;
}

export interface QueryableCompositeProp<
    PropType,
    ParentProp extends string,
    ChildProp extends string> {
    readonly symbol: unique symbol;
    readonly propType: PropType;
    readonly parentProp: ParentProp;
    readonly childProp: ChildProp;
}

export interface QueryableODataProp<
    PropType,
    ParentProp extends string> {
    readonly symbol: unique symbol;
    readonly propType: PropType;
    readonly parentProp: ParentProp;
}

export type QueryableSelectableKeys<T> = T extends (infer A)[] ? QueryableSelectableKeysImpl<A> : QueryableSelectableKeysImpl<T>;
type QueryableSelectableKeysImpl<T> =
    T extends QueryableInterface<infer P, any, infer E> ? {
        [U in keyof P]:
            P[U] extends QueryableCompositeProp<any, infer ParentProp, any> ?
                ParentProp extends E ?
                    U :
                    never :
                P[U] extends QueryableODataProp<any, any> ?
                    never :
                    P[U] extends symbol ?
                        never :
                        U;
    }[keyof P] :
    string;

export type QueryableSelect<T, K extends QueryableSelectableKeys<T>> = T extends (infer A)[] ? QueryableSelectImpl<A, K & QueryableSelectableKeys<A>>[] : QueryableSelectImpl<T, K>;
type QueryableSelectImpl<T, K extends QueryableSelectableKeys<T>> = T extends QueryableInterface<infer P, any, infer E> ? QueryableInterface<P, K & keyof P, E> : T;

export type QueryableExpandableKeys<T> = T extends (infer A)[] ? QueryableExpandableKeysImpl<A> : QueryableExpandableKeysImpl<T>;
type QueryableExpandableKeysImpl<T> =
    T extends QueryableInterface<infer P, any, any> ? {
        [U in keyof P]:
            P[U] extends QueryableProp<infer _PropType, true> ?
                U :
                never;
    }[keyof P] :
    string;

export type QueryableExpand<T, K extends QueryableExpandableKeys<T>> = T extends (infer A)[] ? QueryableExpandImpl<A, K & QueryableExpandableKeys<A>>[] : QueryableExpandImpl<T, K>;
type QueryableExpandImpl<T, K extends QueryableExpandableKeys<T>> = T extends QueryableInterface<infer P, infer S, any> ? QueryableInterface<P, S, K & keyof P> : T;

export type QueryableSelectedProps<T> = T extends (infer A)[] ? QueryableSelectedPropsImpl<A> : QueryableSelectedPropsImpl<T>;
type QueryableSelectedPropsImpl<T> =
    T extends QueryableInterface<infer P, infer S, infer E> ?
        {
            [U in keyof P]:
                P[U] extends QueryableProp<any, true> ?
                    U extends E ? U : never :
                    P[U] extends QueryableProp<any, false> ?
                        U extends S ? U : never :
                        P[U] extends QueryableODataProp<any, infer ParentProp> ?
                            ParentProp extends QueryableSelectedODataParentPropsImpl<T> ?
                                U :
                                never :
                            never;

        }[keyof P] :
        string;

type QueryableSelectedODataParentPropsImpl<T> =
    T extends QueryableInterface<infer P, infer S, infer E> ?
        {
            [U in keyof P]:
                P[U] extends QueryableProp<any, false> ?
                    never :
                    P[U] extends QueryableProp<any, true> ?
                        U extends S ?
                            U :
                            U extends E ?
                                U :
                                never :
                        never;
        }[keyof P] :
        never;

export type QueryableSelectedCompositeChildProps<T, ParentProp extends string> = T extends (infer A)[] ?
    QueryableSelectedCompositeChildPropsImpl<A, ParentProp> :
    QueryableSelectedCompositeChildPropsImpl<T, ParentProp>;
type QueryableSelectedCompositeChildPropsImpl<T, ParentProp extends string> =
    T extends QueryableInterface<infer P, infer S, infer E> ?
        {
            [U in keyof P]:
                P[U] extends QueryableCompositeProp<infer PropType, ParentProp, infer ChildProp> ?
                    ParentProp extends E ?
                        PropType extends QueryableODataProp<any, any> ?
                            ChildProp :
                            U extends S ?
                                ChildProp :
                                ParentProp extends QueryableTouchedExpandedPropsImpl<T> ?
                                    never :
                                    ChildProp :
                        never :
                    never;
        }[keyof P] :
        string;

type QueryableTouchedExpandedPropsImpl<T> =
    T extends QueryableInterface<infer P, infer S, infer E> ?
        {
            [U in keyof P]:
                P[U] extends QueryableCompositeProp<any, infer ParentProp, any> ?
                    ParentProp extends E ?
                        U extends S ?
                            ParentProp :
                            never :
                        never :
                    never;
        }[keyof P] :
        string;

export type QueryableCompositePropType<T, ParentProp extends string, ChildProp extends string> = T extends (infer A)[] ?
    QueryableCompositePropTypeImpl<A, ParentProp, ChildProp> :
    QueryableCompositePropTypeImpl<T, ParentProp, ChildProp>;
type QueryableCompositePropTypeImpl<T, ParentProp extends string, ChildProp extends string> =
    T extends QueryableInterface<infer P, any, any> ?
        {
            [U in keyof P]:
                P[U] extends QueryableCompositeProp<infer PropType, ParentProp, ChildProp> ?
                    PropType extends QueryableODataProp<infer ODataPropType, any> ?
                        ODataPropType :
                        PropType :
                    never;
        }[keyof P] :
        never;

export type QueryableGet<T> = T extends (infer A)[] ? QueryableGetImpl<A>[] : QueryableGetImpl<T>;
type QueryableGetImpl<T> =
    T extends QueryableInterface<infer P, any, any> ?
        {
            [U in (QueryableSelectedProps<T> & keyof P)]:
                P[U] extends QueryableProp<infer PropType, false> ?
                    PropType :
                    P[U] extends QueryableProp<any, true> ?
                        {
                            [V in QueryableSelectedCompositeChildProps<T, U>]: QueryableCompositePropType<T, U, V>;
                        } :
                        // tslint:disable-next-line:no-shadowed-variable
                        P[U] extends QueryableODataProp<infer PropType, any> ?
                            PropType :
                            never
        } :
        T;

export type QueryableOrderableKeys<T> = T extends (infer A)[] ? keyof A : keyof T;




type Test = QueryableInterface<{
    AllowAutomaticASPXPageIndexing: QueryableProp<boolean, false>;
    Id: QueryableProp<string, false>;
    ParentWeb: QueryableProp<any, true>;
    "ParentWeb@odata.navigationLinkUrl": QueryableODataProp<string, "ParentWeb">;
    "ParentWeb/Title": QueryableCompositeProp<string, "ParentWeb", "Title">;
    "ParentWeb/odata.editLink": QueryableCompositeProp<string, "ParentWeb", "odata.editLink">;
    "ParentWeb/odata.id": QueryableCompositeProp<string, "ParentWeb", "odata.id">;
    "ParentWeb/odata.type": QueryableCompositeProp<"SP.WebInfo", "ParentWeb", "odata.type">;
    Title: QueryableProp<string, false>;
    "odata.editLink": QueryableODataProp<string, any>;
    "odata.id": QueryableODataProp<string, any>;
    "odata.metadata": QueryableODataProp<string, any>;
    "odata.type": QueryableODataProp<"SP.Web", any>;
}, "Id" | "Title" | "ParentWeb/Title", never>;

type T0 = QueryableExpandableKeys<any>;
type T1 = QueryableExpand<Test, "ParentWeb">;
type T2 = QueryableSelect<T1, "Title">;
type T3 = QueryableGet<T2>;
