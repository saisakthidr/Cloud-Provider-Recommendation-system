"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartData {
  provider: string;
  score: number;
  cost: number;
  costPerScore: number;
}

interface ComparisonChartProps {
  data: ChartData[];
}

export function ComparisonChart({ data }: ComparisonChartProps) {
  return (
    <div className="space-y-6">
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>Match Score Comparison</CardTitle>
          <CardDescription>How well each provider fits your requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="provider" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: `1px solid var(--border)`,
                  color: "var(--foreground)",
                }}
              />
              <Legend />
              <Bar dataKey="score" fill="var(--chart-1)" name="Match Score" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>Cost Comparison</CardTitle>
          <CardDescription>Estimated monthly costs for each provider</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="provider" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: `1px solid var(--border)`,
                  color: "var(--foreground)",
                }}
                formatter={(value) => `$${value}`}
              />
              <Legend />
              <Bar dataKey="cost" fill="var(--chart-2)" name="Monthly Cost (USD)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>Cost Efficiency</CardTitle>
          <CardDescription>Cost per unit of match score (lower is better)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="provider" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: `1px solid var(--border)`,
                  color: "var(--foreground)",
                }}
                formatter={(value) => `$${value}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="costPerScore"
                stroke="var(--chart-3)"
                name="Cost per Score Unit"
                strokeWidth={2}
                dot={{ fill: "var(--chart-3)", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
