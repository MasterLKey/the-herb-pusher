const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST || 'http://localhost:7700'
const MEILISEARCH_API_KEY = process.env.MEILISEARCH_API_KEY || ''

function meiliHeaders() {
  const h: Record<string, string> = { 'Content-Type': 'application/json' }
  if (MEILISEARCH_API_KEY) h['Authorization'] = `Bearer ${MEILISEARCH_API_KEY}`
  return h
}

export async function indexDocument(indexUid: string, document: Record<string, unknown>) {
  try {
    await fetch(`${MEILISEARCH_HOST}/indexes/${indexUid}/documents`, {
      method: 'POST',
      headers: meiliHeaders(),
      body: JSON.stringify([document]),
    })
  } catch (err) {
    console.error(`[Meilisearch] Failed to index document in ${indexUid}:`, err)
  }
}

export async function deleteDocument(indexUid: string, id: string) {
  try {
    await fetch(`${MEILISEARCH_HOST}/indexes/${indexUid}/documents/${id}`, {
      method: 'DELETE',
      headers: meiliHeaders(),
    })
  } catch (err) {
    console.error(`[Meilisearch] Failed to delete document from ${indexUid}:`, err)
  }
}

export async function ensureIndexes() {
  const indexes = [
    { uid: 'ingredients', primaryKey: 'id' },
    { uid: 'products', primaryKey: 'id' },
    { uid: 'articles', primaryKey: 'id' },
    { uid: 'wellness-goals', primaryKey: 'id' },
  ]

  for (const index of indexes) {
    try {
      await fetch(`${MEILISEARCH_HOST}/indexes`, {
        method: 'POST',
        headers: meiliHeaders(),
        body: JSON.stringify(index),
      })
    } catch {
      // Index likely already exists
    }
  }
}
