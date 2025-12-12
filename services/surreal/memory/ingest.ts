import { MemoryNode, MemoryType } from '../../../types';
import { surreal, dbClient } from '../core';
import { getEmbedding, validateAndClassify, extractGraphEntities } from '../../gemini/index';

export const addMemoryNode = async (
  content: string, 
  title: string, 
  type: MemoryType, 
  sourceUrl?: string
): Promise<MemoryNode> => {
  const start = Date.now();
  await surreal.isReady;

  // 1. Parallel AI Processing: Embedding, Validation, Entity Extraction
  const [embedding, validation, entities] = await Promise.all([
      getEmbedding(content),
      validateAndClassify(content),
      extractGraphEntities(content)
  ]);

  if (!surreal.connected) {
      // Offline fallback
      const newNode: MemoryNode = {
          id: `mem_${Date.now()}`,
          content,
          fileName: title,
          type,
          sourceUrl,
          tags: ['offline', type],
          entities,
          embedding,
          createdAt: new Date().toISOString(),
          relations: [],
          accessCount: 0,
          lastAccessedAt: new Date().toISOString(),
          importance: 1.0,
          trustScore: validation.trustScore, 
          category: validation.category,
          validationStatus: validation.validationStatus
      };
      const existing = JSON.parse(localStorage.getItem('mnemosyne_memories') || '[]');
      localStorage.setItem('mnemosyne_memories', JSON.stringify([newNode, ...existing]));
      return newNode;
  }

  try {
      // 2. Temporal Reasoning Check: Does this new memory supersede an older one?
      // We look for high semantic similarity (>0.92) with the same type.
      let previousVersionId: string | null = null;
      try {
          const [similar] = await dbClient.query<MemoryNode[][]>(`
            SELECT id FROM memory 
            WHERE vector::similarity::cosine(embedding, $embedding) > 0.92
            AND type = $type
            AND (SELECT count() FROM <-supersedes) = 0
            ORDER BY createdAt DESC 
            LIMIT 1
          `, { embedding, type });
          
          if (similar && similar[0]) {
              previousVersionId = similar[0].id;
              console.log(`[Ingest] Detected previous version: ${previousVersionId}. Marking for obsolescence.`);
          }
      } catch (err) {
          console.warn("Temporal check failed", err);
      }

      // 3. Create Node (Relational & Vector Data)
      const created = await dbClient.create('memory', {
          content,
          fileName: title,
          type,
          sourceUrl,
          tags: ['vectorized', type, validation.category],
          entities,
          embedding,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          relations: [],
          accessCount: 0,
          lastAccessedAt: new Date().toISOString(),
          importance: 1.0,
          trustScore: validation.trustScore,
          category: validation.category,
          validationStatus: validation.validationStatus
      });

      const newNode = created[0] as unknown as MemoryNode;

      // 4. Update Graph Edges
      
      // A. Temporal Edge: Supersedes
      if (previousVersionId) {
          await dbClient.query(`
             RELATE ${newNode.id}->supersedes->${previousVersionId}
             SET createdAt = time::now();
          `);
      }

      // B. Contextual Edges: Linked via Entities (Knowledge Graph)
      // Connect to other nodes that share the same entities
      if (entities.length > 0) {
          // Find nodes that contain any of the extracted entities
          await dbClient.query(`
            LET $current = ${newNode.id};
            LET $tags = $entities;
            
            -- Find up to 5 other memories sharing these entities
            FOR $node IN (
                SELECT id, entities FROM memory 
                WHERE entities CONTAINSANY $tags 
                AND id != $current 
                ORDER BY createdAt DESC
                LIMIT 5
            ) {
                -- Create bidirectional 'related_to' edge
                RELATE $current->related_to->$node SET strength = 0.75, source = 'entity_match';
                RELATE $node->related_to->$current SET strength = 0.75, source = 'entity_match';
            };
          `, { entities });
      }

      surreal.logRequest('/db/ingest', 'INSERT', 200, Date.now() - start, embedding.length);
      return newNode;

  } catch (e) {
      console.error("DB Insert Failed", e);
      throw e;
  }
};