import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const VACANTES_REMOTO = [
  // LEGAL / PARALEGAL IMMIGRATION
  { id: "1", titulo: "Paralegal Bilingüe - Inmigración EE.UU.", empresa: "LinkedIn", plataforma: "LinkedIn", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Red profesional más grande. Filtra Remote y ordena Most Recent. Ideal para removal defense y asylum.", url: "https://www.linkedin.com/jobs/search/?keywords=paralegal+immigration+bilingual+spanish&f_WT=2", salario: "$45,000-65,000/año", relevancia: "Alta", match: 98 },
  { id: "2", titulo: "Immigration Legal Assistant Remote", empresa: "Indeed", plataforma: "Indeed", modalidad: "Remoto", ubicacion: "USA / Worldwide", descripcion: "Bolsa global. Filtra Last 7 days y Remote. Muchas firmas EE.UU. buscan bilingüe.", url: "https://www.indeed.com/jobs?q=legal+assistant+immigration+bilingual+spanish&l=Remote&sort=date", salario: "$18-28/hr", relevancia: "Alta", match: 97 },
  { id: "3", titulo: "Paralegal - Removal Defense / Asylum", empresa: "Indeed - Especializado", plataforma: "Indeed", modalidad: "Remoto", ubicacion: "USA", descripcion: "Búsqueda específica removal defense y asylum. Firmas EE.UU. buscan paralegal bilingüe remoto.", url: "https://www.indeed.com/jobs?q=paralegal+removal+defense+asylum+bilingual&l=Remote&sort=date", salario: "$20-30/hr", relevancia: "Alta", match: 98 },
  { id: "4", titulo: "Immigration Paralegal Bilingual", empresa: "ZipRecruiter", plataforma: "ZipRecruiter", modalidad: "Remoto", ubicacion: "USA / Remote", descripcion: "Miles de firmas de inmigración buscando paralegal bilingüe remoto. Filtra por fecha.", url: "https://www.ziprecruiter.com/Jobs/Immigration-Paralegal-Bilingual-Spanish-Remote", salario: "$45,000-65,000/año", relevancia: "Alta", match: 96 },
  { id: "5", titulo: "Paralegal USCIS / EOIR Bilingual", empresa: "Glassdoor", plataforma: "Glassdoor", modalidad: "Remoto", ubicacion: "USA / Worldwide", descripcion: "Vacantes con salarios reales de firmas que trabajan con USCIS y EOIR. Filtra Remote.", url: "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=immigration+paralegal+bilingual+spanish&remoteWorkType=1", salario: "Ver en plataforma", relevancia: "Alta", match: 94 },
  { id: "6", titulo: "Remote Immigration Legal Assistant", empresa: "LinkedIn - Firmas EE.UU.", plataforma: "LinkedIn", modalidad: "Remoto", ubicacion: "USA", descripcion: "Firmas de California, Texas, Nueva York buscan legal assistant bilingüe remoto.", url: "https://www.linkedin.com/jobs/search/?keywords=immigration+legal+assistant+bilingual+remote&f_WT=2&f_TPR=r604800", salario: "Ver en plataforma", relevancia: "Alta", match: 97 },
  { id: "7", titulo: "Paralegal IP - Propiedad Intelectual", empresa: "LinkedIn - IP", plataforma: "LinkedIn", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Firmas internacionales de IP buscan paralegal bilingüe con experiencia en patentes.", url: "https://www.linkedin.com/jobs/search/?keywords=paralegal+intellectual+property+bilingual+spanish&f_WT=2", salario: "Ver en plataforma", relevancia: "Alta", match: 93 },
  { id: "8", titulo: "Patent Paralegal Bilingual Remote", empresa: "Indeed - IP", plataforma: "Indeed", modalidad: "Remoto", ubicacion: "USA / Worldwide", descripcion: "Vacantes de paralegal en propiedad intelectual, patentes y marcas para perfil bilingüe.", url: "https://www.indeed.com/jobs?q=IP+paralegal+intellectual+property+bilingual&l=Remote&sort=date", salario: "$50,000-70,000/año", relevancia: "Alta", match: 92 },

  // ATENCIÓN A CLIENTES BILINGÜE
  { id: "9", titulo: "Customer Success Bilingüe Remoto", empresa: "LinkedIn - CS", plataforma: "LinkedIn", modalidad: "Remoto", ubicacion: "USA / LATAM", descripcion: "Empresas EE.UU. buscan customer success bilingüe español-inglés. Paga en USD, 100% remoto.", url: "https://www.linkedin.com/jobs/search/?keywords=customer+success+bilingual+spanish+english+remote&f_WT=2", salario: "$40,000-60,000/año", relevancia: "Alta", match: 88 },
  { id: "10", titulo: "Client Services Coordinator Bilingüe", empresa: "Indeed - CS", plataforma: "Indeed", modalidad: "Remoto", ubicacion: "USA / Remote", descripcion: "Coordinadoras de servicio al cliente bilingüe para firmas legales y corporativas en EE.UU.", url: "https://www.indeed.com/jobs?q=client+services+coordinator+bilingual+spanish&l=Remote&sort=date", salario: "$18-25/hr", relevancia: "Alta", match: 87 },
  { id: "11", titulo: "Bilingual Customer Support Remote", empresa: "ZipRecruiter - CS", plataforma: "ZipRecruiter", modalidad: "Remoto", ubicacion: "USA / Remote", descripcion: "Soporte al cliente bilingüe para empresas EE.UU. Atención en español e inglés.", url: "https://www.ziprecruiter.com/Jobs/Bilingual-Customer-Support-Spanish-English-Remote", salario: "$16-22/hr", relevancia: "Alta", match: 85 },
  { id: "12", titulo: "Bilingual Account Manager Remote", empresa: "Glassdoor - AM", plataforma: "Glassdoor", modalidad: "Remoto", ubicacion: "USA / LATAM", descripcion: "Account managers bilingüe para empresas con clientes en LATAM. Inglés avanzado requerido.", url: "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=account+manager+bilingual+spanish+remote&remoteWorkType=1", salario: "$50,000-75,000/año", relevancia: "Alta", match: 86 },

  // ASISTENTE / COORDINADORA BILINGÜE
  { id: "13", titulo: "Virtual Assistant Bilingüe Remoto", empresa: "LinkedIn - VA", plataforma: "LinkedIn", modalidad: "Remoto", ubicacion: "USA / LATAM", descripcion: "Asistente virtual bilingüe para firmas, consultoras y empresas EE.UU. 100% remoto desde México.", url: "https://www.linkedin.com/jobs/search/?keywords=virtual+assistant+bilingual+spanish+english&f_WT=2", salario: "$15-25/hr", relevancia: "Alta", match: 90 },
  { id: "14", titulo: "Administrative Assistant Bilingüe", empresa: "Indeed - Admin", plataforma: "Indeed", modalidad: "Remoto", ubicacion: "USA / Remote", descripcion: "Asistentes administrativas bilingüe para empresas EE.UU. Manejo de documentos y coordinación.", url: "https://www.indeed.com/jobs?q=administrative+assistant+bilingual+spanish+english&l=Remote&sort=date", salario: "$16-22/hr", relevancia: "Alta", match: 88 },
  { id: "15", titulo: "Executive Assistant Bilingüe Remote", empresa: "Glassdoor - EA", plataforma: "Glassdoor", modalidad: "Remoto", ubicacion: "USA / Worldwide", descripcion: "Asistentes ejecutivas bilingüe para directivos de empresas internacionales.", url: "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=executive+assistant+bilingual+spanish+remote&remoteWorkType=1", salario: "$45,000-65,000/año", relevancia: "Alta", match: 87 },
  { id: "16", titulo: "Operations Coordinator Bilingüe", empresa: "ZipRecruiter - Ops", plataforma: "ZipRecruiter", modalidad: "Remoto", ubicacion: "USA / Remote", descripcion: "Coordinadoras de operaciones bilingüe para empresas con equipos en LATAM y EE.UU.", url: "https://www.ziprecruiter.com/Jobs/Operations-Coordinator-Bilingual-Spanish-Remote", salario: "$45,000-60,000/año", relevancia: "Alta", match: 86 },
  { id: "17", titulo: "Project Coordinator Bilingüe Remote", empresa: "LinkedIn - PM", plataforma: "LinkedIn", modalidad: "Remoto", ubicacion: "USA / LATAM", descripcion: "Coordinadoras de proyectos bilingüe en empresas internacionales. Organización y seguimiento.", url: "https://www.linkedin.com/jobs/search/?keywords=project+coordinator+bilingual+spanish+remote&f_WT=2", salario: "$50,000-70,000/año", relevancia: "Alta", match: 85 },

  // ENGLISH TEACHER / TUTOR REMOTO
  { id: "18", titulo: "Online English Teacher Remoto", empresa: "LinkedIn - Teacher", plataforma: "LinkedIn", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Plataformas internacionales buscan maestras de inglés online con perfil bilingüe avanzado.", url: "https://www.linkedin.com/jobs/search/?keywords=online+english+teacher+bilingual+remote&f_WT=2", salario: "$15-30/hr", relevancia: "Alta", match: 85 },
  { id: "19", titulo: "English Tutor / Teacher Online", empresa: "Indeed - Teacher", plataforma: "Indeed", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Tutor de inglés online para adultos y corporativos. TOEIC alto es muy valorado.", url: "https://www.indeed.com/jobs?q=english+teacher+tutor+online+bilingual+spanish&l=Remote&sort=date", salario: "$15-25/hr", relevancia: "Alta", match: 83 },
  { id: "20", titulo: "Corporate English Trainer Remote", empresa: "Glassdoor - Training", plataforma: "Glassdoor", modalidad: "Remoto", ubicacion: "LATAM / Worldwide", descripcion: "Empresas buscan trainers de inglés corporativo con experiencia en capacitación organizacional.", url: "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=english+corporate+trainer+bilingual&remoteWorkType=1", salario: "$20-35/hr", relevancia: "Alta", match: 86 },
  { id: "21", titulo: "ESL Teacher Online Remoto", empresa: "RemoteOK - Teacher", plataforma: "RemoteOK", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Plataformas ESL buscan maestras bilingüe. Horarios flexibles desde casa.", url: "https://remoteok.com/remote-teacher-jobs", salario: "$15-28/hr", relevancia: "Alta", match: 82 },

  // TRADUCCIÓN / INTÉRPRETE REMOTO
  { id: "22", titulo: "Legal Translator Spanish-English Remote", empresa: "LinkedIn - Traducción", plataforma: "LinkedIn", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Traductoras legales español-inglés para firmas, juzgados y organismos internacionales.", url: "https://www.linkedin.com/jobs/search/?keywords=legal+translator+spanish+english+remote&f_WT=2", salario: "$25-50/hr", relevancia: "Alta", match: 91 },
  { id: "23", titulo: "Legal Translation & Documents", empresa: "Upwork - Traducción", plataforma: "Upwork", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Traducción legal español-inglés, redacción de documentos y revisión de contratos. Clientes EE.UU.", url: "https://www.upwork.com/search/jobs/?q=legal+translation+spanish+english+paralegal", salario: "$25-60/hr", relevancia: "Alta", match: 90 },
  { id: "24", titulo: "Interpreter Bilingual Remote", empresa: "Indeed - Intérprete", plataforma: "Indeed", modalidad: "Remoto", ubicacion: "USA / Remote", descripcion: "Intérpretes bilingüe para sesiones legales, médicas y corporativas vía videollamada.", url: "https://www.indeed.com/jobs?q=interpreter+bilingual+spanish+english+remote&l=Remote&sort=date", salario: "$18-35/hr", relevancia: "Alta", match: 89 },

  // PORTALES ESPECIALIZADOS REMOTO
  { id: "25", titulo: "Remote Legal Jobs Global", empresa: "RemoteOK", plataforma: "RemoteOK", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Portal 100% remoto. Vacantes legales globales actualizadas diariamente.", url: "https://remoteok.com/remote-legal-jobs", salario: "Ver en plataforma", relevancia: "Alta", match: 86 },
  { id: "26", titulo: "Remote Legal & Admin Positions", empresa: "We Work Remotely", plataforma: "WeWorkRemotely", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Bolsa remota top. Legal, admin y coordinación con vacantes internacionales actualizadas.", url: "https://weworkremotely.com/remote-jobs/search?term=bilingual+legal+assistant", salario: "Ver en plataforma", relevancia: "Alta", match: 85 },
  { id: "27", titulo: "Legal Remote Jobs Curated", empresa: "Remotive", plataforma: "Remotive", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Curación de mejores vacantes remotas para profesionales internacionales.", url: "https://remotive.com/remote-jobs/legal", salario: "Ver en plataforma", relevancia: "Alta", match: 83 },
  { id: "28", titulo: "Remote Legal LATAM USD", empresa: "Hireline", plataforma: "Hireline", modalidad: "Remoto", ubicacion: "LATAM / Worldwide", descripcion: "Plataforma LATAM con empresas que pagan en USD. Legal, admin y bilingüe.", url: "https://hireline.io/mx/empleos-remotos", salario: "USD", relevancia: "Alta", match: 89 },
  { id: "29", titulo: "Legal Paralegal Freelance LATAM", empresa: "Workana", plataforma: "Workana", modalidad: "Remoto", ubicacion: "LATAM", descripcion: "Mayor plataforma freelance LATAM. Proyectos legales, traducción y administración.", url: "https://www.workana.com/jobs?category=legal-law", salario: "Por proyecto", relevancia: "Alta", match: 88 },
  { id: "30", titulo: "Legal Services Freelance Global", empresa: "Upwork", plataforma: "Upwork", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Plataforma freelance líder mundial. Crea perfil con especialidad en immigration law y IP.", url: "https://www.upwork.com/search/jobs/?q=paralegal+immigration+bilingual+spanish", salario: "$20-50/hr", relevancia: "Alta", match: 91 },
  { id: "31", titulo: "Legal Jobs - OCC Home Office", empresa: "OCC Mundial", plataforma: "OCC", modalidad: "Home Office", ubicacion: "México", descripcion: "Bolsa líder México. Busca paralegal, asistente legal, coordinadora jurídica en Home Office.", url: "https://www.occ.com.mx/empleos/de-paralegal/?modality=3", salario: "Ver en plataforma", relevancia: "Alta", match: 87 },
  { id: "32", titulo: "Asistente Bilingüe Home Office", empresa: "Computrabajo", plataforma: "Computrabajo", modalidad: "Home Office", ubicacion: "México / LATAM", descripcion: "Mayor bolsa LATAM. Asistente legal, coordinadora y bilingüe en teletrabajo.", url: "https://www.computrabajo.com.mx/trabajo-de-asistente-bilingue", salario: "Ver en plataforma", relevancia: "Media", match: 82 },
  { id: "33", titulo: "Remote Jobs - Google Jobs", empresa: "Google Jobs", plataforma: "Google", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Google agrega vacantes de TODAS las plataformas. Paralegal, bilingüe, asistente, traductor.", url: "https://www.google.com/search?q=paralegal+bilingual+spanish+remote+job&ibp=htl;jobs&htichips=employment_type:TELECOMMUTE", salario: "Ver en plataforma", relevancia: "Alta", match: 95 },
  { id: "34", titulo: "GetOnBoard - Bilingüe LATAM USD", empresa: "GetOnBoard", plataforma: "GetOnBoard", modalidad: "Remoto", ubicacion: "LATAM", descripcion: "Bolsa LATAM #1 para trabajo remoto con empresas internacionales que pagan en USD.", url: "https://www.getonbrd.com/jobs", salario: "USD", relevancia: "Alta", match: 84 },
];

const VACANTES_PRESENCIAL = [
  { id: "p1", titulo: "English Teacher - Zona Oriente", empresa: "OCC - Oriente", plataforma: "OCC", modalidad: "Presencial", ubicacion: "Texcoco / Los Reyes La Paz / Chimalhuacán", descripcion: "Maestras de inglés en academias y colegios zona oriente EDOMEX y CDMX. Perfil bilingüe avanzado.", url: "https://www.occ.com.mx/empleos/de-maestro-ingles/?location=texcoco", salario: "Ver en plataforma", relevancia: "Alta", match: 90 },
  { id: "p2", titulo: "Asistente Bilingüe - Zona Oriente", empresa: "Computrabajo - Oriente", plataforma: "Computrabajo", modalidad: "Presencial", ubicacion: "Los Reyes La Paz / Iztapalapa / Nezahualcóyotl", descripcion: "Asistentes bilingüe en empresas y despachos zona oriente CDMX y Estado de México.", url: "https://www.computrabajo.com.mx/trabajo-de-asistente-bilingue?l=Iztapalapa%2C+Ciudad+de+M%C3%A9xico", salario: "Ver en plataforma", relevancia: "Alta", match: 87 },
  { id: "p3", titulo: "English Teacher / Instructor Inglés", empresa: "Indeed - Oriente", plataforma: "Indeed", modalidad: "Presencial", ubicacion: "Texcoco / Los Reyes / Iztapalapa", descripcion: "Maestras e instructoras de inglés en academias zona oriente. TOEIC avanzado muy valorado.", url: "https://www.indeed.com/jobs?q=maestro+ingles+instructor&l=Texcoco%2C+Estado+de+M%C3%A9xico", salario: "Ver en plataforma", relevancia: "Alta", match: 88 },
  { id: "p4", titulo: "Asistente Administrativa Bilingüe", empresa: "LinkedIn - CDMX Oriente", plataforma: "LinkedIn", modalidad: "Presencial", ubicacion: "Iztapalapa / CDMX Oriente", descripcion: "Asistentes administrativas bilingüe en empresas zona oriente CDMX. Coordinación y documentos.", url: "https://www.linkedin.com/jobs/search/?keywords=asistente+administrativa+bilingue&location=Iztapalapa%2C+Mexico+City", salario: "Ver en plataforma", relevancia: "Alta", match: 85 },
  { id: "p5", titulo: "Intérprete Bilingüe Presencial", empresa: "Indeed - Intérprete", plataforma: "Indeed", modalidad: "Presencial", ubicacion: "CDMX / Zona Oriente", descripcion: "Intérpretes bilingüe español-inglés para juzgados, despachos y empresas CDMX zona oriente.", url: "https://www.indeed.com/jobs?q=interprete+bilingue+español+ingles&l=Ciudad+de+Mexico&sort=date", salario: "Ver en plataforma", relevancia: "Alta", match: 92 },
  { id: "p6", titulo: "Asistente Bilingüe Despacho Jurídico", empresa: "LinkedIn - Despachos", plataforma: "LinkedIn", modalidad: "Presencial", ubicacion: "CDMX / Texcoco / Los Reyes", descripcion: "Despachos jurídicos zona oriente buscan asistentes bilingüe con experiencia legal.", url: "https://www.linkedin.com/jobs/search/?keywords=asistente+bilingue+despacho+juridico&location=Ciudad+de+Mexico", salario: "Ver en plataforma", relevancia: "Alta", match: 91 },
  { id: "p7", titulo: "Recepcionista / Asistente Bilingüe", empresa: "OCC - CDMX", plataforma: "OCC", modalidad: "Presencial", ubicacion: "Iztapalapa / CDMX Oriente", descripcion: "Recepcionistas y asistentes bilingüe en despachos, clínicas y empresas zona oriente.", url: "https://www.occ.com.mx/empleos/de-recepcionista-bilingue/?location=iztapalapa", salario: "Ver en plataforma", relevancia: "Alta", match: 85 },
  { id: "p8", titulo: "Coordinadora Bilingüe - Empresa Internacional", empresa: "OCC - Internacional", plataforma: "OCC", modalidad: "Presencial", ubicacion: "CDMX Oriente / Nezahualcóyotl", descripcion: "Coordinadoras bilingüe en empresas con operaciones internacionales zona oriente CDMX.", url: "https://www.occ.com.mx/empleos/de-coordinadora-bilingue/?location=nezahualcoyotl", salario: "Ver en plataforma", relevancia: "Alta", match: 88 },
  { id: "p9", titulo: "Traductora / Intérprete Bilingüe", empresa: "Computrabajo - Traducción", plataforma: "Computrabajo", modalidad: "Presencial", ubicacion: "CDMX / Zona Oriente", descripcion: "Traductoras e intérpretes bilingüe para empresas, clínicas y despachos zona oriente.", url: "https://www.computrabajo.com.mx/trabajo-de-traductora-interprete-bilingue?l=Ciudad+de+Mexico", salario: "Ver en plataforma", relevancia: "Alta", match: 89 },
  { id: "p10", titulo: "Secretaria Bilingüe - Zona Oriente", empresa: "Indeed - Secretaria", plataforma: "Indeed", modalidad: "Presencial", ubicacion: "Los Reyes La Paz / Chimalhuacán / Iztapalapa", descripcion: "Secretarias bilingüe en despachos, empresas y corporativos zona oriente CDMX y EDOMEX.", url: "https://www.indeed.com/jobs?q=secretaria+bilingue+ingles&l=Los+Reyes+la+Paz%2C+Estado+de+Mexico&sort=date", salario: "Ver en plataforma", relevancia: "Alta", match: 86 },
  { id: "p11", titulo: "Auxiliar Administrativo Bilingüe", empresa: "OCC - Admin", plataforma: "OCC", modalidad: "Presencial", ubicacion: "Iztapalapa / Texcoco / CDMX Oriente", descripcion: "Auxiliares administrativos bilingüe en empresas zona oriente. Manejo de documentos y atención.", url: "https://www.occ.com.mx/empleos/de-auxiliar-administrativo-bilingue/?location=iztapalapa", salario: "Ver en plataforma", relevancia: "Alta", match: 85 },
  { id: "p12", titulo: "Atención a Clientes Bilingüe Presencial", empresa: "Computrabajo - CS", plataforma: "Computrabajo", modalidad: "Presencial", ubicacion: "Nezahualcóyotl / Los Reyes / Texcoco", descripcion: "Atención a clientes bilingüe en empresas zona oriente. Inglés avanzado requerido.", url: "https://www.computrabajo.com.mx/trabajo-de-atencion-clientes-bilingue?l=Nezahualcoyotl%2C+Estado+de+Mexico", salario: "Ver en plataforma", relevancia: "Alta", match: 84 },
  { id: "p13", titulo: "HR Assistant Bilingüe - Zona Oriente", empresa: "Indeed - RH", plataforma: "Indeed", modalidad: "Presencial", ubicacion: "CDMX Oriente / Iztapalapa", descripcion: "Asistentes de RH bilingüe en empresas zona oriente. Experiencia en Hasbro valorada.", url: "https://www.indeed.com/jobs?q=asistente+recursos+humanos+bilingue+ingles&l=Iztapalapa%2C+Ciudad+de+Mexico&sort=date", salario: "Ver en plataforma", relevancia: "Alta", match: 83 },
  { id: "p14", titulo: "Teacher / Instructor Inglés - Academias", empresa: "Computrabajo - Academias", plataforma: "Computrabajo", modalidad: "Presencial", ubicacion: "Los Reyes La Paz / Chimalhuacán", descripcion: "Instructoras de inglés en academias de idiomas zona oriente EDOMEX. Horarios flexibles.", url: "https://www.computrabajo.com.mx/trabajo-de-instructor-ingles?l=Los+Reyes+la+Paz%2C+Estado+de+M%C3%A9xico", salario: "Ver en plataforma", relevancia: "Alta", match: 86 },
  { id: "p15", titulo: "Asistente Legal / Jurídica Presencial", empresa: "OCC - Legal Oriente", plataforma: "OCC", modalidad: "Presencial", ubicacion: "CDMX Oriente / Texcoco", descripcion: "Asistentes en despachos jurídicos zona oriente CDMX. Experiencia en documentos legales.", url: "https://www.occ.com.mx/empleos/de-asistente-juridica/?location=iztapalapa", salario: "Ver en plataforma", relevancia: "Alta", match: 88 },
  { id: "p16", titulo: "Docente Inglés / Coordinadora Educativa", empresa: "Bumeran - Oriente", plataforma: "Bumeran", modalidad: "Presencial", ubicacion: "Texcoco / Los Reyes / Chimalhuacán", descripcion: "Docentes y coordinadoras en instituciones educativas zona oriente Estado de México.", url: "https://www.bumeran.com.mx/empleos-trabajo-de-docente-ingles-estado-de-mexico.html", salario: "Ver en plataforma", relevancia: "Media", match: 80 },
  { id: "p17", titulo: "Empleos Locales - Google Jobs Oriente", empresa: "Google Jobs", plataforma: "Google", modalidad: "Presencial", ubicacion: "Texcoco / Los Reyes / Iztapalapa", descripcion: "Google agrega vacantes de todas las bolsas. Asistente bilingüe y maestra inglés zona oriente.", url: "https://www.google.com/search?q=empleo+asistente+bilingue+maestra+ingles+texcoco+los+reyes+iztapalapa&ibp=htl;jobs", salario: "Ver en plataforma", relevancia: "Alta", match: 92 },
  { id: "p18", titulo: "Empleos Locales - Facebook Grupos", empresa: "Facebook Grupos", plataforma: "Facebook", modalidad: "Presencial", ubicacion: "Texcoco / Los Reyes / Iztapalapa", descripcion: "Grupos locales de empleo en Facebook zona oriente. Búsqueda directa en comunidades locales.", url: "https://www.facebook.com/groups/search/results/?q=empleo+bilingue+ingles+texcoco+los+reyes", salario: "Ver en plataforma", relevancia: "Alta", match: 85 },
];

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    const favoritos = await redis.get("favoritos") || [];
    const kanban = await redis.get("kanban") || { interesante: [], aplicada: [], proceso: [], rechazada: [] };
    return res.status(200).json({ favoritos, kanban });
  }

  if (method === "POST") {
    const { action, data } = req.body;

    if (action === "search") {
      const { tipo } = data;
      let vacantes;
      if (tipo === "presencial") vacantes = VACANTES_PRESENCIAL;
      else if (tipo === "casa") vacantes = [...VACANTES_PRESENCIAL, ...VACANTES_REMOTO.filter(v => v.match >= 85)];
      else vacantes = VACANTES_REMOTO;
      return res.status(200).json({ vacantes: vacantes.sort((a, b) => b.match - a.match) });
    }

    if (action === "toggle_favorito") {
      const { id } = data;
      let favoritos = await redis.get("favoritos") || [];
      favoritos = favoritos.includes(id) ? favoritos.filter(f => f !== id) : [...favoritos, id];
      await redis.set("favoritos", favoritos);
      return res.status(200).json({ favoritos });
    }

    if (action === "kanban_move") {
      const { id, columna, titulo, empresa, url } = data;
      let kanban = await redis.get("kanban") || { interesante: [], aplicada: [], proceso: [], rechazada: [] };
      Object.keys(kanban).forEach(k => { kanban[k] = kanban[k].filter(v => v.id !== id); });
      if (columna) kanban[columna] = [...(kanban[columna] || []), { id, titulo, empresa, url }];
      await redis.set("kanban", kanban);
      return res.status(200).json({ kanban });
    }

    if (action === "carta") {
      const { vacante } = data;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Escribe una carta de presentación profesional en inglés para Rocío Sánchez aplicando a: "${vacante.titulo}" en "${vacante.empresa}".
Perfil: Paralegal/Legal Assistant bilingüe español-inglés 10+ años. Especialista Derecho Migratorio EE.UU. (Removal Defense, Asylum I-589, 42B, I-360, I-765, USCIS, EOIR) y Propiedad Intelectual (patentes, diseños industriales). Empresas: New Frontier Immigration Law, Aguila Immigration Services, ClarkeModet México, Hasbro México RH. TOEIC 920/990. Licenciatura Pedagogía UNAM. Diplomado Capacitación Organizacional.
3 párrafos, profesional, personalizada. Solo la carta.`
          }]
        })
      });
      const ai = await response.json();
      const carta = ai.content?.[0]?.text || "";
      return res.status(200).json({ carta });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
