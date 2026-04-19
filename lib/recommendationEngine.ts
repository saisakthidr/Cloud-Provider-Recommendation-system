export interface RecommendationInput {
  dataSize: number; // GB
  accessFrequency: "low" | "medium" | "high";
  budget: number; // monthly budget in USD
  usageType: "storage" | "compute" | "database" | "ml" | "mixed";
  region?: string;
}

export interface CloudProviderScore {
  provider: "AWS" | "Azure" | "GCP";
  score: number; // 0-100
  strengths: string[];
  weaknesses: string[];
  estimatedMonthlyCost: number;
  recommendation: string;
}

export function recommendCloudProvider(
  input: RecommendationInput
): CloudProviderScore[] {
  const scores: CloudProviderScore[] = [];

  // AWS Scoring
  const awsScore = calculateAwsScore(input);
  scores.push({
    provider: "AWS",
    score: awsScore,
    strengths: [
      "Largest service portfolio (200+ services)",
      "Best for data analytics and ML workloads",
      "Most mature and battle-tested platform",
      "Extensive pricing options and flexibility",
    ],
    weaknesses: [
      "Complex pricing structure",
      "Steeper learning curve",
      "High default costs without optimization",
    ],
    estimatedMonthlyCost: estimateAwsCost(input),
    recommendation: generateAwsRecommendation(awsScore, input),
  });

  // Azure Scoring
  const azureScore = calculateAzureScore(input);
  scores.push({
    provider: "Azure",
    score: azureScore,
    strengths: [
      "Best for enterprise integration (Office 365, Windows)",
      "Strong hybrid cloud capabilities",
      "Competitive pricing on compute",
      "Excellent for .NET and Microsoft workloads",
    ],
    weaknesses: [
      "Less extensive service portfolio than AWS",
      "Smaller open-source ecosystem",
      "Less mature for certain use cases",
    ],
    estimatedMonthlyCost: estimateAzureCost(input),
    recommendation: generateAzureRecommendation(azureScore, input),
  });

  // GCP Scoring
  const gcpScore = calculateGcpScore(input);
  scores.push({
    provider: "GCP",
    score: gcpScore,
    strengths: [
      "Best for data analytics and BigQuery",
      "Competitive pricing on storage",
      "Strong Kubernetes support",
      "Best-in-class ML/AI services",
    ],
    weaknesses: [
      "Smaller service portfolio",
      "Less mature for enterprise features",
      "Smaller third-party ecosystem",
    ],
    estimatedMonthlyCost: estimateGcpCost(input),
    recommendation: generateGcpRecommendation(gcpScore, input),
  });

  return scores.sort((a, b) => b.score - a.score);
}

function calculateAwsScore(input: RecommendationInput): number {
  let score = 70;

  // Adjust based on data size
  if (input.dataSize > 100) score += 10;
  else if (input.dataSize < 10) score -= 5;

  // Adjust based on usage type
  if (input.usageType === "ml") score += 8;
  if (input.usageType === "mixed") score += 5;
  if (input.usageType === "storage") score += 3;

  // Adjust based on budget
  if (input.budget >= 5000) score += 10;
  else if (input.budget < 500) score -= 8;

  // Adjust based on access frequency
  if (input.accessFrequency === "high") score += 5;

  return Math.min(100, Math.max(0, score));
}

function calculateAzureScore(input: RecommendationInput): number {
  let score = 65;

  // Adjust based on data size
  if (input.dataSize > 500) score += 8;
  else if (input.dataSize < 50) score += 5;

  // Adjust based on usage type
  if (input.usageType === "database") score += 10;
  if (input.usageType === "compute") score += 8;
  if (input.usageType === "mixed") score += 5;

  // Adjust based on budget
  if (input.budget >= 3000) score += 12;
  else if (input.budget >= 1000) score += 8;

  // Adjust based on access frequency
  if (input.accessFrequency === "medium") score += 5;

  return Math.min(100, Math.max(0, score));
}

function calculateGcpScore(input: RecommendationInput): number {
  let score = 68;

  // Adjust based on data size
  if (input.dataSize > 1000) score += 15;
  else if (input.dataSize > 100) score += 8;

  // Adjust based on usage type
  if (input.usageType === "ml") score += 12;
  if (input.usageType === "storage") score += 10;
  if (input.usageType === "database") score += 5;

  // Adjust based on budget
  if (input.budget >= 2000) score += 10;
  else if (input.budget < 500) score -= 5;

  // Adjust based on access frequency
  if (input.accessFrequency === "low") score += 8;

  return Math.min(100, Math.max(0, score));
}

function estimateAwsCost(input: RecommendationInput): number {
  let cost = 0;

  // Storage costs (S3)
  cost += input.dataSize * 0.023; // $0.023 per GB

  // Compute/processing costs based on usage type
  const usageMultiplier = {
    storage: 0.5,
    compute: 2.0,
    database: 1.5,
    ml: 3.0,
    mixed: 1.8,
  };

  cost += 500 * usageMultiplier[input.usageType];

  // Access frequency adjustment
  if (input.accessFrequency === "high") cost *= 1.3;
  else if (input.accessFrequency === "low") cost *= 0.7;

  return Math.round(cost);
}

function estimateAzureCost(input: RecommendationInput): number {
  let cost = 0;

  // Storage costs
  cost += input.dataSize * 0.018; // $0.018 per GB

  const usageMultiplier = {
    storage: 0.4,
    compute: 1.8,
    database: 1.3,
    ml: 2.5,
    mixed: 1.5,
  };

  cost += 450 * usageMultiplier[input.usageType];

  if (input.accessFrequency === "high") cost *= 1.25;
  else if (input.accessFrequency === "low") cost *= 0.75;

  return Math.round(cost);
}

function estimateGcpCost(input: RecommendationInput): number {
  let cost = 0;

  // Storage costs (GCS)
  cost += input.dataSize * 0.02; // $0.02 per GB

  const usageMultiplier = {
    storage: 0.3,
    compute: 1.9,
    database: 1.2,
    ml: 3.2,
    mixed: 1.6,
  };

  cost += 400 * usageMultiplier[input.usageType];

  if (input.accessFrequency === "high") cost *= 1.2;
  else if (input.accessFrequency === "low") cost *= 0.8;

  return Math.round(cost);
}

function generateAwsRecommendation(score: number, input: RecommendationInput): string {
  if (score >= 80) return "Highly recommended for your workload";
  if (score >= 65) return "Well-suited for your requirements";
  return "Consider for specific use cases";
}

function generateAzureRecommendation(score: number, input: RecommendationInput): string {
  if (score >= 80) return "Excellent choice for your needs";
  if (score >= 65) return "Good option with strong enterprise features";
  return "Consider if integrated with Microsoft ecosystem";
}

function generateGcpRecommendation(score: number, input: RecommendationInput): string {
  if (score >= 80) return "Perfect fit for your workload";
  if (score >= 65) return "Strong option with competitive pricing";
  return "Consider for specific data analytics needs";
}

export function generateComparisonChartData(scores: CloudProviderScore[]) {
  return scores.map((s) => ({
    provider: s.provider,
    score: s.score,
    cost: s.estimatedMonthlyCost,
    costPerScore: Math.round(s.estimatedMonthlyCost / (s.score / 10)),
  }));
}
