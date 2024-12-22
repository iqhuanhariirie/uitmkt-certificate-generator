"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  editDocumentInFirestore,
  sendDocumentToFirestore,
} from "@/utils/uploadToFirestore";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ButtonRingLoader } from "./RingLoader";
import CertificatePreview from "./CertificatePreview";
import { useEffect, useState } from "react";
import { useEventData } from "@/context/EventDataContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import { TemplateUpdateDialog } from "./TemplateUpdateDialog";
import toast from "react-hot-toast";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const ACCEPTED_GUEST_LIST_TYPES = ["text/csv"];

const addingFormSchema = z.object({
  eventName: z
    .string({
      required_error: "An event name is required.",
    })
    .min(2, { message: "Event name must must be 2 or more characters long." })
    .max(50, {
      message: "Event name must must be 50 or less characters long.",
    }),
  description: z
    .string({
      required_error: "An event description is required.",
    })
    .min(2, {
      message: "Event description must must be 2 or more characters long.",
    })
    .max(50, {
      message: "Event description must must be 50 or less characters long.",
    }),
  eventDate: z.date({
    required_error: "An event date is required.",
  }),
  guestList: z
    .any()
    .refine(
      (file) => ACCEPTED_GUEST_LIST_TYPES.includes(file?.type),
      "Only .csv file types are supported."
    ),
  eventBanner: z
    .any()
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpeg, .jpg, and .png file types are supported."
    ),
  certificateTemplate: z
    .any()
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpeg, .jpg, and .png file types are supported."
    ),
  namePosition: z.object({
    top: z.number().min(0).max(100),
    left: z.number().min(0).max(100),
    fontSize: z.number().min(8).max(72),
  }),
});

const editingFormSchema = z.object({
  eventName: z
    .string({
      required_error: "An event name is required.",
    })
    .min(2, { message: "Event name must must be 2 or more characters long." })
    .max(50, {
      message: "Event name must must be 50 or less characters long.",
    }),
  description: z
    .string({
      required_error: "An event description is required.",
    })
    .min(2, {
      message: "Event description must must be 2 or more characters long.",
    })
    .max(50, {
      message: "Event description must must be 50 or less characters long.",
    }),
  eventDate: z.date({
    required_error: "An event date is required.",
  }),
  eventBanner: z
    .any()
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpeg, .jpg, and .png file types are supported."
    )
    .optional(),
  certificateTemplate: z
    .any()
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpeg, .jpg, and .png file types are supported."
    )
    .optional(),
  namePosition: z.object({
    top: z.number().min(0).max(100),
    left: z.number().min(0).max(100),
    fontSize: z.number().min(8).max(72),
  }).optional()
});

export type FormType = z.infer<typeof addingFormSchema>;
export type OptionalFormType = z.infer<typeof editingFormSchema>;

type EventFormProps = {
  handleDialogClose: () => void;
  handleDropdownClose?: () => void;
  currentEventName?: string;
  currentEventDescription?: string;
  currentEventDate?: Date;
  id?: string;
};

