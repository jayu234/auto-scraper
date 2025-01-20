# AutoScraper

<p align="center">
  <kbd>
    <img src="https://res.cloudinary.com/famousanonymous/image/upload/v1737291838/auto-scraper/Screenshot_19-1-2025_18150_auto-scraper-pi.vercel.app_cropped_fjrary.jpg" alt="project-screenshot" width="width=&quot;auto&quot;" height="400">
  </kbd>
</p>

<p id="try-now" align="center"><a href="https://www.youtube.com/watch?v=X1-7XYewIds">View demo</a> · <a href="https://campus-connect-1fq8.onrender.com">Try now 🚀</a></p>
<br />

AutoScraper is a SaaS application designed to simplify the creation and execution of web scraping workflows. With its AI-powered capabilities, intuitive interface, and robust scheduling system, AutoScraper makes web scraping accessible to everyone.

## Features

- **AI Smart Automation**: Uses artificial intelligence to simplify web scraping tasks.
- **Flexible Scheduling**: Set up tasks to run automatically at specific times using cron jobs.
- **Secure Credentials Storage**: Safely manage and store your login details for scraping tasks.
- **User-Friendly Interface**: An easy-to-navigate design for creating and managing workflows effortlessly.
- **Interactive Editor**: Design and customize web scraping workflows visually with an intuitive drag-and-drop editor. No coding required for basic tasks.

## Installation

To get started with AutoScraper, follow these steps:

**1. Clone the Repository**:

  ```bash
  https://github.com/jayu234/auto-scraper.git
  cd autoscraper
   ```

**2. Install Dependencies**:

  ```bash
  npm install
  ```

**3. Set Up Environment Variables**:
  Add the following environment variables to your `.env.local` file:

  ```env
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  CLERK_SECRET_KEY
  NEXT_PUBLIC_CLERK_SIGN_IN_URL
  NEXT_PUBLIC_CLERK_SIGN_UP_URL
  NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL
  DATABASE_URL
  NEXT_PUBLIC_DEV_MODE
  NEXT_PUBLIC_APP_URL
  API_SECRET
  ENCRYPTION_KEY
  NEXT_PUBLIC_STRIP_PUBLISHABLE_KEY
  STRIPE_SECRET_KEY
  STRIPE_SMALL_PACK_PRICE_ID
  STRIPE_MEDIUM_PACK_PRICE_ID
  STRIPE_LARGE_PACK_PRICE_ID
  STRIPE_WEBHOOK_SECRET
   ```

**4. Run Database Migrations**:

   ```bash
   npx prisma migrate dev
   ```

**5. Start the Development Server**:

   ```bash
   npm run dev
   ```

**6. Access the Application**:
   Open your browser and navigate to `http://localhost:3000` to access the AutoScraper app.

## Tech Stack

AutoScraper leverages modern web technologies to deliver a seamless experience:

- **TypeScript**: Ensures type safety and scalability.
- **NextJS**: Provides server-side rendering and static site generation.
- **Prisma**: Simplifies database interactions with an intuitive ORM.
- **Clerk**: Handles user authentication and management.
- **PostgreSQL**: A powerful relational database.
- **Stripe**: Facilitates payment processing.
- **shadcn.ui**: For building a modern and consistent user interface.
- **ReactFlow**: Enables interactive workflow design.
- **Puppeteer**: Powers the web scraping functionality.

## Have Suggestions or Feedback?

There's always a room for improvements! If you have suggestions, feature requests, or feedback, feel free to reach out by opening an issue or contacting me directly.
