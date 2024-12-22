import { Button } from "@/components/ui/button";
import { deleteCertificates } from "@/utils/deleteFromFirebase";
import { Table } from "@tanstack/react-table";
import { useState } from "react";
import { Participant } from "./ui/participant-columns";
import toast from "react-hot-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface BulkActionsProps {
  table: Table<Participant>;
  onRefresh?: () => Promise<void>;
}

export function BulkActions({ table, onRefresh }: BulkActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const selectedRows = table.getSelectedRowModel().rows;

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;

    const certificateIds = selectedRows.map(row => row.original.id);
    
    try {
      setIsDeleting(true);
      const toastId = toast.loading(`Deleting ${certificateIds.length} certificates...`);
      
      await deleteCertificates(certificateIds);
      if (onRefresh) {
        await onRefresh(); // Check if onRefresh exists before calling
    }      
      toast.success(`Successfully deleted ${certificateIds.length} certificates`, {
        id: toastId,
      });
      
      // Clear selections
      table.toggleAllRowsSelected(false);
    } catch (error) {
      toast.error('Failed to delete certificates');
      console.error('Error during bulk delete:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {selectedRows.length > 0 && (
        <>
          <span className="text-sm text-gray-500">
            {selectedRows.length} selected
          </span>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={isDeleting}
              >
                Delete Selected
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Certificates</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete {selectedRows.length} certificates? 
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => table.toggleAllRowsSelected(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleBulkDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}