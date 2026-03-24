export interface UserListType {
    id?: string
    name: string
    password?: string
    nickName: string
    role: string
    isAdmin: number | string
    status?: number | string
    token: string
    info?: {
        name: string
    }
    loading?: boolean
}

export interface ListPageType {
    page: number
    pageSize: number
    category?: string
}

export interface InsertSucces {
    success: boolean
    lastInsertRowid: number
    changes: number
}

export interface User {
    id: string
    userid: string
    firstName: string
    lastName: string
    email: string
}

export interface QueryResult<T> {
    rows: T
    success: boolean
}

export interface Article {
    id?: number
    title: string
    content: string
    date: string
    author: string
    category: string
    views?: number
}

export interface ArticleUpdate {
    id?: number
    title: string
    content: string
    date: string
    author: string
    category: string
}

export interface ArchiveType {
    c_id: number
    c_title: string
    c_intro?: any
    c_content: string
    c_cateid: number
    c_allcateid: string
    c_group: number
    c_type: number
    c_pass: string
    c_img: string
    c_down: string
    c_free: string
    c_cb: number
    c_view: number
    c_posttime: string
    c_lasttime?: any
    c_user: string
    c_userid: number
    c_isshow: number
    c_istop: number
    c_iscatetop: number
    c_favnum: number
    c_upnum: number
    c_downnum: number
    c_disk?: any
    c_buynum: number
    c_errnum: number
    c_last: string
    c_spider: number
}
