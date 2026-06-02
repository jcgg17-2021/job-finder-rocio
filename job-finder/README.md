# Buscador de Empleo · Rocío Sánchez

## Deploy en Vercel

### 1. Sube a GitHub
```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/TU_USUARIO/job-finder-rocio.git
git push -u origin main
```

### 2. Conecta en Vercel
- Entra a vercel.com
- "Add New Project"
- Importa el repo de GitHub
- En "Environment Variables" agrega:
  - Key: `ANTHROPIC_API_KEY`
  - Value: tu API key de Anthropic (https://console.anthropic.com)
- Click Deploy

### 3. Listo
Vercel te da un link público tipo `https://job-finder-rocio.vercel.app`
