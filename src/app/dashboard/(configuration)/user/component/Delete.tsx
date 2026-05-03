'use client'
import { useState } from 'react';
import { BtnCancel, BtnSave } from "@/components/Button";
import { toast } from "sonner";
import type {GetData} from "../type/type"
import { useRefreshStore } from "../service/useRefresh";
import { BlockUI } from '@/components/BlockUi';

export default function Delete({title, handlingModal, dataDetail}:Readonly<GetData>) {
    const { triggerRefresh } = useRefreshStore();
    const [isLoading, setIsLoading] = useState(false);
    const [modalAnimated, setModalAnimated] = useState(true);
  
  const sendData = async()=>{

        if (!dataDetail?.id) {
            toast.error("ID data tidak ditemukan!");
            return;
        }
        try {
        
        setIsLoading(true);
        const response = await fetch('/dashboard/user/api/deleteData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({id:dataDetail.id}),
        });
        const getResponse = await response.json()
        if(getResponse.code == 1)
        {
            toast.success(getResponse.message);
            
            setModalAnimated(false); 
            closeModal()
            triggerRefresh()
        }
        else
        {
            getResponse.error.forEach((msg:string[]) => {
                toast.error(msg);
            });
        }
        
      } catch (error) {
        console.error("Gagal:", error);
      } 

      setIsLoading(false);

  }
   const closeModal = () =>{
        setModalAnimated(false); 
        setTimeout(() => {
            handlingModal?.(false, "delete", {}); 
        }, 300);
  }
    return (
        
                <div className={`fixed inset-0 z-50 flex justify-center items-start bg-black/50 overflow-y-auto p-4 py-10  ${modalAnimated?"":"animate-fade-out"} `} >
                    <BlockUI isOpen={isLoading} />
                   <div className={`w-full max-w-4xl rounded-2xl bg-slate-800 p-6  shadow-xl border border-slate-600 ${modalAnimated?"animate-modal-in":"animate-modal-out"}`}>
                    <h2 className="text-xl font-bold text-white border-b-2 border-gray-800 pb-4 ">
                        Delete {title}
                    </h2>
                    <h2 className="mt-2 text-gray-600 rounded-2xl  bg-slate-100 px-4 py-4 text-center">                    
                        Apakah anda yakin akan hapus data ini ?
                    </h2>

                    <div className="mt-6 flex justify-end gap-3">
                          <BtnCancel onClick={() => {closeModal()
                        }} />

                        <BtnSave onClick={sendData} />
                    </div>
                    </div>
                </div>
        
        
    )
}