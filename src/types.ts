/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type OperatorName = 'MTN Cameroon' | 'Orange Cameroon' | 'Camtel' | 'Nexttel';

export type NetworkType = '2G' | '3G' | '4G' | '5G';

export interface LocationData {
  region: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface NetworkMetrics {
  signalStrength: number; // in dBm, e.g., -95
  signalQuality: string; // "Excellent" | "Good" | "Fair" | "Poor"
  networkType: NetworkType;
  downloadSpeed: number; // in Mbps
  uploadSpeed: number; // in Mbps
  latency: number; // in ms
  packetLoss: number; // in %
  jitter: number; // in ms
  operator: OperatorName;
}

export interface UserFeedback {
  overallQoE: number; // 1 to 5 stars
  browsingRating: number; // 1 to 5
  callingRating: number; // 1 to 5
  streamingRating: number; // 1 to 5
  userComments: string;
  frequentIssues: string[]; // e.g. ["Call Drops", "Slow Browsing", "No Signal Indoor", "High Latency"]
}

export interface QoEReport {
  id: string;
  timestamp: string; // ISO format
  location: LocationData;
  metrics: NetworkMetrics;
  feedback: UserFeedback;
  deviceModel: string;
}

export interface OperatorComparisonStats {
  operator: OperatorName;
  avgDownload: number;
  avgUpload: number;
  avgLatency: number;
  avgQoE: number;
  sampleCount: number;
}

export interface RegionSummary {
  region: string;
  sampleCount: number;
  avgQoE: number;
  troubleRatio: number; // % of samples with ratings <= 2
}

export interface SubscriberUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  city: string;
  region: string;
  registeredAt: string;
  status: 'Active' | 'Suspended' | 'Banned';
  tracesCount: number;
  priorityTier: 'Standard' | 'Premium' | 'VIP';
  role?: 'subscriber' | 'operator' | 'admin';
  password?: string;
  operatorName?: OperatorName;
}

export interface NetworkPredictionRequest {
  region: string;
  city: string;
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
}

export interface NetworkPredictionResult {
  request: NetworkPredictionRequest;
  recommendedOperator: OperatorName;
  confidenceScore: number;
  reason: string;
  rankings: {
    operator: OperatorName;
    score: number;
    expectedDownloadSpeed: number;
    expectedLatency: number;
    satisfactionRate: number;
  }[];
}

