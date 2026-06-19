export interface Action{
    id?: string;
    name?: string;
    status?: number | null;
}

export interface MenuItem {
    name: string;
    parentId: string;
    id: number;
    parentName?: string;
    child?: MenuItem[]; // Gunakan MenuItem[] agar bisa berisi data
    slug?: string;
    number?: number;
}

export interface GetData  {
    title:string
    handlingModal?: (action:boolean, data?:MenuItem) =>void,
    dataDetail?:MenuItem
    dataAction?:{value:string; label:string}[]
    dataGrid?:MenuItem[]
}

export interface SetFiltering  {
    globalFilter?:string
    startPage:number
    limitPage:number
}

// Definisikan interface jika Anda ingin tipe data body yang jelas (Opsional)
export interface DataAdd  {
    name:string
    slug?:string|null,
    updated_by?:string
    dataAction?:{value:string; label:string}[],
    parentId?:string
    number?:number
}  

export interface DataEdit  {
    name:string
    id:string
    slug?:string|null,
    updated_by?:string
    dataAction?:{value:string; label:string}[],
    parentId?:string
    number?:number
}  

export interface DataDelete {
    id:string
    status?:string
}  
