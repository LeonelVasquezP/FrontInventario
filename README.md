# SistemaInVentario

This project is a small React + TypeScript frontend scaffolded with Parcel. It currently contains only a few example components and pages.

## Project Structure

```
FrontInventario/
├── public/            # Static assets served directly
│   └── index.html
├── src/               # TypeScript/React source files
│   ├── App.tsx
│   ├── index.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   └── master/    # Placeholder pages (empty)
│   └── components/    # Placeholder React components (empty)
├── package.json
├── tsconfig.json
└── README.md
```

Only `src/index.tsx`, `src/App.tsx` and `src/pages/Home.tsx` contain code so far. All other files are placeholders for future development.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start the development server**
   ```bash
   npm run dev
   ```
   Parcel will serve `public/index.html` and reload on changes.
3. **Create a production build**
   ```bash
   npm run build
   ```
   The output will be placed in the `dist/` directory.

## Planned Features / Next Steps

- Implement the pages under `src/pages/master/` (Clientes, Departamentos, etc.).
- Add React components inside `src/components/` as needed.
- Expand this README with more details about each module.
- Add unit tests and linting to keep code quality high.

---

This repository is just a starting point for an inventory system frontend. Feel free to customize it to fit your needs.
