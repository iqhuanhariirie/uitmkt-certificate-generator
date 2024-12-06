"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { DataTable } from "@/components/DataTableParticipant";
import { participantColumns, Participant } from "./ui/participant-columns";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import toast from "react-hot-toast";
import { Users, Download } from "lucide-react";

export function ParticipantList({ eventId }: { eventId: string }) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "certificates"),
          where("eventId", "==", eventId)
        );

        const querySnapshot = await getDocs(q);
        const participantsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          eventId,
          ...doc.data()
        })) as Participant[];

        setParticipants(participantsData);
      } catch (error) {
        console.error("Error fetching participants:", error);
        toast.error("Failed to load participants");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [eventId]);

  const filteredParticipants = participants.filter(participant =>
    participant.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    participant.studentID.toLowerCase().includes(searchQuery.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadParticipantsList = () => {
    try {
      const headers = ["Name", "Student ID", "Email", "Course", "Part", "Group", "Status"];
      const csvContent = [
        headers.join(","),
        ...filteredParticipants.map(p => 
          [
            p.guestName,
            p.studentID,
            p.email,
            p.course,
            p.part,
            p.group,
            p.status
          ].join(",")
        )
      ].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `participants-${eventId}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Participants list downloaded successfully");
    } catch (error) {
      toast.error("Failed to download participants list");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Event Participants</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={downloadParticipantsList}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>
          <Button
            variant="default"
            onClick={() => {
              toast.loading("Signing certificates...", {
                id: "batch-signing",
              });
              // We'll implement batch signing later
            }}
            disabled={!filteredParticipants.some(p => p.status === 'pending')}
          >
            Sign All Pending
          </Button>
        </div>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Search by name, student ID, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2">Loading participants...</p>
          </div>
        </div>
      ) : (
        <DataTable 
          columns={participantColumns} 
          data={filteredParticipants}
        />
      )}

      <div className="text-sm text-gray-500">
        Total Participants: {filteredParticipants.length}
      </div>
    </div>
  );
}