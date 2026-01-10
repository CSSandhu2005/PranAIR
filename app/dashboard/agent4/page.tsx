"use client"

import { useState } from "react"

export default function Agent4() {
  const [output, setOutput] = useState<string>("")

  async function sendEmergency(formData: FormData) {
    const user_email = formData.get("user_email") as string
    const contacts = formData.get("contacts") as string

    const res = await fetch("/api/agent4", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_email, contacts }),
    })

    const data = await res.json()
    setOutput(JSON.stringify(data, null, 2))
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">🚨 Agent-4 – Emergency Alert</h1>

      <form action={sendEmergency} className="space-y-4">
        <input
          name="user_email"
          type="email"
          required
          className="w-full border p-3 rounded"
          placeholder="Your email"
        />

        <textarea
          name="contacts"
          required
          className="w-full border p-3 rounded"
          placeholder="Emergency contacts (comma separated)"
        />

        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Send Emergency Alert
        </button>
      </form>

      {output && (
        <pre className="bg-black text-green-400 p-4 rounded overflow-x-auto">
          {output}
        </pre>
      )}
    </div>
  )
}
