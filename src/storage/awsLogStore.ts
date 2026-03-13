import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { type AuditEntry, type AuditEntryInput, buildAuditEntry, verifyChainIntegrity } from '../crypto/hashChain.js';

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'ai-blackbox-logs';
const BUCKET_NAME = process.env.S3_BUCKET || 'ai-blackbox-audit-logs';

class AWSLogStore {
  private dynamoClient: DynamoDBDocumentClient;
  private s3Client: S3Client;
  private region: string;

  constructor() {
    this.region = process.env.AWS_REGION || 'ap-south-1';
    
    const ddbClient = new DynamoDBClient({ region: this.region });
    this.dynamoClient = DynamoDBDocumentClient.from(ddbClient);
    
    this.s3Client = new S3Client({ region: this.region });
  }

  /**
   * Appends a new audit entry to DynamoDB and S3
   */
  async append(input: AuditEntryInput): Promise<AuditEntry> {
    // Get the last entry for THIS SESSION to build the chain
    const sessionEntries = await this.getBySession(input.sessionId);
    const previousHash = sessionEntries.length > 0 
      ? sessionEntries[sessionEntries.length - 1]!.hash 
      : '0';
    
    const entry = buildAuditEntry(input, previousHash);
    
    // Store in DynamoDB
    await this.dynamoClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: entry,
    }));
    
    // Store in S3
    await this.s3Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `${entry.sessionId}/${entry.id}.json`,
      Body: JSON.stringify(entry, null, 2),
      ContentType: 'application/json',
    }));
    
    return entry;
  }

  /**
   * Gets all entries for a specific session using GSI
   */
  async getBySession(sessionId: string): Promise<AuditEntry[]> {
    const result = await this.dynamoClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'sessionId = :sessionId',
      ExpressionAttributeValues: {
        ':sessionId': sessionId,
      },
    }));
    
    const entries = (result.Items || []) as AuditEntry[];
    return entries.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Gets all audit entries sorted by timestamp
   */
  async getAll(): Promise<AuditEntry[]> {
    const result = await this.dynamoClient.send(new ScanCommand({
      TableName: TABLE_NAME,
    }));
    
    const entries = (result.Items || []) as AuditEntry[];
    return entries.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Gets all unique session IDs
   */
  async getAllSessions(): Promise<string[]> {
    const result = await this.dynamoClient.send(new ScanCommand({
      TableName: TABLE_NAME,
      ProjectionExpression: 'sessionId',
    }));
    
    const sessionIds = new Set<string>();
    for (const item of result.Items || []) {
      if (item.sessionId) {
        sessionIds.add(item.sessionId as string);
      }
    }
    
    return Array.from(sessionIds);
  }

  /**
   * Verifies the integrity of the entire chain
   */
  async verifyIntegrity(): Promise<{ valid: boolean; errors: string[] }> {
    const entries = await this.getAll();
    return verifyChainIntegrity(entries);
  }

  /**
   * Gets statistics about the log store
   */
  async getStats(): Promise<{
    totalEntries: number;
    totalSessions: number;
    chainValid: boolean;
    oldestEntry: number | null;
    newestEntry: number | null;
    riskDistribution: {
      LOW: number;
      MEDIUM: number;
      HIGH: number;
    };
    highRiskSessions: number;
    averageSeverityScore: number;
  }> {
    const entries = await this.getAll();
    const integrity = await this.verifyIntegrity();
    
    const riskDistribution = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
    };
    
    const severityScores: number[] = [];
    let highRiskSessions = 0;
    
    for (const entry of entries) {
      if (entry.data.riskLevel) {
        riskDistribution[entry.data.riskLevel]++;
      }
      
      // Collect severity scores
      if (entry.data.severityScore !== undefined) {
        severityScores.push(entry.data.severityScore);
        
        // Count high-risk sessions (severity >= 70)
        if (entry.data.severityScore >= 70) {
          highRiskSessions++;
        }
      }
    }
    
    // Calculate average severity score
    const averageSeverityScore = severityScores.length > 0
      ? Math.round(severityScores.reduce((sum, score) => sum + score, 0) / severityScores.length)
      : 0;
    
    const sessions = await this.getAllSessions();
    
    return {
      totalEntries: entries.length,
      totalSessions: sessions.length,
      chainValid: integrity.valid,
      oldestEntry: entries.length > 0 ? entries[0]!.timestamp : null,
      newestEntry: entries.length > 0 ? entries[entries.length - 1]!.timestamp : null,
      riskDistribution,
      highRiskSessions,
      averageSeverityScore,
    };
  }
}

// Singleton instance
export const awsLogStore = new AWSLogStore();
