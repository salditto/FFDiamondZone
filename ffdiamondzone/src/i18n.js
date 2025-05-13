import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // Carga traducciones usando http backend (desde /public/locales)
  .use(Backend)
  // Detecta idioma del usuario
  .use(LanguageDetector)
  // Pasa la instancia de i18n a react-i18next.
  .use(initReactI18next)
  // Inicializa i18next
  .init({
    // Idioma por defecto si la detección falla o el idioma no está soportado
    fallbackLng: 'en',
    debug: true, // Activar logs en desarrollo
    
    // Idiomas soportados
    supportedLngs: ['en', 'es'],

    interpolation: {
      escapeValue: false, // No es necesario para react ya que escapa por defecto
    },
    
    backend: {
      // Ruta para cargar las traducciones
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    detection: {
      // Orden y métodos de detección de idioma
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['cookie', 'localStorage'], // Dónde guardar el idioma detectado/seleccionado
    }
  });

export default i18n; 