export interface User{
    id?: string;
    name?: string;
    username?: string;
    address?: string | null;
    phoneNumber?: string | null;
    status?: number | null;
}


export interface GetData  {
    title:string
    handlingModal?:(action:boolean, type:string, data:User)=>void,
    dataDetail?:User
}

export interface SetFiltering  {
    globalFilter?:string
    startPage:number
    limitPage:number
}