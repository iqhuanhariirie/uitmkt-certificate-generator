"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Upload } from "lucide-react";
import { parseCSV } from "@/utils/parseCSV";
import { addParticipantsToEvent } from "@/utils/uploadToFirestore";
import toast from "react-hot-toast";

interface AddParticipantsProps {
  eventId: string;
  onParticipantsAdded: () => Promise<void>;
}

export function AddParticipants({ eventId, onParticipantsAdded }: AddParticipantsProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<{
    added: number;
    duplicates: number;
    duplicatesList: any[];
  } | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a CSV file first");
      return;
    }

    try {
      setIsLoading(true);
      const parsedGuestList = await parseCSV(selectedFile);
      
      const result = await addParticipantsToEvent(eventId, parsedGuestList);
      setResult(result);

      await onParticipantsAdded();
      
      if (result.added > 0) {
        toast.success(`Added ${result.added} new participants`);
      }

      if (result.duplicates > 0) {
        toast.error(`${result.duplicates} participants were already registered`);
      }
    } catch (error) {
      console.error("Error adding participants:", error);
      toast.error("Failed to add participants");
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setResult(null);
    setSelectedFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Participants
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Participants</DialogTitle>
          {result ? (
            <DialogDescription>
              <div className="mt-4 space-y-2">
                <p className="text-green-600">Successfully added: {result.added}</p>
                {result.duplicates > 0 && (
                  <div>
                    <p className="text-amber-600">
                      Skipped {result.duplicates} duplicate entries:
                    </p>
                    <ul className="mt-2 text-sm text-gray-500 max-h-40 overflow-y-auto">
                      {result.duplicatesList.map((dup, index) => (
                        <li key={index}>
                          {dup.name} ({dup.studentID})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </DialogDescription>
          ) : (
            <DialogDescription>
              Upload a CSV file with participant details
            </DialogDescription>
          )}
        </DialogHeader>
        {!result && (
          <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input 
              type="file" 
              accept=".csv"
              onChange={handleFileSelect}
              disabled={isLoading}
            />
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isLoading}
              className="whitespace-nowrap"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isLoading ? "Uploading..." : "Upload CSV"}
            </Button>
          </div>
          {selectedFile && (
            <p className="text-sm text-gray-500">
              Selected file: {selectedFile.name}
            </p>
          )}
        </div>
        )}
        <DialogFooter>
          <Button onClick={handleClose} variant="outline">
            {result ? 'Close' : 'Cancel'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}