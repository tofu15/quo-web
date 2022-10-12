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
    CustomerViewAll: boolean
    CustomerViewSelf: boolean
    CustomerEditAll: boolean
    CustomerEditSelf: boolean
    CustomerAdd: boolean
    // 报价单
    QuoteSelf: boolean
    QuoteView: boolean
    QuoteAuditFirst: boolean
    quoteAuditSecond: boolean
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
    CustomerViewAll: false,
    CustomerViewSelf: false,
    CustomerEditAll: false,
    CustomerEditSelf: false,
    CustomerAdd: false,
    QuoteSelf: false,
    QuoteView: false,
    QuoteAuditFirst: false,
    quoteAuditSecond: false,
    SystemSettings: false
}

export type TableProps = {
    data: any[]
    headers: TableHeader[]
    actions: TableAction[]
}

export type TableHeader = {
    name: string
    type: string
    decimal?: boolean
}

export type TableAction = {
    name: 'delete' | 'export' | 'view' | 'edit' | 'reset' | 'stock'
    all: boolean
    ids: number[]
}