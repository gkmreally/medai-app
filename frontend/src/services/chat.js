export async function askMedicalAI(message) {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });
  return await res.json();
}
