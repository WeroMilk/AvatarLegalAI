# 🚀 Configuración de GitHub y Deploy

**Estado:** El proyecto está listo para subir a GitHub y desplegar en Vercel. El comando `npm run build` pasa correctamente (ESLint y TypeScript sin errores).

**Repositorio:** [WeroMilk/AvatarLegalAI](https://github.com/WeroMilk/AvatarLegalAI)

## Opción rápida: script automático

En la carpeta del proyecto, abre PowerShell y ejecuta:

```powershell
.\push-to-github.ps1
```

(Asegúrate de tener [Git instalado](https://git-scm.com/download/win) y de haber configurado SSH con GitHub, o edita el script y cambia `$repoUrl` por `$httpsUrl` para usar HTTPS.)

## Pasos manuales para Subir a GitHub

### 1. Repositorio en GitHub

El repositorio ya está creado: [https://github.com/WeroMilk/AvatarLegalAI](https://github.com/WeroMilk/AvatarLegalAI). Si lo creaste vacío, no inicialices con README (este proyecto ya tiene README y .gitignore).

### 2. En la carpeta del proyecto (PowerShell o Git Bash)

```bash
# Inicializar git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Initial commit: Avatar Legal AI"

# Remote (SSH)
git remote add origin git@github.com:WeroMilk/AvatarLegalAI.git

# O con HTTPS (si no usas SSH):
# git remote add origin https://github.com/WeroMilk/AvatarLegalAI.git

# Rama main
git branch -M main

# Subir
git push -u origin main
```

### 3. Configurar Vercel con GitHub

1. Ve a [Vercel](https://vercel.com) e inicia sesión
2. Haz clic en "Add New Project"
3. Selecciona "Import Git Repository"
4. Conecta tu cuenta de GitHub si es necesario
5. Selecciona el repositorio `avatar-legal-ai`
6. Vercel detectará automáticamente Next.js
7. Configura las variables de entorno:
   - Agrega todas las variables del archivo `.env.example`
   - Puedes copiarlas desde tu `.env.local` local
8. Haz clic en "Deploy"

### 4. Configurar Variables de Entorno en Vercel

En el dashboard de Vercel, ve a:
- Settings → Environment Variables

Agrega todas estas variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
OPENAI_API_KEY
```

### 5. Configurar Dominio Personalizado (Opcional)

1. En Vercel, ve a Settings → Domains
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para configurar DNS

### 6. Configurar Webhooks de Stripe (Recomendado)

1. En el dashboard de Stripe, ve a Developers → Webhooks
2. Agrega endpoint: `https://tu-dominio.vercel.app/api/webhooks/stripe`
3. Selecciona eventos: `checkout.session.completed`
4. Copia el "Signing secret" y agrégalo como variable de entorno en Vercel

## Comandos Git Útiles

```bash
# Ver estado de los archivos
git status

# Agregar archivos específicos
git add archivo.ts

# Hacer commit
git commit -m "Descripción del cambio"

# Subir cambios
git push

# Crear nueva rama
git checkout -b nombre-rama

# Cambiar de rama
git checkout main

# Ver historial
git log

# Deshacer cambios locales
git checkout -- archivo.ts
```

## Flujo de Trabajo Recomendado

1. **Crear una rama para nuevas features**:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

2. **Hacer cambios y commits**:
   ```bash
   git add .
   git commit -m "Agregar nueva funcionalidad"
   ```

3. **Subir la rama**:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```

4. **Crear Pull Request en GitHub**:
   - Ve a GitHub
   - Crea un Pull Request desde tu rama hacia `main`
   - Revisa los cambios
   - Haz merge cuando esté listo

5. **Vercel desplegará automáticamente** cuando hagas merge a `main`

## Notas Importantes

- ⚠️ **NUNCA** subas el archivo `.env.local` a GitHub
- ✅ El archivo `.gitignore` ya está configurado para ignorar archivos sensibles
- ✅ Vercel desplegará automáticamente cada vez que hagas push a `main`
- ✅ Puedes ver los logs de deploy en el dashboard de Vercel
- ✅ Las variables de entorno deben configurarse en Vercel, no en el código
