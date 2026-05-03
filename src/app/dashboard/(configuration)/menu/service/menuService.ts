import prisma  from '@/lib/prisma';
import {encryptAES, decryptAES}  from '@/lib/crypto';
import type {DataDelete, DataEdit, DataAdd,  SetFiltering, Action} from "../type/type"
import type {MenuItem} from "@/lib/type/type"

export const menuService = {
    // SELECT: Mengambil data
    async getAllData(paramFitering:SetFiltering) {      
         try {

            const findMenu = await prisma.menu.findMany({
                        where: {status:1},
                        orderBy:{number:"asc"}
                    });
                    
            const menuParent:MenuItem[]=[]
            const menuChild:MenuItem[][]=[]
            findMenu.forEach(element => {

                if(element.parent == null)
                {
                    menuParent.push({name:element.name,parentId:String(element.parent),id:Number(element.id),slug:element.slug??""})
                }else
                {
                    if (!menuChild[Number(element.parent)]) {
                        menuChild[Number(element.parent)] = [];
                    }
                    menuChild[Number(element.parent)].push({name:element.name,parentId:String(element.parent),id:Number(element.id),slug:element.slug??""})
                }

            });

            const allMenu:MenuItem[]=[]
            menuParent.forEach(element => {

                let children:MenuItem[]=[]
                if (menuChild[element.id]) 
                {
                    children = this.getChild(String(element.id), menuChild)
                }

                allMenu.push({name: element.name, parentId: element.parentId, id: element.id, child: children, slug:element.slug})
                
            });
            const getDataAction = await this.getDataAction();
            return {data:allMenu , dataAction:getDataAction} 


        } catch (error) {
            console.error("Gagal Simpan (Rollback terjadi):", error);
            throw new Error(JSON.stringify([error || "Terjadi kesalahan saat update action"]));
        }
    },

    getChild(parentId:string, dataChild:MenuItem[][]){
        const allMenu:MenuItem[]=[]
        dataChild[Number(parentId)].forEach(element => {

            let children:MenuItem[]=[]
            if (dataChild[element.id]) 
            {
                children = this.getChild(String(element.id), dataChild)
            }

            allMenu.push({name: element.name, parentId: element.parentId, id: element.id, child: children, slug:element.slug})
            
        });
        return allMenu
    },

    async getDataAction(){
        const data:Action[] = []
        try {

            const findAction = await prisma.action.findMany({
                        where: {status:1},
                        orderBy:{name:"asc"}
                    });

            findAction.forEach(element=>{
                data.push({id:encryptAES(element.id), name:element.name}) 
            })
                                
            return data

        } catch (error) {
            console.error("Gagal Simpan (Rollback terjadi):", error);
            return data;
        }
    },    

    async actionAdd(body:DataAdd) {
        try {
        return await prisma.$transaction(async (tx) => {            
            // 1. Simpan data ke tabel User
            const newUser = await tx.action.create({
                data: {
                name: body.name,
                status: 1,
                created_on:new Date(),
                created_by: "admin",
                },
            });

            return newUser;
        });

        } catch (error: any) {
        console.error("Gagal Simpan (Rollback terjadi):", error.message);
        throw new Error(error.message || "Terjadi kesalahan saat menambah action");
    }

    }   ,
   async actionEdit(body:DataEdit) {
   
        try {
            const id = await decryptAES(String(body.id));
            if (!id) {
            throw new Error(JSON.stringify(["ID gagal didekripsi (Hasil Null)"]));
            }
            return await prisma.$transaction(async (tx) => {            
                // 1. Simpan data
                const id = await decryptAES(body.id)
                const deleteUser = await tx.action.update({
                    where: { id: Number(id) },
                    data: {             
                    name: body.name,
                    updated_by: body.updated_by,
                    updated_on: new Date(),
                    },
                });
            return {deleteUser};
        });

        } catch (error: any) {
        console.error("Gagal Simpan (Rollback terjadi):", error.message);
        throw new Error(JSON.stringify([error.message || "Terjadi kesalahan saat update action"]));
    }

    }   ,   
    async actionUpdateStatus(body:DataDelete) {
        try {
            const id = await decryptAES(String(body.id));
            if (!id) {
            throw new Error(JSON.stringify(["ID gagal didekripsi (Hasil Null)"]));
            }
            return await prisma.$transaction(async (tx) => {            
                // 1. Simpan data ke tabel User
                const id = await decryptAES(body.id)
                const deleteUser = await tx.action.update({
                    where: { id: Number(id) },
                    data: {             
                    status: Number(body.status),
                    updated_by: "admin",
                    updated_on: new Date(),
                    },
                });
            return deleteUser;

        });

        } catch (error: any) {
        console.error("Gagal Simpan (Rollback terjadi):", error.message);
        throw new Error(JSON.stringify([error.message || "Terjadi kesalahan saat menambah user"]));
    }

    }   
};