"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
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

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return;

    try {
      setIsLoading(true);
      const file = event.target.files[0];
      const parsedGuestList = await parseCSV(file);
      
      await addParticipantsToEvent(eventId, parsedGuestList);
      await onParticipantsAdded();
      
      toast.success("Participants added successfully");
      setOpen(false);
    } catch (error) {
      console.error("Error adding participants:", error);
      toast.error("Failed to add participants");
    } finally {
      setIsLoading(false);
    }
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
        </DialogHeader>
        <Input 
          type="file" 
          accept=".csv"
          onChange={handleCSVUpload}
          disabled={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}