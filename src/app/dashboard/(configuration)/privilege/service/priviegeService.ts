import prisma  from '@/lib/prisma';
import {encryptAES, decryptAES}  from '@/lib/crypto';
import type {DataDelete, DataEdit, DataAdd, MenuData, SetFiltering,Privilege} from "../type/type"

const moduleName = " group";
export const groupService = {
    // SELECT: Mengambil data
    async getAllData(paramFitering:SetFiltering) {      


        const groupId = await decryptAES(paramFitering.group ?? "")
       let privileges: Privilege[] = [];

        if (groupId && groupId !== "") {
            // Jalankan query jika groupId valid (Gunakan PostgreSQL param $1)
            const rawData = await prisma.$queryRawUnsafe<any[]>(`
                SELECT 
                    p.menu_id,
                    p.action_id,
                    p.group_id
                FROM master.privilege p 
                JOIN master.menu_detail md ON p.menu_id = md.menu_id 
                WHERE md.status != '-5' AND p.group_id = $1 and p.status = 1
            `, groupId);

            // 2. Konversi hasil query menjadi tipe data angka murni (number) 
            // Langkah ini krusial untuk mencegah error "Serialization BigInt" di Next.js
            privileges = rawData.map((item) => ({
                menu_id: Number(item.menu_id),
                action_id: Number(item.action_id),
                group_id: Number(item.group_id),
            })) as Privilege[];

        } else {
            // Jika groupId kosong, variabel 'privileges' otomatis tetap berupa array kosong []
            privileges = [];
        }


         const dataMenu = await prisma.menu.findMany({
            where: {
                status: {
                    not: -5
                }
            },
             select: {
                id: true,
                name: true
            }
        });

       const dataMenuDetail = await prisma.$queryRawUnsafe<any[]>(`
                SELECT 
                    p.id,
                    p.menu_id,
                    p.action_id,
                    md.name as action_name
                from master.menu_detail p 
                join master.action md on p.action_id  = md.id 
                where md.status !='-5' and p.status !='-5' order by md.name asc 
            `);

        const getMenu = this.getMenu(dataMenu, dataMenuDetail,privileges)
        
        return {menu:getMenu};
    },
    getMenu(dataMenu:MenuData[], dataDetail:MenuData[], dataPrivilege:Privilege[]){

        const getMenu:{id:string,name:string|undefined, action:{action_id:string; isChecked:boolean}[]}[]=[]
        dataMenu.forEach(element => {
            const action:{action_id:string; isChecked:boolean; action_name:string|undefined}[]  = [];
            
            dataDetail.forEach(valueDetail => {
                if (Number(element.id) === Number(valueDetail.menu_id)) {
                    // Di sini Anda memasukkan menu_id sebagai string ke properti action
                    
                    let  isChecked = false;
                    dataPrivilege.forEach(priv =>{
                        
                        if(priv.menu_id == valueDetail.menu_id && priv.action_id == valueDetail.action_id)
                        {
                            isChecked = true;
                        }
                    })

                    action.push({action_id:encryptAES(valueDetail.action_id),isChecked:isChecked, action_name:valueDetail.action_name});
                }
            });

            // BENAR: Menyimpan array 'detail' langsung ke dalam properti objek menu
            getMenu.push({
                id: String(element.id),
                name: element.name,
                action:action
            });
        });

        // WAJIB: Mengembalikan hasil akhir agar fungsi menghasilkan data saat dipanggil
        return getMenu;
    },
    async actionAdd(body:DataAdd) {
        try {
        return await prisma.$transaction(async (tx) => {            
            // 1. Simpan data ke tabel User
            const newUser = await tx.group.create({
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
        throw new Error(error.message || `Terjadi kesalahan saat menambah ${moduleName}` );
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
                const deleteUser = await tx.group.update({
                    where: { id: Number(id) },
                    data: {             
                    name: body.name,
                    updated_by: body.updated_by,
                    updated_on: new Date(),
                    },
                });
            return deleteUser;
        });

        } catch (error: any) {
        console.error("Gagal Simpan (Rollback terjadi):", error.message);
        throw new Error(JSON.stringify([error.message || `Terjadi kesalahan saat update ${moduleName}`]));
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
                const deleteUser = await tx.group.update({
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
        throw new Error(JSON.stringify([error.message || `Terjadi kesalahan saat menambah ${moduleName}` ]));
    }

    }   
};