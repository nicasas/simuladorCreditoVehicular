# Simulador de Crédito Vehicular

Aplicación web mobile-first para simular cuotas de crédito vehicular con conversor de tasas de interés. Construida con React + Vite + TypeScript + Tailwind CSS v4.

## Funcionalidades

- **Conversor de tasas**: convierte entre Efectiva Anual (E.A.), Efectiva Mensual (E.M. / M.V.), Nominal Anual (con periodicidad de capitalización seleccionable) y Nominal Mensual.
- **Simulador de cuota fija** (sistema francés): calcula cuota mensual, total de intereses y total pagado.
- **Tabla de amortización** completa (mes a mes) con paginación.
- **Gráfica** de evolución del saldo e intereses/capital por mes.
- Formateo en pesos colombianos (COP) y recálculo en tiempo real.

## Correr localmente

```bash
cd simulador-cuota
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## Build de producción

```bash
npm run build
npm run preview   # previsualizar el build localmente
```

## Deploy en Vercel

1. Sube el repositorio a GitHub.
2. En [vercel.com](https://vercel.com), crea un nuevo proyecto e importa el repo.
3. Configura:
   - **Framework Preset**: Vite
   - **Root Directory**: `simulador-cuota`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Haz clic en **Deploy**.

No requiere variables de entorno ni configuración adicional de servidor.

## Estructura del proyecto

```
simulador-cuota/
├── src/
│   ├── utils/
│   │   ├── financialMath.ts   # Cálculos financieros puros (testeables)
│   │   └── formatters.ts      # Formateo de números COP
│   ├── components/
│   │   ├── RateConverter.tsx  # Conversor de tasas
│   │   ├── LoanForm.tsx       # Formulario del crédito
│   │   ├── ResultsSummary.tsx # Resumen de resultados
│   │   ├── AmortizationTable.tsx # Tabla de amortización
│   │   ├── AmortizationChart.tsx # Gráfica (recharts)
│   │   └── Tooltip.tsx        # Tooltips de ayuda
│   └── App.tsx                # Estado principal y layout
├── index.html
└── vite.config.ts
```
