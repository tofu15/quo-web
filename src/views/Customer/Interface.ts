export type Cus = {
    cid: number
    cname: string
    ctype: "新規見込み顧客" | "顧客" | ""
    address: string
    email: string
    zip: string
    tel: string
    fax: string
    contact: string
    ename: string
    csource: string
    ftime: string
}

export type CusPost = {
    cname: string
    address: string
    email: string
    zip: string
    tel: string
    fax: string
    contact: string
    csource: string
    ftime: string
}
