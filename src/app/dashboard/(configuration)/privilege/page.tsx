import Table from "./component/Table";
import Add from "./component/Add"


export default function Action() {
   const title = "Privilege";

    return (
    <div className="rounded-2xl p-4 bg-slate-900 shadow-sm">    
     <div className="flex justify-between items-center p-2 border-b border-gray-300">
            <h2 className="text-2xl font-bold text-white">
            {title}
            </h2>
             <Add title={title} />        
        </div>           
            <Table  title={title}/>       
    </div>
    )
}