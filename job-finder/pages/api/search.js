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
        max_tokens: 1500,
        system: `Eres un experto en búsqueda de empleo legal y paralegal.
Con base en el perfil de la candidata, genera vacantes REALES de plataformas como LinkedIn, Indeed, RemoteOK, WeWorkRemotely, Jobicy, OCC, Computrabajo, FlexJobs.
Responde ÚNICAMENTE con JSON válido, sin markdown, sin backticks, sin texto extra.
Formato exacto:
{
  "vacantes": [
    {
      "titulo": "título del puesto",
      "empresa": "nombre de empresa",
      "plataforma": "LinkedIn | Indeed | RemoteOK | WeWorkRemotely | Jobicy | OCC | FlexJobs | Computrabajo",
      "modalidad": "Remoto",
      "ubicacion": "ciudad, país o Worldwide",
      "descripcion": "descripción breve de 2 líneas",
      "url": "URL de búsqueda real en esa plataforma",
      "salario": "rango aproximado o No especificado",
      "relevancia": "Alta o Media"
    }
  ]
}
Genera entre 6 y 8 vacantes variadas en diferentes plataformas.`,
        messages: [{
          role: "user",
          content: `Perfil:\n${ROCIO_PROFILE}\n\nBúsqueda: ${prompt}\n\nJSON únicamente.`
        }]
      })
    });

    const data = await response.json();
    const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return res.status(500).json({ error: "Sin respuesta válida" });

    const parsed = JSON.parse(match[0]);
    res.status(200).json(parsed);
  } catch (err) {
    res.status(500).json({ error: "Error al conectar con la API" });
  }
}
