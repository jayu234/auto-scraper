'use client';
import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from './ui/breadcrumb';
import { usePathname } from 'next/navigation';
import { MobileSidebar } from './Sidebar';

function BreadcrumbHeader() {
  const pathName = usePathname();
  const paths = pathName?.split("/");
  return (
    <div className="flex items-center flex-start">
      <MobileSidebar />
      <Breadcrumb>
        <BreadcrumbList>
          {paths.map((path, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {index !== paths.length - 1 ?
                  <BreadcrumbLink className="capitalize" href={`/${path}`}>
                    {path}
                  </BreadcrumbLink>
                  : <BreadcrumbPage className="capitalize">
                    {path === "" ? "home" : path}
                  </BreadcrumbPage>
                }
              </BreadcrumbItem>
              {index !== 0 && index !== paths.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div >
  );
}

export default BreadcrumbHeader;