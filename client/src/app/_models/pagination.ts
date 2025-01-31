export interface QueryPagination {
    pageSize?: number,
    currentPage?: number,
    length?: number
}
export interface UserQueryPagination extends QueryPagination {
    username?: string
    min_age?: number
    max_age?: number
    looking_for?: string
    gender?: string
}
export interface Paginator<T, U> {
    pagination: T,
    items: U[]
}

export const defult_pageSizeOption = [2, 5, 10, 20, 50, 100]
export const defult_paginator = {
    pagination: {
        pageSize: 5,
        currentPage: 1,
        length: 1
    },
    items: []
}
