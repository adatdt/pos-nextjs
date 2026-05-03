export interface Action{
    id?: string;
    name?: string;
    status?: number | null;
}

export interface MenuItem {
    name: string;
    parentId: string;
    id: number;
    child?: MenuItem[]; // Gunakan MenuItem[] agar bisa berisi data
    slug?: string;
}

export interface GetData  {
    title:string
    handlingModal?: (action:boolean, data?:MenuItem) =>void,
    dataDetail?:MenuItem
    dataAction?:Action[]
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
