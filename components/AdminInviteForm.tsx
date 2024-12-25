"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection } from "firebase/firestore";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import toast from "react-hot-toast";
import * as z from "zod";

type Role = "admin" | "super_admin";

interface RoleOption {
  value: Role;
  label: string;
}

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.object({
    value: z.enum(["admin", "super_admin"] as const),
    label: z.string(),
  }, {
    required_error: "Please select a role",
  }),
});

const roleOptions: RoleOption[] = [
  { value: "admin", label: "Regular Admin" },
  { value: "super_admin", label: "Super Admin" },
] as const;

type FormValues = z.infer<typeof formSchema>;

export const AdminInviteForm = () => {
  const { user, checkIfUserIsSuperAdmin } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: roleOptions[0],
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user || !checkIfUserIsSuperAdmin(user)) {
      toast.error("You don't have permission to add administrators.");
      return;
    }

    try {
      await addDoc(collection(db, "admins"), {
        email: values.email.toLowerCase(),
        role: values.role.value,
        createdAt: new Date(),
        status: "active",
      });

      toast.success("New administrator has been successfully added.");
      form.reset();
    } catch (error) {
      toast.error("Failed to add administrator. Please try again.");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Email
        </label>
        <Input
          placeholder="admin@example.com"
          {...form.register("email")}
          className="w-full"
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500">
            {form.formState.errors.email.message}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          Enter the email address of the new administrator
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Role
        </label>
        <Controller
          control={form.control}
          name="role"
          render={({ field }) => (
            <Select<RoleOption>
              options={roleOptions}
              value={field.value}
              onChange={field.onChange}
              className="w-full"
              classNamePrefix="select"
              isSearchable={false}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: '#2563eb',
                  primary75: '#3b82f6',
                  primary50: '#60a5fa',
                  primary25: '#93c5fd',
                },
              })}
            />
          )}
        />
        {form.formState.errors.role && (
          <p className="text-sm text-red-500">
            {form.formState.errors.role.message}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          Choose the administrator's role and permissions
        </p>
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? 'Adding...' : 'Add Administrator'}
      </Button>
    </form>
  );
};