'use client';
import { useEffect, useState } from "react";
import type {DataGrid, GetData, SetFiltering} from "../type/type"
import Edit from "./Edit";
import Delete from "./Delete";
import { useRefreshStore} from "../service/useRefresh";

export default function Table({title}: Readonly<GetData>) {

    const [dataGrid, setDataGrid] = useState([]); 
    const [totalData, setTotalData] = useState(0); 
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [fiteringData, setFiteringData] = useState<SetFiltering>({globalFilter:'', startPage:0,limitPage:10});
    const [currentPage, setCurrentPage] = useState(1);
    const [dataDetail, setDataDetail] = useState<Partial<DataGrid>>({});
    const { refreshTicket, triggerRefresh } = useRefreshStore();
  
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); 
 
            const startPage = (currentPage - 1) * fiteringData.limitPage;
            const updatedFilter = { ...fiteringData, startPage };
            setFiteringData(updatedFilter);

            try {
            const response = await fetch('/dashboard/group/api', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFilter),
            });

            if (!response.ok) throw new Error("Gagal mengambil data");

            const result = await response.json();
            
            setDataGrid(result.data);
            setTotalData(result.totalData);
            } catch (error) {
            console.error("Gagal:", error);
            } finally {
            setLoading(false);
            }
        };

        fetchData();
    }, [refreshTicket]); 
  
    const handlingModal = (action:boolean, type:string, data?:DataGrid) => {
        if(type == 'edit' )
        {
            setShowModal(action)
        }else
        {
            setShowModalDelete(action)            
        }
         setDataDetail(data ?? {}); 
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFiteringData((prev) => ({ ...prev, [name]: value }));
    };

    const getSearch = () => {
        const startPage = 0;
        setCurrentPage(1);
        const updatedFilter = { ...fiteringData, startPage };
        setFiteringData(updatedFilter);
        setLoading(true)        
        triggerRefresh()      
    }

    const myData =()=>{
        if(dataGrid.length<1)
        {
            return(<tr className="border-b hover:bg-gray-50"><td className="px-6 py-4 text-center" colSpan={7}>Tidak Ada Data</td></tr>)
        }
        return  (dataGrid.map((value:DataGrid, key)=>(
                                <tr key={value.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">{(fiteringData.startPage)+key+1}</td>
                                    <td className="px-6 py-4">{value.name}</td>
                                    {action(value)}
                                </tr>

                            )))
    }

    const pagination = ()=>{
        const totalPages = Math.ceil(totalData / fiteringData.limitPage);
        const getRange = createRange(totalPages)
        const nextPage  = Math.min(currentPage +1, totalPages)
        const prevPage  = Math.max(1, currentPage - 1)

        return (
            <>
            {getRange.length>0&&(
                
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">                  
                    <button    
                    disabled={currentPage===1} 
                    onClick={() => getPage(1)} 
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M15.79 5.23a.75.75 0 01-.02 1.06L11.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02zm-6 0a.75.75 0 01-.02 1.06L5.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <button  
                    disabled={currentPage===1} 
                    onClick={() => getPage(prevPage)}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                        </svg>
                        
                        </button>
                    {getRange.map((value)=>(
                        <button 
                                key={value} 
                                onClick={() => getPage(value)}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-all focus:z-20 ${
                                    currentPage === value 
                                    ? "z-10 bg-green-700 text-white  focus-visible:outline-2" 
                                    : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50" 
                                }`}
                            >
                                {value}
                            </button>
                    ))}
                     <button 
                        disabled={currentPage===totalPages}
                        onClick={() => getPage(nextPage)}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path 
                                fillRule="evenodd" 
                                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" 
                                clipRule="evenodd" 
                                />
                        </svg>
                        </button>
                        <button
                        disabled={currentPage===totalPages}
                         onClick={() => getPage(totalPages)}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20">
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path 
                                fillRule="evenodd" 
                                d="M10.21 14.77a.75.75 0 01.02-1.06L14.168 10 10.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" 
                                clipRule="evenodd" 
                            />
                            <path 
                                fillRule="evenodd" 
                                d="M4.21 14.77a.75.75 0 01.02-1.06L8.168 10 4.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" 
                                clipRule="evenodd" 
                            />
                            </svg>
                        </button>

                        </nav>
                          )}
                          </>
                ) 
    }

    const getPage = (param:number)=>{
        setCurrentPage(param)
        setLoading(true)
        triggerRefresh()       
    }

    const createRange = (totalPages: number) => {
            
        const displayLimit = 5; // Batas maksimal tombol yang muncul

        // 1. Jika total halaman lebih kecil dari limit, tampilkan semua yang ada
        if (totalPages <= displayLimit) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // 2. Tentukan start awal (posisi ideal: currentPage ada di tengah)
        let start = Math.max(1, currentPage - 2);
        
        // 3. Jika start terlalu dekat ke awal (1 atau 2), paksa mulai dari 1
        if (start <= 1) {
            start = 1;
        }

        // 4. Tentukan end berdasarkan start + limit
        let end = start + displayLimit - 1;

        // 5. Jika end melampaui batas total halaman, geser start ke belakang
        if (end >= totalPages) {
            end = totalPages;
            start = end - displayLimit + 1;
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const showTotalDataPage = (param:number)=>
    {
         setCurrentPage(1)
         const limitPage = param
        const updatedFilter = { ...fiteringData, limitPage };
        setFiteringData(updatedFilter);
        setLoading(true)        
        triggerRefresh()      
    }

    const action = (data:DataGrid)=>{
        
        return(<td className="px-6 py-4 flex gap-2">
            <button className="text-blue-600 hover:underline" onClick={()=>handlingModal(true,"edit",data)} >Edit</button>
            <button className="text-red-600 hover:underline" onClick={()=>handlingModal(true,"delete",data)} >Hapus</button>
        </td>)
    }
  
    return (
        <div className="mt-2 text-gray-600 p-4">
           <div className="flex flex-col md:flex-row justify-end gap-2 w-full pb-4">
                <div className="flex w-full md:max-w-[50%] rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-gray-500 transition-all">
                    
    
                    {/* Search Input */}
                    <input 
                    type="text" 
                    name="globalFilter"
                     onChange={handleChange}
                    placeholder="Cari data user..." 
                    className="flex-1 px-4 py-2 text-sm outline-none bg-gray-50"
                    />
                    {/* Tombol Cari */}
                <button className="bg-green-700 hover:bg-green-600 text-white px-6 py-2  font-medium transition duration-200 flex items-center justify-center gap-2" onClick={getSearch}>
                  {loading ? (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://w3.org" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    )}

                      <span>{loading ? "Mencari..." : "Cari"}</span>
                </button>

                </div>

            </div>
            <div className="w-fit pb-2">
                <label htmlFor="perPage" className="block text-sm font-medium text-white mb-1">
                    Tampilkan data:
                </label>
                
                <select
                    id="perPage"
                    // value={fiteringData.startPage}
                    name="perPage"
                    defaultValue="10"
                    className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ring-1 ring-inset ring-gray-300 bg-gray-50" 
                    onChange={(e) => showTotalDataPage(Number(e.target.value))}
                >
                    <option value="10" >10</option>
                    <option value="25" >25</option>
                    <option value="50" >50</option>
                    <option value="100" >100</option>
                </select>
            </div>


            <div className="overflow-x-auto rounded-2xl bg-slate-100 shadow">
                {showModal&&(<Edit title={title} handlingModal={handlingModal}  dataDetail={dataDetail} />)}
                {showModalDelete&&(<Delete title={title} handlingModal={handlingModal}  dataDetail={dataDetail} />)}
                <table className="min-w-full text-left text-sm">
                    
                    <thead className="bg-slate-600 text-white">
                        <tr>
                           <th className="px-6 py-3 text-left w-[5%]">No</th>
                            <th className="px-6 py-3 text-left w-[75%]">Name</th>
                            <th className="px-6 py-3 text-left w-[20%]">Action</th>  
                        </tr>
                    </thead>

                    <tbody>
                        {loading?(<tr className="border-b hover:bg-gray-50"><td className="px-6 py-4 text-center" colSpan={7}>Loading...</td></tr>):(myData() )}                       
                    </tbody>
                </table>


                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                {/* <!-- Tampilan Desktop --> */}
                <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                    <p className="text-sm text-gray-700">
                        Menampilkan <span className="font-medium">{totalData==0?0:fiteringData.startPage+1}</span> sampai <span className="font-medium">{totalData==0?0:fiteringData.startPage+dataGrid.length}</span> dari <span className="font-medium">{totalData}</span> data
                    </p>
                    </div>
                    <div>                  
                        {pagination()}

                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}