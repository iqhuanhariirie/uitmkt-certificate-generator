"use client";


import { ParticipantList } from "@/components/ParticipantList";
import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ParticipantsPage() {
  const params = useParams();
  const eventId = params.id as string;
  const [eventName, setEventName] = useState<string>("");

  useEffect(() => {
    const fetchEventName = async () => {
      const docRef = doc(db, "events", eventId);
      const eventDoc = await getDoc(docRef);
      if (eventDoc.exists()) {
        setEventName(eventDoc.data().eventName);
      }
    };
    fetchEventName();
  }, [eventId]);

  return (
    <ProtectedRoute requireAdmin>
    <div className="container mx-auto py-6">
      <div className="mb-6 space-y-4">
        <div className="flex items-center text-sm text-gray-500">
          <Link href="/admin/home" className="hover:text-gray-700">
            Events
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-700">{eventName}</span>
        </div>
        {/* <h1 className="text-2xl font-bold">{eventName}</h1> */}
      </div>
      <ParticipantList eventId={eventId} />
    </div>
    </ProtectedRoute>
  );
}
