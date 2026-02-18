# Análisis de Requisitos — CryptoInvestment

## 1. Contexto del Proyecto

CryptoInvestment es un grupo de inversores en criptomonedas que necesita una aplicación web consolidada para seguir el rendimiento de un conjunto personalizado de criptomonedas, reemplazando el uso disperso de hojas de cálculo y múltiples sitios web.

---

## 2. Requisitos Funcionales (RF)

| ID    | Requisito | Descripción | Prioridad |
|-------|-----------|-------------|-----------|
| RF-01 | Agregar criptomonedas | El usuario puede buscar y agregar criptomonedas por símbolo (ej. BTC, ETH, USDT) a su lista personalizada. | Alta |
| RF-02 | Listar criptomonedas | El sistema muestra una tabla con todas las criptomonedas agregadas, incluyendo nombre, símbolo, precio actual en USD, cambio porcentual en 24h y volumen en 24h. | Alta |
| RF-03 | Visualizar historial de precios | Al seleccionar una criptomoneda, se muestra una gráfica con el historial de precios en un rango de tiempo configurable (1 hora, 1 día, 7 días, 30 días). | Alta |
| RF-04 | Seleccionar rango de tiempo | El usuario puede cambiar el rango temporal de la gráfica de historial entre: última hora, hoy, última semana y último mes. | Alta |
| RF-05 | Actualización automática de precios | Los precios se actualizan automáticamente sin necesidad de recargar la página: cada 5 minutos en el servidor (API CoinMarketCap) y cada 30 segundos en el cliente (consulta al backend). | Alta |
| RF-06 | Persistencia de datos | Todos los snapshots de precios se almacenan en base de datos PostgreSQL, permitiendo consultas históricas sobre datos acumulados en el tiempo. | Alta |
| RF-07 | Paginación de la tabla | La tabla de criptomonedas permite paginación con opciones de 5, 10 o 25 elementos por página. | Media |
| RF-08 | Indicadores visuales de rendimiento | Los cambios porcentuales se muestran con colores (verde para positivo, rojo para negativo) y la gráfica cambia de color según el rendimiento del período. | Media |
| RF-09 | Resumen del dashboard | Se muestran tarjetas resumen con el total de criptomonedas monitoreadas y la hora de última actualización. | Baja |

---

## 3. Requisitos No Funcionales (RNF)

| ID     | Requisito | Descripción | Categoría |
|--------|-----------|-------------|-----------|
| RNF-01 | Single Page Application | La aplicación funciona en una sola página con cambios dinámicos sin recarga del navegador (SPA con React). | Usabilidad |
| RNF-02 | Diseño responsivo | La interfaz se adapta a diferentes resoluciones y dispositivos (móvil, tablet, escritorio) mediante CSS responsive con media queries. | Usabilidad |
| RNF-03 | Tiempo de respuesta | Las consultas al backend deben responder en menos de 2 segundos bajo condiciones normales de operación. | Rendimiento |
| RNF-04 | Actualización en tiempo real | El sistema actualiza los datos periódicamente sin intervención del usuario (polling automático). | Rendimiento |
| RNF-05 | Persistencia y durabilidad | Los datos se almacenan en PostgreSQL con Docker, garantizando persistencia mediante volúmenes Docker. | Confiabilidad |
| RNF-06 | Escalabilidad de datos | El modelo de datos permite acumular snapshots de precios indefinidamente para análisis histórico a largo plazo. | Escalabilidad |
| RNF-07 | Seguridad de API keys | Las claves de API de CoinMarketCap se manejan mediante variables de entorno (.env) y no se exponen en el código fuente. | Seguridad |
| RNF-08 | Mantenibilidad | El código sigue una arquitectura por capas (Controller → Service → Repository) en el backend y componentes reutilizables en el frontend. | Mantenibilidad |
| RNF-09 | Portabilidad | La base de datos se ejecuta en contenedores Docker, facilitando el despliegue en cualquier entorno. | Portabilidad |
| RNF-10 | Accesibilidad | La interfaz utiliza atributos ARIA (aria-label, aria-live, role) para mejorar la accesibilidad. | Usabilidad |

---

## 4. Tecnologías utilizadas

| Componente | Tecnología |
|------------|------------|
| Frontend | React + TypeScript | 19.x |
| Build tool | Vite |
| Gráficos | Recharts | Última |
| Backend | Node.js + Express |
| Base de datos | PostgreSQL |
| Contenedores | Docker Compose |
| API externa | CoinMarketCap API |
| Control de versiones | Git + GitHub |
