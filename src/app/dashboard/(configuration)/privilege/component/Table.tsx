'use client';
import { useEffect, useState } from "react";
import type {DataGrid, GetData, MenuActionPrivilege, MenuItem, SetFiltering} from "../type/type"
import Edit from "./Edit";
import Delete from "./Delete";
import { useRefreshStore} from "../service/useRefresh";
import NativeSelect from "@/components/NativeSelectProps";
import SwitchButton from "@/components/GlobalComonent";


export default function Table({title}: Readonly<GetData>) {

    const [dataGrid, setDataGrid] = useState([]); 
    const [dataPrivilege, setDataPrivilege] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [fiteringData, setFiteringData] = useState<string>("");
    const [dataDetail, setDataDetail] = useState<Partial<MenuItem>>({});
    const { refreshTicket, triggerRefresh } = useRefreshStore();
    const [group, setGroup] = useState<string>("");
    const [isActive, setIsActive] = useState<boolean>(false);
  
    const bahasaOptions = [ 
    { value: "id", label: "Bahasa Indonesia" },
    { value: "en", label: "English (US)" },
    { value: "jp", label: "日本語 (Japanese)" },
  ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); 
            setFiteringData(group);

            try {
            const response = await fetch('/dashboard/privilege/api', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({group:group}),
            });

            if (!response.ok) throw new Error("Gagal mengambil data");

            const result = await response.json();
            console.log(result)
            setDataGrid(result.menu);

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

    // const getSearch = () => {
    //     const startPage = 0;
    //     const updatedFilter = { ...fiteringData, startPage };
    //     setFiteringData(updatedFilter);
    //     setLoading(true)        
    //     triggerRefresh()      
    // }

    const myData =()=>{
        // if(group =='' || group ==undefined)
        // {
        //     return(<tr className="border-b hover:bg-gray-50"><td className="px-6 py-4 text-center" colSpan={7}>Tidak Ada Data</td></tr>)
        // }
        return  (dataGrid.map((value:MenuItem, key)=>(
                                <tr key={value.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">{value.name}</td>
                                    {action(value.action)}

                                </tr>

                            )))
    }


    const action = (data:MenuActionPrivilege[])=>{
        
        console.log(data)
        return(<td className="px-6 py-4 flex gap-2">
           {data.map(val => (
                <span key={val.action_id} className="flex items-center gap-2">

                    {val.action_name} 
                    <SwitchButton
                    label=""
                    checked={val.isChecked}
                    onChange={setIsActive}
                    />
                </span>
            ))}
        </td>)
    }
    
  
    return (
        <div className="mt-2 text-gray-600 p-4">
           <div className="flex flex-col md:flex-row justify-end gap-2 w-full pb-4">
               
                <NativeSelect
                id="bahasa-select"
                name="group"
                label="Pilih Group"
                labelClass=" text-white"
                options={bahasaOptions}
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                />
                
            </div>
         

            <div className="overflow-x-auto rounded-2xl bg-slate-100 shadow">
                {showModal&&(<Edit title={title} handlingModal={handlingModal}  dataDetail={dataDetail} />)}
                {showModalDelete&&(<Delete title={title} handlingModal={handlingModal}  dataDetail={dataDetail} />)}
                <table className="min-w-full text-left text-sm">
                    
                    <thead className="bg-slate-600 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left w-[75%]">Name</th>
                            <th className="px-6 py-3 text-left w-[20%]">Action</th>  
                        </tr>
                    </thead>

                    <tbody>
                        {loading?(<tr className="border-b hover:bg-gray-50"><td className="px-6 py-4 text-center" colSpan={7}>Loading...</td></tr>):(myData() )}                       
                    </tbody>
                </table>


                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                
                </div>
            </div>
        </div>
    )
}