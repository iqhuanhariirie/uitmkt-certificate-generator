"use client";

import { fetchImageSize } from "@/utils/fetchImageSize";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { fetchDominantColorFromImage } from "@/utils/fetchDominantColorFromImage";
import { getTextColor } from "@/utils/getTextColor";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import signpdf from '@signpdf/signpdf';
import { P12Signer } from '@signpdf/signer-p12';
import { pdflibAddPlaceholder } from '@signpdf/placeholder-pdf-lib';
import { PDFDocument } from 'pdf-lib';
import { db, storage } from '@/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Certificate = ({
  eventDate,
  certificateTemplate,
  guestName,
  studentID,
  course,
  part,
  group,
  certId
}: {
  eventDate: Timestamp;
  certificateTemplate: string;
  guestName: string;
  studentID: string;
  course: string;
  part: number;
  group: string;
  certId: string;
}) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [backgroundColor, setBackgroundColor] = useState({ r: 0, g: 0, b: 0 });

  useEffect(() => {
    const getImageSize = async () => {
      const size = await fetchImageSize(certificateTemplate);
      setImageSize(size);
    };
    const getBackgroundColor = async () => {
      const color = await fetchDominantColorFromImage(certificateTemplate);
      setBackgroundColor(color);
    };
    getImageSize(); // Gets image size of certificate from Firebase URL
    getBackgroundColor(); // Gets dominant color of the certificate to ensure the text is better as black or white design-wise
  }, [certificateTemplate]);

  if (imageSize.width === 0 || imageSize.height === 0) {
    return null; // Render nothing until imageSize is fetched
  }

  const { width, height } = imageSize;
  const scaleFactor = Math.min(width, height) / 1500; // Adjust this factor as needed
  const textColor = getTextColor(
    backgroundColor.r,
    backgroundColor.g,
    backgroundColor.b
  );

  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      backgroundColor: "#ffffff",
    },
    wrapper: {
      flex: 1,
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    textContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      textAlign: "center",
      fontSize: 120 * scaleFactor,
      fontWeight: "bold",
      color: textColor,
    },
    signatureArea: {
      position: "absolute",
      bottom: 20,
      right: 20,
      textAlign: "right",
    },
    smallText: {
      fontSize: 8,
      color: textColor,
    },
  });

  const certificateContent = (
    <Page size={[width, height]} style={styles.page}>
      <View style={styles.wrapper}>
        <Image src={certificateTemplate} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.text}>{guestName}</Text>
          <Text style={styles.text}>{studentID}</Text>
          <Text style={styles.text}>{course}</Text>
          <Text style={styles.text}>{part}</Text>
          <Text style={styles.text}>{group}</Text>
          <Text style={styles.text}>
            {eventDate.toDate().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </View>
        <View style={styles.signatureArea}>
          <Text style={styles.smallText}>Certificate ID: {certId}</Text>
          <Text style={styles.smallText}>Verify at: yourwebsite.com/verify/{certId}</Text>
        </View>
      </View>
    </Page>
  );

  return (
    <Document onRender={async (blob) => {
      try {
        
        // 1. Generate PDF blob
        const pdfBlob = await pdf(
          <Document>{certificateContent}</Document>
        ).toBlob();

        // 2. Convert Blob to ArrayBuffer
        const pdfArrayBuffer = await pdfBlob.arrayBuffer();

        // 3. Load PDF with pdf-lib
        const pdfDoc = await PDFDocument.load(new Uint8Array(pdfArrayBuffer));

        // 4. Add signature placeholder
        await pdflibAddPlaceholder({
          pdfDoc,
          reason: 'Certificate Validation',
          contactInfo: 'certificate@yourdomain.com',
          name: 'Certificate Authority',
          location: 'Your Organization',
          signatureLength: 3322,
        });

        // 5. Serialize the PDF with placeholder
        const pdfWithPlaceholder = await pdfDoc.save();

        // 6. Create signer with P12 certificate
        const signer = new P12Signer(Buffer.from(process.env.P12_CERTIFICATE!, 'base64'), {
          passphrase: process.env.P12_PASSPHRASE
        });

        // 7. Sign the PDF
        const signedPdf = await signpdf.sign(Buffer.from(pdfWithPlaceholder), signer);

        // 8. Upload to Firebase Storage
        const storageRef = ref(storage, `certificates/${certId}.pdf`);
        await uploadBytes(storageRef, signedPdf);
        const pdfUrl = await getDownloadURL(storageRef);

        // 9. Update certificate document
        await updateDoc(doc(db, 'certificates', certId), {
          pdfUrl,
          status: 'signed',
          signedAt: Timestamp.now()
        });

      } catch (error) {
        console.error('Error signing PDF:', error);
      }
    }}>
      {certificateContent}
    </Document>
  );
};

export default Certificate;
