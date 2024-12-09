import { FormType, OptionalFormType } from "@/components/EventForm";
import { db } from "@/firebase/config";
import { compressBanner } from "@/utils/compressBanner";
import { parseCSV } from "@/utils/parseCSV";
import { uploadPhoto } from "@/utils/uploadToStorage";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export type SignatureInfo = {
  reason: string;
  contactInfo: string;
  name: string;
  location: string;
};

export type Certificate = {
  eventId: string;
  guestName: string;
  studentID: string;
  email: string;
  course: string;
  part: number;
  group: string;
  certId: string;
  status: 'pending' | 'signed' | 'error';
  createdAt: Timestamp;
  certificateTemplate: string;
  signedPdfUrl: string | null;
  signedAt: Timestamp | null;
  signatureInfo: SignatureInfo;
  errorMessage?: string | null;
};

// Add default signature info
const DEFAULT_SIGNATURE_INFO: SignatureInfo = {
  reason: 'Certificate Validation',
  contactInfo: 'uitm.kppim@uitm.edu.my',
  name: 'UITM KT CDCS230',
  location: 'Kuala Terengganu'
};

export type Guest = {
  email: string;
  name: string;
  studentID: string;
  course: string;
  part: number;
  group: string;
  certId: string;
  certificateId?: string;
};

export type InitialPayload = {
  eventName: string;
  description: string;
  eventDate: Timestamp;
  guestList?: Guest[];
};

export type FilePayload = {
  eventBanner?: string;
  certificateTemplate?: string;
};

export const sendDocumentToFirestore = async (payload: FormType) => {
  try {
    console.log("Payload received in sendDocumentToFirestore:", payload);
    console.log("Guest list file before parsing:", payload.guestList);

    // 1. Parse guest list from CSV
    const parsedGuestList: Guest[] = await parseCSV(payload.guestList); // Convert .csv file to JSON format
    console.log("Successfully parsed guest list:", parsedGuestList);
    // 2. Create event document first (without guest list)
    const eventDocRef = await addDoc(collection(db, "events"), {
      eventName: payload.eventName || "",
      description: payload.description || "",
      eventDate: payload.eventDate ? Timestamp.fromDate(payload.eventDate) : Timestamp.now(),
    });

    // 3. Upload files
    // Compress event banner to ensure fast loading of event page. It is blurred so losing quality is fine.
    const compressedBanner = await compressBanner(payload.eventBanner);
    const eventBannerURL: string = await uploadPhoto(
      eventDocRef.id,
      compressedBanner,
      "banner"
    );
    const certificateTemplateURL: string = await uploadPhoto(
      eventDocRef.id,
      payload.certificateTemplate,
      "cert"
    );

    // 4. Create certificate documents for each guest
    const certificatePromises = parsedGuestList.map(async (guest) => {
      const certRef = await addDoc(collection(db, 'certificates'), {
        eventId: eventDocRef.id,
        guestName: guest.name,
        studentID: guest.studentID,
        email: guest.email,
        course: guest.course,
        part: guest.part,
        group: guest.group,
        certId: guest.certId,
        status: 'pending',
        createdAt: Timestamp.now(),
        certificateTemplate: certificateTemplateURL,
        signedPdfUrl: null,
        signedAt: null,
        signatureInfo: DEFAULT_SIGNATURE_INFO,
        errorMessage: null
      } as Certificate);

      return {
        ...guest,
        certificateId: certRef.id // Add reference to certificate document
      };
    });

    // 5. Wait for all certificate documents to be created
    const updatedGuestList = await Promise.all(certificatePromises);

    // 6. Update event document with files and guest list
    await updateDoc(eventDocRef, {
      eventBanner: eventBannerURL,
      certificateTemplate: certificateTemplateURL,
      guestList: updatedGuestList
    });

    console.log("Event and certificates successfully uploaded to Firebase!");
  } catch (error: any) {
    console.error("Uploading event error occurred", error.message);
    throw error;
  }
};

export const editDocumentInFirestore = async ({
  payload,
  id,
}: {
  payload: OptionalFormType;
  id: string;
}) => {
  try {
    const eventDocRef = doc(db, "events", id);

    // 1. Handle non-file updates
    const initialPayload: InitialPayload = {
      eventName: payload.eventName,
      description: payload.description,
      eventDate: Timestamp.fromDate(payload.eventDate),
    };

    // 2. Handle guest list if provided
    if (payload.guestList) {
      const parsedGuestList: Guest[] = await parseCSV(payload.guestList);

      const eventDoc = await getDoc(eventDocRef);
      const certificateTemplateURL = eventDoc.data()?.certificateTemplate || '';

      // Create new certificate documents
      const certificatePromises = parsedGuestList.map(async (guest) => {
        const certRef = await addDoc(collection(db, 'certificates'), {
          eventId: id,
          guestName: guest.name,
          studentID: guest.studentID,
          email: guest.email,
          course: guest.course,
          part: guest.part,
          group: guest.group,
          certId: guest.certId,
          status: 'pending',
          createdAt: Timestamp.now(),
          certificateTemplate: certificateTemplateURL, // Add this
          signedPdfUrl: null,
          signedAt: null,
          signatureInfo: DEFAULT_SIGNATURE_INFO,
          errorMessage: null
        } as Certificate);


        return {
          ...guest,
          certificateId: certRef.id
        };
      });

      const updatedGuestList = await Promise.all(certificatePromises);
      initialPayload.guestList = updatedGuestList;
    }

    // 3. Update event document with initial payload
    await updateDoc(eventDocRef, initialPayload);

    // 4. Handle file updates if provided
    if (payload.eventBanner) {
      const compressedBanner = await compressBanner(payload.eventBanner);
      const eventBannerURL = await uploadPhoto(id, compressedBanner, "banner");
      await updateDoc(eventDocRef, { eventBanner: eventBannerURL });
    }

    if (payload.certificateTemplate) {
      const certificateTemplateURL = await uploadPhoto(
        id,
        payload.certificateTemplate,
        "cert"
      );
      await updateDoc(eventDocRef, { certificateTemplate: certificateTemplateURL });

      // Update template URL in all pending certificates
      const certificatesQuery = query(
        collection(db, 'certificates'),
        where('eventId', '==', id),
        where('status', '==', 'pending')
      );
      const certificatesSnapshot = await getDocs(certificatesQuery);

      const templateUpdatePromises = certificatesSnapshot.docs.map(doc =>
        updateDoc(doc.ref, { certificateTemplate: certificateTemplateURL })
      );

      await Promise.all(templateUpdatePromises);
    }

    console.log("Event successfully edited in Firebase!");
  } catch (error: any) {
    console.error("Editing event error occurred", error.message);
    throw error;
  }
};
