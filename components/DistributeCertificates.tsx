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
import { AlertCircle, Mail } from "lucide-react";
import { Participant } from "./ui/participant-columns";
import toast from "react-hot-toast";

interface DistributeCertificatesProps {
  selectedParticipants: Participant[];
  eventName: string;
  onSuccess?: () => void;
  onRefresh?: () => Promise<void>;
}
interface EmailResult {
  email: string;
  success: boolean;
  error?: string;
}

interface EmailResponse {
  success: boolean;
  results: EmailResult[];
  summary?: {
    total: number;
    successful: number;
    failed: number;
  };
  error?: string;
}
export function DistributeCertificates({
  selectedParticipants,
  eventName,
  onSuccess,
  onRefresh
}: DistributeCertificatesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDistributing, setIsDistributing] = useState(false);
  const [progress, setProgress] = useState({ sent: 0, total: 0 });

  // Filter out unsigned certificates
  const signedParticipants = selectedParticipants.filter(p => p.status === 'signed');
  const unsignedParticipants = selectedParticipants.filter(p => p.status !== 'signed');

  const handleDistribute = async () => {
    if (signedParticipants.length === 0) return;

    const toastId = toast.loading(
      `Sending certificates to ${signedParticipants.length} participants...`
    );
    setIsDistributing(true);
    setProgress({ sent: 0, total: signedParticipants.length });

    try {
      const recipients = signedParticipants.map(participant => ({
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

      const result = await response.json() as EmailResponse;

      if (!result.success) {
        throw new Error(result.error || 'Failed to send emails');
      }

      const successCount = result.summary?.successful || 0;
      const failureCount = result.summary?.failed || 0;

      if (failureCount > 0) {
        toast.error(`Failed to send ${failureCount} emails`, { id: toastId });
      } else {
        toast.success(`Successfully sent ${successCount} certificates`, { id: toastId });
      }

      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error distributing certificates:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to distribute certificates', { id: toastId });
    } finally {
      setIsDistributing(false);
      setProgress({ sent: 0, total: 0 });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={selectedParticipants.length === 0 || signedParticipants.length === 0}
        >
          <Mail className="mr-2 h-4 w-4" />
          Distribute Certificates ({signedParticipants.length})
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Distribute Certificates</DialogTitle>
          <DialogDescription>
            Send certificate access links to {signedParticipants.length} participants via email.
          </DialogDescription>
        </DialogHeader>

        {unsignedParticipants.length > 0 && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Unsigned Certificates
                </h3>
                <div className="mt-1 text-sm text-red-700">
                  {unsignedParticipants.length} selected certificate(s) cannot be sent because they are not signed yet.
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-h-[200px] overflow-y-auto mt-4">
          {signedParticipants.length > 0 && (
            <>
              <h3 className="font-medium mb-2 text-sm">Ready to Send:</h3>
              <ul className="space-y-2">
                {signedParticipants.map((participant) => (
                  <li key={participant.id} className="text-sm">
                    {participant.guestName} ({participant.email})
                  </li>
                ))}
              </ul>
            </>
          )}

          {unsignedParticipants.length > 0 && (
            <>
              <h3 className="font-medium mt-4 mb-2 text-sm text-red-600">
                Needs Signature:
              </h3>
              <ul className="space-y-2">
                {unsignedParticipants.map((participant) => (
                  <li key={participant.id} className="text-sm text-red-600">
                    {participant.guestName} ({participant.email})
                  </li>
                ))}
              </ul>
            </>
          )}
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
            disabled={isDistributing || signedParticipants.length === 0}
          >
            {isDistributing ? 'Sending...' : `Send ${signedParticipants.length} Email${signedParticipants.length !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}