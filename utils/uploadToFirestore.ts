import { FormType, OptionalFormType } from "@/components/EventForm";
import { db } from "@/firebase/config";
import { compressBanner } from "@/utils/compressBanner";
import { parseCSV } from "@/utils/parseCSV";
import { uploadPhoto } from "@/utils/uploadToStorage";
import {
  Timestamp,
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
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
type NamePosition = {
  top: number;
  left: number;
  fontSize: number;
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

export type UpdateEventPayload = {
  eventName: string;
  description: string;
  eventDate: Timestamp;
  namePosition?: NamePosition; // Optional for updates
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
      namePosition: {
        top: payload.namePosition.top,
        left: payload.namePosition.left,
        fontSize: payload.namePosition.fontSize
      },
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

export const addParticipantsToEvent = async (eventId: string, guestList: Guest[]) => {
  try {
    // Get event document to get certificate template
    const eventDoc = await getDoc(doc(db, "events", eventId));
    if (!eventDoc.exists()) {
      throw new Error("Event not found");
    }
    
    const certificateTemplateURL = eventDoc.data().certificateTemplate;

    // Create certificate documents for each guest
    const certificatePromises = guestList.map(async (guest) => {
      const certRef = await addDoc(collection(db, 'certificates'), {
        eventId,
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
        certificateId: certRef.id
      };
    });

    const newParticipants = await Promise.all(certificatePromises);

    // Update event's guestList
    const eventRef = doc(db, "events", eventId);
    await updateDoc(eventRef, {
      guestList: arrayUnion(...newParticipants)
    });

    return newParticipants;
  } catch (error) {
    console.error("Error adding participants:", error);
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
    const batch = writeBatch(db);
    const now = Timestamp.now();

    // Handle basic updates
    const updatePayload: UpdateEventPayload = {
      eventName: payload.eventName,
      description: payload.description,
      eventDate: Timestamp.fromDate(payload.eventDate),
    };

    if (payload.namePosition) {
      updatePayload.namePosition = payload.namePosition;
    }

    // Update event document with initial payload
    batch.update(eventDocRef, updatePayload);

    // Handle file updates
    if (payload.eventBanner) {
      const compressedBanner = await compressBanner(payload.eventBanner);
      const eventBannerURL = await uploadPhoto(id, compressedBanner, "banner");
      batch.update(eventDocRef, { eventBanner: eventBannerURL });
    }

    if (payload.certificateTemplate) {
      const certificateTemplateURL = await uploadPhoto(
        id,
        payload.certificateTemplate,
        "cert"
      );

      // Store template history
      batch.update(eventDocRef, {
        certificateTemplate: certificateTemplateURL,
        lastTemplateUpdate: now,
        templateHistory: arrayUnion({
          url: certificateTemplateURL,
          updatedAt: now
        })
      });

      // Only update pending certificates
      const pendingCertsQuery = query(
        collection(db, 'certificates'),
        where('eventId', '==', id),
        where('status', '==', 'pending')
      );
      
      const pendingCerts = await getDocs(pendingCertsQuery);
      pendingCerts.forEach(doc => {
        batch.update(doc.ref, {
          certificateTemplate: certificateTemplateURL,
          lastTemplateUpdate: now
        });
      });
    }

    // Commit all changes
    await batch.commit();
    console.log("Event successfully edited in Firebase!");
  } catch (error) {
    console.error("Editing event error occurred:", error);
    throw error;
  }
};
