import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const USD_TO_MXN = 17.5;

const convertirSalario = (salario) => {
  if (!salario || salario === "Ver en plataforma" || salario === "Por proyecto") return salario;
  
  // Si tiene rango por hora: "$18-28/hr"
  const hrMatch = salario.match(/\$([0-9,]+)-([0-9,]+)\/hr/);
  if (hrMatch) {
    const min = Math.round(parseFloat(hrMatch[1].replace(",","")) * 160 * USD_TO_MXN / 1000) * 1000;
    const max = Math.round(parseFloat(hrMatch[2].replace(",","")) * 160 * USD_TO_MXN / 1000) * 1000;
    return `$${min.toLocaleString("es-MX")} - $${max.toLocaleString("es-MX")} MXN/mes`;
  }

  // Si tiene rango anual: "$45,000-65,000/año"
  const yrMatch = salario.match(/\$([0-9,]+)-([0-9,]+)\/año/);
  if (yrMatch) {
    const min = Math.round(parseFloat(yrMatch[1].replace(",","")) * USD_TO_MXN / 12 / 1000) * 1000;
    const max = Math.round(parseFloat(yrMatch[2].replace(",","")) * USD_TO_MXN / 12 / 1000) * 1000;
    return `$${min.toLocaleString("es-MX")} - $${max.toLocaleString("es-MX")} MXN/mes`;
  }

  return salario;
};

