import { getCollection, type CollectionEntry } from 'astro:content';

export function absoluteSlug (entry: CollectionEntry<'dev'>) {
  const v = entry.data.devSlug.split('-')
  v.pop()
  return v.join('-')
}

export async function devCollectionPosts() {
  const entries = await getCollection('dev');
  return entries.flatMap(entry => {
    return [
      {params: { slug: entry.data.devSlug }, props: { entry }},
      {params: { slug: absoluteSlug(entry) }, props: { entry }}
    ]
  });
}

export function formatBlogPostDate(dateString: string | Date): string {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate();
  return `${month} ${day}, ${year}`;
}