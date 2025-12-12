import { db } from '../surrealService';
import { formatContext, OutputFormat } from './formatter';
import { PermissionScope } from '../../types';

interface McpRequest {
  apiKey: string;
  query: string;
  format?: OutputFormat;
}

interface McpResponse {
  status: number;
  payload?: string; // The formatted context
  error?: string;
  meta?: {
    count: number;
    scopes_used: PermissionScope[];
  }
}

/**
 * MODEL CONTEXT PROTOCOL (MCP)
 * The interoperability layer allowing external agents to query Mnemosyne's memory.
 */
export class ModelContextProtocol {
  
  static async handleRequest({ apiKey, query, format = 'json' }: McpRequest): Promise<McpResponse> {
    const start = Date.now();
    
    // 1. Authenticate & Retrieve Scopes
    // Note: In this mock environment, we validate against the local storage keys.
    const keys = db.getApiKeys();
    const keyRecord = keys.find(k => k.status === 'active'); 
    // Real implementation would verify the specific apiKey string hash.

    if (!keyRecord) {
        return { status: 401, error: "Unauthorized: Invalid or revoked API Key." };
    }

    const scopes = keyRecord.scopes;

    // 2. Authorization (Granular Permission Check)
    const hasReadAccess = scopes.some(s => s.startsWith('memory:read'));
    if (!hasReadAccess) {
        return { status: 403, error: "Forbidden: This key does not have memory read permissions." };
    }

    // 3. Retrieval (Hybrid Search)
    let nodes = await db.hybridSearch(query);

    // 4. Scope Enforcement (Filtering)
    // If user has restricted scopes (e.g. only 'epistemic'), filter the results.
    nodes = nodes.filter(node => {
        if (scopes.includes('memory:read')) return true; // Full Root Access

        // Granular Checks
        if (scopes.includes('memory:read:epistemic') && node.category === 'epistemic') return true;
        if (scopes.includes('memory:read:operational') && node.category === 'operational') return true;
        
        return false;
    });

    if (nodes.length === 0) {
        return { status: 200, payload: "", meta: { count: 0, scopes_used: scopes } };
    }

    // 5. Normalization
    const payload = formatContext(nodes, format);

    // Log the interaction
    // Accessing private instance via a public method if exposed, otherwise simulate side-effect
    console.log(`[MCP] Served ${nodes.length} nodes via protocol.`);

    return {
        status: 200,
        payload,
        meta: {
            count: nodes.length,
            scopes_used: scopes
        }
    };
  }
}