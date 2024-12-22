// components/TemplateUpdateDialog.tsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { AlertTriangle, Info, FileWarning } from "lucide-react";
import { useEffect } from "react";
  
  interface TemplateUpdateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    signedCount: number;
    pendingCount: number;
  }
  
  export function TemplateUpdateDialog({
    isOpen,
    onClose,
    onConfirm,
    signedCount,
    pendingCount,
  }: TemplateUpdateDialogProps) {
    console.log("TemplateUpdateDialog rendered with:", {
      isOpen,
      signedCount,
      pendingCount,
      time: new Date().toISOString()
    });
  
    useEffect(() => {
      console.log("Dialog open state changed:", isOpen);
    }, [isOpen]);    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileWarning className="h-5 w-5 text-yellow-500" />
              Certificate Template Update
            </DialogTitle>
            <DialogDescription className="space-y-4">
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground">Current Status:</p>
                    <ul className="list-disc pl-4 space-y-1 mt-1">
                      <li className="text-orange-600 dark:text-orange-400">
                        {signedCount} signed certificates (will remain unchanged)
                      </li>
                      <li className="text-green-600 dark:text-green-400">
                        {pendingCount} pending certificates (will use new template)
                      </li>
                    </ul>
                  </div>
                </div>
  
                {pendingCount === 0 ? (
                  <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-md border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <p className="font-semibold text-yellow-800 dark:text-yellow-200">
                        No Pending Certificates
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                      There are no pending certificates to update. Consider deleting signed certificates first if you need to update the template.
                    </p>
                  </div>
                ) : (
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      This action will update the template for {pendingCount} pending certificates.
                      Signed certificates will retain their original template.
                    </p>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={onConfirm}
              disabled={pendingCount === 0}
              variant={pendingCount === 0 ? "secondary" : "default"}
              className={pendingCount === 0 ? "cursor-not-allowed" : ""}
              title={pendingCount === 0 ? "No pending certificates to update" : ""}
            >
              {pendingCount === 0 
                ? "No Pending Certificates" 
                : `Update Template for ${pendingCount} Pending Certificate${pendingCount === 1 ? '' : 's'}`
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }