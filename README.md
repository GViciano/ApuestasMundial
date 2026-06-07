# Mundial Apuestas 2026 🏆

App de apuestas para el Mundial entre amigos. Backend en Supabase, frontend en Netlify. **Totalmente gratis.**

---

## Puesta en marcha (15 minutos)

### PASO 1 — Crear la base de datos en Supabase

1. Ve a **https://supabase.com** y crea una cuenta gratuita
2. Haz clic en **"New project"**
   - Ponle un nombre (ej: `mundial-apuestas`)
   - Elige una región europea (ej: `West EU`)
   - Escribe una contraseña para la base de datos (guárdala, aunque no la necesitarás luego)
   - Clic en **"Create new project"** y espera ~2 minutos
3. Una vez creado, ve a **SQL Editor** (menú izquierdo)
4. Haz clic en **"New query"**
5. Copia y pega todo el contenido del archivo `supabase_schema.sql` y haz clic en **"Run"**
   - Verás "Success" si todo va bien
6. Ahora ve a **Project Settings > API** (icono de engranaje abajo a la izquierda)
7. Apunta estos dos valores:
   - **Project URL** → algo como `https://abcdefgh.supabase.co`
   - **anon public key** → una cadena larga que empieza por `eyJ...`

---

### PASO 2 — Subir el código a GitHub

1. Ve a **https://github.com** y crea una cuenta si no tienes
2. Crea un **nuevo repositorio** (clic en `+` > `New repository`)
   - Nombre: `mundial-apuestas`
   - Público o privado, da igual
   - Clic en **"Create repository"**
3. En tu ordenador, abre la carpeta del proyecto y ejecuta en terminal:

```bash
cd mundial-apuestas
git init
git add .
git commit -m "primera versión"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/mundial-apuestas.git
git push -u origin main
```

> Si no tienes Git instalado: descárgalo en https://git-scm.com

---

### PASO 3 — Desplegar en Netlify

1. Ve a **https://netlify.com** y crea una cuenta gratuita (puedes entrar con GitHub)
2. Clic en **"Add new site" > "Import an existing project"**
3. Elige **GitHub** y selecciona el repositorio `mundial-apuestas`
4. Configuración de build:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Antes de hacer deploy, clic en **"Environment variables"** y añade:
   - `VITE_SUPABASE_URL` → la URL de tu proyecto Supabase
   - `VITE_SUPABASE_ANON_KEY` → la anon key de Supabase
6. Clic en **"Deploy site"**
7. En ~2 minutos tendrás una URL del tipo `https://nombre-aleatorio.netlify.app`

¡Ya está online! Puedes cambiar el nombre del dominio en Netlify > Site settings > Domain management.

---

## Uso

### Usuario admin
- Usuario: `admin` | Contraseña: `admin123`
- **Cámbiala** desde Settings creando un nuevo usuario admin y borrando el default
- El admin introduce los resultados reales después de cada partido
- El admin puede crear/eliminar usuarios y configurar los puntos

### Jugadores
- Cada amigo se registra solo con su usuario y contraseña
- O el admin les crea la cuenta desde Settings
- Pueden apostar hasta 1 minuto antes de que empiece cada partido

### Sistema de puntos (configurable)
| Acierto | Puntos por defecto |
|---------|-------------------|
| Resultado correcto (ganador o empate) | 3 pts |
| Primer goleador correcto | 2 pts |
| Minuto del primer gol exacto | 1 pt |

---

## Estructura del proyecto

```
mundial-apuestas/
├── src/
│   ├── components/
│   │   ├── Login.jsx        # Pantalla de login/registro
│   │   ├── MatchCard.jsx    # Tarjeta de cada partido
│   │   ├── Ranking.jsx      # Clasificación de jugadores
│   │   └── Settings.jsx     # Config de admin
│   ├── App.jsx              # Componente principal
│   ├── data.js              # Datos partidos y helpers
│   ├── supabase.js          # Cliente Supabase
│   └── index.css            # Estilos globales
├── supabase_schema.sql      # SQL para crear las tablas
├── netlify.toml             # Config de Netlify
└── .env.example             # Variables de entorno de ejemplo
```

---

## Preguntas frecuentes

**¿Es gratis?**  
Sí. Supabase free tier incluye 500 MB de base de datos y 50.000 filas (más que suficiente). Netlify free tier incluye hosting ilimitado para sitios estáticos.

**¿Los datos son seguros?**  
Para un grupo de amigos es suficiente. Las contraseñas se guardan en base64 (no encriptadas). Si quisieras más seguridad habría que usar bcrypt + JWT, pero para este uso no es necesario.

**¿Puedo añadir más partidos (octavos, cuartos...)?**  
Sí, edita el archivo `src/data.js` y añade más grupos/partidos siguiendo el mismo formato.
