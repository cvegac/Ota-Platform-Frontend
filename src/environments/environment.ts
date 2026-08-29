// Entorno de PRODUCCION (build por defecto).
// API_URL vacio => las llamadas salen al mismo host que sirve la web (el ALB),
// que enruta /api, /auth, /iot, /s3, /lambda, /platform y /actuator al BackEnd.
// Sin CORS y sin acoplar el dominio del backend al build.
export const environment = {
  production: true,
  API_URL: '',
};
