'use client';
import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  username: string;
  address: string;
  phoneNumber: string;
  status: string;
}
type Props = {
  setHeader:string[];
  data:User[];
}


export default function Table({ setHeader, data}: Props) {

const [dataGrid, setDataGrid] = useState([]); 
  const [loading, setLoading] = useState(true);

  // 2. useEffect: Mesin pemanggil API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/dashboard/user/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Budi',
            email: 'budi@example.com',
          }),
        });

        const result = await response.json();
        // Memperbarui state agar Grid terisi
        setDataGrid(await result.data); 
      } catch (error) {
        console.error("Gagal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // [] agar hanya berjalan saat komponen pertama kali muncul

  if (loading) return <p>Loading...</p>;
  
    return (
            <div className="overflow-x-auto rounded-2xl bg-slate-100 shadow">
                <table className="min-w-full text-left text-sm">
                    
                    <thead className="bg-slate-600 text-white">
                        <tr>
                            {setHeader.map((header, key) => (
                                <th key={key} className="px-6 py-3 text-left">{header}</th>
                            ))}
                           
                        </tr>
                    </thead>    

                    <tbody>
                        {dataGrid.map((value:User, key)=>(
                                <tr key={key} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">{value.id}</td>
                                    <td className="px-6 py-4">{value.name}</td>
                                    <td className="px-6 py-4">{value.username}</td>
                                    <td className="px-6 py-4">{value.address}</td>
                                    <td className="px-6 py-4">{value.phoneNumber}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">{value.status}</span>
                                    </td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button className="text-blue-600 hover:underline">Edit</button>
                                        <button className="text-red-600 hover:underline">Hapus</button>
                                    </td>
                                </tr>

                            )) }
                       
                    </tbody>




                </table>


            </div>

    )
}