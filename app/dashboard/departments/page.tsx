"use client";
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { toast } from "sonner";
import PageHeader from "@/components/ui/PageHeader";
import DepartmentCard from "@/components/departments/DepartmentCard";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteConfirmation from "@/components/ui/DeleteConfirmation";
import {
  GET_DEPARTMENTS,
  REMOVE_DEPARTMENT,
  Department,
} from "@/lib/graphql/departments";
import Link from "next/link";

const DepartmentsList = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<number | null>(
    null
  );

  const { data, loading, error } = useQuery(GET_DEPARTMENTS);

  const [removeDepartment, { loading: deleteLoading }] = useMutation(
    REMOVE_DEPARTMENT,
    {
      refetchQueries: [{ query: GET_DEPARTMENTS }],
      onCompleted() {
        toast.success("Department deleted successfully");
        setDeleteDialogOpen(false);
        setDepartmentToDelete(null);
      },
      onError(err) {
        console.error("Error deleting department:", err);
        // Toast is handled by Apollo error link
      },
    }
  );

  const handleDeleteClick = (id: number) => {
    setDepartmentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (departmentToDelete) {
      removeDepartment({ variables: { id: departmentToDelete } });
    }
  };

  if (error) {
    return (
      <div>
        <PageHeader
          title="Departments"
          subtitle="Manage your organization's departments"
          createLink="/dashboard/departments/create"
        />
        <div className="p-6 text-center">
          <p className="text-destructive">
            Error loading departments. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Departments"
        subtitle="Manage your organization's departments"
        createLink="/dashboard/departments/create"
      />

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full" />
            </div>
          ))}
        </div>
      ) : data?.departments?.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.departments.map((department: Department) => (
            <DepartmentCard
              key={department.id}
              department={department}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center border rounded-lg bg-muted/50">
          <h3 className="text-xl font-medium mb-2">No Departments Found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first department.
          </p>
          <Link
            href="/dashboard/departments/create"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
          >
            Create Department
          </Link>
        </div>
      )}

      <DeleteConfirmation
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={confirmDelete}
        isLoading={deleteLoading}
        title="Delete Department"
        description="This will also delete all sub-departments within this department. This action cannot be undone."
        entityName="department"
      />
    </>
  );
};

export default DepartmentsList;
