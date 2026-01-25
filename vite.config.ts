import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    preserveSymlinks: false,
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AIChatbot',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      // Solo externalizar dependencias de node_modules, NO archivos internos
      external: (id) => {
        // Si es un path relativo o absoluto, NO es externo (debe empaquetarse)
        if (id.startsWith('.') || path.isAbsolute(id)) {
          return false;
        }
        // Externalizar solo dependencias específicas de node_modules
        // NOTA: Las siguientes dependencias se incluyen en el bundle para evitar problemas:
        // - @assistant-ui/react y @assistant-ui/react-markdown: problemas de inicialización con módulos ES
        // - mermaid: dependencia específica de la librería
        return [
          'react',
          'react-dom',
          'react/jsx-runtime',
          '@tanstack/react-query',
          // '@assistant-ui/react' - INCLUIDO en bundle
          // '@assistant-ui/react-markdown' - INCLUIDO en bundle
          // 'mermaid' - INCLUIDO en bundle
          '@radix-ui/react-avatar',
          '@radix-ui/react-dialog',
          '@radix-ui/react-popover',
          '@radix-ui/react-slot',
          '@radix-ui/react-tooltip',
          'class-variance-authority',
          'clsx',
          'lucide-react',
          'remark-gfm',
          'tailwind-merge',
          'zustand',
        ].some(dep => id === dep || id.startsWith(`${dep}/`));
      },
      output: {
        // Asegurar que todo se empaquete en un solo archivo
        inlineDynamicImports: true,
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'style.css';
          }
          return assetInfo.name || 'assets/[name][extname]';
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: false,
  },
})
