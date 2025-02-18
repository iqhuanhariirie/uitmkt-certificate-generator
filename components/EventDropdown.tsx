"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  deleteFromFirebase
} from "@/utils/deleteFromFirebase";
import Link from "next/link";
import { Event } from "@/components/ui/columns";
import { EventForm } from "@/components/EventForm";
import { useState } from "react";
import { Users } from "lucide-react";
import { useEventData } from "@/context/EventDataContext";

export const EventDropdown = ({ eventData }: { eventData: Event }) => {
  const { refreshData } = useEventData();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleEditDialogClose = () => {
    setEditOpen(false);
  };
  const handleDeleteDialogClose = () => {
    setDeleteOpen(false);
  };
  const handleDropdownClose = () => {
    setDropdownOpen(false);
  };
  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>
            <Link 
              href={`/event/${eventData.id}/participant`}
              className="flex items-center"
            >
              <Users className="mr-2 h-4 w-4" />
              View Participants
            </Link>
          </DropdownMenuItem>
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setEditOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit {eventData.name}</DialogTitle>
                <DialogDescription>
                  Edit the event details you want changed.
                </DialogDescription>
              </DialogHeader>
              <EventForm
                handleDialogClose={handleEditDialogClose}
                handleDropdownClose={handleDropdownClose}
                currentEventName={eventData.name}
                currentEventDate={eventData.date.toDate()}
                currentEventDescription={eventData.description}
                id={eventData.id}
              />
            </DialogContent>
          </Dialog>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setDeleteOpen(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  Are you sure you want to delete {eventData.name}?
                </DialogTitle>
                <DialogDescription>
                  Once deleted, it could no longer be reverted.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    try {
                      setIsDeleting(true);
                      await deleteFromFirebase(eventData.id);
                      await refreshData();
                      handleDeleteDialogClose();
                      handleDropdownClose();
                    } catch (error) {
                      console.error("Error deleting event:", error);
                      // Optionally show error message to user
                    } finally {
                      setIsDeleting(false);
                    }
                  }}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

