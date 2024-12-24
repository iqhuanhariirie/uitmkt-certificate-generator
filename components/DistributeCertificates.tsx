import { useState } from 'react';
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
import { Mail } from "lucide-react";
import { Participant } from "./ui/participant-columns";
import toast from "react-hot-toast";

interface DistributeCertificatesProps {
  selectedParticipants: Participant[];
  eventName: string;
  onSuccess?: () => void;
  onRefresh?: () => Promise<void>;
}

export function DistributeCertificates({
  selectedParticipants,
  eventName,
  onSuccess,
  onRefresh
}: DistributeCertificatesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDistributing, setIsDistributing] = useState(false);

  const handleDistribute = async () => {
    if (selectedParticipants.length === 0) return;

    const toastId = toast.loading(
      `Sending certificates to ${selectedParticipants.length} participants...`
    );
    setIsDistributing(true);

    try {
      const recipients = selectedParticipants.map(participant => ({
        email: participant.email,
        guestName: participant.guestName,
        eventName: eventName,
        certificateUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/certificate/public/${participant.id}`
      }));

      const response = await fetch('/api/certificates/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipients })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      const successCount = result.results.filter((r: any) => r.success).length;
      const failureCount = result.results.filter((r: any) => !r.success).length;

      if (failureCount > 0) {
        toast.error(`Failed to send ${failureCount} emails`, { id: toastId });
      } else {
        toast.success(`Successfully sent ${successCount} certificates`, { id: toastId });
      }

      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error distributing certificates:', error);
      toast.error('Failed to distribute certificates', { id: toastId });
    } finally {
      setIsDistributing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={selectedParticipants.length === 0}>
          <Mail className="mr-2 h-4 w-4" />
          Distribute Certificates ({selectedParticipants.length})
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Distribute Certificates</DialogTitle>
          <DialogDescription>
            Send certificate access links to {selectedParticipants.length} participants via email.
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[200px] overflow-y-auto">
          <ul className="space-y-2">
            {selectedParticipants.map((participant) => (
              <li key={participant.id} className="text-sm">
                {participant.guestName} ({participant.email})
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDistributing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDistribute}
            disabled={isDistributing}
          >
            {isDistributing ? 'Sending...' : 'Send Emails'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}