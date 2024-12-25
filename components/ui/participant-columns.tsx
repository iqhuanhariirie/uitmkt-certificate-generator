"use client";

import { CellContext, ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Timestamp } from "firebase/firestore";
import { signCertificate } from "@/utils/signCertificate";
import toast from "react-hot-toast";
import { deleteCertificate } from "@/utils/deleteFromFirebase";
import { Checkbox } from "@/components/ui/checkbox";
import Certificate from '@/components/Certificate';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { generateCertificatePDF } from "@/utils/generateCertificatePDF";
import { useState } from "react";

export type Participant = {
    id: string;
    eventId: string;
    guestName: string;
    studentID: string;
    email: string;
    course: string;
    part: number;
    group: string;
    certId: string;
    status: 'pending' | 'signed' | 'error';
    signedAt: Timestamp | null;
    signedPdfUrl: string | null;
    errorMessage?: string;
    eventDate: Timestamp;
    certificateTemplate: string;
    namePosition: {
        top: number;
        left: number;
        fontSize: number;
    };
};

const StatusCell = ({ participant }: { participant: Participant }) => {
    const [status, setStatus] = useState(participant.status);
    return (
      <div className={`
        px-2 py-1 rounded-full text-xs font-medium text-center
        ${status === 'signed' ? 'bg-green-100 text-green-800' : ''}
        ${status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
        ${status === 'error' ? 'bg-red-100 text-red-800' : ''}
      `}>
        {status}
      </div>
    );
  };

interface ActionsCellProps extends CellContext<Participant, any> {
    onRefresh?: () => Promise<void>;
}

const ActionCell = (props: ActionsCellProps) => {
    const { row, onRefresh } = props;
    const participant = row.original;
    const [status, setStatus] = useState(participant.status);
    const [signedUrl, setSignedUrl] = useState(participant.signedPdfUrl);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleSign = async () => {
        const toastId = toast.loading('Signing certificate...');
        try {
            // Generate PDF for certificate
            const pdfBytes = await generateCertificatePDF(participant);
            if (!pdfBytes) {
                throw new Error('Failed to generate PDF');
            }

            const result = await signCertificate(participant, pdfBytes);
            if (!result.success) {
                throw new Error(result.error || 'Failed to sign certificate');
            }
            // Update local state
            setStatus('signed');
            if (result.url) {
                setSignedUrl(result.url);
            }
            // Refresh the data after successful signing
            if (onRefresh) {
                await onRefresh();
            }

            toast.success('Certificate signed successfully', { id: toastId });

            // Optional: Open signed certificate in new tab
            if (result.url) {
                window.open(`/event/${participant.eventId}/certificate/${participant.id}`, '_blank');
            }
        } catch (error) {
            setStatus('error');
            console.error('Error signing certificate:', error);
            toast.error(
                error instanceof Error ? error.message : 'Failed to sign certificate',
                { id: toastId }
            );
        }
    };
    const handleDelete = async () => {
        const toastId = toast.loading('Deleting certificate...');
        try {
            await deleteCertificate(participant.id);
            if (onRefresh) {
                await onRefresh();
            }
            toast.success('Certificate deleted successfully', { id: toastId });
            setShowDeleteDialog(false);
        } catch (error) {
            console.error('Error deleting certificate:', error);
            toast.error('Failed to delete certificate', { id: toastId });
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    {status === 'pending' ? (
                        <DropdownMenuItem onClick={handleSign}>
                            Sign Certificate
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem asChild>
                            <Link
                                href={`/event/${participant.eventId}/certificate/${participant.id}`}
                                className="cursor-pointer w-full"
                            >
                                View Certificate
                            </Link>
                        </DropdownMenuItem>
                    )}
                    {status === 'signed' && signedUrl && (
                        <DropdownMenuItem>
                            <a
                                href={signedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cursor-pointer"
                            >
                                Download Certificate
                            </a>
                        </DropdownMenuItem>
                    )}
                    {status === 'error' && (
                        <DropdownMenuItem className="text-red-600">
                            Error: {participant.errorMessage || 'Unknown error'}
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                        onSelect={(e) => {
                            e.preventDefault();
                            setShowDeleteDialog(true);
                        }}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Certificate
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Certificate</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the certificate for {participant.guestName}?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

// Add a new type for selected items
export type SelectedCertificates = {
    [key: string]: boolean;
  };

export const participantColumns: ColumnDef<Participant>[] = [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
    {
        accessorKey: "guestName",
        header: "Name",
    },
    {
        accessorKey: "studentID",
        header: "Student ID",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "course",
        header: "Course",
    },
    {
        accessorKey: "part",
        header: () => <div className="text-center">Part</div>,
        cell: ({ row }) => {
            return <div className="text-center">{row.getValue("part")}</div>;
        },
    },
    {
        accessorKey: "group",
        header: () => <div className="text-center">Group</div>,
        cell: ({ row }) => {
            return <div className="text-center">{row.getValue("group")}</div>;
        },
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {
            const participant = row.original;
            return <StatusCell participant={participant} />;
        }
    },
    {
        id: "actions",
        cell: ActionCell
    },
];