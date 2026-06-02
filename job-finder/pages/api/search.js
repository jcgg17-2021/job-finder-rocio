export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Falta el prompt" });

  const ROCIO_PROFILE = `
Rocío Sánchez — Paralegal / Legal Assistant Bilingüe
- Especialidades: Derecho Migratorio EE.UU. (Asylum I-589, 42B, I-360, I-765, Removal Defense), Propiedad Intelectual (patentes, diseños industriales)
- Idiomas: Español nativo, Inglés avanzado (TOEIC 920/990)
- Educación: Licenciatura en Pedagogía - UNAM FES Aragón
- Experiencia: 10+ años — New Frontier Immigration Law, Aguila Immigration Services, Clarke Modet, Hasbro México
- Habilidades: Redacción legal en inglés/español, gestión de casos, atención a clientes, coordinación internacional, capacitación de personal
- Modalidad buscada: Remoto / Home Office
`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: `Eres un experto en búsqueda de empleo. Responde SOLO con un JSON válido sin backticks ni markdown.
El JSON debe tener exactamente esta estructura:
{"vacantes":[{"titulo":"string","empresa":"string","plataforma":"string","modalidad":"Remoto","ubicacion":"string","descripcion":"string","url":"string","salario":"string","relevancia":"Alta"}]}
Genera 6 vacantes.`,
        messages: [{
          role: "user",
          content: `Perfil: ${ROCIO_PROFILE}\n\nBúsqueda: ${prompt}\n\nResponde solo con el JSON.`
        }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({ error: "API error: " + errText });
    }

    const data = await response.json();
    console.log("API response:", JSON.stringify(data).substring(0, 500));

    if (!data.content || data.content.length === 0) {
      return res.status(500).json({ error: "Respuesta vacía de API", raw: data });
    }

    const text = data.content
      .filter(b => b.type === "text")
      .map(b => b.text)
      .join("");

    if (!text) {
      return res.status(500).json({ error: "Sin texto en respuesta", content: data.content });
    }

    const clean = text.replace(/```json|```/gi, "").trim();
    const match = clean.match(/\{[\s\S]*\}/);
    if (!match) {
      return res.status(500).json({ error: "No se encontró JSON", text: clean.substring(0, 200) });
    }

    const parsed = JSON.parse(match[0]);
    res.status(200).json(parsed);

  } catch (err) {
    res.status(500).json({ error: "Excepción: " + err.message });
  }
}
