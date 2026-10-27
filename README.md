# mosquiteras
Calculador de presupuestos en español, adaptable a móviles y sin dependencias de instalación.

## Desarrollo

Requiere Python 3 y Node.js 18+ para las pruebas.

- `npm start`: sirve la aplicación en el puerto 3000.
- `npm test`: verifica cálculo de superficie, mínimo facturable, acabados, cantidades e IVA.

Tarifas iniciales de ejemplo: fija 45 €/m², enrollable 75 €/m², corredera 60 €/m². Editables en pantalla, guardadas en el navegador. Superficie mínima: 1 m² por unidad; antracita +15%, madera +25%; IVA 21%. Las líneas ya añadidas conservan su tarifa. Medidas admitidas: 20–300 cm; cantidades: 1–100.

Permite añadir y eliminar líneas e imprimir o guardar el presupuesto como PDF desde el navegador. No incluye envío ni instalación. Los presupuestos son temporales y se vacían al recargar. No hay backend ni se envían datos a un servidor. Las tipografías de Google son opcionales: hay fuentes locales de respaldo.
