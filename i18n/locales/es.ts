export const es = {
  "common": {
    "login": "Iniciar Sesión",
    "register": "Registrarse",
    "logout": "Cerrar Sesión",
    "dashboard": "Chat",
    "memory": "Base de Memoria",
    "billing": "Facturación",
    "settings": "Configuración",
    "save": "Guardar",
    "cancel": "Cancelar",
    "email": "Correo Electrónico",
    "password": "Contraseña",
    "name": "Nombre Completo",
    "submit": "Enviar",
    "status": "Estado",
    "actions": "Acciones"
  },
  "auth": {
    "welcomeBack": "Bienvenido de nuevo",
    "createAccount": "Crear una cuenta",
    "forgotPassword": "¿Olvidaste tu contraseña?",
    "haveAccount": "¿Ya tienes una cuenta?",
    "noAccount": "¿No tienes una cuenta?",
    "secureLogin": "Inicio seguro vía estándares OWASP"
  },
  "chat": {
    "placeholder": "Pregunta algo usando tu memoria infinita...",
    "thinking": "Pensando...",
    "contextUsed": "Contexto Usado",
    "noveltyDetected": "Novedad Detectada",
    "training": "Entrenando Adaptador (Hot-Training)...",
    "trainingComplete": "Memoria Actualizada"
  },
  "memory": {
    "title": "Grafo de Conocimiento y Archivos",
    "description": "Ingesta datos de múltiples fuentes. Todo se vectoriza y guarda en SurrealDB como un grafo de contexto estándar.",
    "files": "Archivos",
    "text": "Texto Plano",
    "url": "URL Web",
    "integrations": "Integraciones",
    "adapters": "Adaptadores Neuronales (LoRA)",
    "uploadFile": "Subir Archivo",
    "enterText": "Ingresar Información",
    "enterUrl": "Ingresar URL del Sitio",
    "add": "Agregar a Memoria",
    "filesList": "Base de Conocimiento Ingestada",
    "noFiles": "No hay fuentes de conocimiento agregadas aún.",
    "connect": "Conectar",
    "connected": "Sincronizado",
    "createAdapter": "Crear Adaptador",
    "adapterName": "Nombre del Adaptador",
    "trainNow": "Entrenar Ahora",
    "delete": "Eliminar",
    "deleteConfirm": "¿Seguro que deseas eliminar este adaptador?",
    "entities": "Entidades Extraídas",
    "relations": "Conexiones de Grafo",
    "sources": {
      "gdrive": "Google Drive",
      "onedrive": "OneDrive",
      "notion": "Notion",
      "web": "Web Scraper"
    },
    "placeholders": {
        "textTitle": "Título (ej. Notas de reunión)",
        "textContent": "Pega el contenido aquí...",
        "url": "https://ejemplo.com/articulo"
    }
  },
  "billing": {
    "currentBalance": "Créditos Actuales",
    "history": "Historial de Transacciones",
    "addCredits": "Agregar Créditos",
    "date": "Fecha",
    "amount": "Monto",
    "description": "Descripción",
    "status": "Estado"
  },
  "settings": {
      "title": "Gestión de API y Uso",
      "description": "Administra tus llaves API, monitorea el uso de tokens y ve los registros del sistema.",
      "createKey": "Crear Nueva Llave",
      "keyName": "Nombre de la Llave",
      "permissions": "Permisos (Scopes)",
      "scopes": {
        "readFull": "Lectura Completa (Memoria Total)",
        "write": "Escritura (Ingesta)",
        "readEpistemic": "Lectura: Solo Hechos (Privacidad)",
        "readOperational": "Lectura: Solo Instrucciones"
      },
      "tokensUsed": "Tokens Usados",
      "created": "Creada",
      "revoke": "Revocar",
      "logs": "Registros de API",
      "endpoint": "Endpoint",
      "method": "Método",
      "latency": "Latencia",
      "timestamp": "Timestamp"
  }
};