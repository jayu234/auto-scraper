'use client';

import { CoinsIcon, HomeIcon, Layers2Icon, MenuIcon, ShieldCheckIcon } from 'lucide-react'
import React, { useState } from 'react'
import Logo from './Logo';
import Link from 'next/link';
import { Button, buttonVariants } from './ui/button';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import UserAvailableCreditsBadge from './UserAvailableCreditsBadge';

const routes = [
  {
    href: "/dashboard",
    label: "Home",
    icon: HomeIcon,
  },
  {
    href: "/dashboard/workflows",
    label: "Workflows",
    icon: Layers2Icon,
  },
  {
    href: "/dashboard/credentials",
    label: "Credentials",
    icon: ShieldCheckIcon,
  },
  {
    href: "/dashboard/billing",
    label: "Billing",
    icon: CoinsIcon,
  },
];

export function DesktopSidebar() {
  const pathName = usePathname();
  const activeRoute = routes.find(
    (route) => pathName === route.href
  ) || routes[0];

  return (
    <div className="hidden relative md:block min-w-[280px] max-w-[280px] h-screen overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2 border-separate">
      <div className="flex items-center justify-center gap-2 border-b-[1px] border-separate p-4">
        <Logo />
      </div>
      <div className='p-2'><UserAvailableCreditsBadge /></div>
      <div className="flex flex-col p-2 gap-y-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={buttonVariants({
              variant:
                activeRoute.href === route.href
                  ? "sidebarActiveItem"
                  : "sidebarItem",
            })}
          >
            <route.icon size={20} />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export function MobileSidebar() {
  const [isOpen, setOpen] = useState(false);
  const pathName = usePathname();
  const activeRoute = routes.find(
    (route) => pathName === route.href
  ) || routes[0];

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="flex items-center justify-between pr-2">
        <Sheet open={isOpen} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px] space-y-4" side="left">
            <Logo />
            <div><UserAvailableCreditsBadge /></div>
            <div className="flex flex-col p-2 gap-y-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={handleLinkClick}
                  className={buttonVariants({
                    variant:
                      activeRoute.href === route.href
                        ? "sidebarActiveItem"
                        : "sidebarItem",
                  })}
                >
                  <route.icon size={20} />
                  {route.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}