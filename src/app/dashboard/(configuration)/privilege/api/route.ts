import { NextResponse, NextRequest } from "next/server";
import { groupService } from "../service/priviegeService";
import type {SetFiltering} from "../type/type"

// Definisikan interface jika Anda ingin tipe data body yang jelas (Opsional)

export async function GET() {
  return NextResponse.json({
    message: "Halo dari Next.js API!",
    status: "success",
  });
}

export async function POST(request: NextRequest) {
    try {
        // Menentukan tipe data body sebagai UserBody
        const body: SetFiltering = await request.json();
        const myData = await groupService.getAllData(body);
        return NextResponse.json(
            {
                receivedData: body,
                ...myData,
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
                error: error.message || "Terjadi kesalahan saat memproses data",
            },
            { status: 500 },
        );
    }
}
