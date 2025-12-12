import { MemoryNode, SearchFilters } from '../../../types';
import { surreal, dbClient } from '../core';
import { getEmbedding } from '../../gemini/index';

export const hybridSearch = async (query: string, filters?: SearchFilters): Promise<MemoryNode[]> => {
  const start = Date.now();
  await surreal.isReady;

  if (!query) return [];

  if (!surreal.connected) {
      const memories: MemoryNode[] = JSON.parse(localStorage.getItem('mnemosyne_memories') || '[]');
      const qLower = query.toLowerCase();
      return memories
        .filter(m => m.content.toLowerCase().includes(qLower))
        .slice(0, 5);
  }

  try {
      const queryEmbedding = await getEmbedding(query);
      
      // RAG Query with Graph Traversal for Temporal Consistency
      // We select the memory, but also check if there is an incoming 'supersedes' edge.
      // If `newer_version` exists, it means this record is outdated.
      let ql = `
        SELECT 
            *, 
            vector::similarity::cosine(embedding, $queryEmbedding) AS vector_score,
            ((vector::similarity::cosine(embedding, $queryEmbedding) * 0.7) + (trustScore * 0.3)) AS final_score,
            (SELECT id, content, createdAt, trustScore, category FROM <-supersedes<-memory ORDER BY createdAt DESC LIMIT 1) AS newer_version
        FROM memory 
        WHERE embedding != NONE
      `;

      const params: any = { queryEmbedding };

      // Apply Relational Filters
      if (filters?.startDate) {
          ql += ` AND createdAt >= $startDate`;
          params.startDate = filters.startDate;
      }
      if (filters?.types?.length) {
          ql += ` AND type INSIDE $types`;
          params.types = filters.types;
      }
      if (filters?.minTrust) {
          ql += ` AND trustScore >= $minTrust`;
          params.minTrust = filters.minTrust;
      }

      ql += ` AND vector::similarity::cosine(embedding, $queryEmbedding) > 0.60`;
      ql += ` ORDER BY final_score DESC LIMIT 8`;

      const [result] = await dbClient.query<any[][]>(ql, params);
      
      const processedNodes: MemoryNode[] = [];
      const seenIds = new Set<string>();

      // Post-Processing for Temporal Logic
      for (const row of (result || [])) {
          if (seenIds.has(row.id)) continue;

          // Temporal Reasoning:
          // If this node is superseded by a newer version, use the newer version instead.
          if (row.newer_version && row.newer_version.length > 0) {
              const newer = row.newer_version[0];
              console.log(`[RAG] Temporal Correction: Swapping ${row.id} for newer version ${newer.id}`);
              
              if (!seenIds.has(newer.id)) {
                  processedNodes.push({
                      ...newer,
                      previousVersion: { id: row.id, content: row.content, createdAt: row.createdAt },
                      relations: [], // Simplify for RAG context
                      accessCount: newer.accessCount || 0,
                      lastAccessedAt: newer.lastAccessedAt || newer.createdAt,
                      importance: newer.importance || 1.0,
                      entities: newer.entities || [], // Ensure type safety
                      type: newer.type || 'text',
                      trustScore: newer.trustScore,
                      category: newer.category,
                      validationStatus: newer.validationStatus || 'verified'
                  } as MemoryNode);
                  seenIds.add(newer.id);
                  seenIds.add(row.id); // Mark old one as seen so we don't add it later
              }
          } else {
              // This is the latest version
              processedNodes.push({
                  ...row,
                  relations: [],
                  accessCount: row.accessCount || 0,
                  lastAccessedAt: row.lastAccessedAt || row.createdAt,
                  importance: row.importance || 0.5,
                  trustScore: row.trustScore ?? 0.5,
                  category: row.category ?? 'uncategorized',
                  validationStatus: row.validationStatus ?? 'verified'
              } as MemoryNode);
              seenIds.add(row.id);
          }
      }

      // Update Access Metrics
      if (processedNodes.length > 0) {
          const ids = processedNodes.map(n => n.id);
          dbClient.query(`
            UPDATE $ids SET 
                accessCount = (accessCount OR 0) + 1, 
                lastAccessedAt = time::now()
          `, { ids }).catch(err => console.warn("Failed to update memory metrics", err));
      }

      surreal.logRequest('/db/search/hybrid', 'SELECT', 200, Date.now() - start);
      return processedNodes.slice(0, 6); // Return top matches

  } catch (e) {
      console.error("Search failed", e);
      return [];
  }
};