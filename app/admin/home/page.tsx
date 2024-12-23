import { DataTable } from "@/components/DataTableEvent";
import { columns } from "@/components/ui/columns";
import ProtectedRoute from "@/components/ProtectedRoute";


const Page = () => {
  return (
    <>
    <ProtectedRoute>
      <div className="h-full px-28 py-2">
        <DataTable columns={columns} />
      </div>
      </ProtectedRoute>
    </>
  );
};

export default Page;
