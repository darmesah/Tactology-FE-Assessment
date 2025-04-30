"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { Department, GET_DEPARTMENTS } from "@/lib/graphql/departments";
import { Skeleton } from "@/components/ui/skeleton";

const subDepartmentSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100),
  departmentId: z.coerce
    .number({ required_error: "Department ID is required" })
    .positive("Department ID must be a positive number"),
});

type SubDepartmentFormValues = z.infer<typeof subDepartmentSchema>;

interface CreateSubDepartmentFormProps {
  isSubmitting: boolean;
  onSubmit: (data: SubDepartmentFormValues) => void;
}

const CreateSubDepartmentForm = ({
  isSubmitting,
  onSubmit,
}: CreateSubDepartmentFormProps) => {
  const searchParams = useSearchParams();
  const departmentIdFromQuery = Number(searchParams.get("departmentId")) || 0;

  const { data, loading } = useQuery(GET_DEPARTMENTS);
  const departments = data?.departments || [];

  const form = useForm<SubDepartmentFormValues>({
    resolver: zodResolver(subDepartmentSchema),
    defaultValues: {
      name: "",
      departmentId: departmentIdFromQuery,
    },
  });

  const handleSubmit = (data: SubDepartmentFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sub-Department Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Recruitment" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="departmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              {loading ? (
                <Skeleton className="h-10 w-full rounded-md" />
              ) : (
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((dept: Department) => (
                      <SelectItem key={dept.id} value={String(dept.id)}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Sub-Department"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateSubDepartmentForm;
