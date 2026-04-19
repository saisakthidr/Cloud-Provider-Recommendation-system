import { NextRequest, NextResponse } from "next/server";
import {
  recommendCloudProvider,
  RecommendationInput,
  generateComparisonChartData,
} from "@/lib/recommendationEngine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const { dataSize, accessFrequency, budget, usageType } = body;

    if (
      typeof dataSize !== "number" ||
      !accessFrequency ||
      typeof budget !== "number" ||
      !usageType
    ) {
      return NextResponse.json(
        { error: "Invalid input parameters" },
        { status: 400 }
      );
    }

    // Validate value ranges
    if (dataSize < 0 || budget < 0) {
      return NextResponse.json(
        { error: "Data size and budget must be positive" },
        { status: 400 }
      );
    }

    const input: RecommendationInput = {
      dataSize,
      accessFrequency,
      budget,
      usageType,
    };

    // Get recommendations
    const recommendations = recommendCloudProvider(input);
    const chartData = generateComparisonChartData(recommendations);

    return NextResponse.json({
      recommendations,
      chartData,
      input,
    });
  } catch (error) {
    console.error("Recommendation error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
