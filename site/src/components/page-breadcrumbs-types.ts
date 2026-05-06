/** Visible breadcrumbs — pair with `breadcrumbListGraphNode` in JSON-LD (same URLs). */
export type BreadcrumbCrumb =
  | { name: string; current: true }
  | { name: string; href: string };

export function isCurrentCrumb(item: BreadcrumbCrumb): item is { name: string; current: true } {
  return 'current' in item && item.current === true;
}
