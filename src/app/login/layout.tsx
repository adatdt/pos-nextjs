
import { Toaster } from 'sonner';
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function layout({
    children,
}: {
    children: React.ReactNode
}) {

const session = await auth();

  // 2. Proteksi: Jika tidak ada session, langsung redirect ke login
  if (session) {
    redirect("/dashboard");
  }

    return (
        <div className="flex min-h-screen ">
        {/* <!-- Content Area --> */}
            <div className="flex flex-1 flex-col">
                {/* <!-- Main --> */}
                {children}
                <Toaster richColors position="top-right" expand={true}  visibleToasts={5}  gap={8} />
            </div>
        </div>

    )
}