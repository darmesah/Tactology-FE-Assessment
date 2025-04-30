import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { SubDepartment } from "@/lib/graphql/departments";
import Link from "next/link";

interface SubDepartmentCardProps {
  subDepartment: SubDepartment;
  onDelete: (id: number) => void;
}

const SubDepartmentCard = ({
  subDepartment,
  onDelete,
}: SubDepartmentCardProps) => {
  return (
    <Card className="h-full transition-all hover:border-primary/50 hover:shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-1 text-xl">
            {subDepartment.name}
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" asChild>
              <Link
                href={`/dashboard/sub-departments/${subDepartment.id}/edit`}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(subDepartment.id)}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter>
        <Button variant="secondary" className="w-full" asChild>
          <Link href={`/dashboard/sub-departments/${subDepartment.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubDepartmentCard;
