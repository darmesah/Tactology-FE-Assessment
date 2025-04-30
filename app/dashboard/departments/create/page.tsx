"use client";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import PageHeader from "@/components/ui/PageHeader";
import DepartmentForm from "@/components/departments/DepartmentForm";
import { CREATE_DEPARTMENT, GET_DEPARTMENTS } from "@/lib/graphql/departments";
import { useRouter } from "next/navigation";

const CreateDepartment = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createDepartment] = useMutation(CREATE_DEPARTMENT, {
    refetchQueries: [{ query: GET_DEPARTMENTS }],
    onCompleted() {
      toast.success("Department created successfully");
      router.push("/dashboard/departments");
    },
    onError(error) {
      console.error("Error creating department:", error);
      // Toast is handled by Apollo error link
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (data: {
    name: string;
    subDepartments?: { name: string }[];
  }) => {
    setIsSubmitting(true);
    await createDepartment({
      variables: {
        input: {
          name: data.name,
          subDepartments: data.subDepartments,
        },
      },
    });
  };

  return (
    <>
      <PageHeader
        title="Create Department"
        subtitle="Add a new department to your organization"
        backLink="/dashboard/departments"
      />

      <Card className="max-w-2xl mx-auto">
        <div className="p-6">
          <DepartmentForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </Card>
    </>
  );
};

export default CreateDepartment;
