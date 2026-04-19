"use client";

import { useState } from "react";
import { RecommendationForm } from "@/components/RecommendationForm";
import { RecommendationResult } from "@/components/RecommendationResult";
import { ComparisonChart } from "@/components/ComparisonChart";
import { CloudProviderScore } from "@/lib/recommendationEngine";

interface ChartData {
  provider: string;
  score: number;
  cost: number;
  costPerScore: number;
}

export default function Home() {
  const [recommendations, setRecommendations] = useState<CloudProviderScore[] | null>(null);
  const [chartData, setChartData] = useState<ChartData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: {
    dataSize: number;
    accessFrequency: "low" | "medium" | "high";
    budget: number;
    usageType: "storage" | "compute" | "database" | "ml" | "mixed";
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const result = await response.json();
      setRecommendations(result.recommendations);
      setChartData(result.chartData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Cloud Provider Recommender
            </h1>
            <p className="text-lg text-muted-foreground">
              Find the right cloud provider for your infrastructure needs
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1 animate-slide-in">
            <RecommendationForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {error && (
              <div className="bg-destructive/10 border border-destructive rounded-lg p-4 mb-6">
                <p className="text-destructive font-medium">{error}</p>
              </div>
            )}

            {recommendations && chartData ? (
              <div className="space-y-8">
                <RecommendationResult recommendations={recommendations} />
                <ComparisonChart data={chartData} />
              </div>
            ) : !isLoading ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <div className="mb-4">
                  <div className="text-5xl mb-4">☁️</div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Ready to find your cloud home?
                  </h2>
                  <p className="text-muted-foreground">
                    Fill out the form to the left to get personalized cloud provider recommendations
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <div className="inline-flex items-center justify-center">
                  <div className="text-5xl animate-spin">⚙️</div>
                </div>
                <p className="text-muted-foreground mt-4">Analyzing your requirements...</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-16 bg-secondary/50 border border-border rounded-lg p-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">How We Calculate</h3>
          <div className="grid md:grid-cols-4 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground mb-1">Data Size</p>
              <p>Affects storage and transfer costs</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Access Frequency</p>
              <p>Determines tier and performance costs</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Budget</p>
              <p>Helps match realistic pricing</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Usage Type</p>
              <p>Identifies best-fit services</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
