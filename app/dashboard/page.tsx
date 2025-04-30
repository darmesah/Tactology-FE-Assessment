"use client";
import { useQuery } from "@apollo/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PageHeader from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { GET_DEPARTMENTS } from "@/lib/graphql/departments";
import { GET_SUB_DEPARTMENTS } from "@/lib/graphql/subDepartments";
import { Building, FolderTree, User } from "lucide-react";
import Link from "next/link";

const Dashboard = () => {
  const { user } = useAuth();

  const { data: departmentsData, loading: departmentsLoading } =
    useQuery(GET_DEPARTMENTS);
  const { data: subDepartmentsData, loading: subDepartmentsLoading } =
    useQuery(GET_SUB_DEPARTMENTS);

  const departmentsCount = departmentsData?.departments?.length || 0;
  const subDepartmentsCount = subDepartmentsData?.subDepartments?.length || 0;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="" />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Welcome</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.email}</div>
            <p className="text-xs text-muted-foreground">Logged in user</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Departments
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {departmentsLoading ? (
              <Skeleton className="h-6 w-12" />
            ) : (
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold">{departmentsCount}</div>
                  <p className="text-xs text-muted-foreground">
                    Departments created
                  </p>
                </div>
                <div>
                  {departmentsCount > 0 && (
                    <Link
                      href="/dashboard/departments"
                      className=" underline font-black"
                    >
                      View All
                    </Link>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sub-Departments
            </CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {subDepartmentsLoading ? (
              <Skeleton className="h-6 w-12" />
            ) : (
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {subDepartmentsCount}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Sub-departments created
                  </p>
                </div>
                <div>
                  {subDepartmentsCount > 0 && (
                    <Link
                      href="/dashboard/sub-departments"
                      className=" underline font-black"
                    >
                      View All
                    </Link>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Link
              href="/dashboard/departments/create"
              className="flex items-center rounded-md border px-4 py-3 text-sm hover:bg-accent transition-colors"
            >
              <Building className="mr-2 h-4 w-4" />
              Create a new department
            </Link>
            <Link
              href="/dashboard/sub-departments/create"
              className="flex items-center rounded-md border px-4 py-3 text-sm hover:bg-accent transition-colors"
            >
              <FolderTree className="mr-2 h-4 w-4" />
              Create a new sub-department
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
