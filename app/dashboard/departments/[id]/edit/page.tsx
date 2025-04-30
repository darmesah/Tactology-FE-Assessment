"use client";
import { use, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import PageHeader from "@/components/ui/PageHeader";
import DepartmentForm from "@/components/departments/DepartmentForm";
import { Skeleton } from "@/components/ui/skeleton";
import { GET_DEPARTMENT, UPDATE_DEPARTMENT } from "@/lib/graphql/departments";
import { useRouter } from "next/navigation";

const EditDepartment = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const departmentId = parseInt(id);

  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, loading, error } = useQuery(GET_DEPARTMENT, {
    variables: { id: departmentId },
    skip: isNaN(departmentId),
  });

  const [updateDepartment] = useMutation(UPDATE_DEPARTMENT, {
    onCompleted() {
      toast.success("Department updated successfully");
      router.push(`/dashboard/departments/${departmentId}`);
    },
    onError(error) {
      console.error("Error updating department:", error);
      // Toast is handled by Apollo error link
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (data: { name: string }) => {
    setIsSubmitting(true);
    await updateDepartment({
      variables: {
        input: {
          id: departmentId,
          name: data.name,
        },
      },
    });
  };

  if (isNaN(departmentId)) {
    return <div>Invalid department ID.</div>;
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !data?.department) {
    return (
      <div>
        <PageHeader
          title="Department Not Found"
          backLink="/dashboard/departments"
        />
        <p className="text-destructive">Error loading department details.</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={`Edit ${data.department.name}`}
        subtitle="Update department information"
        backLink={`/dashboard/departments/${departmentId}`}
      />

      <Card className="max-w-2xl mx-auto">
        <div className="p-6">
          <DepartmentForm
            initialData={data.department}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </Card>
    </>
  );
};

export default EditDepartment;
