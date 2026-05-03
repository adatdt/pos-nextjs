// components/BlockUI.tsx
export const BlockUI = ({ isOpen }: { isOpen: boolean }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner Loading */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
        <p className="text-white font-medium">Mohon tunggu...</p>
      </div>
    </div>
  );
};