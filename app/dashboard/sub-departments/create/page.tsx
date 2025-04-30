// CreateSubDepartment.tsx
import { Suspense } from "react";
import PageHeader from "@/components/ui/PageHeader";
import SubDepartmentFormWrapper from "@/components/sub-departments/SubDepartmentFormWrapper";

const CreateSubDepartment = () => {
  return (
    <>
      <PageHeader
        title="Create Sub-Department"
        subtitle="Add a new sub-department to your organization"
        backLink="/dashboard/sub-departments"
      />

      <Suspense fallback={<div>Loading...</div>}>
        <SubDepartmentFormWrapper />
      </Suspense>
    </>
  );
};

export default CreateSubDepartment;
