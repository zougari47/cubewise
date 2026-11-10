/** The `<head>` entries every page needs: title, description and share-card tags. */
export function pageHead({ title, description }: { title: string; description: string }) {
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
  }
}
