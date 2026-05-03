import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
  Credentials({
    // Tambahkan konfigurasi ini agar NextAuth mengenali field kustom Anda
    credentials: {
      username: {},
      pass: {},
    },
    authorize: async (credentials) => {

        console.log(credentials)
      // Ambil nilai dari field kustom
      const username = credentials?.username as string;
      const pass = credentials?.pass as string;   
         
        const findUsername = await prisma.users.findMany({
                where: {username:username, status:1}
            });
            
         if(findUsername.length<1)
        {
            return null
        }
        const isMatch = await bcrypt.compare(pass, findUsername[0].password);  
        if(!isMatch)
        {
            return null
        } 

        return { id:String(username), username: username, group_id:findUsername[0] };
      
    },
  }),
],
  callbacks: {
    // Memasukkan role ke dalam Token
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    // Memasukkan role ke dalam Session agar bisa dipanggil di Frontend
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      return session;
    },
  },
  session: { strategy: "jwt" },
});

