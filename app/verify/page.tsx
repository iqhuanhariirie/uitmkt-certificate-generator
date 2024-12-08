"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { Upload, CheckCircle2, XCircle } from "lucide-react";
import { Certificate } from "@/utils/uploadToFirestore";

type VerificationStatus = 'idle' | 'loading' | 'valid' | 'invalid';

interface VerificationResponse {
  isValid: boolean;
  certificate?: Certificate;
  error?: string;
  signatureInfo?: {
    reason?: string;
    name?: string;
    location?: string;
    signedAt?: Date;
  };
}

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('idle');
  const [verificationResult, setVerificationResult] = useState<VerificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
      setVerificationStatus('idle');
      setVerificationResult(null);
    }
  };

  const handleVerify = async () => {
    if (!file) return;

    try {
      setVerificationStatus('loading');
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/certificates/verify', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!result.isValid) {
        setVerificationStatus('invalid');
        setError(result.error);
        return;
      }

      setVerificationResult(result);
      setVerificationStatus('valid');
    } catch (err) {
      console.error('Verification error:', err);
      setVerificationStatus('invalid');
      setError('Failed to verify certificate');
    }
  };

  const getStatusColor = (status: VerificationStatus) => {
    switch (status) {
      case 'loading':
        return 'bg-blue-50 text-blue-700';
      case 'valid':
        return 'bg-green-50 text-green-700';
      case 'invalid':
        return 'bg-red-50 text-red-700';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Certificate Verification</CardTitle>
          <CardDescription>
            Upload a certificate to verify its authenticity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-gray-50 rounded-full">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  {file ? file.name : 'Drag and drop your certificate, or click to browse'}
                </p>
                <p className="text-xs text-gray-400 mt-1">PDF files only</p>
              </div>
              <Input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="certificate-upload"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('certificate-upload')?.click()}
              >
                Select File
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-center text-sm">
              {error}
            </div>
          )}

          {/* Preview Section */}
          {previewUrl && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
              <div className="h-[600px] border rounded-lg overflow-hidden">
                <Worker workerUrl="/assets/pdf/pdf.worker.min.js">
                  <Viewer
                    fileUrl={previewUrl}
                    plugins={[defaultLayoutPluginInstance]}
                  />
                </Worker>
              </div>
            </div>
          )}

          {/* Verification Result */}
          {verificationResult?.certificate && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Certificate Details</h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Name</dt>
                  <dd className="font-medium">{verificationResult.certificate.guestName}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Student ID</dt>
                  <dd className="font-medium">{verificationResult.certificate.studentID}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Course</dt>
                  <dd className="font-medium">{verificationResult.certificate.course}</dd>
                </div>
                {verificationResult.signatureInfo && (
                  <>
                    <div>
                      <dt className="text-sm text-gray-500">Signed By</dt>
                      <dd className="font-medium">{verificationResult.signatureInfo.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Signed At</dt>
                      <dd className="font-medium">
                        {verificationResult.signatureInfo.signedAt?.toLocaleString()}
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </div>
          )}

          {/* Verification Status */}
          {verificationStatus !== 'idle' && (
            <div className={`p-4 rounded-lg flex items-center gap-2 justify-center ${getStatusColor(verificationStatus)}`}>
              {verificationStatus === 'loading' && (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                  <span>Verifying certificate...</span>
                </>
              )}
              {verificationStatus === 'valid' && (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Certificate is valid</span>
                </>
              )}
              {verificationStatus === 'invalid' && (
                <>
                  <XCircle className="h-5 w-5" />
                  <span>Certificate is invalid</span>
                </>
              )}
            </div>
          )}

          {/* Verify Button */}
          {file && verificationStatus !== 'loading' && (
            <div className="flex justify-center">
              <Button
                onClick={handleVerify}
                className="w-full max-w-xs"
                disabled={verificationStatus === 'loading' as VerificationStatus}
              >
                Verify Certificate
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
