import { createContext, useContext, useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Event } from "@/components/ui/columns"; // Import the Event type

// Use the Event type instead of creating a new EventData type
type EventDataContextType = {
  eventData: Event[];
  loading: boolean;
  refreshData: () => Promise<void>;
};

const EventDataContext = createContext<EventDataContextType | undefined>(undefined);

// Rename to EventDataContextProvider and export it
export const EventDataContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [eventData, setEventData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "events"));
      console.log("Raw Firestore data:", querySnapshot.docs.map(doc => doc.data()));

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().eventName,
        date: doc.data().eventDate,
        description: doc.data().description,
        guests: doc.data().guestList?.length || 0,
        eventBanner: doc.data().eventBanner,
        createdAt: doc.data().createdAt ? doc.data().createdAt:doc.data().eventDate
      })) as Event[];

      // Sort by both createdAt and date
      data.sort((a, b) => {
        // First sort by createdAt
        const createDiff = (b.createdAt.seconds - a.createdAt.seconds);
        if (createDiff !== 0) return createDiff;

        // If createdAt is the same, sort by event date
        return b.date.seconds - a.date.seconds;
      });
      console.log('Fetched events with timestamps:', data.map(event => ({
        name: event.name,
        createdAt: event.createdAt?.toDate(),
        eventDate: event.date?.toDate()
      })));
      console.log("Processed event data:", data);
      setEventData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching event data:", error);
      setLoading(false);
    }
  };

  const refreshEvents = async () => {
    setLoading(true);
    await fetchEventData();
    setLoading(false);
  };

  useEffect(() => {
    refreshEvents();
  }, []);

  const refreshData = async () => {
    await fetchEventData();
  };

  return (
    <EventDataContext.Provider value={{ eventData, loading, refreshData }}>
      {children}
    </EventDataContext.Provider>
  );
};

export const useEventData = () => {
  const context = useContext(EventDataContext);
  if (context === undefined) {
    throw new Error("useEventData must be used within an EventDataContextProvider");
  }
  return context;
};