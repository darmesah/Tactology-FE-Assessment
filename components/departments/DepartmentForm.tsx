import { useForm, useFieldArray } from "react-hook-form";
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
import { Department } from "@/lib/graphql/departments";
import { Loader } from "lucide-react";

const departmentSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Department name must be at least 2 characters" })
    .max(100),
  subDepartments: z
    .array(
      z.object({
        name: z
          .string()
          .min(2, {
            message: "Sub-department name must be at least 2 characters",
          })
          .max(100),
      })
    )
    .optional(),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

interface DepartmentFormProps {
  initialData?: Department;
  isSubmitting: boolean;
  onSubmit: (data: DepartmentFormValues) => void;
}

const DepartmentForm = ({
  initialData,
  isSubmitting,
  onSubmit,
}: DepartmentFormProps) => {
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: initialData?.name || "",
      subDepartments: initialData?.subDepartments || [{ name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subDepartments",
  });

  const handleSubmit = (data: DepartmentFormValues) => {
    onSubmit(data);
  };

  const isEditMode = !!initialData;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Department Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Human Resources" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sub-Departments Fields */}
        <div>
          <FormLabel>Sub-Departments</FormLabel>
          {fields.map((item, index) => (
            <div key={item.id} className="flex items-center space-x-4">
              <FormField
                control={form.control}
                name={`subDepartments.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="e.g. Femi 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" onClick={() => append({ name: "" })}>
            Add Sub-Department
          </Button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : isEditMode ? (
              "Update Department"
            ) : (
              "Create Department"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DepartmentForm;
