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
  updateDoc,
} from "firebase/firestore";

export type Guest = {
  email: string;
  name: string;
  studentID: string;
  course: string;
  part: number;
  group: string;
  certId: string;
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

    const parsedGuestList: Guest[] = await parseCSV(payload.guestList); // Convert .csv file to JSON format
    const initialPayload: InitialPayload = {
      eventName: payload.eventName || "", // Ensure eventName is not undefined
      description: payload.description || "", // Ensure description is not undefined
      eventDate: payload.eventDate ? Timestamp.fromDate(payload.eventDate) : Timestamp.now(), // Ensure eventDate is not undefined
      guestList: parsedGuestList || [], // Ensure guestList is not undefined
    };

    console.log("Initial payload before adding to Firestore:", initialPayload);

    const eventDocRef = await addDoc(collection(db, "events"), initialPayload); // Once payload has been added, proceed to storage file uploads.
    
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
    const filePayload: FilePayload = {
      eventBanner: eventBannerURL,
      certificateTemplate: certificateTemplateURL,
    };

    console.log("File payload before updating Firestore:", filePayload);

    await updateDoc(eventDocRef, filePayload); // Update document using eventDocRef so downloadURLs to files are added to Firestore doc.
    console.log("Event successfully uploaded to Firebase!");
  } catch (error: any) {
    console.error("Uploading event error occurred", error.message);
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
    let parsedGuestList: Guest[] | undefined;
    if (payload.guestList !== undefined) {
      parsedGuestList = await parseCSV(payload.guestList); // Convert .csv file to JSON format
    }

    const initialPayload: InitialPayload = {
      // Initial payload are non-file uploads.
      eventName: payload.eventName,
      description: payload.description,
      eventDate: Timestamp.fromDate(payload.eventDate),
    };

    if (parsedGuestList !== undefined) {
      initialPayload.guestList = parsedGuestList;
    }

    const eventDocRef = doc(db, "events", id); // Use the provided ID to reference the existing document in Firestore
    await updateDoc(eventDocRef, initialPayload); // Update the document with initial payload

    if (payload.eventBanner !== undefined) {
      // Compress event banner to ensure fast loading of event page. It is blurred so losing quality is fine.
      const compressedBanner = await compressBanner(payload.eventBanner);
      const eventBannerURL: string = await uploadPhoto(
        eventDocRef.id,
        compressedBanner,
        "banner"
      );
      const filePayload: FilePayload = {
        eventBanner: eventBannerURL,
      };
      await updateDoc(eventDocRef, filePayload); // Update the document with the event banner URL
    }
    if (payload.certificateTemplate !== undefined) {
      const certificateTemplateURL: string = await uploadPhoto(
        eventDocRef.id,
        payload.certificateTemplate,
        "cert"
      );
      const filePayload: FilePayload = {
        certificateTemplate: certificateTemplateURL,
      };
      await updateDoc(eventDocRef, filePayload); // Update the document with the certificate template URL
    }
    console.log("Event successfully edited in Firebase!");
  } catch (error: any) {
    console.error("Editing event error occurred", error.message);
  }
};
