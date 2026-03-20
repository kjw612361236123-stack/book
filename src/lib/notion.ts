import { Client } from '@notionhq/client';
import { NotionAPI } from 'notion-client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const notionRenderer = new NotionAPI();

export const getDatabase = async (databaseId: string) => {
  const response = await notion.databases.query({
    database_id: databaseId,
    sorts: [
      {
        timestamp: 'created_time',
        direction: 'descending',
      },
    ],
  });

  return response.results.map((page: any) => {
    const properties = page.properties;
    
    // Find properties by their key name (Notion stores property names as object keys)
    const titleProp = Object.values(properties).find((p: any) => p.type === 'title') as any;
    const dateProp = Object.values(properties).find((p: any) => p.type === 'date') as any;
    const filesProp = Object.values(properties).find((p: any) => p.type === 'files') as any;
    const textProp = Object.values(properties).find((p: any) => p.type === 'rich_text') as any;

    // Match by property KEY name (e.g. properties['카테고리']) — NOT by p.name
    const tagsProp = properties['카테고리'] || Object.values(properties).find((p: any) => p.type === 'multi_select') as any;
    const ratingProp = properties['평점'] || Object.values(properties).find((p: any) => p.type === 'select') as any;

    return {
      id: page.id,
      title: titleProp?.title?.[0]?.plain_text || 'Untitled',
      date: dateProp?.date?.start || page.created_time.substring(0, 10),
      tags: tagsProp?.multi_select?.map((tag: any) => tag.name) || [],
      thumbnail: filesProp?.files?.[0]?.file?.url || filesProp?.files?.[0]?.external?.url || '',
      description: textProp?.rich_text?.[0]?.plain_text || '',
      rating: ratingProp?.select?.name || '',
    };
  });
};

export const getPage = async (pageId: string) => {
  // Use notion-client for full page record map (required for react-notion-x)
  const recordMap = await notionRenderer.getPage(pageId);

  // Filter out '코멘트' and '표지' from the properties table to avoid overflow and GracefulImage crash
  if (recordMap.collection) {
    const collectionIds = Object.keys(recordMap.collection);
    if (collectionIds.length > 0) {
      const collection = recordMap.collection[collectionIds[0]] as any;
      const schema = collection.value?.schema;
      if (schema) {
        for (const key of Object.keys(schema)) {
          if (schema[key].name === '코멘트' || schema[key].name === '표지') {
            delete schema[key];
          }
        }
      }
    }
  }

  return recordMap;
};

export const getPageProperties = async (pageId: string) => {
  const response = await notion.pages.retrieve({ page_id: pageId });
  const properties = (response as any).properties;
  
  // Extract comment property
  const commentProp = properties['코멘트'];
  const comment = commentProp?.rich_text?.[0]?.plain_text || '';

  // Extract thumbnail property
  const filesProp = properties['표지'] || Object.values(properties).find((p: any) => p.type === 'files') as any;
  const thumbnail = filesProp?.files?.[0]?.file?.url || filesProp?.files?.[0]?.external?.url || '';
  
  return {
    comment,
    thumbnail
  };
};
