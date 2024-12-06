"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { Timestamp } from "firebase/firestore";
import { signCertificate } from "@/utils/signCertificate";
import toast from "react-hot-toast";
import Certificate from '@/components/Certificate';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { generateCertificatePDF } from "@/utils/generateCertificatePDF";

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
};

export const participantColumns: ColumnDef<Participant>[] = [
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
            const status = row.getValue("status") as string;
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
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const participant = row.original;

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
            
                    toast.success('Certificate signed successfully', { id: toastId });
            
                    // Optional: Open signed certificate in new tab
                    if (result.url) {
                        window.open(result.url, '_blank');
                    }
                } catch (error) {
                    console.error('Error signing certificate:', error);
                    toast.error(
                        error instanceof Error ? error.message : 'Failed to sign certificate', 
                        { id: toastId }
                    );
                }
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {participant.status === 'pending' ? (
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
                        {participant.status === 'signed' && participant.signedPdfUrl && (
                            <DropdownMenuItem>
                                <a
                                    href={participant.signedPdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cursor-pointer"
                                >
                                    Download Certificate
                                </a>
                            </DropdownMenuItem>
                        )}
                        {participant.status === 'error' && (
                            <DropdownMenuItem className="text-red-600">
                                Error: {participant.errorMessage || 'Unknown error'}
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];