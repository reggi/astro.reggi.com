reggi.com build using astro, intergrates aspects of:

- https://github.com/reggi/home
- https://github.com/reggi/simple-website
- https://github.com/reggi/brushwork
- https://github.com/reggi/deno-resume

## What are the main issues right now:

1. Being able to "easily add" in custom domains / parsers without opening up the
   codebase.
2. Being able to migrate the sqlite database to make changes to it
3. Confusion around which URL is which in the db
4. Confusion around when things get downloaded
5. Hoisting up embed and the domain matchers to consider different paths
6. Testing / Viewing components in a storybook-like format
7. The infinite canvas stuff
