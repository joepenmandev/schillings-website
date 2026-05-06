/** BreadcrumbList for Google rich results (paired with visible crumbs where present). */

export function breadcrumbListGraphNode(items: { name: string; item: string }[]): {
  '@type': string;
  itemListElement: { '@type': string; position: number; name: string; item: string }[];
} {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((row, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: row.name,
      item: row.item,
    })),
  };
}

export function breadcrumbListJsonLd(
  items: { name: string; item: string }[],
): {
  '@context': string;
  '@type': string;
  itemListElement: { '@type': string; position: number; name: string; item: string }[];
} {
  return {
    '@context': 'https://schema.org',
    ...breadcrumbListGraphNode(items),
  };
}
