"use client";

import { CloudProviderScore } from "@/lib/recommendationEngine";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RecommendationResultProps {
  recommendations: CloudProviderScore[];
}

export function RecommendationResult({ recommendations }: RecommendationResultProps) {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Recommendations</h2>
        <p className="text-muted-foreground">Based on your requirements, here are the cloud providers ranked by fit</p>
      </div>

      {recommendations.map((rec, index) => (
        <Card
          key={rec.provider}
          className={`border-border shadow-sm transition-all animate-fade-in card-hover ${
            index === 0 ? "ring-2 ring-accent" : ""
          }`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-xl">{rec.provider}</CardTitle>
                  <Badge
                    variant="secondary"
                    className="bg-accent text-accent-foreground"
                  >
                    Rank #{index + 1}
                  </Badge>
                  {index === 0 && (
                    <Badge className="bg-primary text-primary-foreground">
                      Recommended
                    </Badge>
                  )}
                </div>
                <CardDescription className="mt-2">{rec.recommendation}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-primary">{rec.score}</div>
                <p className="text-sm text-muted-foreground">Match Score</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-3">Estimated Monthly Cost</h3>
              <div className="text-3xl font-bold text-primary">
                ${rec.estimatedMonthlyCost.toLocaleString()}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {rec.strengths.map((strength, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-primary font-bold">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-destructive rounded-full"></span>
                  Considerations
                </h3>
                <ul className="space-y-2">
                  {rec.weaknesses.map((weakness, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-destructive font-bold">•</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
