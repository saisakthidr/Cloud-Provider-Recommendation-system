"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormProps {
  onSubmit: (data: {
    dataSize: number;
    accessFrequency: "low" | "medium" | "high";
    budget: number;
    usageType: "storage" | "compute" | "database" | "ml" | "mixed";
  }) => void;
  isLoading: boolean;
}

export function RecommendationForm({ onSubmit, isLoading }: FormProps) {
  const [dataSize, setDataSize] = useState<string>("100");
  const [accessFrequency, setAccessFrequency] = useState<"low" | "medium" | "high">("medium");
  const [budget, setBudget] = useState<string>("2000");
  const [usageType, setUsageType] = useState<"storage" | "compute" | "database" | "ml" | "mixed">("mixed");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      dataSize: Number(dataSize),
      accessFrequency,
      budget: Number(budget),
      usageType,
    });
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Cloud Configuration</CardTitle>
        <CardDescription>Describe your cloud infrastructure needs</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="dataSize" className="text-foreground font-medium">
              Data Size (GB)
            </Label>
            <Input
              id="dataSize"
              type="number"
              min="1"
              max="100000"
              value={dataSize}
              onChange={(e) => setDataSize(e.target.value)}
              placeholder="Enter data size in GB"
              className="bg-input border-border focus:border-accent focus:ring-accent transition-colors"
            />
            <p className="text-sm text-muted-foreground">Total amount of data to store</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessFrequency" className="text-foreground font-medium">
              Access Frequency
            </Label>
            <select
              id="accessFrequency"
              value={accessFrequency}
              onChange={(e) => setAccessFrequency(e.target.value as "low" | "medium" | "high")}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:border-accent focus:ring-2 focus:ring-accent/50 transition-colors"
            >
              <option value="low">Low (Archive/Backup)</option>
              <option value="medium">Medium (Regular Access)</option>
              <option value="high">High (Real-time Access)</option>
            </select>
            <p className="text-sm text-muted-foreground">How often will you access your data?</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget" className="text-foreground font-medium">
              Monthly Budget (USD)
            </Label>
            <Input
              id="budget"
              type="number"
              min="100"
              max="100000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter monthly budget"
              className="bg-input border-border focus:border-accent focus:ring-accent transition-colors"
            />
            <p className="text-sm text-muted-foreground">Your monthly budget for cloud services</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="usageType" className="text-foreground font-medium">
              Primary Usage Type
            </Label>
            <select
              id="usageType"
              value={usageType}
              onChange={(e) => setUsageType(e.target.value as "storage" | "compute" | "database" | "ml" | "mixed")}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:border-accent focus:ring-2 focus:ring-accent/50 transition-colors"
            >
              <option value="storage">Storage (Data Lake/Archive)</option>
              <option value="compute">Compute (Processing/Servers)</option>
              <option value="database">Database (SQL/NoSQL)</option>
              <option value="ml">Machine Learning</option>
              <option value="mixed">Mixed Workload</option>
            </select>
            <p className="text-sm text-muted-foreground">What will be your primary use case?</p>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? "Analyzing..." : "Get Recommendations"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
