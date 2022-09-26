export type UserPermission = {
    ProductView: boolean
    ProductEdit: boolean
    ProductDelete: boolean
    ProductAdd: boolean
    ProductPlan: boolean
    ProductSeriesView: boolean
    ProductSeriesEdit: boolean
    ProductSeriesDelete: boolean
    ProductSeriesAdd: boolean
    SystemSettings: boolean
}

export const DefaultUserPermission: UserPermission = {
    ProductView: false,
    ProductEdit: false,
    ProductDelete: false,
    ProductAdd: false,
    ProductPlan: false,
    ProductSeriesView: false,
    ProductSeriesEdit: false,
    ProductSeriesDelete: false,
    ProductSeriesAdd: false,
    SystemSettings: false
}

export type TableProps = {
    data: any[]
    headers: TableHeader[]
    actions: TableAction[]
}

export type TablePropsWithoutAction = {
    data: any[]
    headers: TableHeader[]
}

export type TableHeader = {
    name: string
    type: string
}

export type TableAction = {
    name: string
    all: boolean
    ids: number[]
}