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