const VACANTES = [
  // PARALEGAL / LEGAL
  { id: "1", tipo: "paralegal", modalidad: "remoto", titulo: "Paralegal Bilingüe - Inmigración EE.UU.", empresa: "LinkedIn", plataforma: "LinkedIn", ubicacion: "Worldwide", descripcion: "Red profesional más grande. Filtra Remote y Most Recent. Removal defense y asylum.", url: "https://www.linkedin.com/jobs/search/?keywords=paralegal+immigration+bilingual+spanish&f_WT=2", salario: "$45,000-65,000/año" },
  { id: "2", tipo: "paralegal", modalidad: "remoto", titulo: "Immigration Legal Assistant Remote", empresa: "Indeed", plataforma: "Indeed", ubicacion: "USA / Worldwide", descripcion: "Filtra Last 7 days y Remote. Firmas EE.UU. buscan paralegal bilingüe.", url: "https://www.indeed.com/jobs?q=legal+assistant+immigration+bilingual+spanish&l=Remote&sort=date", salario: "$18-28/hr" },
  { id: "3", tipo: "paralegal", modalidad: "remoto", titulo: "Paralegal Removal Defense / Asylum", empresa: "Indeed - Especializado", plataforma: "Indeed", ubicacion: "USA", descripcion: "Búsqueda específica removal defense y asylum. Perfil bilingüe remoto.", url: "https://www.indeed.com/jobs?q=paralegal+removal+defense+asylum+bilingual&l=Remote&sort=date", salario: "$20-30/hr" },
  { id: "4", tipo: "paralegal", modalidad: "remoto", titulo: "Immigration Paralegal Bilingual", empresa: "ZipRecruiter", plataforma: "ZipRecruiter", ubicacion: "USA / Remote", descripcion: "Miles de firmas de inmigración buscando paralegal bilingüe remoto.", url: "https://www.ziprecruiter.com/Jobs/Immigration-Paralegal-Bilingual-Spanish-Remote", salario: "$45,000-65,000/año" },
  { id: "5", tipo: "paralegal", modalidad: "remoto", titulo: "Paralegal USCIS / EOIR Bilingual", empresa: "Glassdoor", plataforma: "Glassdoor", ubicacion: "USA / Worldwide", descripcion: "Vacantes con salarios reales de firmas que trabajan con USCIS y EOIR.", url: "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=immigration+paralegal+bilingual+spanish&remoteWorkType=1", salario: "$45,000-65,000/año" },
  { id: "6", tipo: "paralegal", modalidad: "remoto", titulo: "Remote Immigration Legal Assistant", empresa: "LinkedIn - Firmas EE.UU.", plataforma: "LinkedIn", ubicacion: "USA", descripcion: "Firmas de California, Texas, Nueva York buscan legal assistant bilingüe.", url: "https://www.linkedin.com/jobs/search/?keywords=immigration+legal+assistant+bilingual+remote&f_WT=2&f_TPR=r604800", salario: "$45,000-65,000/año" },
  { id: "7", tipo: "paralegal", modalidad: "remoto", titulo: "Paralegal IP - Propiedad Intelectual", empresa: "LinkedIn - IP", plataforma: "LinkedIn", ubicacion: "Worldwide", descripcion: "Firmas internacionales de IP buscan paralegal bilingüe con experiencia en patentes.", url: "https://www.linkedin.com/jobs/search/?keywords=paralegal+intellectual+property+bilingual+spanish&f_WT=2", salario: "$50,000-70,000/año" },
  { id: "8", tipo: "paralegal", modalidad: "remoto", titulo: "Patent Paralegal Bilingual Remote", empresa: "Indeed - IP", plataforma: "Indeed", ubicacion: "USA / Worldwide", descripcion: "Vacantes de paralegal en propiedad intelectual, patentes y marcas.", url: "https://www.indeed.com/jobs?q=IP+paralegal+intellectual+property+bilingual&l=Remote&sort=date", salario: "$50,000-70,000/año" },
  { id: "9", tipo: "paralegal", modalidad: "remoto", titulo: "Legal Translation & Documents", empresa: "Upwork", plataforma: "Upwork", ubicacion: "Worldwide", descripcion: "Traducción legal español-inglés, redacción de documentos y revisión de contratos.", url: "https://www.upwork.com/search/jobs/?q=legal+translation+spanish+english+paralegal", salario: "$25-50/hr" },
  { id: "10", tipo: "paralegal", modalidad: "remoto", titulo: "Legal Paralegal Freelance LATAM", empresa: "Workana", plataforma: "Workana", ubicacion: "LATAM", descripcion: "Mayor plataforma freelance LATAM. Proyectos legales y traducción.", url: "https://www.workana.com/jobs?category=legal-law", salario: "Por proyecto" },
  { id: "11", tipo: "paralegal", modalidad: "remoto", titulo: "Remote Legal Jobs Global", empresa: "RemoteOK", plataforma: "RemoteOK", ubicacion: "Worldwide", descripcion: "Portal 100% remoto. Vacantes legales actualizadas diariamente.", url: "https://remoteok.com/remote-legal-jobs", salario: "Ver en plataforma" },
  { id: "12", tipo: "paralegal", modalidad: "remoto", titulo: "Legal Jobs - OCC Home Office", empresa: "OCC Mundial", plataforma: "OCC", ubicacion: "México", descripcion: "Bolsa líder México. Paralegal y asistente legal en Home Office.", url: "https://www.occ.com.mx/empleos/de-paralegal/?modality=3", salario: "Ver en plataforma" },
  { id: "13", tipo: "paralegal", modalidad: "presencial", titulo: "Asistente Legal / Jurídica Presencial", empresa: "OCC - Legal Oriente", plataforma: "OCC", ubicacion: "CDMX Oriente / Texcoco", descripcion: "Asistentes en despachos jurídicos zona oriente CDMX. Experiencia en documentos legales.", url: "https://www.occ.com.mx/empleos/de-asistente-juridica/?location=iztapalapa", salario: "Ver en plataforma" },
  { id: "14", tipo: "paralegal", modalidad: "presencial", titulo: "Asistente Legal Bilingüe Despacho", empresa: "LinkedIn - Despachos", plataforma: "LinkedIn", ubicacion: "CDMX / Texcoco / Los Reyes", descripcion: "Despachos jurídicos zona oriente buscan asistentes bilingüe con experiencia legal.", url: "https://www.linkedin.com/jobs/search/?keywords=asistente+juridica+bilingue+despacho&location=Ciudad+de+Mexico&f_TPR=r604800", salario: "Ver en plataforma" },
  { id: "15", tipo: "paralegal", modalidad: "presencial", titulo: "Coordinadora Legal Bilingüe", empresa: "Indeed - Legal CDMX", plataforma: "Indeed", ubicacion: "CDMX Oriente / Iztapalapa", descripcion: "Coordinadoras y asistentes legales bilingüe en despachos y empresas zona oriente.", url: "https://www.indeed.com/jobs?q=asistente+legal+juridica+bilingue&l=Ciudad+de+Mexico&sort=date", salario: "Ver en plataforma" },

  // ASISTENTE BILINGÜE
  { id: "16", tipo: "asistente", modalidad: "remoto", titulo: "Virtual Assistant Bilingüe Remoto", empresa: "LinkedIn - VA", plataforma: "LinkedIn", ubicacion: "USA / LATAM", descripcion: "Asistente virtual bilingüe para firmas y empresas EE.UU. 100% remoto desde México.", url: "https://www.linkedin.com/jobs/search/?keywords=virtual+assistant+bilingual+spanish+english&f_WT=2", salario: "$15-25/hr" },
  { id: "17", tipo: "asistente", modalidad: "remoto", titulo: "Administrative Assistant Bilingüe", empresa: "Indeed - Admin", plataforma: "Indeed", ubicacion: "USA / Remote", descripcion: "Asistentes administrativas bilingüe para empresas EE.UU. Documentos y coordinación.", url: "https://www.indeed.com/jobs?q=administrative+assistant+bilingual+spanish+english&l=Remote&sort=date", salario: "$16-22/hr" },
  { id: "18", tipo: "asistente", modalidad: "remoto", titulo: "Executive Assistant Bilingüe Remote", empresa: "Glassdoor", plataforma: "Glassdoor", ubicacion: "USA / Worldwide", descripcion: "Asistentes ejecutivas bilingüe para directivos de empresas internacionales.", url: "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=executive+assistant+bilingual+spanish+remote&remoteWorkType=1", salario: "$45,000-65,000/año" },
  { id: "19", tipo: "asistente", modalidad: "remoto", titulo: "Operations Coordinator Bilingüe", empresa: "ZipRecruiter", plataforma: "ZipRecruiter", ubicacion: "USA / Remote", descripcion: "Coordinadoras de operaciones bilingüe para empresas con equipos en LATAM.", url: "https://www.ziprecruiter.com/Jobs/Operations-Coordinator-Bilingual-Spanish-Remote", salario: "$45,000-60,000/año" },
  { id: "20", tipo: "asistente", modalidad: "remoto", titulo: "Project Coordinator Bilingüe Remote", empresa: "LinkedIn - PM", plataforma: "LinkedIn", ubicacion: "USA / LATAM", descripcion: "Coordinadoras de proyectos bilingüe en empresas internacionales.", url: "https://www.linkedin.com/jobs/search/?keywords=project+coordinator+bilingual+spanish+remote&f_WT=2", salario: "$50,000-70,000/año" },
  { id: "21", tipo: "asistente", modalidad: "remoto", titulo: "Asistente Bilingüe Home Office", empresa: "OCC Mundial", plataforma: "OCC", ubicacion: "México", descripcion: "Bolsa líder México. Asistente bilingüe y coordinadora en Home Office.", url: "https://www.occ.com.mx/empleos/de
