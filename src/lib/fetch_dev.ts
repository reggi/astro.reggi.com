import { stringify } from 'yaml'
import camelCase from 'camelcase';
import fs from 'node:fs/promises'
import path from 'node:path'

const inputDir = './dev-cache';
const outputDir = './src/content/dev';

async function convertJsonToMarkdown() {
  const files = await fs.readdir(inputDir, { withFileTypes: true });

  for (const file of files) {
    if (file.isFile() && file.name.endsWith('.json')) {
      const filePath = path.join(inputDir, file.name);
      const jsonData = await fs.readFile(filePath, 'utf8');
      const article = JSON.parse(jsonData);

      const content = createFrontmatter(article);
      const outputFilePath = path.join(outputDir, file.name.replace('.json', '.mdx'));

      await fs.writeFile(outputFilePath, content);
      // console.log(`Markdown file created: ${outputFilePath}`);
    }
  }
}

function createFrontmatter(article: any): string {  
  // ignore these properties
  const {
    body_html,
    body_markdown,
    crossposted_at,
    user,
    type_of,
    tag_list,
    path,
    url,
    comments_count,
    last_comment_at,
    positive_reactions_count,
    public_reactions_count,
    ...rest
  } = article

  const {
    id,
    title,
    description,
    slug,
    readable_publish_date,
    collection_id,
    cover_image,
    social_image,
    created_at,
    edited_at,
    published_at,
    canonical_url,
    published_timestamp,
    reading_time_minutes,
    tags
  } = rest;

  const devId = id
  const devCollectionId = collection_id
  const devUrl = canonical_url
  const devSlug = slug

  const order = {
    devId,
    devCollectionId,
    devUrl,
    devSlug,
    title,
    description,
    tags,
    reading_time_minutes,
    // times
    readable_publish_date,
    created_at,
    edited_at,
    published_at,
    published_timestamp,
    cover_image,
    social_image,
  }

  const data = Object.fromEntries(Object.entries(order).map(([key, value]) => {
    return [camelCase(key), value]
  }))

  let hasEmbed = false
  const value = replaceLiquidTemplates(body_markdown, (innerLiquid) => {
    hasEmbed = true
    const [_liquid, value] = innerLiquid.split(' ')
    return `<Embed href="${value}" />`
  })

  const include = hasEmbed ? `import { Embed } from 'astro-cache-embed'\n` : undefined
  return ['---', stringify({ ...data }), '---', include, value].filter(v => v).join('\n');
}

function replaceLiquidTemplates(input: string, callback: (innerLiquid: string) => string): string {
  const liquidTemplateRegex = /{%\s*(.*?)\s*%}/gs;
  return input.replace(liquidTemplateRegex, (_, innerLiquid) => callback(innerLiquid));
}

await convertJsonToMarkdown();