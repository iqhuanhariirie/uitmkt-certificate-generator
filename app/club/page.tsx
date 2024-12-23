import { DataTable } from "@/components/DataTableClub";
import { clubColumns, columns } from "@/components/ui/columns";
import ProtectedRoute from "@/components/ProtectedRoute";

const Page = () => {
  return (
    <>
    <ProtectedRoute>
      <div className="h-full px-28 py-2">
        <DataTable columns={clubColumns} />
      </div>
      </ProtectedRoute>
    </>
  );
};

export default Page;