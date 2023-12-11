import fs from 'fs';

// Function to replace a string in a file
async function replaceInFile(filePath: string, find: string, replace: string): Promise<void> {
  try {
    // Read the file content
    const content = await fs.promises.readFile(filePath, 'utf8');

    // Replace the string
    const modifiedContent = content.replace(find, replace);

    // Write the modified content back to the file
    await fs.promises.writeFile(filePath, modifiedContent, 'utf8');
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

// Example usage
const filePath = 'src/content/dev/1691041.mdx';
const find = 'https://youtube.com/shorts/hpkMXIJsdaU';
const replace = 'https://indieweb.social/@thomasreggi/111534765056666887';

replaceInFile(filePath, find, replace);
