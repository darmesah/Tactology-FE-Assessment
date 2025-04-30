"use client";
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { toast } from "sonner";
import PageHeader from "@/components/ui/PageHeader";
import SubDepartmentCard from "@/components/sub-departments/SubDepartmentCard";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteConfirmation from "@/components/ui/DeleteConfirmation";
import {
  GET_SUB_DEPARTMENTS,
  REMOVE_SUB_DEPARTMENT,
} from "@/lib/graphql/subDepartments";
import { SubDepartment } from "@/lib/graphql/departments";
import Link from "next/link";

const SubDepartmentsList = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subDepartmentToDelete, setSubDepartmentToDelete] = useState<
    number | null
  >(null);

  const { data, loading, error } = useQuery(GET_SUB_DEPARTMENTS);

  const [removeSubDepartment, { loading: deleteLoading }] = useMutation(
    REMOVE_SUB_DEPARTMENT,
    {
      refetchQueries: [{ query: GET_SUB_DEPARTMENTS }],
      onCompleted() {
        toast.success("Sub-department deleted successfully");
        setDeleteDialogOpen(false);
        setSubDepartmentToDelete(null);
      },
      onError(err) {
        console.error("Error deleting sub-department:", err);
        // Toast is handled by Apollo error link
      },
    }
  );

  const handleDeleteClick = (id: number) => {
    setSubDepartmentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (subDepartmentToDelete) {
      removeSubDepartment({ variables: { id: subDepartmentToDelete } });
    }
  };

  if (error) {
    return (
      <div>
        <PageHeader
          title="Sub-Departments"
          subtitle="Manage your organization's sub-departments"
          createLink="/dashboard/sub-departments/create"
        />
        <div className="p-6 text-center">
          <p className="text-destructive">
            Error loading sub-departments. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Sub-Departments"
        subtitle="Manage all organization's sub-departments"
        createLink="/dashboard/sub-departments/create"
      />

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full" />
            </div>
          ))}
        </div>
      ) : data?.subDepartments?.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.subDepartments.map((subDepartment: SubDepartment) => (
            <SubDepartmentCard
              key={subDepartment.id}
              subDepartment={subDepartment}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center border rounded-lg bg-muted/50">
          <h3 className="text-xl font-medium mb-2">No Sub-Departments Found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first sub-department.
          </p>
          <Link
            href="/dashboard/sub-departments/create"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
          >
            Create Sub-Department
          </Link>
        </div>
      )}

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

export default SubDepartmentsList;
