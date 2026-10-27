// Fuente: LISTA PRECIOS MOSQUITERAS 2025.pdf. Medidas en mm.
// Tarifas del PDF en prices.js. Ejes de enrollables confirmados por el usuario.
const bands = pairs => pairs.map(([width, height]) => ({ width, height }));
const grid = (widths, heights) => widths.flatMap(width => heights.map(height => ({ width, height })));
const sequence = (start, end, step) => Array.from({ length: (end - start) / step + 1 }, (_, i) => start + i * step);
export const catalog = [
 { id: 'p22-single', family: 'Plisada 22 mm', name: '1 hoja', page: 1, bands: bands([[1600,2150],[1600,2350],[1600,2550]]) },
 { id: 'p22-bilateral', family: 'Plisada 22 mm', name: 'Doble bilateral', page: 1, bands: bands([[2400,2150],[2400,2350],[2400,2550],[3000,2550],[3000,2800]]) },
 { id: 'p22-central', family: 'Plisada 22 mm', name: 'Doble central', page: 1, bands: bands([[3200,2150],[3200,2350],[3200,2550]]) },
 { id: 'mt40-single', family: 'Plisada MT 40', name: '1 hoja', page: 1, bands: bands([2200,2500,2700,3000].map(h => [1600,h])) },
 { id: 'mt40-double', family: 'Plisada MT 40', name: 'Doble central y/o lateral', page: 2, bands: bands([2200,2500,2700,3000].map(h => [3200,h])) },
 { id: 'mt40-triple', family: 'Plisada MT 40', name: 'Triple lateral', page: 2, bands: bands([2200,2500,2700,3000].map(h => [4800,h])) },
 { id: 'roller-vertical', family: 'Enrollable', name: 'Vertical', page: 3, bands: grid(sequence(800,2000,100), sequence(800,2400,100)) },
 { id: 'roller-single', family: 'Enrollable', name: 'Para corredizas / puerta simple', page: 3, bands: grid([900,1100,1300,1500], sequence(2000,2500,100)) },
 { id: 'roller-double', family: 'Enrollable', name: 'Puerta doble', page: 3, bands: grid(sequence(1500,2700,200), sequence(2000,2500,100)) }
];
export const bandKey = band => `${band.width}x${band.height}`;
export function productById(id) { return catalog.find(product => product.id === id); }
