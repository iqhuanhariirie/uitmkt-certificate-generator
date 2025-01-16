"use client";

import { ColumnDef, SortingFn, sortingFns } from "@tanstack/react-table";
import { Timestamp } from "firebase/firestore";
import { EventDropdown } from "@/components/EventDropdown";
import { ClubDropdown } from "@/components/ClubDropdown";
import { ArrowDown, ArrowUp, ArrowUpDown, ImageIcon } from "lucide-react";
import Image from "next/image";
import { Button } from '@/components/ui/button';

export type Event = {
  id: string;
  name: string;
  date: Timestamp;
  description: string;
  guests: number;
  eventBanner: string;
  createdAt: Timestamp;
};

export type Club = {
  id: string;
  clubName: string;
  createdAt: Timestamp;
};
const SortIcon = ({ sorted }: { sorted: false | 'asc' | 'desc' }) => {
  if (!sorted) return <ArrowUpDown className="ml-2 h-4 w-4" />;
  if (sorted === 'asc') return <ArrowUp className="ml-2 h-4 w-4" />;
  return <ArrowDown className="ml-2 h-4 w-4" />;
};

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-center w-full"
        >
          Created At
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Timestamp;
      const seconds = date.seconds;
      const dateObj = new Date(seconds * 1000);
      return (
        <div className="text-center">
          {dateObj.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const timestampA = rowA.getValue("createdAt") as Timestamp;
      const timestampB = rowB.getValue("createdAt") as Timestamp;
      
      if (!timestampA || !timestampB) return 0;
      return timestampA.seconds - timestampB.seconds;
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-center w-full"
        >
          Event Date
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("date") as Timestamp;
      const seconds = date.seconds;
      const dateObj = new Date(seconds * 1000);
      const outputDate = new Date(seconds * 1000).toLocaleDateString().split("T")[0];
      return (
        <div className="text-center">
            {dateObj.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })}
        </div>
    );
    },
    sortingFn: (rowA, rowB) => {
      const dateA = (rowA.getValue("date") as Timestamp).seconds;
      const dateB = (rowB.getValue("date") as Timestamp).seconds;
      return dateA - dateB;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("name")}</div>;
    }
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("description")}</div>;
    }
  },
  {
    accessorKey: "guests",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-center w-full"
        >
          Participants
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="bg-[#F0F1FA] dark:bg-[#0f1a36] text-center rounded-lg py-1">
          {row.getValue("guests")}
        </div>
      );
    },
    sortingFn: sortingFns.alphanumeric
  },
  {
    id: "banner",
    header: "",
    cell: ({ row }) => {
      const event = row.original;
      console.log("Event banner URL:", event.eventBanner);
      return (
        <div className="relative h-14 w-36 rounded-md overflow-hidden mx-auto">
          {event.eventBanner ? (
            <Image
              src={event.eventBanner}
              alt={event.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="h-full w-full bg-gray-100 flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const event = row.original;
      return (
        <div className="flex justify-center"> {/* Center the actions dropdown */}
          <EventDropdown eventData={event} />
        </div>
      );
    },
  },
];

export const clubColumns: ColumnDef<Club>[] = [
  
    {
      accessorKey: "clubName",
      header: "Club Name",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as Timestamp;
        const seconds = date.seconds;
        const outputDate = new Date(seconds * 1000).toLocaleDateString().split("T")[0];
        return <div className="text-center">{outputDate}</div>;
      },
    },
   
    {
      id: "actions",
      cell: ({ row }) => {
        const club = row.original;
        return <ClubDropdown clubData={club} />;
      },
    },
  ];
