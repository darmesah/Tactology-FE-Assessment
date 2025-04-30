import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FolderTree, Edit, Trash2 } from "lucide-react";
import { Department } from "@/lib/graphql/departments";
import Link from "next/link";

interface DepartmentCardProps {
  department: Department;
  onDelete: (id: number) => void;
}

const DepartmentCard = ({ department, onDelete }: DepartmentCardProps) => {
  const subDeptCount = department.subDepartments?.length || 0;

  return (
    <Card className="h-full transition-all hover:border-primary/50 hover:shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-1 text-xl">
            {department.name}
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" asChild>
              <Link href={`/dashboard/departments/${department.id}/edit`}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(department.id)}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground">
          <Badge variant="outline" className="flex items-center gap-1">
            <FolderTree className="h-3 w-3" />
            <span>
              {subDeptCount} sub-dept{subDeptCount !== 1 ? "s" : ""}
            </span>
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" className="w-full" asChild>
          <Link href={`/dashboard/departments/${department.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DepartmentCard;
