export type UserPermission = {
    // 产品
    ProductView: boolean
    ProductEdit: boolean
    ProductDelete: boolean
    ProductAdd: boolean
    ProductPlan: boolean
    ProductSeriesView: boolean
    ProductSeriesEdit: boolean
    ProductSeriesDelete: boolean
    ProductSeriesAdd: boolean
    // 库存
    StockView: boolean
    StockRecord: boolean
    StockAction: boolean
    // 顾客
    CustomerView: boolean
    CustomerEdit: boolean
    CustomerAdd: boolean
    // 系统设置
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
    StockView: false,
    StockRecord: false,
    StockAction: false,
    CustomerView: false,
    CustomerEdit: false,
    CustomerAdd: false,
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
    decimal?: boolean
}

export type TableAction = {
    name: string
    all: boolean
    ids: number[]
}