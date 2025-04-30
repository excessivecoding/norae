# Norae Project

This is a Next.js application.

## Prerequisites

- Node.js (Check `package.json` for specific version if needed, currently uses Node 20 according to devDependencies)
- npm (comes with Node.js)
- Docker (Optional, if using the defined proxy service)
- Access to an external Docker network named `docker-swarm_shared_network` (If using the Docker proxy service)

## Docker Proxy Service (Optional)

This project includes a `docker-compose.yaml` file to run a proxy service. This service might be used in specific deployment scenarios (like the one defined in `docker-compose.yaml` targeting Docker Swarm) or to handle requests like the Genius API proxy mentioned in the environment variables.

**Note:** This proxy service is generally **not required** for standard local development when running the application directly using `npm run dev`.

## Local Development Setup

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd norae
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Variables:**

    - Create a `.env.local` file in the root directory by copying the example below and filling in the values.
    - Refer to the comments in the example for details on obtaining each value.

    ```env
    # .env.local.example

    # Auth.js (NextAuth)
    # Canonical URL of your deployment (e.g., http://localhost:3000 for local dev)
    NEXTAUTH_URL=
    # Generate with `npx auth secret`
    NEXTAUTH_SECRET=
    # Spotify Developer Dashboard credentials (https://developer.spotify.com/dashboard)
    AUTH_SPOTIFY_ID=
    AUTH_SPOTIFY_SECRET=

    # Upstash Redis (https://upstash.com/)
    # Used as the primary database and for caching/rate limiting
    UPSTASH_REDIS_REST_URL=
    UPSTASH_REDIS_REST_TOKEN=

    # OpenAI (Optional - if using a non-standard endpoint)
    # Base URL for OpenAI API (if using a proxy or alternative)
    # OPENAI_BASE_URL=
    # Your OpenAI API Key (implicitly required if using OpenAI features)
    # OPENAI_API_KEY=

    # Genius API / Proxy (https://genius.com/api-clients)
    GENIUS_ACCESS_TOKEN=
    # Details for the proxy used to access Genius lyrics (if applicable)
    GENIUS_PROXY_PROTOCOL=
    GENIUS_PROXY_HOST=
    GENIUS_PROXY_PORT=
    GENIUS_PROXY_TOKEN=

    # Feature Flags (Example)
    # Specific flag found in app/api/translations/route.ts
    # KOREAN_EMAIL_ENABLED=
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

## Building for Production

1.  **Build the application:**

    ```bash
    npm run build
    ```

    This creates an optimized production build in the `.next` folder.

2.  **Start the production server:**

    ```bash
    npm run start
    ```

## Deployment

Deploying this project involves two main components:

1.  **Next.js Application:**

    - Build the Next.js application using `npm run build`.
    - Deploy the output (the `.next` directory, `public`, `package.json`, etc.) to your preferred hosting provider (e.g., Vercel, Netlify, a Node.js server). Follow standard deployment procedures for Next.js applications.

2.  **Proxy Service (`proxy/` directory):**
    - The proxy service located in the `proxy/` directory needs to be deployed separately, ideally on a Virtual Private Server (VPS) or any server with a stable IP address.
    - **Reason:** This is necessary to provide a consistent IP address for external services (like the Genius API accessed via the proxy) and helps avoid issues with bot detection mechanisms (e.g., Cloudflare) that might block requests from serverless platforms with dynamic IPs.
    - **Deployment Method (Docker Stack / Swarm):** The root `package.json` includes a script for deploying the proxy service using `docker stack deploy` within a Docker Swarm:
      ```bash
      # Run from the project root directory
      npm run deploy:proxy
      ```
      This command utilizes the `docker-compose.yaml` file and the `docker stack deploy` command. It assumes you have a Docker Swarm environment set up with the required external network (`docker-swarm_shared_network`).
      - If you need guidance on setting up Docker Swarm and using `docker stack deploy`, this video might be helpful: [Dream of Code - Docker Stack Tutorial](https://www.youtube.com/watch?v=fuZoxuBiL9o).
    - **Alternative Deployment:** If not using Docker Swarm, navigate to the `proxy/` directory and follow its specific deployment instructions (likely involving building a Docker image using the `Dockerfile` present there and running it on your VPS or another container orchestration platform).

Ensure your production environment variables (as defined in `.env.local` during development) are correctly configured on both deployment targets.
