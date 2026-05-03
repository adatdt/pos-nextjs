import prisma  from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signIn, signOut } from "@/lib/auth";

export const loginService = {

    async login(param:{username:string; pass:string}) {

        try {
            const findUsername = await prisma.users.findMany({
                where: {username:param.username}
            });
            let msg = "Login Berhasil"
            if(findUsername.length<1)
            {
                msg = "Username Tidak ditemukan"
                console.error(msg);
                return {data:[], message:[msg], code:0}
            }

            const comparePassword = await this.comparePassword(param.pass, findUsername[0].password)
            if(!comparePassword)
            {
                msg = "Username  dan Password Tidak Cocok"
                console.error(msg);
                return {data:[], message:[msg], code:0}
            }
            const result = await signIn("credentials", {
                    username:param.username,
                    pass:param.pass,
                    redirect: false, // Kita handle redirect manual agar lebih fleksibel
                });

            if (result?.error) {
                msg = result.error
                console.error(msg);
                return {data:[], message:[msg], code:0}
            }                        
            return {data:[], message:[msg], code:1}
        } catch (error) {
            console.error("Prisma Error:", error);
            throw new Error(JSON.stringify(error));
        }
    },
     async logout() {
        await signOut({ redirectTo: "/login" }); 
    },
    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        const isMatch = await bcrypt.compare(password, hashedPassword);    
        return isMatch; // Mengembalikan true jika sama, false jika beda
    }


};