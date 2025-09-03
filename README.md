# OBJ to JSON Converter - Deploy no Vercel

## Como fazer deploy no Vercel

### 1. Preparar o repositório no GitHub
1. Crie um novo repositório no GitHub
2. Faça upload de todos os arquivos do projeto
3. Certifique-se que o `vercel.json` está na raiz

### 2. Deploy no Vercel
1. Vá para [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "New Project"
4. Selecione seu repositório
5. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `vite build`
   - **Output Directory**: `dist`
6. Clique em "Deploy"

### 3. Configuração automática
O Vercel vai:
- ✅ Instalar dependências automaticamente
- ✅ Fazer build do frontend (Vite)
- ✅ Configurar APIs serverless
- ✅ Gerar URL público `.vercel.app`

### 4. APIs disponíveis
- `POST /api/convert` - Converte arquivos .OBJ para JSON
- `GET /api/conversions` - Lista conversões (placeholder)

### 5. Funcionalidades
- ✅ Upload de arquivos .OBJ
- ✅ Conversão para formato Blockbench
- ✅ Download do JSON convertido
- ✅ Interface responsiva (mobile/desktop)
- ✅ Modo escuro/claro

### 6. Estrutura do projeto
```
/
├── api/
│   ├── convert.ts      # API de conversão
│   └── conversions.ts  # API de histórico
├── client/
│   └── src/            # Frontend React
├── vercel.json         # Configuração Vercel
└── README.md          # Este arquivo
```

## Deploy gratuito! 🎉
O Vercel oferece plan gratuito generoso para projetos pessoais.