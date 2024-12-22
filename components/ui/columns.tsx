"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Timestamp } from "firebase/firestore";
import { EventDropdown } from "@/components/EventDropdown";
import { ClubDropdown } from "@/components/ClubDropdown";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

export type Event = {
  id: string;
  name: string;
  date: Timestamp;
  description: string;
  guests: number;
  eventBanner: string;
};

export type Club = {
  id: string;
  clubName: string;
  createdAt: Timestamp;
};

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date") as Timestamp;
      const seconds = date.seconds;
      const outputDate = new Date(seconds * 1000).toLocaleDateString().split("T")[0];
      return <div className="text-center">{outputDate}</div>;
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
    header: "Participants",
    cell: ({ row }) => {
      return (
        <div className="bg-[#F0F1FA] dark:bg-[#0f1a36] text-center rounded-lg py-1">
          {row.getValue("guests")}
        </div>
      );
    },
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
