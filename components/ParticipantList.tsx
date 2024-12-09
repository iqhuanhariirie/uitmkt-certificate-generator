"use client";

import { useEffect, useState, useCallback } from "react";
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { DataTable } from "@/components/DataTableParticipant";
import { participantColumns, Participant } from "./ui/participant-columns";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import toast from "react-hot-toast";
import { Users, Download } from "lucide-react";
import { signCertificate } from "@/utils/signCertificate";
import { generateCertificatePDF } from "@/utils/generateCertificatePDF";
import { useAuth } from "@/context/AuthContext"; // Add this import

export function ParticipantList({ eventId }: { eventId: string }) {
  const { user, checkIfUserIsAdmin } = useAuth(); // Add this line
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchParticipants = useCallback(async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "certificates"),
        where("eventId", "==", eventId)
      );

      // First get the event details to get the namePosition
    const eventDoc = await getDoc(doc(db, "events", eventId));
    if (!eventDoc.exists()) {
      throw new Error("Event not found");
    }
    const eventData = eventDoc.data();

    const querySnapshot = await getDocs(q);
    const participantsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      eventId,
      ...doc.data(),
      eventDate: doc.data().eventDate,
      certificateTemplate: doc.data().certificateTemplate,
      namePosition: eventData.namePosition || {  // Add the namePosition from event
        top: 50,
        left: 50,
        fontSize: 24
      }
    })) as Participant[];


      setParticipants(participantsData);
    } catch (error) {
      console.error("Error fetching participants:", error);
      toast.error("Failed to load participants");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

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
          ].join(","))
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

  const batchSignCertificates = async () => {
    // Add auth check at the start of the function
    if (!user || !checkIfUserIsAdmin(user)) {
      toast.error("You must be an admin to sign certificates");
      return;
    }

    const pendingCertificates = participants.filter(p => p.status === 'pending');
    const batchSize = 5;

    const toastId = toast.loading(
      `Preparing to sign ${pendingCertificates.length} certificates...`
    );

    try {
      const idToken = await user.getIdToken();
      console.log("Got ID token:", idToken.substring(0, 10) + "...");
      const certificateBatches = [];
      for (let i = 0; i < pendingCertificates.length; i += batchSize) {
        const batch = pendingCertificates.slice(i, i + batchSize);

        // Generate PDFs for the batch
        const batchData = await Promise.all(
          batch.map(async (cert) => ({
            certificateId: cert.id,
            pdfBytes: Array.from(await generateCertificatePDF(cert))
          }))
        );

        certificateBatches.push(batchData);
      }

      let totalSuccess = 0;
      let totalFailed = 0;

      // Process each batch
      for (let i = 0; i < certificateBatches.length; i++) {
        const batch = certificateBatches[i];

        toast.loading(
          `Processing batch ${i + 1}/${certificateBatches.length}...`,
          { id: toastId }
        );

        const response = await fetch('/api/certificates/batch-sign', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({ certificates: batch })
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Server response:", errorData); // Log server error
          throw new Error(errorData.error || 'Failed to process batch');
        }

        const result = await response.json();
        totalSuccess += result.success;
        totalFailed += result.failed;
      }

      toast.success(
        `Signed ${totalSuccess} certificates. Failed: ${totalFailed}`,
        { id: toastId }
      );

      // Refresh the participants list
      await fetchParticipants();
    } catch (error) {
      console.error('Batch signing error:', error);
      toast.error('Failed to complete batch signing', { id: toastId });
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
            onClick={batchSignCertificates}
            disabled={
              !filteredParticipants.some(p => p.status === 'pending') ||
              !user ||
              !checkIfUserIsAdmin(user) // Add this condition
            }
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