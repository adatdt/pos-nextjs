'use client';
import { Fragment, useEffect, useState } from "react";
import type {GetData, SetFiltering, Action} from "../type/type"
import { useRefreshStore} from "../service/useRefresh";
import Edit from "../component/Edit";
import type {MenuItem} from "@/lib/type/type"

export default function Table({title}: Readonly<GetData>) {
     const [loading, setLoading] = useState(true);
     const [showModal, setShowModal] = useState(false);
     const { refreshTicket, triggerRefresh } = useRefreshStore();
     const [fiteringData, setFiteringData] = useState<SetFiltering>({globalFilter:'', startPage:0,limitPage:10});
     const [dataDetail, setDataDetail] = useState<MenuItem>();
     const [dataGrid, setDataGrid] = useState([]); 
      const [dataGridAction, setDataGridAction] = useState([]); 

        useEffect(() => {
        const fetchData = async () => {
            setLoading(true); 

            try {
            const response = await fetch('/dashboard/menu/api', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(fiteringData),
            });

            if (!response.ok) throw new Error("Gagal mengambil data");

            const result = await response.json();            
            setDataGrid(result.data);
           
            const dataAction = result.dataAction.map((element: { id: string; name: string }) => ({
                value: element.id,
                label: element.name
            }));
             setDataGridAction(dataAction)

            } catch (error) {
            console.error("Gagal:", error);
            } finally {
            setLoading(false);
            }
        };

        fetchData();
    }, [refreshTicket]); 
  
    const parent = ()=>{
        return (<tbody>
            {dataGrid.map((element:MenuItem)=>(
                element.child?.length && element.child.length > 0?(
                     <Fragment  key={element.id}>
                    <tr  className="hover:bg-blue-50 cursor-pointer border-b border-gray-200" >
                        <td className="px-5 py-4 flex items-center">
                            <div >
                            <span id="icon-lv1-1" className="mr-3 transform transition-transform duration-200">▶</span>
                            <span className="font-bold text-gray-800">{element.name}</span>
                            </div>
                        </td>
                    <td className="px-5 py-4 text-center">
                          <button className="text-blue-600 hover:underline" onClick={()=>handlingModal(true, element)} >Edit</button>
                    </td>
                </tr>
                {child(element.child, 0)}
                </Fragment>
                ):(
                <tr key={element.id} className=" bg-white border-b border-gray-100 lv1-1 lv-1">
                        <td className="px-5 py-2  italic text-sm text-gray-500">
                            <div >
                            {element.name}
                            </div>
                        </td>
                        <td className="px-5 py-2 text-center">
                              <button className="text-blue-600 hover:underline" onClick={()=>handlingModal(true, element)} >Edit</button>
                        </td>
                </tr>
                )

            ))}

        </tbody>)

    }

    const child = (dataChild:MenuItem[], pad:number)=>{
        const newParamPad = pad + 1
        const newPad = newParamPad * 20
        return (<>            
            {dataChild.map((element:MenuItem)=>(
                element.child?.length && element.child.length > 0?(
                    <Fragment  key={element.id}>
                    <tr key={element.id} className="hover:bg-blue-50 cursor-pointer border-b border-gray-200" >
                        <td className={`px-5 py-4   flex items-center`} >
                            <div style={{ paddingLeft: `${newPad}px` }} >
                                <span id="icon-lv1-1" className="mr-3 transform transition-transform duration-200">▶</span>
                                <span className="font-bold text-gray-800">{element.name}</span>
                            </div>
                        </td>
                    <td className="px-5 py-4 text-center ">
                        <button className="text-blue-600 hover:underline" onClick={()=>handlingModal(true, element)} >Edit</button>
                    </td>
                </tr>
                 {child(element.child, newParamPad)}
                </Fragment>
                ):(
                <tr key={element.id} className=" bg-white border-b border-gray-100 lv1-1 lv-1">
                        <td className={`px-5 py-2  italic text-sm text-gray-500`}><div style={{ paddingLeft: `${newPad}px` }} >{element.name}</div>
                        </td>
                        <td className="px-5 py-2 text-center">  <button className="text-blue-600 hover:underline" onClick={()=>handlingModal(true, element)} >Edit</button></td>
                </tr>
                )

            ))}

        </>)
        
    }

     const handlingModal = (action:boolean, data?:MenuItem) => {
        setShowModal(action)
        setDataDetail(data)
        
    }

    return (
        <div className="mt-2 text-gray-600 p-4">
             {showModal&&(<Edit title={title} handlingModal={handlingModal}  dataDetail={dataDetail}  dataAction={dataGridAction} dataGrid={dataGrid}/>)}
           <div className="flex flex-col md:flex-row justify-end gap-2 w-full pb-4">
            
            </div>
          
            <div className="overflow-x-auto rounded-2xl bg-slate-100 shadow">

                <table className="min-w-full text-left text-sm">
                    
                    <thead className="bg-slate-600 text-white">
                        <tr>
                           <th className="px-6 py-3 text-left w-[90%]">Name</th>
                            <th className="px-6 py-3 text-left w-[10%]">Action</th>  
                        </tr>
                    </thead>
                
                    {loading?(<tbody><tr className="border-b hover:bg-gray-50"><td className="px-6 py-4 text-center" colSpan={2}>Loading...</td></tr></tbody>):(parent())}                       

                </table>

            </div>

        </div>
    )
}