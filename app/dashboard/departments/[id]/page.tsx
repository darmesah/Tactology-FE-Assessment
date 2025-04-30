"use client";
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { toast } from "sonner";
import PageHeader from "@/components/ui/PageHeader";
import SubDepartmentCard from "@/components/sub-departments/SubDepartmentCard";
import DeleteConfirmation from "@/components/ui/DeleteConfirmation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GET_DEPARTMENT,
  REMOVE_DEPARTMENT,
  SubDepartment,
} from "@/lib/graphql/departments";
import { REMOVE_SUB_DEPARTMENT } from "@/lib/graphql/subDepartments";
import { useRouter } from "next/navigation";

interface DepartmentDetailsProps {
  params: {
    id: string;
  };
}

const DepartmentDetails = ({ params }: DepartmentDetailsProps) => {
  const departmentId = parseInt(params.id, 10);

  const router = useRouter();

  const [deleteSubDeptDialogOpen, setDeleteSubDeptDialogOpen] = useState(false);
  const [deleteDeptDialogOpen, setDeleteDeptDialogOpen] = useState(false);
  const [subDeptToDelete, setSubDeptToDelete] = useState<number | null>(null);

  const { data, loading, error } = useQuery(GET_DEPARTMENT, {
    variables: { id: departmentId },
    skip: isNaN(departmentId),
  });

  const [removeDepartment, { loading: deleteLoading }] = useMutation(
    REMOVE_DEPARTMENT,
    {
      onCompleted() {
        toast.success("Department deleted successfully");
        router.replace("/dashboard/departments");
      },
      onError(err) {
        console.error("Error deleting department:", err);
      },
    }
  );

  const [removeSubDepartment, { loading: deleteSubDeptLoading }] = useMutation(
    REMOVE_SUB_DEPARTMENT,
    {
      refetchQueries: [
        { query: GET_DEPARTMENT, variables: { id: departmentId } },
      ],
      onCompleted() {
        toast.success("Sub-department deleted successfully");
        setDeleteSubDeptDialogOpen(false);
        setSubDeptToDelete(null);
      },
      onError(err) {
        console.error("Error deleting sub-department:", err);
      },
    }
  );

  const handleSubDeptDeleteClick = (id: number) => {
    setSubDeptToDelete(id);
    setDeleteSubDeptDialogOpen(true);
  };

  const confirmSubDeptDelete = () => {
    if (subDeptToDelete) {
      removeSubDepartment({ variables: { id: subDeptToDelete } });
    }
  };

  const confirmDeptDelete = () => {
    removeDepartment({ variables: { id: departmentId } });
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

  if (error) {
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

  if (!data?.department) {
    return (
      <div>
        <PageHeader
          title="Department Not Found"
          backLink="/dashboard/departments"
        />
        <p>The requested department could not be found.</p>
      </div>
    );
  }

  const department = data.department;
  const subDepartments = department.subDepartments || [];

  return (
    <>
      <PageHeader
        title={department.name}
        subtitle="Department details and sub-departments"
        backLink="/dashboard/departments"
        createLink={`/dashboard/sub-departments/create?departmentId=${departmentId}`}
        createLabel="Add Sub-Department"
      >
        <div className="flex space-x-2 mt-2 sm:mt-0">
          <Button variant="outline" asChild>
            <a href={`/dashboard/departments/${departmentId}/edit`}>Edit</a>
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteDeptDialogOpen(true)}
          >
            Delete
          </Button>
        </div>
      </PageHeader>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Department Information</CardTitle>
          <CardDescription>Basic details about this department</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Sub-Departments</h3>
              <Badge variant="secondary">{subDepartments.length}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Sub-Departments</h2>
          <Button asChild variant="outline" size="sm">
            <a
              href={`/dashboard/sub-departments/create?departmentId=${departmentId}`}
            >
              Add Sub-Department
            </a>
          </Button>
        </div>

        {subDepartments.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {subDepartments.map((subDept: SubDepartment) => (
              <SubDepartmentCard
                key={subDept.id}
                subDepartment={{
                  ...subDept,
                }}
                onDelete={handleSubDeptDeleteClick}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border rounded-lg bg-muted/50">
            <h3 className="text-xl font-medium mb-2">No Sub-Departments</h3>
            <p className="text-muted-foreground mb-4">
              This department does not have any sub-departments yet.
            </p>
            <a
              href={`/dashboard/sub-departments/create?departmentId=${departmentId}`}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
            >
              Add Sub-Department
            </a>
          </div>
        )}
      </div>

      <DeleteConfirmation
        isOpen={deleteSubDeptDialogOpen}
        onClose={() => setDeleteSubDeptDialogOpen(false)}
        onDelete={confirmSubDeptDelete}
        isLoading={deleteSubDeptLoading}
        title="Delete Sub-Department"
        description="This action cannot be undone."
        entityName="sub-department"
      />

      <DeleteConfirmation
        isOpen={deleteDeptDialogOpen}
        onClose={() => setDeleteDeptDialogOpen(false)}
        onDelete={confirmDeptDelete}
        isLoading={deleteLoading}
        title="Delete Department"
        description="This will also delete all sub-departments within this department. This action cannot be undone."
        entityName="department"
      />
    </>
  );
};

export default DepartmentDetails;
