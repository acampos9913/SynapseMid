import { MemoryNode } from '../../types';

export type OutputFormat = 'json' | 'markdown' | 'xml';

/**
 * MCP NORMALIZATION LAYER
 * Converts raw graph nodes into standardized formats for external LLM consumption.
 */
export const formatContext = (nodes: MemoryNode[], format: OutputFormat): string => {
  if (format === 'json') {
    return JSON.stringify(nodes.map(n => ({
      id: n.id,
      content: n.content,
      source: n.fileName,
      trust_score: n.trustScore,
      category: n.category,
      created_at: n.createdAt
    })), null, 2);
  }

  if (format === 'xml') {
    return `<mcp_context_response>
      ${nodes.map(n => `
      <memory_node id="${n.id}" trust="${n.trustScore}" category="${n.category}">
        <source>${n.fileName || 'unknown'}</source>
        <content><![CDATA[${n.content}]]></content>
        <meta>
            <created>${n.createdAt}</created>
        </meta>
      </memory_node>`).join('')}
    </mcp_context_response>`;
  }

  // Markdown (Default) - Optimized for RAG context injection
  return nodes.map((n, i) => 
    `### Memory [${i+1}]
**Source:** ${n.fileName} | **Type:** ${n.category.toUpperCase()} | **Confidence:** ${(n.trustScore * 100).toFixed(0)}%
${n.content}
`
  ).join('\n---\n\n');
};