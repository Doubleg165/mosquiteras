# mosquiteras

Calculador en español, adaptable a móviles, sin dependencias de instalación.

## Desarrollo

Requiere Python 3 y Node.js 18+ para las pruebas.

- `npm start`: sirve la aplicación en el puerto 3000.
- `npm test`: valida los límites del catálogo, selección de tramos, precios pendientes, cantidades e IVA.

## Catálogo

Fuente: `LISTA PRECIOS MOSQUITERAS 2025.pdf`, proporcionado por el usuario. Las medidas se introducen como milímetros enteros positivos. No se inventa un mínimo de fabricación: medidas inferiores al primer tramo se asignan a ese tramo y quedan sujetas a confirmación comercial.

| Familia | Modelo | Máximo ancho × alto (mm) | Página |
| --- | --- | --- | --- |
| Plisada 22 mm | 1 hoja | 1600 × 2550 | 1 |
| Plisada 22 mm | Doble bilateral | 3000 × 2800 | 1 |
| Plisada 22 mm | Doble central | 3200 × 2550 | 1 |
| Plisada MT 40 | 1 hoja | 1600 × 3000 | 1 |
| Plisada MT 40 | Doble central y/o lateral | 3200 × 3000 | 2 |
| Plisada MT 40 | Triple lateral | 4800 × 3000 | 2 |
| Enrollable | Vertical | 2000 × 2400 | 3 |
| Enrollable | Corredizas / puerta simple | 1500 × 2500 | 3 |
| Enrollable | Puerta doble | 2700 × 2500 | 3 |

Los ejes de las tablas enrollables no están rotulados en el PDF. Se interpreta vertical: columnas = ancho, filas = alto; puertas: filas = ancho, columnas = alto. Interpretación confirmada por el usuario durante la adaptación del catálogo.

`catalog.js` contiene 310 combinaciones de tramos: 23 de plisadas y 287 de enrollables. Se selecciona el tramo de menor superficie que cubra ambas medidas, sin girarlas. Cada precio corresponde al tramo por unidad, sin mínimo inventado de m² ni interpolación de precios.

## Precios del PDF

`prices.js` incluye las 310 tarifas del PDF de 2025 en USD por unidad, sin IVA. Se cargan automáticamente en cualquier navegador. Se pueden editar o vaciar en pantalla; vaciar una tarifa la deja pendiente. Los cambios locales prevalecen sobre las tarifas del PDF. Si alguna línea no tiene precio, el total queda pendiente.

Se conserva el valor de USD 153 para la enrollable vertical de 2000 × 2200 mm tal como aparece en el documento, aunque podría ser una errata por ser menor que algunos tramos inferiores. Confirmar con el proveedor antes de usar ese tramo.

Las modificaciones de tarifas se conservan en localStorage en este navegador. No se sincronizan con otros dispositivos ni se suben a GitHub. Las tarifas originales sí están incluidas en el código. Las líneas ya añadidas conservan su tarifa: para aplicar un precio cambiado hay que eliminar la línea y añadirla de nuevo. Los presupuestos se vacían al recargar. No hay backend.

El PDF indica dólares y precios sin IVA; no indica el porcentaje. La interfaz permite ajustar el IVA (21% inicial pendiente de confirmar). No se aplican recargos inventados por color ni descuentos: se consultan con el vendedor. Se admite un texto libre de color deseado. No incluye instalación ni envío.

Permite imprimir o guardar PDF desde el navegador, incluso una selección con precios pendientes. Tipografías externas opcionales con fuentes locales de respaldo.

## Identidad visual

Logo original de Aluplexa extraído sin modificaciones del PDF proporcionado, conservado en `assets/aluplexa-logo.png`. Interfaz con verde, negro y blanco de la identidad visible en el logo; tipografía del sistema sin descargas externas. Se incluyen vistas móviles y estilos de impresión. La web de la marca no pudo consultarse por restricciones de red durante esta adaptación; el diseño se basa en el material de marca del PDF, sin afirmar que reproduce la web actual.
