# TodoApp Frontend - Angular

Aplicación frontend construida con **Angular 19** para gestión de tareas, integrada con la API TodoAppApi.

## 🏗️ Arquitectura

### Estructura Modular
```
src/app/
├── core/                    # Servicios core, modelos, guards, interceptors
│   ├── guards/
│   ├── interceptors/
│   ├── models/
│   └── services/
├── features/               # Módulos de funcionalidades (lazy loading)
│   ├── auth/              # Login y registro
│   ├── dashboard/         # Panel principal
│   └── tasks/             # Gestión de tareas
├── shared/                # Componentes y servicios compartidos
│   ├── components/modal/
│   ├── models/
│   └── services/
└── store/                 # NgRx State Management
    ├── auth/
    ├── tasks/
    └── index.ts
```

## ✨ Características Implementadas

### Autenticación
- ✅ Login y registro de usuarios
- ✅ Guardas de rutas (authGuard, loginGuard)
- ✅ Interceptor JWT automático
- ✅ Persistencia de sesión en localStorage
- ✅ Validación de formularios con ReactiveFormsModule

### Dashboard
- ✅ Estadísticas de tareas (total, completadas, pendientes)
- ✅ Gráfico de progreso visual
- ✅ Diseño responsivo con gradientes modernos

### Gestión de Tareas
- ✅ Lista de tareas con trackBy para optimización
- ✅ Filtros: Todas, Completadas, Pendientes
- ✅ Crear, editar, eliminar tareas
- ✅ Marcar tareas como completadas/pendientes
- ✅ Prioridades: Alta, Media, Baja
- ✅ Fechas de vencimiento
- ✅ Indicadores visuales de tareas vencidas

### Sistema de Modales
- ✅ Modal reutilizable para confirmaciones
- ✅ Tipos: success, error, warning, info, confirm
- ✅ Animaciones suaves
- ✅ Diseño responsive

## 🛠️ Tecnologías

- **Angular 19** con Standalone Components
- **NgRx** (Store, Effects, Entity, DevTools)
- **RxJS** para programación reactiva
- **TypeScript** con tipado estricto
- **CSS3** con diseño responsive
- **FluentValidation** para validaciones

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ y npm
- Angular CLI (`npm install -g @angular/cli`)
- API TodoAppApi corriendo en `https://localhost:5001`

### Pasos

1. **Instalar dependencias**
   ```bash
   cd TodoAppFrontend
   npm install
   ```

2. **Configurar URL de la API**
   
   Editar `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'https://localhost:5001/api'  // Ajustar si es necesario
   };
   ```

3. **Ejecutar la aplicación**
   ```bash
   ng serve
   ```
   
   La aplicación estará en `http://localhost:4200`

4. **Compilar para producción**
   ```bash
   ng build --configuration production
   ```

## 🎯 Principios Aplicados

### Modularización
- Separación de funcionalidades en módulos con lazy loading
- Core module para servicios singleton
- Shared module para componentes reutilizables

### NgRx State Management
- **Actions**: Eventos del sistema
- **Reducers**: Actualización inmutable del estado
- **Effects**: Efectos secundarios (llamadas HTTP)
- **Selectors**: Derivación de estado
- **Entity**: Gestión optimizada de colecciones

### Optimizaciones
- `trackBy` en listas para rendering eficiente
- Lazy loading de rutas
- Standalone components
- OnPush change detection (potencial mejora)

### Responsive Design
- Mobile-first approach
- Breakpoints: 480px, 768px
- Flexbox y CSS Grid
- Diseño adaptativo

## 📱 Uso de la Aplicación

### 1. Login
- URL: `http://localhost:4200/auth/login`
- Credenciales de prueba:
  - Usuario: `admin` / Contraseña: `admin123`
  - Usuario: `demo` / Contraseña: `demo123`

### 2. Dashboard
- Ver estadísticas de tareas
- Progreso visual
- Acceso rápido a tareas

### 3. Gestión de Tareas
- Crear nueva tarea con el botón "+ Nueva Tarea"
- Filtrar por estado (Todas, Completadas, Pendientes)
- Marcar como completada clickeando el checkbox
- Editar tarea con el botón ✏️
- Eliminar con confirmación con el botón 🗑️

### 4. Modales
- Confirmación antes de eliminar
- Notificaciones de éxito/error
- Mensajes informativos

## 🧪 Testing

Los tests están configurados con Jasmine y Karma:

```bash
# Ejecutar tests unitarios
ng test

# Tests con cobertura
ng test --code-coverage

# Tests en modo CI
ng test --watch=false --browsers=ChromeHeadless
```

## 📝 Estructura de Estado (NgRx)

### Auth State
```typescript
{
  user: { username, email } | null,
  token: string | null,
  loading: boolean,
  error: string | null
}
```

### Tasks State
```typescript
{
  ids: number[],
  entities: { [id: number]: Task },
  loading: boolean,
  error: string | null,
  filter: 'all' | 'completed' | 'pending'
}
```

## 🎨 Paleta de Colores

- **Primario**: Gradiente púrpura (`#667eea` → `#764ba2`)
- **Éxito**: `#22c55e`
- **Error**: `#ef4444`
- **Advertencia**: `#f59e0b`
- **Info**: `#3b82f6`
- **Fondo**: `#f5f7fa`

## 🚀 Características Avanzadas

- **Interceptor HTTP**: Inyección automática del token JWT
- **Guards**: Protección de rutas basada en autenticación
- **Effects**: Gestión de side effects con RxJS
- **Selectors**: Memoización de consultas derivadas
- **DevTools**: Integración con Redux DevTools para debugging

## 📄 Scripts Disponibles

```json
{
  "start": "ng serve",
  "build": "ng build",
  "watch": "ng build --watch --configuration development",
  "test": "ng test"
}
```

## 🔐 Seguridad

- Token JWT almacenado en localStorage
- Interceptor para headers de autorización
- Guards para protección de rutas
- Validación de formularios en cliente
- Sanitización de entradas

## 🌐 Compatibilidad

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📞 Soporte

Para problemas o preguntas, revisar:
1. Consola del navegador para errores
2. Redux DevTools para estado de NgRx
3. Network tab para llamadas a la API
4. Verificar que la API esté corriendo

---

**Desarrollado con Angular 19 y mucho ☕**
