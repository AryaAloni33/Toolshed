# <img src="public/favicon.svg" width="32" height="32" align="center" /> Toolshed

Toolshed is a premium, focused workspace featuring a collection of **40+ essential tools** for developers, writers, and power users. Built with a focus on privacy, speed, and a high-end tactile user experience.


## ✨ Features

### 🧠 AI Powered Tools (via Groq)
- **AI Summary**: Condense long documents into actionable bullet points.
- **AI OCR**: Extract text from images and scans with high precision using Llama 3.2 Vision.
- **Content Extractor**: Pull key entities, themes, and structured data from any text.

### 📄 Document Processing
- **PDF Suite**: Merge, Split, and Compress PDF files.
- **Conversions**: Word to PDF, Excel to PDF, and PDF to Image.

### 🖼️ Image Editing
- **Optimization**: Resize and compress images without losing quality.
- **Cleanup**: Remove backgrounds using on-device AI.
- **Utilities**: Convert formats (JPG, PNG, WebP), generate QR codes, and extract color palettes.

### ✍️ Text & Data
- **Transformation**: Case conversion, text cleanup, and RegEx testing.
- **Analysis**: Word and character counting with reading time estimation.
- **Developer Suite**: JSON/CSV/SQL formatters, JWT Decoder, Hash Generator (MD5, SHA), Base64 Image Encoder, and Diff Checker.

### 📐 Reference & Productivity
- **Reference**: HTTP Status Codes and Unit Converter.
- **Productivity**: Percentage Calculator, Quick Notes, and To-Do lists.

## 🚀 Tech Stack
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Architecture**: [TanStack Start](https://tanstack.com/start)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **State & Data**: [TanStack Query](https://tanstack.com/query)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Engine**: [Groq Cloud API](https://groq.com/)

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (latest LTS recommended)
- [Bun](https://bun.sh/) (faster package management)

### Installation
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd Toolshed
   ```

2. Install dependencies:
   ```bash
   bun install
   # or
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root:
   ```env
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```

4. Start the development server:
   ```bash
   bun dev
   ```

## 🌐 Deployment

### Netlify (Recommended)
This project is pre-configured for Netlify via `netlify.toml`:

1. Import your project from GitHub to Netlify.
2. Use these settings (detected automatically):
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist/client`
   - **Functions Directory**: `dist/server`
3. Add your `VITE_GROQ_API_KEY` in the environment variables.

### Cloudflare Pages (Alternative)
If using Cloudflare Pages:
1. Set **Build Command** to `npm run build`.
2. Set **Output Directory** to `dist/client`.
3. Set **Environment Variable** `NITRO_PRESET=cloudflare-pages`.
4. In **Settings > Functions**, enable the `nodejs_compat` compatibility flag.

## 🛡️ Privacy
All tools (except AI features) run entirely in your browser. No data is sent to a server. For AI tools, data is processed via Groq's high-performance inference engine and is subject to their privacy policy.

---
Built for focused work. © 2026 Toolshed.
