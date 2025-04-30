"use client";
import { use, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import PageHeader from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GET_SUB_DEPARTMENT,
  UPDATE_SUB_DEPARTMENT,
} from "@/lib/graphql/subDepartments";
import { useRouter } from "next/navigation";
import SubDepartmentForm from "@/components/sub-departments/SubDepartmentForm";

const EditSubDepartment = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const subDepartmentId = parseInt(id);

  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, loading, error } = useQuery(GET_SUB_DEPARTMENT, {
    variables: { id: subDepartmentId },
    skip: isNaN(subDepartmentId),
  });

  const [updateSubDepartment] = useMutation(UPDATE_SUB_DEPARTMENT, {
    onCompleted() {
      toast.success("Sub-department updated successfully");
      router.push(`/dashboard/sub-departments/${subDepartmentId}`);
    },
    onError(error) {
      console.error("Error updating sub-department:", error);
      // Toast is handled by Apollo error link
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (data: { name: string }) => {
    setIsSubmitting(true);
    await updateSubDepartment({
      variables: {
        input: {
          subDepartmentId,
          name: data.name,
        },
      },
    });
  };

  if (isNaN(subDepartmentId)) {
    return <div>Invalid sub-department ID.</div>;
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !data?.subDepartment) {
    return (
      <div>
        <PageHeader
          title="Sub-Department Not Found"
          backLink="/dashboard/sub-departments"
        />
        <p className="text-destructive">
          Error loading sub-department details.
        </p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={`Edit ${data.subDepartment.name}`}
        subtitle="Update sub-department information"
        backLink={`/dashboard/sub-departments/${subDepartmentId}`}
      />

      <Card className="max-w-2xl mx-auto">
        <div className="p-6">
          <SubDepartmentForm
            initialData={data.subDepartment}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </Card>
    </>
  );
};

export default EditSubDepartment;
