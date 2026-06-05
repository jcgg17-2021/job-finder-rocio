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
  } catch {
    return 17.5;
  }
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

const VACANTES = [
  // PARALEGAL / LEGAL - REMOTO
  { id: "1", tipo: "paralegal", modalidad: "remoto", titulo: "Paralegal Bilingüe - Inmigración EE.UU.", empresa: "LinkedIn", plataforma: "LinkedIn", ubicacion: "Worldwide", descripcion: "Red profesional más grande. Filtra Remote y Most Recent. Removal defense y asylum.", url: "https://www.linkedin.com/jobs/search/?keywords=paralegal+immigration+bilingual+spanish&f_WT=2", salario: "$45,000-65,000/año" },
  { id: "2", tipo: "paralegal", modalidad: "remoto", titulo: "Immigration Legal Assistant Remote", empresa: "Indeed", plataforma: "Indeed", ubicacion: "USA / Worldwide", descripcion: "Filtra Last 7 days y Remote. Firmas EE.UU. buscan paralegal bilingüe.", url: "https://www.indeed.com/jobs?q=legal+assistant+immigration+bilingual+spanish&l=Remote&sort=date", salario: "$18-28/hr" },
  { id: "3", tipo: "paralegal", modalidad: "remoto", titulo: "Paralegal Removal Defense / Asylum", empresa: "Indeed - Especializado", plataforma: "Indeed", ubicacion: "USA", descripcion: "Búsqueda específica removal defense y asylum. Filtra por fecha.", url: "https://www.indeed.com/jobs?q=paralegal+removal+defense+asylum+bilingual&l=Remote&sort=date", salario: "$20-30/hr" },
  { id: "4", tipo: "paralegal", modalidad: "remoto", titulo: "Immigration Paralegal Bilingual", empresa: "ZipRecruiter", plataforma: "ZipRecruiter", ubicacion: "USA / Remote", descripcion: "Miles de firmas de inmigración buscando paralegal bilingüe remoto.", url: "https://www.ziprecruiter.com/Jobs/Immigration-Paralegal-Bilingual-Spanish-Remote", salario: "$45,000-65,000/año" },
  { id: "5", tipo: "paralegal", modalidad: "remoto", titulo: "Paralegal USCIS / EOIR Bilingual", empresa: "Glassdoor", plataforma: "Glassdoor", ubicacion: "USA / Worldwide", descripcion: "Firmas que trabajan con USCIS y EOIR. Filtra Remote y fecha.", url: "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=immigration+paralegal+bilingual+spanish&remoteWorkType=1", salario: "$45,000-65,000/año" },
  { id: "6", tipo: "paralegal", modalidad: "remoto", titulo: "Paralegal IP - Propiedad Intelectual", empresa: "LinkedIn - IP", plataforma: "LinkedIn", ubicacion: "Worldwide", descripcion: "Firmas internacionales de IP buscan paralegal bilingüe con experiencia en patentes.", url: "https://www.linkedin.com/jobs/search/?keywords=paralegal+intellectual+property+bilingual+spanish&f_WT=2", salario: "$50,000-70,000/año" },
  { id: "7", tipo: "paralegal", modalidad: "remoto", titulo: "Patent Paralegal Bilingual Remote", empresa: "Indeed - IP", plataforma: "Indeed", ubicacion: "USA / Worldwide", descripcion: "Vacantes de paralegal en propiedad intelectual, patentes y marcas.", url: "https://www.indeed.com/jobs?q=IP+paralegal+intellectual+property+bilingual&l=Remote&sort=date", salario: "$50,000-70,000/año" },
  { id: "8", tipo: "paralegal", modalidad: "remoto", titulo: "Legal Paralegal - RemoteOK", empresa: "RemoteOK", plataforma: "RemoteOK", ubicacion: "Worldwide", descripcion: "Portal 100% remoto. Vacantes legales actualizadas diariamente.", url: "https://remoteok.com/remote-legal-jobs", salario: "Ver en plataforma" },
  { id: "9", tipo: "paralegal", modalidad: "remoto", titulo: "Legal Positions - WeWorkRemotely", empresa: "WeWorkRemotely", plataforma: "WeWorkRemotely", ubicacion: "Worldwide", descripcion: "Bolsa remota top. Sección Legal con vacantes internacionales.", url: "https://weworkremotely.com/remote-jobs/search?term=paralegal+bilingual", salario: "Ver en plataforma" },
  { id: "10", tipo: "paralegal", modalidad: "remoto", titulo: "Legal Paralegal Freelance", empresa: "Upwork", plataforma: "Upwork", ubicacion: "Worldwide", descripcion: "Plataforma freelance líder. Proyectos de immigration law y IP para clientes EE.UU.", url: "https://www.upwork.com/search/jobs/?q=paralegal+immigration+bilingual+spanish", salario: "$25-50/hr" },
  { id: "11", tipo: "paralegal", modalidad: "remoto", titulo: "Legal Freelance LATAM", empresa: "Workana", plataforma: "Workana", ubicacion: "LATAM", descripcion: "Mayor plataforma freelance LATAM. Proyectos legales y traducción.", url: "https://www.workana.com/jobs?category=legal-law", salario: "Por proyecto" },
  { id: "12", tipo: "paralegal", modalidad: "remoto", titulo: "Paralegal Home Office - OCC", empresa: "OCC Mundial", plataforma: "OCC", ubicacion: "México", descripcion: "Bolsa líder México. Paralegal y asistente legal en Home Office.", url: "https://www.occ.com.mx/empleos/de-paralegal/?modality=3", salario: "Ver en plataforma" },
  { id: "13", tipo: "paralegal", modalidad: "remoto", titulo: "Asistente Legal Bilingüe - Computrabajo", empresa: "Computrabajo", plataforma: "Computrabajo", ubicacion: "México / LATAM", descripcion: "Mayor bolsa LATAM. Filtra teletrabajo para posiciones remotas.", url: "https://www.computrabajo.com.mx/trabajo-de-asistente-legal-bilingue", salario: "Ver en plataforma" },

  // PARALEGAL / LEGAL - PRESENCIAL
  { id: "14", tipo: "paralegal", modalidad: "presencial", titulo: "Asistente Legal / Jurídica", empresa: "OCC - Oriente", plataforma: "OCC", ubicacion: "CDMX Oriente / Iztapalapa", descripcion: "Asistentes en despachos jurídicos zona oriente CDMX.", url: "https://www.occ.com.mx/empleos/de-asistente-juridica/?location=iztapalapa", salario: "Ver en plataforma" },
  { id: "15", tipo: "paralegal", modalidad: "presencial", titulo: "Asistente Legal Bilingüe", empresa: "Indeed - CDMX", plataforma: "Indeed", ubicacion: "CDMX / Texcoco / Los Reyes", descripcion: "Coordinadoras y asistentes legales bilingüe en despachos zona oriente.", url: "https://www.indeed.com/jobs?q=asistente+legal+juridica+bilingue&l=Ciudad+de+Mexico&sort=date", salario: "Ver en plataforma" },
  { id: "16", tipo: "paralegal", modalidad: "presencial", titulo: "Asistente Jurídica Bilingüe", empresa: "Computrabajo - Oriente", plataforma: "Computrabajo", ubicacion: "Iztapalapa / Nezahualcóyotl", descripcion: "Asistentes jurídicas bilingüe en despachos zona oriente CDMX.", url: "https://www.computrabajo.com.mx/trabajo-de-asistente-juridica-bilingue?l=Iztapalapa%2C+Ciudad+de+M%C3%A9xico", salario: "Ver en plataforma" },

  // ASISTENTE BILINGÜE - REMOTO
  { id: "17", tipo: "asistente", modalidad: "remoto", titulo: "Virtual Assistant Bilingüe", empresa: "LinkedIn - VA", plataforma: "LinkedIn", ubicacion: "USA / LATAM", descripcion: "Asistente virtual bilingüe para firmas y empresas EE.UU. 100% remoto desde México.", url: "https://www.linkedin.com/jobs/search/?keywords=virtual+assistant+bilingual+spanish+english&f_WT=2", salario: "$15-25/hr" },
  { id: "18", tipo: "asistente", modalidad: "remoto", titulo: "Administrative Assistant Bilingüe", empresa: "Indeed - Admin", plataforma: "Indeed", ubicacion: "USA / Remote", descripcion: "Asistentes administrativas bilingüe para empresas EE.UU. Documentos y coordinación.", url: "https://www.indeed.com/jobs?q=administrative+assistant+bilingual+spanish+english&l=Remote&sort=date", salario: "$16-22/hr" },
  { id: "19", tipo: "asistente", modalidad: "remoto", titulo: "Executive Assistant Bilingüe", empresa: "Glassdoor", plataforma: "Glassdoor", ubicacion: "USA / Worldwide", descripcion: "Asistentes ejecutivas bilingüe para directivos de empresas internacionales.", url: "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=executive+assistant+bilingual+spanish+remote&remoteWorkType=1", salario: "$45,000-65,000/año" },
  { id: "20", tipo: "asistente", modalidad: "remoto", titulo: "Operations Coordinator Bilingüe", empresa: "ZipRecruiter", plataforma: "ZipRecruiter", ubicacion: "USA / Remote", descripcion: "Coordinadoras de operaciones bilingüe para empresas con equipos en LATAM.", url: "https://www.ziprecruiter.com/Jobs/Operations-Coordinator-Bilingual-Spanish-Remote", salario: "$45,000-60,000/año" },
  { id: "21", tipo: "asistente", modalidad: "remoto", titulo: "Asistente Bilingüe Home Office - OCC", empresa: "OCC Mundial", plataforma: "OCC", ubicacion: "México", descripcion: "Bolsa líder México. Asistente bilingüe y coordinadora en Home Office.", url: "https://www.occ.com.mx/empleos/de-asistente-bilingue/?modality=3", salario: "Ver en plataforma" },
  { id: "22", tipo: "asistente", modalidad: "remoto", titulo: "Asistente Bilingüe Remoto - Computrabajo", empresa: "Computrabajo", plataforma: "Computrabajo", ubicacion: "México / LATAM", descripcion: "Mayor bolsa LATAM. Asistente bilingüe en teletrabajo.", url: "https://www.computrabajo.com.mx/trabajo-de-asistente-bilingue", salario: "Ver en plataforma" },
  { id: "23", tipo: "asistente", modalidad: "remoto", titulo: "Bilingual Coordinator - Hireline", empresa: "Hireline", plataforma: "Hireline", ubicacion: "LATAM / Worldwide", descripcion: "Plataforma LATAM con empresas que pagan en USD. Admin y coordinación bilingüe.", url: "https://hireline.io/mx/empleos-remotos", salario: "USD" },

  // ASISTENTE BILINGÜE - PRESENCIAL
  { id: "24", tipo: "asistente", modalidad: "presencial", titulo: "Asistente Bilingüe - Zona Oriente", empresa: "Computrabajo - Oriente", plataforma: "Computrabajo", ubicacion: "Los Reyes La Paz / Iztapalapa", descripcion: "Asistentes bilingüe en empresas y despachos zona oriente CDMX.", url: "https://www.computrabajo.com.mx/trabajo-de-asistente-bilingue?l=Iztapalapa%2C+Ciudad+de+M%C3%A9xico", salario: "Ver en plataforma" },
  { id: "25", tipo: "asistente", modalidad: "presencial", titulo: "Asistente Administrativa Bilingüe", empresa: "LinkedIn - CDMX", plataforma: "LinkedIn", ubicacion: "Iztapalapa / CDMX Oriente", descripcion: "Asistentes administrativas bilingüe en empresas zona oriente CDMX.", url: "https://www.linkedin.com/jobs/search/?keywords=asistente+administrativa+bilingue&location=Iztapalapa%2C+Mexico+City&f_TPR=r604800", salario: "Ver en plataforma" },
  { id: "26", tipo: "asistente", modalidad: "presencial", titulo: "Secretaria Bilingüe Zona Oriente", empresa: "Indeed - Oriente", plataforma: "Indeed", ubicacion: "Los Reyes / Chimalhuacán / Iztapalapa", descripcion: "Secretarias bilingüe en despachos y empresas zona oriente CDMX y EDOMEX.", url: "https://www.indeed.com/jobs?q=secretaria+bilingue+ingles&l=Iztapalapa%2C+Ciudad+de+Mexico&sort=date", salario: "Ver en plataforma" },
  { id: "27", tipo: "asistente", modalidad: "presencial", titulo: "Auxiliar Administrativo Bilingüe", empresa: "OCC - Oriente", plataforma: "OCC", ubicacion: "Iztapalapa / Texcoco / CDMX Oriente", descripcion: "Auxiliares administrativos bilingüe en empresas zona oriente.", url: "https://www.occ.com.mx/empleos/de-auxiliar-administrativo-bilingue/?location=iztapalapa", salario: "Ver en plataforma" },
  { id: "28", tipo: "asistente", modalidad: "presencial", titulo: "Coordinadora Bilingüe Presencial", empresa: "OCC - Internacional", plataforma: "OCC", ubicacion: "CDMX Oriente / Nezahualcóyotl", descripcion: "Coordinadoras bilingüe en empresas con operaciones internacionales zona oriente.", url: "https://www.occ.com.mx/empleos/de-coordinadora-bilingue/?location=nezahualcoyotl", salario: "Ver en plataforma" },
  { id: "29", tipo: "asistente", modalidad: "presencial", titulo: "HR Assistant Bilingüe", empresa: "Indeed - RH Oriente", plataforma: "Indeed", ubicacion: "CDMX Oriente / Iztapalapa", descripcion: "Asistentes de RH bilingüe en empresas zona oriente. Experiencia en Hasbro valorada.", url: "https://www.indeed.com/jobs?q=asistente+recursos+humanos+bilingue+ingles&l=Iztapalapa%2C+Ciudad+de+Mexico&sort=date", salario: "Ver en plataforma" },

  // ENGLISH TEACHER - REMOTO
  { id: "30", tipo: "teacher", modalidad: "remoto", titulo: "Online English Teacher", empresa: "LinkedIn - Teacher", plataforma: "LinkedIn", ubicacion: "Worldwide", descripcion: "Plataformas internacionales buscan maestras de inglés online con perfil bilingüe.", url: "https://www.linkedin.com/jobs/search/?keywords=online+english+teacher+bilingual+remote&f_WT=2", salario: "$15-30/hr" },
  { id: "31", tipo: "teacher", modalidad: "remoto", titulo: "English Tutor / Teacher Online", empresa: "Indeed - Teacher", plataforma: "Indeed", ubicacion: "Worldwide", descripcion: "Tutor de inglés online para adultos y corporativos. TOEIC 920 muy valorado.", url: "https://www.indeed.com/jobs?q=english+teacher+tutor+online+bilingual+spanish&l=Remote&sort=date", salario: "$15-25/hr" },
  { id: "32", tipo: "teacher", modalidad: "remoto", titulo: "Corporate English Trainer Remote", empresa: "Glassdoor", plataforma: "Glassdoor", ubicacion: "LATAM / Worldwide", descripcion: "Trainers de inglés corporativo con experiencia en capacitación organizacional.", url: "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=english+corporate+trainer+bilingual&remoteWorkType=1", salario: "$20-35/hr" },
  { id: "33", tipo: "teacher", modalidad: "remoto", titulo: "ESL Teacher Online", empresa: "RemoteOK", plataforma: "RemoteOK", ubicacion: "Worldwide", descripcion: "Plataformas ESL buscan maestras bilingüe. Horarios flexibles desde casa.", url: "https://remoteok.com/remote-teacher-jobs", salario: "$15-28/hr" },
  { id: "34", tipo: "teacher", modalidad: "remoto", titulo: "English Teacher Home Office - OCC", empresa: "OCC Mundial", plataforma: "OCC", ubicacion: "México", descripcion: "Maestras de inglés en modalidad Home Office. Plataformas y academias online.", url: "https://www.occ.com.mx/empleos/de-maestro-ingles/?modality=3", salario: "Ver en plataforma" },

  // ENGLISH TEACHER - PRESENCIAL
  { id: "35", tipo: "teacher", modalidad: "presencial", titulo: "English Teacher Zona Oriente", empresa: "OCC - Oriente", plataforma: "OCC", ubicacion: "Texcoco / Los Reyes / Chimalhuacán", descripcion: "Maestras de inglés en academias y colegios zona oriente EDOMEX y CDMX.", url: "https://www.occ.com.mx/empleos/de-maestro-ingles/?location=texcoco", salario: "Ver en plataforma" },
  { id: "36", tipo: "teacher", modalidad: "presencial", titulo: "Instructor Inglés - Academias Oriente", empresa: "Computrabajo - Academias", plataforma: "Computrabajo", ubicacion: "Los Reyes La Paz / Chimalhuacán", descripcion: "Instructoras de inglés en academias zona oriente EDOMEX. Horarios flexibles.", url: "https://www.computrabajo.com.mx/trabajo-de-instructor-ingles?l=Los+Reyes+la+Paz%2C+Estado+de+M%C3%A9xico", salario: "Ver en plataforma" },
  { id: "37", tipo: "teacher", modalidad: "presencial", titulo: "Maestra Inglés - Indeed Oriente", empresa: "Indeed - Oriente", plataforma: "Indeed", ubicacion: "Texcoco / Iztapalapa / Nezahualcóyotl", descripcion: "Maestras de inglés en colegios y academias zona oriente. TOEIC avanzado valorado.", url: "https://www.indeed.com/jobs?q=maestro+ingles+instructor&l=Texcoco%2C+Estado+de+M%C3%A9xico&sort=date", salario: "Ver en plataforma" },
  { id: "38", tipo: "teacher", modalidad: "presencial", titulo: "Docente Inglés - Bumeran Oriente", empresa: "Bumeran", plataforma: "Bumeran", ubicacion: "Texcoco / Los Reyes / Chimalhuacán", descripcion: "Docentes de inglés en instituciones educativas zona oriente Estado de México.", url: "https://www.bumeran.com.mx/empleos-trabajo-de-docente-ingles-estado-de-mexico.html", salario: "Ver en plataforma" },

  // INTÉRPRETE / TRADUCTORA - REMOTO
  { id: "39", tipo: "interprete", modalidad: "remoto", titulo: "Legal Translator Spanish-English", empresa: "LinkedIn - Traducción", plataforma: "LinkedIn", ubicacion: "Worldwide", descripcion: "Traductoras legales español-inglés para firmas, juzgados y organismos internacionales.", url: "https://www.linkedin.com/jobs/search/?keywords=legal+translator+spanish+english+remote&f_WT=2", salario: "$25-50/hr" },
  { id: "40", tipo: "interprete", modalidad: "remoto", titulo: "Legal Translation & Documents", empresa: "Upwork", plataforma: "Upwork", ubicacion: "Worldwide", descripcion: "Traducción legal español-inglés, redacción de documentos y revisión de contratos.", url: "https://www.upwork.com/search/jobs/?q=legal+translation+spanish+english", salario: "$25-60/hr" },
  { id: "41", tipo: "interprete", modalidad: "remoto", titulo: "Interpreter Bilingual Remote", empresa: "Indeed - Intérprete", plataforma: "Indeed", ubicacion: "USA / Remote", descripcion: "Intérpretes bilingüe para sesiones legales y corporativas vía videollamada.", url: "https://www.indeed.com/jobs?q=interpreter+bilingual+spanish+english+remote&l=Remote&sort=date", salario: "$18-35/hr" },
  { id: "42", tipo: "interprete", modalidad: "remoto", titulo: "Remote Interpreter - ZipRecruiter", empresa: "ZipRecruiter", plataforma: "ZipRecruiter", ubicacion: "USA / Remote", descripcion: "Intérpretes remotos bilingüe para juzgados y firmas legales EE.UU.", url: "https://www.ziprecruiter.com/Jobs/Remote-Interpreter-Spanish-English", salario: "$18-30/hr" },

  // INTÉRPRETE / TRADUCTORA - PRESENCIAL
  { id: "43", tipo: "interprete", modalidad: "presencial", titulo: "Intérprete Bilingüe Presencial", empresa: "Indeed - CDMX", plataforma: "Indeed", ubicacion: "CDMX / Zona Oriente", descripcion: "Intérpretes bilingüe para juzgados, despachos y empresas CDMX zona oriente.", url: "https://www.indeed.com/jobs?q=interprete+bilingue+español+ingles&l=Ciudad+de+Mexico&sort=date", salario: "Ver en plataforma" },
  { id: "44", tipo: "interprete", modalidad: "presencial", titulo: "Traductora Bilingüe Presencial", empresa: "Computrabajo - Traducción", plataforma: "Computrabajo", ubicacion: "CDMX / Zona Oriente", descripcion: "Traductoras bilingüe para empresas, clínicas y despachos zona oriente.", url: "https://www.computrabajo.com.mx/trabajo-de-traductora-interprete-bilingue?l=Ciudad+de+Mexico", salario: "Ver en plataforma" },

  // ATENCIÓN A CLIENTES BILINGÜE - REMOTO
  { id: "45", tipo: "atencion", modalidad: "remoto", titulo: "Customer Success Bilingüe Remoto", empresa: "LinkedIn - CS", plataforma: "LinkedIn", ubicacion: "USA / LATAM", descripcion: "Empresas EE.UU. buscan customer success bilingüe. Paga en USD, 100% remoto.", url: "https://www.linkedin.com/jobs/search/?keywords=customer+success+bilingual+spanish+english+remote&f_WT=2", salario: "$40,000-60,000/año" },
  { id: "46", tipo: "atencion", modalidad: "remoto", titulo: "Client Services Coordinator Bilingüe", empresa: "Indeed - CS", plataforma: "Indeed", ubicacion: "USA / Remote", descripcion: "Coordinadoras de servicio al cliente bilingüe para firmas legales y corporativas.", url: "https://www.indeed.com/jobs?q=client+services+coordinator+bilingual+spanish&l=Remote&sort=date", salario: "$18-25/hr" },
  { id: "47", tipo: "atencion", modalidad: "remoto", titulo: "Bilingual Customer Support Remote", empresa: "ZipRecruiter", plataforma: "ZipRecruiter", ubicacion: "USA / Remote", descripcion: "Soporte al cliente bilingüe para empresas EE.UU. Atención en español e inglés.", url: "https://www.ziprecruiter.com/Jobs/Bilingual-Customer-Support-Spanish-English-Remote", salario: "$16-22/hr" },
  { id: "48", tipo: "atencion", modalidad: "remoto", titulo: "Bilingual Account Manager Remote", empresa: "Glassdoor", plataforma: "Glassdoor", ubicacion: "USA / LATAM", descripcion: "Account managers bilingüe para empresas con clientes en LATAM.", url: "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=account+manager+bilingual+spanish+remote&remoteWorkType=1", salario: "$50,000-75,000/año" },
  { id: "49", tipo: "atencion", modalidad: "remoto", titulo: "Atención Clientes Bilingüe - OCC", empresa: "OCC Mundial", plataforma: "OCC", ubicacion: "México", descripcion: "Atención a clientes bilingüe en Home Office. Empresas con operaciones internacionales.", url: "https://www.occ.com.mx/empleos/de-atencion-a-clientes-bilingue/?modality=3", salario: "Ver en plataforma" },
  { id: "50", tipo: "atencion", modalidad: "remoto", titulo: "Ejecutivo Bilingüe Home Office", empresa: "Computrabajo", plataforma: "Computrabajo", ubicacion: "México / LATAM", descripcion: "Ejecutivos bilingüe en atención a clientes en modalidad teletrabajo.", url: "https://www.computrabajo.com.mx/trabajo-de-ejecutivo-bilingue", salario: "Ver en plataforma" },

  // ATENCIÓN A CLIENTES BILINGÜE - PRESENCIAL
  { id: "51", tipo: "atencion", modalidad: "presencial", titulo: "Ejecutivo Bilingüe Presencial B2+", empresa: "OCC - Oriente", plataforma: "OCC", ubicacion: "Iztapalapa / Nezahualcóyotl", descripcion: "Ejecutivos bilingüe nivel avanzado (B2-C1) en empresas zona oriente. Inglés avanzado bien remunerado.", url: "https://www.occ.com.mx/empleos/de-ejecutivo-bilingue/?location=iztapalapa", salario: "Ver en plataforma" },
  { id: "52", tipo: "atencion", modalidad: "presencial", titulo: "Atención Clientes Bilingüe - Computrabajo", empresa: "Computrabajo - Oriente", plataforma: "Computrabajo", ubicacion: "Nezahualcóyotl / Los Reyes / Texcoco", descripcion: "Atención a clientes bilingüe en empresas zona oriente. Inglés avanzado requerido.", url: "https://www.computrabajo.com.mx/trabajo-de-atencion-clientes-bilingue?l=Nezahualcoyotl%2C+Estado+de+Mexico", salario: "Ver en plataforma" },
  { id: "53", tipo: "atencion", modalidad: "presencial", titulo: "Recepcionista / Asistente Bilingüe", empresa: "OCC - CDMX", plataforma: "OCC", ubicacion: "Iztapalapa / CDMX Oriente", descripcion: "Recepcionistas y asistentes bilingüe en despachos, clínicas y empresas zona oriente.", url: "https://www.occ.com.mx/empleos/de-recepcionista-bilingue/?location=iztapalapa", salario: "Ver en plataforma" },
  { id: "54", tipo: "atencion", modalidad: "presencial", titulo: "Empleos Bilingüe - Facebook Grupos", empresa: "Facebook Grupos Locales", plataforma: "Facebook", ubicacion: "Texcoco / Los Reyes / Iztapalapa", descripcion: "Grupos locales de empleo en Facebook zona oriente. Búsqueda directa en comunidades locales.", url: "https://www.facebook.com/groups/search/results/?q=empleo+bilingue+ingles+texcoco+los+reyes+iztapalapa", salario: "Ver en plataforma" },
];

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    const favoritos = await redis.get("favoritos") || [];
    return res.status(200).json({ favoritos });
  }

  if (method === "POST") {
    const { action, data } = req.body;

    if (action === "search") {
      const { tipo, modalidad } = data;
      const tc = await getUSDtoMXN();
      let vacantes = VACANTES;
      if (tipo && tipo !== "todos") vacantes = vacantes.filter(v => v.tipo === tipo);
      if (modalidad && modalidad !== "todos") vacantes = vacantes.filter(v => v.modalidad === modalidad);
      const resultado = vacantes.map(v => ({ ...v, salarioMXN: convertirSalario(v.salario, tc) }));
      return res.status(200).json({ vacantes: resultado, tipoCambio: tc });
    }

    if (action === "toggle_favorito") {
      const { id } = data;
      let favoritos = await redis.get("favoritos") || [];
      favoritos = favoritos.includes(id) ? favoritos.filter(f => f !== id) : [...favoritos, id];
      await redis.set("favoritos", favoritos);
      return res.status(200).json({ favoritos });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
