import { NextResponse, NextRequest } from "next/server";
import { loginService } from "../../service/loginService";
import { z } from "zod"; // Import Zod


const userSchema = z.object({
    username: z.string().min(3, "Username minimal 3 karakter").max(20, "maximal 20 karakter"),
    pass: z.string().min(6, "Password minimal 6 karakter"),
});

export async function POST(request: NextRequest) {
  try {

    const body: {username:string, pass:string} = await request.json();

    const validation = userSchema.safeParse(body);
    if (!validation.success) {

        const errorMessages = validation.error.issues.map((issue) => issue.message);
        return NextResponse.json(
            { 
                message: errorMessages, 
                code: 0,  
            }, 
            { status: 201 }
        );
    }

    const sendData = await loginService.login(body)

    return NextResponse.json(
      {
        receivedData: body,
        ...sendData
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
