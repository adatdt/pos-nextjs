'use client';
interface ButtonProps {
  onClick?: () => void; // Mendefinisikan tipe fungsi untuk onClick
}

export function BtnAdd({onClick}:ButtonProps) {
    return (
        <button onClick={onClick} className="bg-green-700 hover:bg-green-600 text-white px-2 py-2   text-sm rounded  transition">
        Add +
         </button>
    )
}

export  function BtnCancel({onClick}:ButtonProps) {
  return (
     <button onClick={onClick} className="bg-red-700 hover:bg-red-600 text-white px-2 py-2   text-sm rounded  transition">
        Cancel        
    </button>
  )
}

export  function BtnSave({onClick}:ButtonProps) {
  return (
     <button onClick={onClick} className="bg-blue-700 hover:bg-blue-600 text-white px-2 py-2   text-sm rounded  transition">
        Save
    </button>
  )
}