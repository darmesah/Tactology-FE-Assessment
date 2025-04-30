import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubDepartment } from "@/lib/graphql/departments";
import { Loader } from "lucide-react";

const subDepartmentSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100),
});

type SubDepartmentFormValues = z.infer<typeof subDepartmentSchema>;

interface SubDepartmentFormProps {
  initialData?: SubDepartment;
  isSubmitting: boolean;
  onSubmit: (data: SubDepartmentFormValues) => void;
}

const SubDepartmentForm = ({
  initialData,
  isSubmitting,
  onSubmit,
}: SubDepartmentFormProps) => {
  const form = useForm<SubDepartmentFormValues>({
    resolver: zodResolver(subDepartmentSchema),
    defaultValues: {
      name: initialData?.name || "",
    },
  });

  const handleSubmit = (data: SubDepartmentFormValues) => {
    onSubmit({
      ...data,
    });
  };

  const isEditMode = !!initialData;

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

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : isEditMode ? (
              "Update Sub-Department"
            ) : (
              "Create Sub-Department"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SubDepartmentForm;
