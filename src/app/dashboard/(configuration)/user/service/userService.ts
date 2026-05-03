import prisma  from '@/lib/prisma';
import {encryptAES, decryptAES}  from '@/lib/crypto';
import bcrypt from 'bcryptjs';
import type {User, SetFiltering} from "../type/type"
// Mendefinisikan tipe data untuk input
export interface CreateUserParams {
  name: string;
  email: string;
}

type userAdd = {
    name:string
    pass:string
    username:string
    address:string
    phoneNumber:string
}  

type userEdit = {
    username?:string|null
    name:string
    id:string
    address:string
    phoneNumber:string
    updated_by?:string
}  

type userDelete = {
    id:string
    status?:string
}  

export const userService = {
    // SELECT: Mengambil data
    async getAllUsers(paramFitering:SetFiltering) {
        console.log(paramFitering.globalFilter)
        const whereClause: any = {};
        whereClause.status = { notIn: [-5] };
        if(paramFitering.globalFilter && paramFitering.globalFilter.trim() !== "" )   {
            whereClause.OR = [
                { name: { contains: paramFitering.globalFilter, mode: 'insensitive' } },
                { username: { contains: paramFitering.globalFilter, mode: 'insensitive' } },
                { phone_number: { contains: paramFitering.globalFilter, mode: 'insensitive' } },
                { address: { contains: paramFitering.globalFilter, mode: 'insensitive' } },
            ];
        }

        const data = await prisma.users.findMany({
            where: whereClause,
            orderBy: { id: 'desc' },
            skip: paramFitering.startPage, // Sama dengan OFFSET
            take: paramFitering.limitPage, // Sama dengan LIMIT
        });

        const totalData = await prisma.users.count({
            where: whereClause,
        });

        const returnData:User[] = []
        data.forEach(async element => {
            const id = encryptAES(element.id)
            const row:User = {id: id, name: element.name, username: element.username, address: element.address, phoneNumber: element.phone_number, status: element.status}
            returnData.push(row)
        });
        
        return {data:returnData, totalData:totalData};
    },

    async actionAdd(body:userAdd) {
        try {
        body.pass = await this.hashPassword(body.pass)
        return await prisma.$transaction(async (tx) => {            
            // 1. Simpan data ke tabel User
            const newUser = await tx.users.create({
                data: {
                name: body.name,
                group_id: 1,
                username: body.username,
                address: body.address,
                phone_number: body.phoneNumber,
                status: 1,
                created_by: "admin",
                password: body.pass,
                },
            });

            return newUser;
        });

        } catch (error: any) {
        console.error("Gagal Simpan (Rollback terjadi):", error.message);
        throw new Error(error.message || "Terjadi kesalahan saat menambah user");
    }

    }   ,
   async actionEdit(body:userEdit) {
        try {
            const id = await decryptAES(String(body.id));
            if (!id) {
            throw new Error(JSON.stringify(["ID gagal didekripsi (Hasil Null)"]));
            }
            return await prisma.$transaction(async (tx) => {            
                // 1. Simpan data ke tabel User
                const id = await decryptAES(body.id)
                const deleteUser = await tx.users.update({
                    where: { id: Number(id) },
                    data: {             
                    name: body.name,
                    phone_number: body.phoneNumber,
                    address: body.address,
                    updated_by: body.updated_by,
                    updated_on: new Date(),
                    },
                });
            return deleteUser;

        });

        } catch (error: any) {
        console.error("Gagal Simpan (Rollback terjadi):", error.message);
        throw new Error(JSON.stringify([error.message || "Terjadi kesalahan saat menambah user"]));
    }

    }   ,   
    async actionUpdateStatus(body:userDelete) {
        try {
            const id = await decryptAES(String(body.id));
            if (!id) {
            throw new Error(JSON.stringify(["ID gagal didekripsi (Hasil Null)"]));
            }
            return await prisma.$transaction(async (tx) => {            
                // 1. Simpan data ke tabel User
                const id = await decryptAES(body.id)
                const deleteUser = await tx.users.update({
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

    }   ,    
    async hashPassword(password:string) {
        // '12' adalah saltRounds (tingkat keamanan). Semakin tinggi, semakin lambat/aman.
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        return hashedPassword;
    },

};