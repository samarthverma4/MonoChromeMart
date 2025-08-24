# MonochromeMart

MonochromeMart is a modern e-commerce platform built with React, TypeScript, and Node.js, featuring an AI-powered shopping assistant using Google's Gemini API.

## Features

- 🛍️ Product browsing and shopping cart functionality
- 🤖 AI-powered shopping assistant using Gemini API
- 🎨 Modern UI with Tailwind CSS and Shadcn components
- 🔒 Type-safe development with TypeScript
- ⚡ Fast development with Vite
- 🖥️ Full-stack application with Express backend

## Tech Stack

- **Frontend:**
  - React
  - TypeScript
  - Tailwind CSS
  - Shadcn UI Components
  - Vite

- **Backend:**
  - Node.js
  - Express
  - Google Generative AI (Gemini)

- **Development Tools:**
  - TypeScript
  - ESLint
  - Prettier
  - Drizzle

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/samarthverma4/MonochromeMart.git
   cd MonochromeMart
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
MonochromeMart/
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Page components
│   │   └── lib/         # Utility functions
├── server/              # Backend Express server
│   ├── services/        # Backend services
│   └── routes.ts        # API routes
└── shared/             # Shared types and utilities
```

## Features in Detail

### Shopping Cart
- Add/remove products
- Adjust quantities
- Real-time price updates

### AI Shopping Assistant
- Powered by Google's Gemini API
- Natural language product recommendations
- Shopping guidance and support

### User Interface
- Responsive design
- Dark/light mode support
- Modern and clean aesthetics

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Shadcn UI for the beautiful components
- Google Gemini API for AI capabilities
- The React and TypeScript communities

---

Built with ❤️ by Samarth Verma
