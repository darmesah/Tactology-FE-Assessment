
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Home, Building, FolderTree } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState('');

  useEffect(() => {
    const path = pathname || '';
    if (path.startsWith('/dashboard/departments')) {
      setActiveItem('departments');
    } else if (path.startsWith('/dashboard/sub-departments')) {
      setActiveItem('sub-departments');
    } else if (path === '/dashboard') {
      setActiveItem('dashboard');
    } else {
      setActiveItem('');
    }
  }, [pathname]);

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <Home className="h-4 w-4" />,
      id: 'dashboard'
    },
    {
      name: 'Departments',
      path: '/dashboard/departments',
      icon: <Building className="h-4 w-4" />,
      id: 'departments'
    },
    {
      name: 'Sub-Departments',
      path: '/dashboard/sub-departments',
      icon: <FolderTree className="h-4 w-4" />,
      id: 'sub-departments'
    },
  ];

  return (
    <div
      className={cn(
        "fixed top-16 bottom-0 left-0 z-20 w-64 border-r bg-sidebar transition-transform duration-300 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <ScrollArea className="h-full py-6 pr-6">
        <div className="space-y-4 pl-2">
          <div className="py-2">
            <h2 className="px-4 text-lg font-semibold tracking-tight">Navigation</h2>
            <div className="space-y-1 mt-2">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeItem === item.id ? 'secondary' : 'ghost'}
                  asChild
                  className={cn(
                    "w-full justify-start",
                    activeItem === item.id && "bg-secondary text-secondary-foreground font-medium"
                  )}
                >
                  <Link href={item.path}>
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
