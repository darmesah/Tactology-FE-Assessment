import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backLink?: string;
  backLabel?: string;
  createLink?: string;
  createLabel?: string;
  className?: string;
  children?: ReactNode;
}

const PageHeader = ({
  title,
  subtitle,
  backLink,
  backLabel = "Back",
  createLink,
  createLabel = "Create",
  className,
  children,
}: PageHeaderProps) => {
  return (
    <div className={cn("mb-6 space-y-4", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {backLink && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="mb-2 -ml-2 text-muted-foreground hover:text-foreground"
            >
              <Link href={backLink}>
                <ArrowLeft className="mr-1 h-4 w-4" />
                {backLabel}
              </Link>
            </Button>
          )}
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
        {createLink && (
          <Button asChild>
            <Link href={createLink}>
              <Plus className="mr-2 h-4 w-4" />
              {createLabel}
            </Link>
          </Button>
        )}
        {children}
      </div>
    </div>
  );
};

export default PageHeader;
