"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Timestamp } from "firebase/firestore";
import { EventDropdown } from "@/components/EventDropdown";
import { ClubDropdown } from "@/components/ClubDropdown";

export type Event = {
  id: string;
  name: string;
  date: Timestamp;
  description: string;
  guests: number;
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
  },
  {
    accessorKey: "description",
    header: "Description",
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
    id: "actions",
    cell: ({ row }) => {
      const event = row.original;
      return <EventDropdown eventData={event} />;
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
