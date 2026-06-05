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

// NOTA IMPORTANTE SOBRE URLs:
// - LinkedIn f_WT=2 = Remote only
// - Indeed &l=Remote = Remote, sin l = busca por ciudad
// - OCC ?modality=3 = Home Office, sin modality = presencial (pero no filtra zona exacta)
// - Computrabajo con parámetro de ciudad
// - Google Jobs &htichips=employment_type:TELECOMMUTE = remoto, sin eso = todos
// - Las URLs presenciales abren búsquedas en la zona indicada pero el usuario debe verificar

const VACANTES = [

  // ==================== PARALEGAL / LEGAL ====================

  // REMOTO
  { id: "1", tipo: "paralegal", modalidad: "remoto", titulo: "Paralegal Inmigración Bilingüe", empresa: "LinkedIn", plataforma: "LinkedIn", ubicacion: "Remoto · Worldwide", descripcion: "Filtra por 'Remote' y ordena 'Most Recent'. Firmas EE.UU. buscan paralegal bilingüe con experiencia en asylum y removal defense.", url: "https://www.linkedin.com/jobs/search/?keywords=paralegal+immigration+bilingual+spanish&f_WT=2&sortBy=DD", salario: "$45,000-65,000/año" },
  { id: "2", tipo: "paralegal", modalidad: "remoto", titulo: "Legal Assistant Immigration Remote", empresa: "Indeed", plataforma: "Indeed", ubicacion: "Remoto · USA", descripcion: "Búsqueda con filtro Remote activo. Ordena por 'Date posted: Last 7 days' para ver las más recientes.", url: "https://www.indeed.com/jobs?q=legal+assistant+immigration+bilingual+spanish&sc=0kf%3Aattr(DSQF7)%3B&sort=date", salario: "$18-28/hr" },
  { id: "3", tipo: "paralegal", modalidad: "remoto", titulo: "Paralegal Removal Defense / Asylum", empresa: "Indeed - Especializado", plataforma: "Indeed", ubicacion: "Remoto · USA", descripcion: "Búsqueda específica de removal defense y asylum. Filtra por fecha para ver las más nuevas.", url: "https://www.indeed.com/jobs?q=paralegal+removal+defense+asylum+bilingual&sc=0kf%3Aattr(DSQF7)%3B&sort=date", salario: "$20-30/hr" },
  { id: "4", tipo: "paralegal", modalidad: "remoto", titulo: "Immigration Paralegal Bilingual", empresa: "ZipRecruiter", plataforma: "ZipRecruiter", ubicacion: "Remoto · USA", descripcion: "Miles de firmas de inmigración EE.UU. buscando paralegal bilingüe remoto. Resultados actualizados.", url: "https://www.ziprecruiter.com/Jobs/Immigration-Paralegal-Bilingual-Spanish-Remote", salario: "$45,000-65,000/año" },
  { id: "5", tipo: "paralegal", modalidad: "remoto", titulo: "Paralegal USCIS / EOIR Bilingual", empresa: "Glassdoor", plataforma: "Glassdoor", ubicacion: "Remoto · USA", descripcion: "Vacantes con salarios reales verificados. Firmas que trabajan con USCIS y EOIR buscan bilingüe remoto.", url: "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=immigration+paralegal+bilingual+spanish&remoteWorkType=1&sortBy=date_desc", salario: "$45,000-65,000/año" },
  { id: "6", tipo: "paralegal", modalidad: "remoto", titulo: "Paralegal IP Propiedad Intelectual", empresa: "LinkedIn - IP", plataforma: "LinkedIn", ubicacion: "Remoto · Worldwide", descripcion: "Firmas internacionales de IP buscan paralegal bilingüe con experiencia en patentes y diseños industriales.", url: "https://www.linkedin.com/jobs/search/?keywords=paralegal+intellectual+property+bilingual+spanish&f_WT=2&sortBy=DD", salario: "$50,000-70,000/año" },
  { id: "7", tipo: "paralegal", modalidad: "remoto", titulo: "Patent Paralegal Bilingual Remote", empresa: "Indeed - IP", plataforma: "Indeed", ubicacion: "Remoto · USA / Worldwide", descripcion: "Paralegal en propiedad intelectual, patentes y marcas. Filtro Remote activo.", url: "https://www.indeed.com/jobs?q=IP+paralegal+intellectual+property+bilingual&sc=0kf%3Aattr(DSQF7)%3B&sort=date", salario: "$50,000-70,000/año" },
  { id: "8", tipo: "paralegal", modalidad: "remoto", titulo: "Legal Jobs Remote - RemoteOK", empresa: "RemoteOK", plataforma: "RemoteOK", ubicacion: "Remoto · Worldwide", descripcion: "Portal 100% remoto. Sección legal actualizada diariamente con vacantes verificadas.", url: "https://remoteok.com/remote-legal-jobs", salario: "Ver en plataforma" },
  { id: "9", tipo: "paralegal", modalidad: "remoto", titulo: "Legal Positions - WeWorkRemotely", empresa: "WeWorkRemotely", plataforma: "WeWorkRemotely", ubicacion: "Remoto · Worldwide", descripcion: "Bolsa remota top. Sección Legal con vacantes internacionales verificadas.", url: "https://weworkremotely.com/remote-jobs/search?term=paralegal+bilingual+legal", salario: "Ver en plataforma" },
  { id: "10", tipo: "paralegal", modalidad: "remoto", titulo: "Legal Paralegal Freelance", empresa: "Upwork", plataforma: "Upwork", ubicacion: "Remoto · Worldwide", descripcion: "Plataforma freelance líder. Proyectos de immigration law y IP para clientes EE.UU. Crea perfil y aplica.", url: "https://www.upwork.com/search/jobs/?q=paralegal+immigration+bilingual+spanish&sort=recency", salario: "$25-50/hr" },
  { id: "11", tipo: "paralegal", modalidad: "remoto", titulo: "Legal Freelance LATAM", empresa: "Workana", plataforma: "Workana", ubicacion: "Remoto · LATAM", descripcion: "Mayor plataforma freelance LATAM. Proyectos legales y traducción en español e inglés.", url: "https://www.workana.com/jobs?category=legal-law&language=es", salario: "Por proyecto" },
  { id: "12", tipo: "paralegal", modalidad: "remoto", titulo: "Paralegal Home Office", empresa: "OCC Mundial", plataforma: "OCC", ubicacion: "Remoto · México", descripcion: "Bolsa líder México. Filtra 'Home Office' para ver solo vacantes remotas de paralegal y asistente legal.", url: "https://www.occ.com.mx/empleos/de-paralegal/?modality=3", salario: "Ver en plataforma" },
  { id: "13", tipo: "paralegal", modalidad: "remoto", titulo: "Paralegal Bilingüe - Google Jobs Remoto", empresa: "Google Jobs", plataforma: "Google Jobs", ubicacion: "Remoto · México / USA", descripcion: "Google agrega vacantes de TODAS las bolsas con filtro de trabajo remoto activado. Resultados más frescos.", url: "https://www.google.com/search?q=paralegal+bilingue+remoto+home+office&ibp=htl;jobs&htichips=employment_type:TELECOMMUTE,date_posted:week", salario: "Ver en plataforma" },

  // PRESENCIAL ZONA ORIENTE
  { id: "14", tipo: "paralegal", modalidad: "presencial", titulo: "Asistente Legal / Jurídica - CDMX Oriente", empresa: "Indeed", plataforma: "Indeed", ubicacion: "Presencial · Iztapalapa / CDMX", descripcion: "Búsqueda en Indeed con ubicación CDMX. Al abrir filtra manualmente por 'Iztapalapa' o 'Oriente' para afinar.", url: "https://www.indeed.com/jobs?q=asistente+legal+juridica+bilingue&l=Iztapalapa%2C+Ciudad+de+M%C3%A9xico&sort=date", salario: "Ver en plataforma" },
  { id: "15", tipo: "paralegal", modalidad: "presencial", titulo: "Asistente Jurídica - Computrabajo CDMX", empresa: "Computrabajo", plataforma: "Computrabajo", ubicacion: "Presencial · Iztapalapa / Nezahualcóyotl", descripcion: "Computrabajo filtrando por Iztapalapa. Verifica la ubicación exacta antes de postularte.", url: "https://mx.computrabajo.com/trabajo-de-asistente-juridica?l=Iztapalapa%2C+Ciudad+de+M%C3%A9xico", salario: "Ver en plataforma" },
  { id: "16", tipo: "paralegal", modalidad: "presencial", titulo: "Paralegal Legal CDMX - Google Jobs", empresa: "Google Jobs", plataforma: "Google Jobs", ubicacion: "Presencial · CDMX Oriente", descripcion: "Google Jobs filtrando por Iztapalapa y alrededores. Verifica ubicación exacta al abrir cada vacante.", url: "https://www.google.com/search?q=asistente+legal+juridica+bilingue+iztapalapa+los+reyes+texcoco&ibp=htl;jobs&htichips=date_posted:week", salario: "Ver en plataforma" },

  // ==================== ASISTENTE BILINGÜE ====================

  // REMOTO
  { id: "17", tipo: "asistente", modalidad: "remoto", titulo: "Virtual Assistant Bilingüe", empresa: "LinkedIn", plataforma: "LinkedIn", ubicacion: "Remoto · USA / LATAM", descripcion: "Asistente virtual bilingüe para firmas y empresas EE.UU. 100% remoto desde México. Filtra 'Remote'.", url: "https://www.linkedin.com/jobs/search/?keywords=virtual+assistant+bilingual+spanish+english&f_WT=2&sortBy=DD", salario: "$15-25/hr" },
  { id: "18", tipo: "asistente", modalidad: "remoto", titulo: "Administrative Assistant Bilingüe Remote", empresa: "Indeed", plataforma: "Indeed", ubicacion: "Remoto · USA", descripcion: "Asistentes administrativas bilingüe para empresas EE.UU. Filtro Remote activo.", url: "https://www.indeed.com/jobs?q=administrative+assistant+bilingual+spanish+english&sc=0kf%3Aattr(DSQF7)%3B&sort=date", salario: "$16-22/hr" },
  { id: "19", tipo: "asistente", modalidad: "remoto", titulo: "Executive Assistant Bilingüe Remote", empresa: "Glassdoor", plataforma: "Glassdoor", ubicacion: "Remoto · USA / Worldwide", descripcion: "Asistentes ejecutivas bilingüe para directivos de empresas internacionales. Filtro Remote activo.", url: "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=executive+assistant+bilingual+spanish+remote&remoteWorkType=1&sortBy=date_desc", salario: "$45,000-65,000/año" },
  { id: "20", tipo: "asistente", modalidad: "remoto", titulo: "Operations Coordinator Bilingüe", empresa: "ZipRecruiter", plataforma: "ZipRecruiter", ubicacion: "Remoto · USA", descripcion: "Coordinadoras de operaciones bilingüe para empresas con equipos en LATAM y EE.UU.", url: "https://www.ziprecruiter.com/Jobs/Operations-Coordinator-Bilingual-Spanish-Remote", salario: "$45,000-60,000/año" },
  { id: "21", tipo: "asistente", modalidad: "remoto", titulo: "Asistente Bilingüe Home Office - OCC", empresa: "OCC Mundial", plataforma: "OCC", ubicacion: "Remoto · México", descripcion: "Bolsa líder México. Asistente bilingüe en Home Office. Resultados solo de modalidad remota.", url: "https://www.occ.com.mx/empleos/de-asistente-bilingue/?modality=3", salario: "Ver en plataforma" },
  { id: "22", tipo: "asistente", modalidad: "remoto", titulo: "Asistente Bilingüe Remoto - Computrabajo", empresa: "Computrabajo", plataforma: "Computrabajo", ubicacion: "Remoto · México / LATAM", descripcion: "Mayor bolsa LATAM. Asistente bilingüe en teletrabajo. Filtra 'Teletrabajo' al abrir.", url: "https://mx.computrabajo.com/trabajo-de-asistente-bilingue?jt=4", salario: "Ver en plataforma" },
  { id: "23", tipo: "asistente", modalidad: "remoto", titulo: "Bilingual Coordinator Remote - Hireline", empresa: "Hireline", plataforma: "Hireline", ubicacion: "Remoto · LATAM / Worldwide", descripcion: "Plataforma LATAM especializada en trabajo 100% remoto con empresas que pagan en USD.", url: "https://hireline.io/mx/empleos-remotos?q=bilingue+asistente", salario: "USD" },
  { id: "24", tipo: "asistente", modalidad: "remoto", titulo: "Asistente Bilingüe Remote - Google Jobs", empresa: "Google Jobs", plataforma: "Google Jobs", ubicacion: "Remoto · México / USA", descripcion: "Google agrega vacantes de todas las bolsas con filtro remoto. Asistente bilingüe home office.", url: "https://www.google.com/search?q=asistente+bilingue+home+office+remoto+ingles&ibp=htl;jobs&htichips=employment_type:TELECOMMUTE,date_posted:week", salario: "Ver en plataforma" },

  // PRESENCIAL ZONA ORIENTE
  { id: "25", tipo: "asistente", modalidad: "presencial", titulo: "Asistente Bilingüe - Indeed Iztapalapa", empresa: "Indeed", plataforma: "Indeed", ubicacion: "Presencial · Iztapalapa / Los Reyes", descripcion: "Búsqueda centrada en Iztapalapa. Verifica la ubicación exacta de cada vacante antes de postularte.", url: "https://www.indeed.com/jobs?q=asistente+bilingue+ingles&l=Iztapalapa%2C+Ciudad+de+M%C3%A9xico&sort=date", salario: "Ver en plataforma" },
  { id: "26", tipo: "asistente", modalidad: "presencial", titulo: "Secretaria Bilingüe - Computrabajo Oriente", empresa: "Computrabajo", plataforma: "Computrabajo", ubicacion: "Presencial · Iztapalapa / Nezahualcóyotl", descripcion: "Computrabajo filtrando por zona oriente CDMX. Confirma ubicación antes de postularte.", url: "https://mx.computrabajo.com/trabajo-de-secretaria-bilingue?l=Iztapalapa%2C+Ciudad+de+M%C3%A9xico", salario: "Ver en plataforma" },
  { id: "27", tipo: "asistente", modalidad: "presencial", titulo: "Asistente Bilingüe - Indeed Texcoco", empresa: "Indeed", plataforma: "Indeed", ubicacion: "Presencial · Texcoco / Los Reyes La Paz", descripcion: "Búsqueda centrada en Texcoco y alrededores. Verifica la ubicación exacta de cada vacante.", url: "https://www.indeed.com/jobs?q=asistente+bilingue+ingles&l=Texcoco%2C+Estado+de+M%C3%A9xico&sort=date", salario: "Ver en plataforma" },
  { id: "28", tipo: "asistente", modalidad: "presencial", titulo: "Asistente Bilingüe Oriente - Google Jobs", empresa: "Google Jobs", plataforma: "Google Jobs", ubicacion: "Presencial · Iztapalapa / Texcoco / Los Reyes", descripcion: "Google Jobs con búsqueda específica zona oriente. Verifica ubicación exacta al abrir cada vacante.", url: "https://www.google.com/search?q=asistente+bilingue+ingles+iztapalapa+texcoco+los+reyes+la+paz&ibp=htl;jobs&htichips=date_posted:week", salario: "Ver en plataforma" },
  { id: "29", tipo: "asistente", modalidad: "presencial", titulo: "Empleos Bilingüe - Facebook Grupos Oriente", empresa: "Facebook Grupos", plataforma: "Facebook", ubicacion: "Presencial · Texcoco / Los Reyes / Iztapalapa", descripcion: "Grupos locales de empleo zona oriente en Facebook. Busca 'empleo bilingüe' en grupos de tu colonia.", url: "https://www.facebook.com/groups/search/results/?q=empleo+bilingue+ingles+iztapalapa+texcoco", salario: "Ver en plataforma" },

  // ==================== ENGLISH TEACHER ====================

  // REMOTO
  { id: "30", tipo: "teacher", modalidad: "remoto", titulo: "Online English Teacher", empresa: "LinkedIn", plataforma: "LinkedIn", ubicacion: "Remoto · Worldwide", descripcion: "Plataformas de inglés online buscan maestras bilingüe. TOEIC 920 es un diferenciador enorme.", url: "https://www.linkedin.com/jobs/search/?keywords=online+english+teacher+bilingual+remote&f_WT=2&sortBy=DD", salario: "$15-30/hr" },
  { id: "31", tipo: "teacher", modalidad: "remoto", titulo: "English Tutor / Teacher Online", empresa: "Indeed", plataforma: "Indeed", ubicacion: "Remoto · Worldwide", descripcion: "Tutor de inglés online para adultos y corporativos. Filtro Remote activo. Ordena por fecha.", url: "https://www.indeed.com/jobs?q=english+teacher+tutor+online+bilingual+spanish&sc=0kf%3Aattr(DSQF7)%3B&sort=date", salario: "$15-25/hr" },
  { id: "32", tipo: "teacher", modalidad: "remoto", titulo: "Corporate English Trainer Remote", empresa: "Glassdoor", plataforma: "Glassdoor", ubicacion: "Remoto · LATAM / Worldwide", descripcion: "Trainers de inglés corporativo con experiencia en capacitación organizacional. Filtro remoto activo.", url: "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=english+corporate+trainer+bilingual+remote&remoteWorkType=1&sortBy=date_desc", salario: "$20-35/hr" },
  { id: "33", tipo: "teacher", modalidad: "remoto", titulo: "ESL Teacher Online - RemoteOK", empresa: "RemoteOK", plataforma: "RemoteOK", ubicacion: "Remoto · Worldwide", descripcion: "Plataformas ESL buscan maestras bilingüe. Portal 100% remoto con vacantes verificadas.", url: "https://remoteok.com/remote-teacher-jobs", salario: "$15-28/hr" },
  { id: "34", tipo: "teacher", modalidad: "remoto", titulo: "English Teacher Home Office - OCC", empresa: "OCC Mundial", plataforma: "OCC", ubicacion: "Remoto · México", descripcion: "Maestras de inglés en modalidad Home Office en México. Solo resultados remotos.", url: "https://www.occ.com.mx/empleos/de-maestro-ingles/?modality=3", salario: "Ver en plataforma" },
  { id: "35", tipo: "teacher", modalidad: "remoto", titulo: "English Teacher Online - Google Jobs", empresa: "Google Jobs", plataforma: "Google Jobs", ubicacion: "Remoto · México / Worldwide", descripcion: "Google Jobs con filtro remoto para maestras de inglés online. Resultados de múltiples plataformas.", url: "https://www.google.com/search?q=maestra+ingles+online+remoto+home+office&ibp=htl;jobs&htichips=employment_type:TELECOMMUTE,date_posted:week", salario: "Ver en plataforma" },

  // PRESENCIAL ZONA ORIENTE
  { id: "36", tipo: "teacher", modalidad: "presencial", titulo: "English Teacher - Indeed Texcoco", empresa: "Indeed", plataforma: "Indeed", ubicacion: "Presencial · Texcoco / Los Reyes La Paz", descripcion: "Maestras de inglés en colegios y academias. Búsqueda centrada en Texcoco. Verifica ubicación.", url: "https://www.indeed.com/jobs?q=maestro+ingles+instructor&l=Texcoco%2C+Estado+de+M%C3%A9xico&sort=date", salario: "Ver en plataforma" },
  { id: "37", tipo: "teacher", modalidad: "presencial", titulo: "Instructor Inglés - Computrabajo Los Reyes", empresa: "Computrabajo", plataforma: "Computrabajo", ubicacion: "Presencial · Los Reyes La Paz / Chimalhuacán", descripcion: "Instructoras de inglés en academias zona oriente. Confirma la ubicación antes de postularte.", url: "https://mx.computrabajo.com/trabajo-de-instructor-ingles?l=Los+Reyes+la+Paz%2C+Estado+de+M%C3%A9xico", salario: "Ver en plataforma" },
  { id: "38", tipo: "teacher", modalidad: "presencial", titulo: "Maestra Inglés Oriente - Google Jobs", empresa: "Google Jobs", plataforma: "Google Jobs", ubicacion: "Presencial · Texcoco / Los Reyes / Iztapalapa", descripcion: "Google Jobs con búsqueda zona oriente para maestras de inglés. Verifica ubicación exacta en cada vacante.", url: "https://www.google.com/search?q=maestra+instructor+ingles+texcoco+los+reyes+iztapalapa+chimalhuacan&ibp=htl;jobs&htichips=date_posted:week", salario: "Ver en plataforma" },
  { id: "39", tipo: "teacher", modalidad: "presencial", titulo: "Docente Inglés - Indeed Iztapalapa", empresa: "Indeed", plataforma: "Indeed", ubicacion: "Presencial · Iztapalapa / Nezahualcóyotl", descripcion: "Docentes de inglés en zona oriente CDMX. Verifica que la ubicación sea cerca antes de aplicar.", url: "https://www.indeed.com/jobs?q=maestro+docente+ingles&l=Iztapalapa%2C+Ciudad+de+M%C3%A9xico&sort=date", salario: "Ver en plataforma" },

  // ==================== INTÉRPRETE / TRADUCTORA ====================

  // REMOTO
  { id: "40", tipo: "interprete", modalidad: "remoto", titulo: "Legal Translator Spanish-English Remote", empresa: "LinkedIn", plataforma: "LinkedIn", ubicacion: "Remoto · Worldwide", descripcion: "Traductoras legales español-inglés para firmas, juzgados y organismos internacionales. Filtro Remote.", url: "https://www.linkedin.com/jobs/search/?keywords=legal+translator+spanish+english+remote&f_WT=2&sortBy=DD", salario: "$25-50/hr" },
  { id: "41", tipo: "interprete", modalidad: "remoto", titulo: "Legal Translation & Documents - Upwork", empresa: "Upwork", plataforma: "Upwork", ubicacion: "Remoto · Worldwide", descripcion: "Proyectos de traducción legal español-inglés para clientes EE.UU. Crea perfil y aplica.", url: "https://www.upwork.com/search/jobs/?q=legal+translation+spanish+english&sort=recency", salario: "$25-60/hr" },
  { id: "42", tipo: "interprete", modalidad: "remoto", titulo: "Remote Interpreter Bilingual", empresa: "Indeed", plataforma: "Indeed", ubicacion: "Remoto · USA", descripcion: "Intérpretes bilingüe para sesiones legales y corporativas vía videollamada. Filtro Remote activo.", url: "https://www.indeed.com/jobs?q=interpreter+bilingual+spanish+english+remote&sc=0kf%3Aattr(DSQF7)%3B&sort=date", salario: "$18-35/hr" },
  { id: "43", tipo: "interprete", modalidad: "remoto", titulo: "Intérprete Bilingüe Remote - Google Jobs", empresa: "Google Jobs", plataforma: "Google Jobs", ubicacion: "Remoto · México / USA", descripcion: "Google Jobs con filtro remoto para intérpretes y traductores bilingüe. Vacantes de múltiples bolsas.", url: "https://www.google.com/search?q=interprete+traductor+bilingue+remoto+home+office+español+ingles&ibp=htl;jobs&htichips=employment_type:TELECOMMUTE,date_posted:week", salario: "Ver en plataforma" },

  // PRESENCIAL ZONA ORIENTE
  { id: "44", tipo: "interprete", modalidad: "presencial", titulo: "Intérprete Bilingüe - Indeed CDMX", empresa: "Indeed", plataforma: "Indeed", ubicacion: "Presencial · CDMX / Zona Oriente", descripcion: "Intérpretes bilingüe en juzgados y despachos CDMX. Verifica la ubicación exacta antes de aplicar.", url: "https://www.indeed.com/jobs?q=interprete+bilingue+español+ingles&l=Ciudad+de+Mexico&sort=date", salario: "Ver en plataforma" },
  { id: "45", tipo: "interprete", modalidad: "presencial", titulo: "Traductora Bilingüe - Computrabajo CDMX", empresa: "Computrabajo", plataforma: "Computrabajo", ubicacion: "Presencial · CDMX / Zona Oriente", descripcion: "Traductoras bilingüe en empresas y despachos CDMX. Confirma ubicación al abrir cada vacante.", url: "https://mx.computrabajo.com/trabajo-de-traductora-bilingue?l=Ciudad+de+M%C3%A9xico", salario: "Ver en plataforma" },

  // ==================== ATENCIÓN A CLIENTES BILINGÜE ====================

  // REMOTO
  { id: "46", tipo: "atencion", modalidad: "remoto", titulo: "Customer Success Bilingüe Remote", empresa: "LinkedIn", plataforma: "LinkedIn", ubicacion: "Remoto · USA / LATAM", descripcion: "Empresas EE.UU. buscan customer success bilingüe español-inglés. Paga en USD, 100% remoto.", url: "https://www.linkedin.com/jobs/search/?keywords=customer+success+bilingual+spanish+english+remote&f_WT=2&sortBy=DD", salario: "$40,000-60,000/año" },
  { id: "47", tipo: "atencion", modalidad: "remoto", titulo: "Client Services Coordinator Bilingüe", empresa: "Indeed", plataforma: "Indeed", ubicacion: "Remoto · USA", descripcion: "Coordinadoras de servicio al cliente bilingüe para firmas legales y corporativas EE.UU. Filtro Remote.", url: "https://www.indeed.com/jobs?q=client+services+coordinator+bilingual+spanish&sc=0kf%3Aattr(DSQF7)%3B&sort=date", salario: "$18-25/hr" },
  { id: "48", tipo: "atencion", modalidad: "remoto", titulo: "Bilingual Customer Support Remote", empresa: "ZipRecruiter", plataforma: "ZipRecruiter", ubicacion: "Remoto · USA", descripcion: "Soporte al cliente bilingüe para empresas EE.UU. Atención en español e inglés. Resultados remotos.", url: "https://www.ziprecruiter.com/Jobs/Bilingual-Customer-Support-Spanish-English-Remote", salario: "$16-22/hr" },
  { id: "49", tipo: "atencion", modalidad: "remoto", titulo: "Atención Clientes Bilingüe Home Office - OCC", empresa: "OCC Mundial", plataforma: "OCC", ubicacion: "Remoto · México", descripcion: "Atención a clientes bilingüe en Home Office México. Solo resultados de modalidad remota.", url: "https://www.occ.com.mx/empleos/de-atencion-a-clientes-bilingue/?modality=3", salario: "Ver en plataforma" },
  { id: "50", tipo: "atencion", modalidad: "remoto", titulo: "Ejecutivo Bilingüe Teletrabajo - Computrabajo", empresa: "Computrabajo", plataforma: "Computrabajo", ubicacion: "Remoto · México / LATAM", descripcion: "Ejecutivos bilingüe en atención a clientes modalidad teletrabajo. Solo resultados remotos.", url: "https://mx.computrabajo.com/trabajo-de-ejecutivo-bilingue?jt=4", salario: "Ver en plataforma" },
  { id: "51", tipo: "atencion", modalidad: "remoto", titulo: "Atención Clientes Bilingüe Remote - Google Jobs", empresa: "Google Jobs", plataforma: "Google Jobs", ubicacion: "Remoto · México / USA", descripcion: "Google Jobs filtrando atención a clientes bilingüe en modalidad remota. Vacantes actualizadas.", url: "https://www.google.com/search?q=atencion+clientes+bilingue+ingles+home+office+remoto&ibp=htl;jobs&htichips=employment_type:TELECOMMUTE,date_posted:week", salario: "Ver en plataforma" },

  // PRESENCIAL ZONA ORIENTE
  { id: "52", tipo: "atencion", modalidad: "presencial", titulo: "Ejecutivo Bilingüe B2+ - Indeed Iztapalapa", empresa: "Indeed", plataforma: "Indeed", ubicacion: "Presencial · Iztapalapa / Nezahualcóyotl", descripcion: "Ejecutivos bilingüe nivel avanzado en zona oriente. Verifica la ubicación exacta antes de postularte.", url: "https://www.indeed.com/jobs?q=ejecutivo+bilingue+ingles+avanzado&l=Iztapalapa%2C+Ciudad+de+M%C3%A9xico&sort=date", salario: "Ver en plataforma" },
  { id: "53", tipo: "atencion", modalidad: "presencial", titulo: "Atención Clientes Bilingüe - Computrabajo Oriente", empresa: "Computrabajo", plataforma: "Computrabajo", ubicacion: "Presencial · Nezahualcóyotl / Los Reyes / Texcoco", descripcion: "Atención a clientes bilingüe zona oriente. Inglés avanzado bien remunerado. Confirma ubicación.", url: "https://mx.computrabajo.com/trabajo-de-atencion-clientes-bilingue?l=Nezahualcoyotl%2C+Estado+de+Mexico", salario: "Ver en plataforma" },
  { id: "54", tipo: "atencion", modalidad: "presencial", titulo: "Atención Clientes Bilingüe Oriente - Google Jobs", empresa: "Google Jobs", plataforma: "Google Jobs", ubicacion: "Presencial · Iztapalapa / Nezahualcóyotl / Los Reyes", descripcion: "Google Jobs zona oriente para atención a clientes bilingüe. Verifica ubicación exacta en cada resultado.", url: "https://www.google.com/search?q=atencion+clientes+bilingue+ingles+iztapalapa+nezahualcoyotl+los+reyes&ibp=htl;jobs&htichips=date_posted:week", salario: "Ver en plataforma" },
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
