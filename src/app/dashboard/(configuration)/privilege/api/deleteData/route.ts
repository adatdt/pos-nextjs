import { NextResponse, NextRequest } from "next/server";
import { z } from "zod"; // Import Zod
import { groupService } from "../../service/priviegeService";
import {  DataDelete} from "../../type/type";

const userSchema = z.object({
    id: z.string()
});

export async function POST(request: NextRequest) {
  try {

    const body: DataDelete = await request.json();

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
    
    body.status = '-5'
    const sendData = await groupService.actionUpdateStatus(body)
    const serializedData = JSON.parse(
      JSON.stringify(sendData, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return NextResponse.json(
      {
        receivedData: body,
        data: serializedData,
        message: "Success Delete Data",
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
