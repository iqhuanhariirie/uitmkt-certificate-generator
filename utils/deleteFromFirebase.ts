import { deleteDoc, doc, collection, query, where, getDocs, getDoc, arrayRemove, increment, writeBatch } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../firebase/config";

export const deleteFromFirebase = async (id: string) => {
  try {
    // Delete event document
    await deleteDoc(doc(db, "events", id));

    // Delete event files from storage
    const bannerRef = ref(storage, `${id}-banner.jpg`);
    const certRef = ref(storage, `${id}-cert.jpg`);

    try {
      await deleteObject(bannerRef);
      console.log("Banner deleted successfully.");
    } catch (error: any) {
      console.log("Error deleting event banner: ", error.message);
    }

    try {
      await deleteObject(certRef);
      console.log("Certificate template deleted successfully.");
    } catch (error: any) {
      console.log("Error deleting certificate template: ", error.message);
    }

    // Delete all certificates associated with this event
    const certificatesQuery = query(
      collection(db, "certificates"),
      where("eventId", "==", id)
    );

    const certificateSnapshots = await getDocs(certificatesQuery);

    // Delete each certificate document and its PDF if it exists
    const certificateDeletions = certificateSnapshots.docs.map(async (doc) => {
      const certificateData = doc.data();
      
      // If there's a signed PDF, delete it from storage
      if (certificateData.status === 'signed') {
        const pdfRef = ref(storage, `certificates/${doc.id}.pdf`);
        try {
          await deleteObject(pdfRef);
          console.log(`Deleted signed PDF for certificate ${doc.id}`);
        } catch (error: any) {
          console.log(`Error deleting signed PDF for certificate ${doc.id}:`, error.message);
        }
      }

      // Delete the certificate document
      await deleteDoc(doc.ref);
      console.log(`Deleted certificate document ${doc.id}`);
    });

    // Wait for all certificate deletions to complete
    await Promise.all(certificateDeletions);

    console.log("Event and all associated certificates deleted successfully");
  } catch (error: any) {
    console.error("Error during deletion process:", error.message);
    throw error;
  }
};
export const deleteCertificate = async (certificateId: string) => {
  try {
    // Get the certificate document first
    const certificateRef = doc(db, "certificates", certificateId);
    const certificateSnap = await getDoc(certificateRef);
    
    if (!certificateSnap.exists()) {
      throw new Error("Certificate not found");
    }

    const certificateData = certificateSnap.data();
    const eventId = certificateData.eventId;
    
    // Get the event document
    const eventRef = doc(db, "events", eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (!eventSnap.exists()) {
      throw new Error("Event not found");
    }

    const eventData = eventSnap.data();
    
    // Find the exact guest object in the guestList array
    const updatedGuestList = eventData.guestList.filter(
      (guest: any) => guest.studentID !== certificateData.studentID
    );

    // Start a batch operation for atomic updates
    const batch = writeBatch(db);
    
    // If there's a signed PDF, delete it from storage
    if (certificateData.status === 'signed') {
      const pdfRef = ref(storage, `certificates/${certificateId}.pdf`);
      try {
        await deleteObject(pdfRef);
        console.log(`Deleted signed PDF for certificate ${certificateId}`);
      } catch (error: any) {
        console.log(`Error deleting signed PDF:`, error.message);
      }
    }

    // Update event document with the filtered guest list
    batch.update(eventRef, {
      guestList: updatedGuestList,
      totalParticipants: increment(-1)
    });

    // Delete the certificate document
    batch.delete(certificateRef);

    // Commit the batch
    await batch.commit();

    console.log(`Certificate ${certificateId} and guest entry deleted successfully`);
  } catch (error: any) {
    console.error("Error deleting certificate and guest:", error.message);
    throw error;
  }
};

// utils/deleteFromFirebase.ts
export const deleteCertificates = async (certificateIds: string[]) => {
  try {
    // Create a batch
    const batch = writeBatch(db);
    
    // Group certificates by eventId
    const certificatesByEvent: { [eventId: string]: any[] } = {};
    
    // First, gather all certificate data
    for (const certificateId of certificateIds) {
      const certificateRef = doc(db, "certificates", certificateId);
      const certificateSnap = await getDoc(certificateRef);
      
      if (!certificateSnap.exists()) continue;

      const certificateData = certificateSnap.data();
      const eventId = certificateData.eventId;

      if (!certificatesByEvent[eventId]) {
        certificatesByEvent[eventId] = [];
      }
      certificatesByEvent[eventId].push({
        certificateId,
        certificateData
      });
    }

    // Process each event's certificates
    for (const [eventId, certificates] of Object.entries(certificatesByEvent)) {
      const eventRef = doc(db, "events", eventId);
      const eventSnap = await getDoc(eventRef);
      
      if (!eventSnap.exists()) continue;

      const eventData = eventSnap.data();
      const studentIdsToRemove = certificates.map(c => c.certificateData.studentID);
      
      // Filter out all guests that match any of the certificates being deleted
      const updatedGuestList = eventData.guestList.filter(
        (guest: any) => !studentIdsToRemove.includes(guest.studentID)
      );

      // Update event document once per event
      batch.update(eventRef, {
        guestList: updatedGuestList,
        totalParticipants: updatedGuestList.length
      });

      // Delete certificate documents and their PDFs
      for (const certificate of certificates) {
        if (certificate.certificateData.status === 'signed') {
          const pdfRef = ref(storage, `certificates/${certificate.certificateId}.pdf`);
          try {
            await deleteObject(pdfRef);
          } catch (error: any) {
            console.log(`Error deleting signed PDF:`, error.message);
          }
        }

        // Delete certificate document
        batch.delete(doc(db, "certificates", certificate.certificateId));
      }
    }

    // Commit the batch
    await batch.commit();

    console.log(`${certificateIds.length} certificates deleted successfully`);
  } catch (error: any) {
    console.error("Error deleting certificates:", error.message);
    throw error;
  }
};