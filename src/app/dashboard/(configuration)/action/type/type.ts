export interface Action{
    id?: string;
    name?: string;
    status?: number | null;
}

export interface GetData  {
    title:string
    handlingModal?:(action:boolean, type:string, data:Action)=>void,
    dataDetail?:Action
}

export interface SetFiltering  {
    globalFilter?:string
    startPage:number
    limitPage:number
}

// Definisikan interface jika Anda ingin tipe data body yang jelas (Opsional)
export interface DataAdd  {
    name:string
}  

export interface DataEdit  {
    name:string
    id:string
    updated_by?:string
}  

export interface DataDelete {
    id:string
    status?:string
}  
