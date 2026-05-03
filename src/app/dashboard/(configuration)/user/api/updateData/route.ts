import { NextResponse, NextRequest } from "next/server";
import { z } from "zod"; // Import Zod
import { userService } from "../../service/userService";

// Definisikan interface jika Anda ingin tipe data body yang jelas (Opsional)
type userEdit = {
   username?:string|null
    name:string
    id:string
    address:string
    phoneNumber:string
    updated_by?:string
}  

const userSchema = z.object({
     id: z.string(),
    name: z.string().min(3, "Nama minimal 3 karakter"),
    address: z.string().min(5, "Alamat terlalu pendek"),
    phoneNumber: z.string().regex(/^\d+$/, "Nomor telepon harus angka").optional(),
});

export async function POST(request: NextRequest) {
  try {

    const body: userEdit = await request.json();

    const validation = userSchema.safeParse(body);
    if (!validation.success) {

        const errorMessages = validation.error.issues.map((issue) => issue.message);
        return NextResponse.json(
            { 
                message: errorMessages, 
                code: 0,  
            }, 
            { status: 400 }
        );
    }
    
    body.updated_by = 'admin'
    const sendData = await userService.actionEdit(body)
    const serializedData = JSON.parse(
      JSON.stringify(sendData, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return NextResponse.json(
      {
        receivedData: body,
        data: serializedData,
        message: "Success Update Data",
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
