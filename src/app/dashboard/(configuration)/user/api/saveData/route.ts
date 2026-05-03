import { NextResponse, NextRequest } from "next/server";
import { z } from "zod"; // Import Zod
import { userService } from "../../service/userService";

// Definisikan interface jika Anda ingin tipe data body yang jelas (Opsional)
type userAdd = {
    name:string
    pass:string
    username:string
    address:string
    phoneNumber:string
}  

const userSchema = z.object({
    name: z.string().min(3, "Nama minimal 3 karakter"),
    username: z.string().min(3, "Username minimal 3 karakter").max(20, "maximal 20 karakter"),
    address: z.string().min(5, "Alamat terlalu pendek"),
    phoneNumber: z.string().regex(/^\d+$/, "Nomor telepon harus angka").optional(),
    pass: z.string().min(6, "Password minimal 6 karakter"),
});

export async function POST(request: NextRequest) {
  try {

    const body: userAdd = await request.json();

    const validation = userSchema.safeParse(body);
    if (!validation.success) {

        const errorMessages = validation.error.issues.map((issue) => issue.message);
        return NextResponse.json(
            { 
                message: "Validasi Gagal", 
                code: 0, 
                error: errorMessages 
            }, 
            { status: 400 }
        );
    }

    const sendData = await userService.actionAdd(body)
    const serializedData = JSON.parse(
      JSON.stringify(sendData, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return NextResponse.json(
      {
        receivedData: body,
        data: serializedData,
        message: "Success Add Data",
        code:1
      },
      { status: 201 },
    );
  } catch (error: any) {
    // Log error ke console untuk debugging
    console.error("Error di POST route:", error);

    // Mengembalikan response error ke client
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: [error.message || "Terjadi kesalahan saat memproses data"],
        code:0
      },
      { status: 500 },
    );
  }
}
