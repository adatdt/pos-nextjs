import prisma  from '@/lib/prisma';
import {encryptAES, decryptAES}  from '@/lib/crypto';
import type {DataDelete, DataEdit, DataAdd, Action, SetFiltering} from "../type/type"

export const actionService = {
    // SELECT: Mengambil data
    async getAllUsers(paramFitering:SetFiltering) {      
        const whereClause: any = {};
        whereClause.status = { in: [1] };
        if(paramFitering.globalFilter && paramFitering.globalFilter.trim() !== "" )   {
            whereClause.OR = [
                { name: { contains: paramFitering.globalFilter, mode: 'insensitive' } },
            ];
        }

        const data = await prisma.action.findMany({
            where: whereClause,
            orderBy: { id: 'desc' },
            skip: paramFitering.startPage, // Sama dengan OFFSET
            take: paramFitering.limitPage, // Sama dengan LIMIT
        });

        const totalData = await prisma.action.count({
            where: whereClause,
        });

        const returnData:Action[] = []
        data.forEach(async element => {
            const id = encryptAES(element.id)
            const row:Action = {id: id, name: element.name, status: element.status}
            returnData.push(row)
        });
        
        return {data:returnData, totalData:totalData};
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
            return deleteUser;
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