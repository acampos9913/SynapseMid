export type MemoryType = 'text' | 'file' | 'url' | 'integration_gdrive' | 'integration_onedrive' | 'integration_notion' | 'abstraction';

export type RelationType = 'related_to' | 'supersedes' | 'contradicts' | 'mentions' | 'abstracted_by';
export type MemoryCategory = 'epistemic' | 'operational' | 'uncategorized' | 'abstract';
export type ValidationStatus = 'verified' | 'low_confidence' | 'pending_review' | 'archived';

export interface GraphRelation {
  targetId: string;
  relationType: RelationType;
  strength: number; // 0-1
  direction: 'in' | 'out';
}

export interface MemoryNode {
  id: string;
  content: string;
  type: MemoryType;
  tags: string[];
  entities: string[]; 
  embedding?: number[]; 
  createdAt: string;
  updatedAt?: string; 
  fileName?: string; 
  sourceUrl?: string; 
  // Graph edges expanded
  relations: GraphRelation[]; 
  // For temporal reasoning (fetched via graph traversal)
  previousVersion?: {
      id: string;
      content: string;
      createdAt: string;
  };
  // HOPE: Optimization Metrics
  accessCount: number;      
  lastAccessedAt: string;   
  importance: number;       

  // HOPE: Robustness & Quality
  trustScore: number;       // 0-1 (Confidence Level)
  category: MemoryCategory; // Epistemic (Facts) vs Operational (Actions)
  validationStatus: ValidationStatus;
}

export interface SearchFilters {
  startDate?: string;
  endDate?: string;
  tags?: string[];
  types?: MemoryType[];
  minRelevance?: number;
  minTrust?: number; // New filter
}