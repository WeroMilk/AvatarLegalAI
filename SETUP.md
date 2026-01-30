# Guía de Configuración - AVATAR Legal AI

## 🚀 Pasos para Configurar el Proyecto

### 1. Instalación de Dependencias

```bash
npm install
```

### 2. Configuración de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Habilita Authentication (Email/Password y Google)
4. Crea una base de datos Firestore
5. Copia las credenciales de configuración
6. Para Firebase Admin, genera una clave privada de servicio desde Configuración del Proyecto > Cuentas de Servicio

### 3. Configuración de Stripe

1. Crea una cuenta en [Stripe](https://stripe.com/)
2. Obtén tus API keys desde el Dashboard
3. Configura webhooks para recibir notificaciones de pagos (opcional pero recomendado)

### 4. Configuración de OpenAI

1. Crea una cuenta en [OpenAI](https://platform.openai.com/)
2. Genera una API key desde tu dashboard
3. Asegúrate de tener créditos disponibles

### 5. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id

# Firebase Admin
FIREBASE_CLIENT_EMAIL=tu_client_email
FIREBASE_PRIVATE_KEY=tu_private_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu_publishable_key
STRIPE_SECRET_KEY=tu_secret_key

# OpenAI
OPENAI_API_KEY=tu_openai_key
```

### 6. Configuración de Firestore

Crea las siguientes colecciones en Firestore:
- `documents` - Para almacenar los documentos generados

Reglas de seguridad recomendadas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /documents/{documentId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### 7. Ejecutar el Proyecto

```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:3000`

## 📦 Deploy en Vercel

1. Conecta tu repositorio de GitHub con Vercel
2. Agrega todas las variables de entorno en la configuración de Vercel
3. Vercel detectará automáticamente Next.js y desplegará el proyecto

## 🔧 Comandos Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Ejecuta la aplicación en modo producción
- `npm run lint` - Ejecuta el linter

## 📝 Notas Importantes

- Asegúrate de que todas las variables de entorno estén configuradas correctamente
- Firebase Admin requiere configuración adicional para funcionar en producción
- Stripe funciona en modo test con claves de prueba
- OpenAI requiere créditos en tu cuenta para generar documentos
