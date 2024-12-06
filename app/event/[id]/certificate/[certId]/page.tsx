"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { Participant } from "@/components/ui/participant-columns";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PDFViewer } from "@react-pdf/renderer";
import Certificate from "@/components/Certificate";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ViewCertificatePage({
  params,
}: {
  params: { id: string; certId: string };
}) {
  const [certificate, setCertificate] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const certificateRef = doc(db, "certificates", params.certId);
        const certificateSnap = await getDoc(certificateRef);

        if (!certificateSnap.exists()) {
          setError("Certificate not found");
          return;
        }

        const certificateData = {
          id: certificateSnap.id,
          ...certificateSnap.data(),
        } as Participant;

        // Verify this certificate belongs to the correct event
        if (certificateData.eventId !== params.id) {
          setError("Certificate does not belong to this event");
          return;
        }

        setCertificate(certificateData);
      } catch (err) {
        console.error("Error fetching certificate:", err);
        setError("Failed to load certificate");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [params.certId, params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Are you lost buddy?</CardTitle>
            <CardDescription>
              Seems like you entered the wrong URL.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-gray-600">
              {error || "Certificate does not exist"}
            </p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{certificate.guestName}</CardTitle>
              <CardDescription>
                Status:{" "}
                <span
                  className={`font-semibold 
                    ${certificate.status === "signed" ? "text-green-600" : ""}
                    ${certificate.status === "pending" ? "text-yellow-600" : ""}
                    ${certificate.status === "error" ? "text-red-600" : ""}
                  `}
                >
                  {certificate.status}
                </span>
              </CardDescription>
            </div>
            <div className="space-x-4">
              <Button variant="outline" onClick={() => router.back()}>
                Back to List
              </Button>
              {certificate.status === "signed" && certificate.signedPdfUrl && (
                <Button
                  onClick={() => window.open(certificate.signedPdfUrl!, "_blank")}
                >
                  Download Certificate
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Student ID</p>
              <p className="font-medium">{certificate.studentID}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{certificate.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Course</p>
              <p className="font-medium">{certificate.course}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Part & Group</p>
              <p className="font-medium">
                Part {certificate.part}, Group {certificate.group}
              </p>
            </div>
            {certificate.signedAt && (
              <div>
                <p className="text-sm text-gray-500">Signed At</p>
                <p className="font-medium">
                  {certificate.signedAt.toDate().toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Certificate Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white rounded-lg shadow-inner p-4">
            <PDFViewer className="w-full h-[800px]">
              <Certificate
                certificateTemplate={certificate.certificateTemplate}
                guestName={certificate.guestName}
                
              />
            </PDFViewer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}