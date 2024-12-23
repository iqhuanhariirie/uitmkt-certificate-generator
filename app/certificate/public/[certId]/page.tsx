// app/certificate/public/[certId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { Participant } from "@/components/ui/participant-columns";
import { Button } from "@/components/ui/button";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download } from "lucide-react";

interface EventData {
    id: string;
    eventName: string;
  }

export default function PublicCertificateView({
  params,
}: {
  params: { certId: string };
}) {
  const [certificate, setCertificate] = useState<Participant | null>(null);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    const fetchCertificateAndEvent = async () => {
      try {
        //Fetch certificate
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

        // Only allow viewing of signed certificates
        if (certificateData.status !== "signed") {
          setError("This certificate is not yet available");
          return;
        }

        setCertificate(certificateData);

        // Fetch event data
        const eventRef = doc(db, "events", certificateData.eventId);
        const eventSnap = await getDoc(eventRef);

        if (!eventSnap.exists()) {
          setError("Event information not found");
          return;
        }

        setEventData({
          id: eventSnap.id,
          ...eventSnap.data()
        } as EventData);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load certificate");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificateAndEvent();
  }, [params.certId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading your certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Certificate Unavailable</CardTitle>
            <CardDescription>
              We couldn't find the certificate you're looking for.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-gray-600">
              {error || "Certificate does not exist"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col items-center text-center">
            <img 
              src="/logo.png" 
              alt="Organization Logo" 
              className="h-16 mb-4"
            />
            <CardTitle className="text-2xl mb-2">
              Certificate of Participation
            </CardTitle>
            <CardDescription className="text-lg">
              Awarded to {certificate.guestName}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-500">Event</p>
              <p className="font-medium">{eventData?.eventName}</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-500">Date Issued</p>
              <p className="font-medium">
                {certificate.signedAt?.toDate().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <Button
              className="w-full md:w-auto"
              onClick={() => window.open(certificate.signedPdfUrl!, "_blank")}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Certificate
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="bg-white rounded-lg shadow-inner">
            <div style={{ height: '800px' }}>
              <Worker workerUrl="/assets/pdf/pdf.worker.min.js">
                <Viewer
                  fileUrl={certificate?.signedPdfUrl || certificate?.certificateTemplate}
                  plugins={[defaultLayoutPluginInstance]}
                />
              </Worker>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-8 text-sm text-gray-500">
        <p>This certificate can be verified at our official website.</p>
        <p>Certificate ID: {certificate.id}</p>
      </div>
    </div>
  );
}