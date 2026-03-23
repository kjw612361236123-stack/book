import { getDatabase } from '@/lib/notion';
import type { MetadataRoute } from 'next';

import { headers } from 'next/headers';

export const revalidate = 86400; // Regenerate once a day

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'https';
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;
  const databaseId = process.env.NOTION_DATABASE_ID;
  const books = await getDatabase(databaseId);

  const bookEntries: MetadataRoute.Sitemap = books.map((book: any) => ({
    url: `${baseUrl}/book/${book.id}`,
    lastModified: new Date(book.date || new Date().toISOString()),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...bookEntries,
  ];
}
