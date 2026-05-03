import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Toaster } from 'sonner';
import { getMenu } from "@/lib/menu";
import type {MenuItem} from "@/lib/type/type"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

   const session = await auth();
   if (!session) {
     redirect("/login");
    }
    const dataMenu:MenuItem[] = await getMenu()
  return (
    
    <div className="flex min-h-screen">
        {/* <!-- Sidebar --> */}
        <Sidebar dataMenu={dataMenu} />
         {/* <!-- Content Area --> */}
        <div className="flex flex-1 flex-col">
            {/* <!-- Header --> */}
            <Header />
            {/* <!-- Main --> */}
            <main className="flex-1 p-6 bg-slate-800 ">{children}</main>
            <Toaster richColors position="top-right" expand={true}  visibleToasts={5}  gap={8} />
        </div>
    </div>


  )
}