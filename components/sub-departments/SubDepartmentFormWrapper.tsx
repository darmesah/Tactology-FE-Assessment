"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import CreateSubDepartmentForm from "@/components/sub-departments/CreateSubDepartmentForm";
import {
  CREATE_SUB_DEPARTMENT,
  GET_SUB_DEPARTMENTS,
} from "@/lib/graphql/subDepartments";
import { GET_DEPARTMENT } from "@/lib/graphql/departments";

const SubDepartmentFormWrapper = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedDepartmentId = searchParams.get("departmentId");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createSubDepartment] = useMutation(CREATE_SUB_DEPARTMENT, {
    refetchQueries: [
      { query: GET_SUB_DEPARTMENTS },
      ...(preSelectedDepartmentId
        ? [
            {
              query: GET_DEPARTMENT,
              variables: { id: parseInt(preSelectedDepartmentId, 10) },
            },
          ]
        : []),
    ],
    onCompleted(data) {
      toast.success("Sub-department created successfully");
      router.push(`/dashboard/sub-departments/${data.createSubDepartment.id}`);
    },
    onError(error) {
      console.error("Error creating sub-department:", error);
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async ({
    name,
    departmentId,
  }: {
    name: string;
    departmentId: string | number;
  }) => {
    setIsSubmitting(true);

    await createSubDepartment({
      variables: {
        input: {
          name,
          departmentId:
            typeof departmentId === "string"
              ? parseInt(departmentId, 10)
              : departmentId,
        },
      },
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="p-6">
        <CreateSubDepartmentForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </Card>
  );
};

export default SubDepartmentFormWrapper;
