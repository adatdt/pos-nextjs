import prisma  from '@/lib/prisma';
import {encryptAES, decryptAES}  from '@/lib/crypto';
import type {DataDelete, DataEdit, DataAdd,  SetFiltering, Action} from "../type/type"
import type {MenuItem} from "@/lib/type/type"

interface MenuDictionary {
  [id: string]: string;
}

export const menuService = {
    // SELECT: Mengambil data
    async getAllData(paramFitering:SetFiltering) {      
         try {

            const findMenu = await prisma.menu.findMany({
                        where: {status:1},
                        orderBy:{number:"asc"}
                    });

            const dataParent: MenuDictionary = findMenu.reduce((acc, item) => {
                acc[String(item.id)] = item.name; // Menggunakan item.id sebagai key dan item.name sebagai value
                return acc;
                }, {} as MenuDictionary);
                    
            const menuParent:MenuItem[]=[]
            const menuChild:MenuItem[][]=[]
            findMenu.forEach(element => {
                
                if(element.parent == null)
                {
                    menuParent.push({name:element.name,parentId:String(element.parent),id:Number(element.id),slug:element.slug??"", parentName:"",number:element.number})
                }else
                {
                    if (!menuChild[Number(element.parent)]) {
                        menuChild[Number(element.parent)] = [];
                    }
                    const parentName = dataParent[String(element.parent)];
                    menuChild[Number(element.parent)].push({name:element.name,parentId:String(element.parent),id:Number(element.id),slug:element.slug??"", parentName:parentName,number:element.number})
                }

            });

            const allMenu:MenuItem[]=[]
            menuParent.forEach(element => {

                let children:MenuItem[]=[]
                if (menuChild[element.id]) 
                {
                    children = this.getChild(String(element.id), menuChild)
                }

                allMenu.push({name: element.name, parentId: element.parentId, id: element.id, child: children, slug:element.slug, parentName:element.parentName,number:element.number})
                
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

            allMenu.push({name: element.name, parentId: element.parentId, id: element.id, child: children, slug:element.slug, parentName:element.parentName,number:element.number})
            
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

    async getDataPrivilage(menu_id:string){
        try {

            const getId =await  decryptAES(menu_id)
            const result = await prisma.$queryRaw<{action_id:number; name:string}[]>`
                SELECT 
                    p.action_id,
                    a.name
                FROM master.menu_detail p
                LEFT join master.action a on p.action_id = a.id 
                WHERE p.status not in (-5) 
                AND p.menu_id = ${getId}
            `;
            
            const data = result.map((element) => ({
                action_id: encryptAES(element.action_id),
                name: element.name,
            }));   

            return data

        } catch (error) {
            console.error("Gagal ambil data:", error);
            return [];
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
            const parentId = body.parentId
            if (!id) {
                throw new Error(JSON.stringify(["ID gagal didekripsi (Hasil Null)"]));
            }

            body.dataAction?.forEach( async(element) => {
                const valueId = await decryptAES(element.value);
                 if (!valueId) {
                    throw new Error(JSON.stringify(["ID Value gagal didekripsi (Hasil Null)"]));
                }                
            });
            let parentIdDec = ''
            if(parentId !=='')
            {
                 parentIdDec = await decryptAES(String(parentId));
                 if (!parentIdDec) {
                    throw new Error(JSON.stringify(["ID Parent gagal didekripsi (Hasil Null)"]));
                }
            }
           
            return await prisma.$transaction(async (tx) => {            
                // 1. Dekripsi ID utama
                const id = await decryptAES(body.id);
                const menuId = Number(id);

                const update = await tx.menu.update({
                    where: { id: menuId },
                    data: {             
                        name: body.name,
                        number: body.number,
                        parent: parentIdDec ? Number(parentIdDec) : null,
                        updated_by: body.updated_by,
                        updated_on: new Date(),
                    },
                });
                
                // 2. Gunakan FOR...OF agar await berfungsi dengan benar
                if (body.dataAction) {
                    const idmenuDetail =[];
                    for (const element of body.dataAction) {
                        const actionIdStr = await decryptAES(element.value);
                        const actionId = Number(actionIdStr);

                        // PENTING: Gunakan 'tx', bukan 'prisma' di dalam transaksi
                        const findPriv = await tx.menu_detail.findFirst({
                            where: {
                                status: { notIn: [-5] },
                                menu_id: menuId,
                                action_id: actionId 
                            }
                        });
                       

                        if (findPriv) {
                            await tx.menu_detail.update({
                                where: { id: findPriv.id },
                                data: {             
                                    status: 1,
                                    updated_by: body.updated_by,
                                    updated_on: new Date(),
                                },
                            });
                             idmenuDetail.push(findPriv.id)
                        } else {
                            const newData = await tx.menu_detail.create({
                                data: {
                                    menu_id: menuId,
                                    action_id: actionId,
                                    status: 1,
                                    created_on: new Date(),
                                    created_by: body.updated_by,
                                },
                            });
                            idmenuDetail.push(newData.id)
                        }
                    }

                    await tx.menu_detail.updateMany({
                        where: { id:{notIn:[...idmenuDetail]}, status:{not:-5}, menu_id: menuId},
                        data: {             
                            status: -5,
                            updated_by: body.updated_by,
                            updated_on: new Date(),
                        },
                    });
                }
                else
                {                    
                    await tx.menu_detail.updateMany({
                        where: { menu_id: menuId, status:{not:-5} },
                        data: {             
                            status: -5,
                            updated_by: body.updated_by,
                            updated_on: new Date(),
                        },
                    });
                }

                return { update };
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