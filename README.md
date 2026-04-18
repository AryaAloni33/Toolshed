# <img src="public/favicon.svg" width="32" height="32" align="center" /> Toolshed

Toolshed is a premium, focused workspace featuring a collection of essential tools for developers, writers, and power users. Built with a focus on privacy, speed, and a high-end tactile user experience.

![Toolshed Overview](https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=2000)

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
- **Utilities**: Convert formats (JPG, PNG, WebP) and extract color palettes.

### ✍️ Text & Data

- **Transformation**: Case conversion, text cleanup (stripping white spaces/tabs), and formatting.
- **Analysis**: Word and character counting with reading time estimation.
- **Developer**: JSON formatting, Base64 encoding/decoding, URL encoding, and UUID generation.

### ⚡ Productivity

- **Quick Notes**: Persistent local notes that stay between visits.
- **To-Do**: Simple, distraction-free task management.
- **Clipboard**: History management for your most-used snippets.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **State & Data**: [TanStack Query](https://tanstack.com/query)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Engine**: [Groq Cloud API](https://groq.com/)
- **Animations**: Standard CSS transitions with a focus on tactile feedback.

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
   # or
   npm run dev
   ```

## 🌐 Deployment

### Cloudflare Pages (Recommended)

This project is pre-configured for Cloudflare Pages:

1. Connect your repository to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Select **Workers & Pages** > **Create** > **Pages** > **Connect to Git**.
3. Use these settings:
   - **Build Command**: `bun run build`
   - **Build Output Directory**: `.output` (or `dist` if using static build)
4. Add your `VITE_GROQ_API_KEY` in the environment variables.
5. In **Settings** > **Functions**, ensure the compatibility flag `nodejs_compat` is active.

### Vercel (Alternative)

If you prefer Vercel:

1. Ensure the **Build Command** is `bun run build`.
2. Set the **Output Directory** to `.output`.
3. The `vercel.json` in the root will handle routing.

## 🛡️ Privacy

All tools (except AI features) run entirely in your browser. No data is sent to a server. For AI tools, data is processed via Groq's high-performance inference engine and is subject to their privacy policy.

---

Built for focused work. © 2026 Toolshed.
