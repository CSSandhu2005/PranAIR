"use client"
import { useState } from "react"

export default function Agent3() {
  const [text, setText] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function analyze() {
    setLoading(true)
    const res = await fetch("/api/pranair-triage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold text-red-600">
        🚑 PranAIR — Emergency Triage & Mission Planner
      </h1>

      <p className="text-neutral-600">
        Describe an emergency. This AI will decide what PranAIR should do.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Example: A person collapsed and is not breathing..."
        className="w-full p-4 border rounded-md h-32"
      />

      <button
        onClick={analyze}
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md"
      >
        {loading ? "Analyzing..." : "Run Triage AI"}
      </button>

      {result && (
        <div className="bg-gray-100 dark:bg-neutral-800 p-6 rounded-lg space-y-3">
          <p><b>Emergency:</b> {String(result.emergency)}</p>
          <p><b>Category:</b> {result.category}</p>
          <p><b>Severity:</b> {result.severity}</p>
          <p><b>Priority:</b> {result.priority}</p>
          <p><b>Drone Kit:</b> {result.suggested_drone_kit?.join(", ")}</p>
          <p><b>Action:</b> {result.recommended_action}</p>
        </div>
      )}
    </div>
  )
}
