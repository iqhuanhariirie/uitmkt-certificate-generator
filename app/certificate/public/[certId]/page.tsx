// app/certificate/public/[certId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { Participant } from "@/components/ui/participant-columns";
import { Button } from "@/components/ui/button";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import uitmLogo from "@/assets/UiTM Logo Vector.svg";
import { toast } from 'react-hot-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, ExternalLink } from "lucide-react";
import { RingLoader } from "@/components/RingLoader";
import Image from "next/image";
import Link from "next/link";

interface EventData {
  id: string;
  eventName: string;
}
interface DownloadButtonProps {
  url: string;
  filename: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ url, filename }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadCertificate = async () => {
    setIsDownloading(true);
    const toastId = toast.loading('Downloading certificate...');

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.success('Download completed', { id: toastId });
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download certificate', { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      className="w-full md:w-auto"
      onClick={downloadCertificate}
      disabled={isDownloading}
    >
      <Download className="mr-2 h-4 w-4" />
      {isDownloading ? 'Downloading...' : 'Download Certificate'}
    </Button>
  );
};

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
          <RingLoader />
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
              We couldn&apos;t find the certificate you&apos;re looking for.
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
            <Image
              src={uitmLogo}
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
            {certificate && certificate.signedPdfUrl && (
              <DownloadButton 
                url={certificate.signedPdfUrl}
                filename={`${certificate.guestName}-certificate.pdf`}
              />
            )}
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
        <p><Link
          href={`/verify?id=${certificate.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="outline"
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Verify this certificate
          </Button>
        </Link></p>
        <p>Certificate ID: {certificate.id}</p>
      </div>
    </div>
  );
}