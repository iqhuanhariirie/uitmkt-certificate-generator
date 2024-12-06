"use client";


import { ParticipantList } from "@/components/ParticipantList";
import { useParams } from "next/navigation";

export default function ParticipantsPage() {
  const params = useParams();
  const eventId = params.id as string;

  return (
    <div className="container mx-auto py-10">
      <ParticipantList eventId={eventId} />
    </div>
  );
}
