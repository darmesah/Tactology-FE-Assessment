"use client";
import { use, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { toast } from "sonner";
import PageHeader from "@/components/ui/PageHeader";
import DeleteConfirmation from "@/components/ui/DeleteConfirmation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  GET_SUB_DEPARTMENT,
  REMOVE_SUB_DEPARTMENT,
} from "@/lib/graphql/subDepartments";
import { useRouter } from "next/navigation";

const SubDepartmentDetails = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);
  const subDepartmentId = parseInt(id);

  const router = useRouter();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data, loading, error } = useQuery(GET_SUB_DEPARTMENT, {
    variables: { id: subDepartmentId },
    skip: isNaN(subDepartmentId),
  });

  const [removeSubDepartment, { loading: deleteLoading }] = useMutation(
    REMOVE_SUB_DEPARTMENT,
    {
      onCompleted() {
        toast.success("Sub-department deleted successfully");
        router.replace("/dashboard/sub-departments");
      },
      onError(err) {
        console.error("Error deleting sub-department:", err);
        // Toast is handled by Apollo error link
      },
    }
  );

  const confirmDelete = () => {
    removeSubDepartment({ variables: { id: subDepartmentId } });
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

  if (error) {
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

  if (!data?.subDepartment) {
    return (
      <div>
        <PageHeader
          title="Sub-Department Not Found"
          backLink="/dashboard/sub-departments"
        />
        <p>The requested sub-department could not be found.</p>
      </div>
    );
  }

  const subDepartment = data.subDepartment;

  return (
    <>
      <PageHeader
        title={subDepartment.name}
        subtitle=""
        backLink="/dashboard/sub-departments"
      >
        <div className="flex space-x-2 mt-2 sm:mt-0">
          <Button variant="outline" asChild>
            <a href={`/dashboard/sub-departments/${subDepartmentId}/edit`}>
              Edit
            </a>
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </div>
      </PageHeader>

      <DeleteConfirmation
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={confirmDelete}
        isLoading={deleteLoading}
        title="Delete Sub-Department"
        description="This action cannot be undone."
        entityName="sub-department"
      />
    </>
  );
};

export default SubDepartmentDetails;