export const EventForm = ({
  handleDialogClose,
  handleDropdownClose,
  currentEventName,
  currentEventDescription,
  currentEventDate,
  id,
}: EventFormProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { refreshData } = useEventData();
  const currentResolver = id ? editingFormSchema : addingFormSchema;
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [certificateStats, setCertificateStats] = useState({ signed: 0, pending: 0 });
  const [canUpdateTemplate, setCanUpdateTemplate] = useState(true);
  const [hasTemplateSelected, setHasTemplateSelected] = useState(false);

  const form = useForm<FormType>({
    resolver: zodResolver(currentResolver),
    mode: "onChange",
    defaultValues: {
      eventName: currentEventName || "",
      description: currentEventDescription || "",
      eventDate: currentEventDate || undefined,
      namePosition: {  // Add this
        top: 50,
        left: 50,
        fontSize: 24
      }
    },
  });

  const { formState } = form;

  const onSubmit = async (payload: FormType) => {
    try {
      console.log("Submitting form with name position:", payload.namePosition);
      console.log("Payload before sending to Firestore:", payload);
      console.log("Guest list file:", payload.guestList);

      if (id) {
        await editDocumentInFirestore({ payload, id });
      } else {
        await sendDocumentToFirestore(payload);
      }
      await refreshData();
      handleDialogClose();
      if (handleDropdownClose !== undefined) {
        handleDropdownClose();
      }
    } catch (error) {
      console.error("Error submitting form:", error);

    }
  };

  const handleGuestList = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      console.log("Setting guest list file:", file);
      form.setValue("guestList", file, {
        shouldValidate: true,
        shouldDirty: true
      });
      form.trigger("guestList");
    }
  };

  const handleEventBanner = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      form.setValue("eventBanner", file);
      form.trigger("eventBanner");
    }
  };

  const checkCertificateStatus = async (eventId: string) => {
    const signedQuery = query(
      collection(db, 'certificates'),
      where('eventId', '==', eventId),
      where('status', '==', 'signed')
    );
    const pendingQuery = query(
      collection(db, 'certificates'),
      where('eventId', '==', eventId),
      where('status', '==', 'pending')
    );

    const [signedDocs, pendingDocs] = await Promise.all([
      getDocs(signedQuery),
      getDocs(pendingQuery)
    ]);

    return {
      signed: signedDocs.size,
      pending: pendingDocs.size
    };
  };

  const handleCertificateTemplate = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) {
      setHasTemplateSelected(false);
      return;
    }

    const file = event.target.files[0];
    setHasTemplateSelected(true);

    if (id) { // If editing
      console.log("Checking certificates for event ID:", id);
      const stats = await checkCertificateStatus(id);
      console.log("Retrieved stats:", stats);

      setCertificateStats(stats);

      if (stats.signed > 0) {
        console.log("Has signed certificates:", stats.signed);
        if (stats.pending > 0) {
          console.log("Has pending certificates:", stats.pending);
          // Show dialog first, then set other states
          setTemplateFile(file);
          setCanUpdateTemplate(true);

          setTimeout(() => {
          console.log("Opening template dialog");
          setShowTemplateDialog(true);
        }, 0);
        return;
          
        } else {
          console.log("No pending certificates");
          setCanUpdateTemplate(false);
          toast.error("There are no pending certificates to update with the new template.");
          event.target.value = '';
          setHasTemplateSelected(false);
          return;
        }
        
      }
    }

    // If creating new or no signed certificates
    console.log("Setting template for new event");
    setCanUpdateTemplate(true);
    form.setValue("certificateTemplate", file);
    form.trigger("certificateTemplate");
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };
  useEffect(() => {
    console.log("Template dialog state:", showTemplateDialog);
    console.log("Certificate stats:", certificateStats);
  }, [showTemplateDialog, certificateStats]);

  const handleTemplateUpdateConfirm = () => {
    if (templateFile) {
      form.setValue("certificateTemplate", templateFile);
      form.trigger("certificateTemplate");
      const url = URL.createObjectURL(templateFile);
      setPreviewUrl(url);
    }
    setShowTemplateDialog(false);
  };

  const handlePositionChange = (position: { top: number; left: number; fontSize: number }) => {
    form.setValue("namePosition", position);
    form.trigger("namePosition");
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="eventDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Event Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventBanner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Banner</FormLabel>
                <FormControl>
                  <Input type="file" onChange={handleEventBanner} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Only show guest list field if it's NOT an edit form */}
          {!id && (
            <FormField
              control={form.control}
              name="guestList"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Participant List</FormLabel>
                  <FormControl>
                    <Input type="file" onChange={handleGuestList} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="certificateTemplate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certificate Template</FormLabel>
                <FormControl>
                  <Input type="file" onChange={handleCertificateTemplate} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Template Update Dialog */}
          <TemplateUpdateDialog
            isOpen={showTemplateDialog}
            onClose={() => setShowTemplateDialog(false)}
            onConfirm={handleTemplateUpdateConfirm}
            signedCount={certificateStats.signed}
            pendingCount={certificateStats.pending}
          />
          {previewUrl && (
            <FormField
              control={form.control}
              name="namePosition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name Position</FormLabel>
                  <FormControl>
                    <CertificatePreview
                      templateUrl={previewUrl}
                      sampleName="This is a name placement"
                      onPositionChange={handlePositionChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <div className="space-y-2">
            {formState.isSubmitting ? (
              <Button disabled>
                <ButtonRingLoader />
              </Button>
            ) : (
              <>
                <Button
                  type="submit"
                  disabled={!!(
                    !formState.isValid ||
                    (id && !canUpdateTemplate && hasTemplateSelected)
                  )}
                >
                  Submit
                </Button>
                {id && !canUpdateTemplate && hasTemplateSelected && (
                  <p className="text-sm text-destructive">
                    Cannot update template: No pending certificates available
                  </p>
                )}
              </>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};
