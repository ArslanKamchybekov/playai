# PlayAI Book Reader

## Overview

PlayAI Book Reader is a web application designed to provide a seamless experience for reading and listening to PDF files using PlayAI's Text-to-Speech API. The application allows users to upload PDFs, navigate through pages, and listen to the content using AI-generated voices.

## Features

- **PDF Upload:** Users can upload a PDF file through the web interface.
- **Page Display:** The uploaded PDF is parsed and displayed on a per-page basis.
  - Users can navigate between pages using next/previous buttons or a page number input.
- **Text-to-Speech Integration:**
  - Users can initiate audio playback for each displayed page.
  - Audio playback is powered by PlayAI's Text-to-Speech API.
  - Provides basic playback controls (play/pause).
- **PlayAI API Integration:**
  - Uses [PlayAI's Text-to-Speech API](https://docs.play.ai/tts-api-reference/endpoints/v1/tts/stream/post-playdialog) for reading page content.
  - Authenticated API calls with the provided API Key and User ID.
  - Supports multiple AI-generated voices for playback.

## Technical Stack

- **Frontend:** Next.js, React, TailwindCSS
- **Backend:** Next.js API Routes
- **API Integration:** PlayAI Text-to-Speech API

## Setup and Installation

### Prerequisites

Ensure you have the following installed:
- Node.js (v16 or later)
- npm or yarn

### Installation Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/ArslanKamchybekov/playai.git
   cd playai
   ```

2. Install dependencies:
   ```sh
   npm install
   ```
   or
   ```sh
   bun install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory.
   - Add the following credentials:
     ```env
     NEXT_PUBLIC_PLAYAI_API_KEY=your_api_key
     NEXT_PUBLIC_PLAYAI_USER_ID=your_user_id
     ```

4. Start the development server:
   ```sh
   npm run dev
   ```
   or
   ```sh
   bun run dev
   ```

5. Open `http://localhost:3000` in your browser to access the application locally.

## Additional Notes

- The project was built using Next.js, React, and TailwindCSS.
- The application was designed to be responsive and user-friendly.
- To access the deployed version, follow this [link](https://playaidev.vercel.app/)

