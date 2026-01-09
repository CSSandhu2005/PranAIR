"use client";
import React, { useState } from "react";
import { IconUpload, IconAlertTriangle, IconCheck, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface DistressAnalysis {
  humanVisible: boolean;
  visibleBlood: boolean;
  personLyingDown: boolean;
  appearsMotionless: boolean;
  signsOfDistress: string[];
  urgencyLevel: "Low" | "Medium" | "High" | "Critical";
  lifeThreat: "Low" | "Medium" | "High";
  confidence: number;
  summary: string;
}

export default function Agent1Dashboard() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<DistressAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setAnalysis(null);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await fetch("/api/agent1-human-distress", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to analyze image");
      }

      if (data.analysis) {
        setAnalysis(data.analysis);
      } else {
        throw new Error("No analysis data received");
      }
    } catch (err: any) {
      console.error("Analysis error:", err);
      setError(err.message || "An error occurred during analysis");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "bg-red-500 text-white";
      case "High":
        return "bg-orange-500 text-white";
      case "Medium":
        return "bg-yellow-500 text-black";
      case "Low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="flex flex-1 w-full overflow-y-auto bg-neutral-50 dark:bg-neutral-900">
      <div className="w-full mx-auto max-w-6xl p-4 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100">
            Agent 1: Human Distress Detection
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Upload an image to analyze visible signs of human distress
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN - Image Upload */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
              <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                Upload Image
              </h2>
              
              <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-4 hover:border-red-500 dark:hover:border-red-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  {imagePreview ? (
                    <div className="w-full">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-64 object-contain rounded-lg"
                      />
                      <p className="text-center mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                        Click to change image
                      </p>
                    </div>
                  ) : (
                    <>
                      <IconUpload className="w-12 h-12 text-neutral-400 mb-4" />
                      <p className="text-neutral-600 dark:text-neutral-400 text-center font-medium">
                        Click to upload image
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-2">
                        JPG, PNG formats supported
                      </p>
                    </>
                  )}
                </label>
              </div>

              {/* Analyze Button */}
              <button
                onClick={analyzeImage}
                disabled={!selectedImage || isAnalyzing}
                className={cn(
                  "w-full mt-4 py-3 rounded-lg font-semibold transition-all duration-200",
                  selectedImage && !isAnalyzing
                    ? "bg-red-500 hover:bg-red-600 text-white cursor-pointer shadow-lg hover:shadow-xl"
                    : "bg-neutral-300 dark:bg-neutral-700 text-neutral-500 cursor-not-allowed"
                )}
              >
                {isAnalyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  "Analyze Emergency"
                )}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN - Patient Emergency Report */}
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <IconAlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-red-800 dark:text-red-300 font-semibold">
                      Analysis Failed
                    </p>
                    <p className="text-red-700 dark:text-red-400 text-sm mt-1">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {analysis ? (
              <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
                  Patient Emergency Report
                </h2>

                {/* Urgency Badge */}
                <div>
                  <span
                    className={cn(
                      "inline-block px-4 py-2 rounded-full font-bold text-base",
                      getUrgencyColor(analysis.urgencyLevel)
                    )}
                  >
                    {analysis.urgencyLevel} Urgency
                  </span>
                </div>

                {/* Summary */}
                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
                  <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 mb-2 text-sm">
                    EMERGENCY SUMMARY
                  </h3>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {analysis.summary}
                  </p>
                </div>

                {/* Patient Condition */}
                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
                  <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 mb-3 text-sm">
                    PATIENT CONDITION
                  </h3>
                  <div className="space-y-2">
                    <ConditionItem
                      label="Human Visible"
                      value={analysis.humanVisible}
                    />
                    <ConditionItem
                      label="Visible Blood"
                      value={analysis.visibleBlood}
                    />
                    <ConditionItem
                      label="Person Lying Down"
                      value={analysis.personLyingDown}
                    />
                    <ConditionItem
                      label="Appears Motionless"
                      value={analysis.appearsMotionless}
                    />
                  </div>
                </div>

                {/* Threat Level & Confidence */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                      LIFE THREAT
                    </p>
                    <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                      {analysis.lifeThreat}
                    </p>
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                      CONFIDENCE
                    </p>
                    <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                      {Math.round(analysis.confidence * 100)}%
                    </p>
                  </div>
                </div>

                {/* Detected Signals */}
                {analysis.signsOfDistress.length > 0 && (
                  <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
                    <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 mb-3 text-sm">
                      DETECTED SIGNALS
                    </h3>
                    <ul className="space-y-2">
                      {analysis.signsOfDistress.map((sign, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300"
                        >
                          <IconAlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                          <span>{sign}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : !error ? (
              <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 h-full flex items-center justify-center">
                <div className="text-center">
                  <IconUpload className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Upload an image and click
                  </p>
                  <p className="text-neutral-500 dark:text-neutral-400">
                    "Analyze Emergency" to see results
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for condition items
function ConditionItem({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-700 last:border-0">
      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </span>
      <div className="flex items-center gap-2">
        {value ? (
          <>
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">Yes</span>
            <IconCheck className="w-5 h-5 text-green-500" />
          </>
        ) : (
          <>
            <span className="text-sm font-semibold text-neutral-500">No</span>
            <IconX className="w-5 h-5 text-neutral-400" />
          </>
        )}
      </div>
    </div>
  );
}
