export interface DataGrid{
    id?: string;
    name?: string;
    status?: number | null;
}

export interface GetData  {
    title:string
    handlingModal?:(action:boolean, type:string, data:DataGrid)=>void,
    dataDetail?:DataGrid
}

export interface SetFiltering  {
    group?:string
   
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

export interface MenuData {
    id:bigint
    name?:string
    action_id?:number
    menu_id?:number
    action_name?:string
}  

export interface Privilege {
    menu_id:number|bigint
    action_id:number|bigint
    group_id:number|bigint
}  

export interface MenuActionPrivilege {
  action_id: string;
  isChecked: boolean;
  action_name: string; // Mengunci nama aksi bawaan
}

// 2. Definisikan tipe untuk objek item menu utama
export interface MenuItem {
  id: string;
  name: string;
  action: MenuActionPrivilege[];
}

