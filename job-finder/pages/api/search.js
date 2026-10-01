import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const getUSDtoMXN = async () => {
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const data = await res.json();
    return data.rates?.MXN || 17.5;
  } catch { return 17.5; }
};

const convertirSalario = (salario, tc) => {
  if (!salario || salario === "Ver en plataforma" || salario === "Por proyecto") return salario;
  const hrMatch = salario.match(/\$([0-9,]+)-([0-9,]+)\/hr/);
  if (hrMatch) {
    const min = Math.round(parseFloat(hrMatch[1].replace(",", "")) * 160 * tc / 1000) * 1000;
    const max = Math.round(parseFloat(hrMatch[2].replace(",", "")) * 160 * tc / 1000) * 1000;
    return `$${min.toLocaleString("es-MX")} - $${max.toLocaleString("es-MX")} MXN/mes`;
  }
  const yrMatch = salario.match(/\$([0-9,]+)-([0-9,]+)\/año/);
  if (yrMatch) {
    const min = Math.round(parseFloat(yrMatch[1].replace(",", "")) * tc / 12 / 1000) * 1000;
    const max = Math.round(parseFloat(yrMatch[2].replace(",", "")) * tc / 12 / 1000) * 1000;
    return `$${min.toLocaleString("es-MX")} - $${max.toLocaleString("es-MX")} MXN/mes`;
  }
  return salario;
};

const PRESENCIALES = [
  { id: "p1000", tipo: "paralegal", modalidad: "presencial", titulo: "Paralegal / Legal · Google Jobs", empresa: "Google Jobs", plataforma: "Google Jobs", ubicacion: "Presencial · Zona Oriente CDMX / EDOMEX", descripcion: "Búsqueda en Google Jobs para Paralegal / Legal. Al abrir filtra por distancia y fecha de publicación.", url: "https://www.google.com/search?q=paralegal%20bilingue&ibp=htl;jobs&htichips=date_posted:week", salario: "Ver en plataforma" },
  { id: "p1001", tipo: "asistente", modalidad: "presencial", titulo: "Asistente Bilingüe · Google Jobs", empresa: "Google Jobs", plataforma: "Google Jobs", ubicacion: "Presencial · Zona Oriente CDMX / EDOMEX", descripcion: "Búsqueda en Google Jobs para Asistente Bilingüe. Al abrir filtra por distancia y fecha de publicación.", url: "https://www.google.com/search?q=asistente%20bilingue&ibp=htl;jobs&htichips=date_posted:week", salario: "Ver en plataforma" },
  { id: "p1002", tipo: "teacher", modalidad: "presencial", titulo: "English Teacher · Google Jobs", empresa: "Google Jobs", plataforma: "Google Jobs", ubicacion: "Presencial · Zona Oriente CDMX / EDOMEX", descripcion: "Búsqueda en Google Jobs para English Teacher. Al abrir filtra por distancia y fecha de publicación.", url: "https://www.google.com/search?q=maestra%20ingles&ibp=htl;jobs&htichips=date_posted:week", salario: "Ver en plataforma" },
  { id: "p1003", tipo: "interprete", modalidad: "presencial", titulo: "Intérprete / Traductora · Google Jobs", empresa: "Google Jobs", plataforma: "Google Jobs", ubicacion: "Presencial · Zona Oriente CDMX / EDOMEX", descripcion: "Búsqueda en Google Jobs para Intérprete / Traductora. Al abrir filtra por distancia y fecha de publicación.", url: "https://www.google.com/search?q=interprete%20bilingue&ibp=htl;jobs&htichips=date_posted:week", salario: "Ver en plataforma" },
  { id: "p1004", tipo: "atencion", modalidad: "presencial", titulo: "Atención Clientes · Google Jobs", empresa: "Google Jobs", plataforma: "Google Jobs", ubicacion: "Presencial · Zona Oriente CDMX / EDOMEX", descripcion: "Búsqueda en Google Jobs para Atención Clientes. Al abrir filtra por distancia y fecha de publicación.", url: "https://www.google.com/search?q=ejecutivo%20bilingue&ibp=htl;jobs&htichips=date_posted:week", salario: "Ver en plataforma" },
  { id: "p1005", tipo: "paralegal", modalidad: "presencial", titulo: "Paralegal / Legal · Iztapalapa · Indeed", empresa: "Indeed", plataforma: "Indeed", ubicacion: "Presencial · Iztapalapa, CDMX", descripcion: "Indeed con ubicación en Iztapalapa. Ordena por fecha para ver las más recientes. Verifica ubicación antes de postularte.", url: "https://www.indeed.com/jobs?q=paralegal%20bilingue&l=Iztapalapa&sort=date", salario: "Ver en plataforma" },
  { id: "p1006", tipo: "paralegal", modalidad: "presencial", titulo: "Paralegal / Legal · Iztapalapa · OCC", empresa: "OCC Mundial", plataforma: "OCC", ubicacion: "Presencial · Iztapalapa, CDMX", descripcion: "OCC con ubicación en Iztapalapa. Confirma que la ubicación sea correcta antes de aplicar.", url: "https://www.occ.com.mx/empleos/de-paralegal/?location=Iztapalapa", salario: "Ver en plataforma" },
  { id: "p1007", tipo: "paralegal", modalidad: "presencial", titulo: "Paralegal / Legal · Iztapalapa · Computrabajo", empresa: "Computrabajo", plataforma: "Computrabajo", ubicacion: "Presencial · Iztapalapa, CDMX", descripcion: "Computrabajo con ubicación en Iztapalapa. Verifica ubicación exacta antes de postularte.", url: "https://mx.computrabajo.com/trabajo-de-paralegal-bilingue?l=Iztapalapa", salario: "Ver en plataforma" },
