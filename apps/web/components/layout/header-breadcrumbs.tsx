'use client';

import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import type { ResolvedBreadcrumb } from "@/lib/navigation/breadcrumbs-registry";

type RenderableCrumb =
  | {
      type: "crumb";
      id: string;
      label: string;
      href?: string;
      isCurrent: boolean;
    }
  | { type: "ellipsis"; id: string };

const MAX_CRUMBS_WITHOUT_COLLAPSE = 4;

export function HeaderBreadcrumbs() {
  const breadcrumbs = useBreadcrumbs();

  const displayCrumbs = collapseIfNeeded(breadcrumbs);

  if (!displayCrumbs.length) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {displayCrumbs.map((item, index) => {
          const isLast = index === displayCrumbs.length - 1;

          if (item.type === "ellipsis") {
            return (
              <Fragment key={item.id}>
                <BreadcrumbItem>
                  <BreadcrumbEllipsis />
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </Fragment>
            );
          }

          const isLink = !!item.href && !item.isCurrent;

          return (
            <Fragment key={item.id}>
              <BreadcrumbItem>
                {isLink ? (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function collapseIfNeeded(crumbs: ResolvedBreadcrumb[]): RenderableCrumb[] {
  if (crumbs.length <= MAX_CRUMBS_WITHOUT_COLLAPSE) {
    return crumbs.map((crumb) => ({
      type: "crumb" as const,
      ...crumb,
    }));
  }

  const first = crumbs[0];
  const second = crumbs[1];
  const penultimate = crumbs[crumbs.length - 2];
  const last = crumbs[crumbs.length - 1];

  return [
    { type: "crumb", ...first },
    { type: "crumb", ...second },
    { type: "ellipsis", id: "ellipsis" },
    { type: "crumb", ...penultimate },
    { type: "crumb", ...last },
  ];
}
