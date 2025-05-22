# What AI Model - Recommendation App

A web application that helps users find the perfect AI model for their needs based on accuracy, performance, and price.

## Features

- Browse and search AI models from various providers
- Filter models by capability categories
- Get personalized recommendations based on your needs
- View detailed information about each model
- Dark mode support
- Responsive design for all devices

## Security Improvements for Deployment

This application has been secured for deployment by:

1. Moving the OpenRouter API key to server-side code
2. Creating a Node.js backend to proxy API requests
3. Using environment variables for sensitive information
4. Including proper .gitignore settings to prevent committing sensitive files

## Deployment Instructions for Render

### Prerequisites

- A Render account (https://render.com)
- Your OpenRouter API key

### Steps to Deploy

1. **Create a new Web Service on Render**

   - Log in to your Render account
   - Click "New" and select "Web Service"
   - Connect your GitHub repository
   - Select the repository containing this application

2. **Configure the Web Service**

   - **Name**: Choose a name for your service (e.g., "what-ai-model")
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Select an appropriate plan (Free tier works for testing)

3. **Add Environment Variables**

   - Scroll down to the "Environment" section
   - Add the following environment variable:
     - Key: `OPENROUTER_API_KEY`
     - Value: Your OpenRouter API key

4. **Deploy the Service**

   - Click "Create Web Service"
   - Render will automatically build and deploy your application
   - Once deployment is complete, you can access your application at the provided URL

### Updating Your Application

When you push changes to your GitHub repository, Render will automatically rebuild and deploy your application.

## Local Development

### Prerequisites

- Node.js and npm installed on your machine
- OpenRouter API key

### Setup

1. Clone the repository
2. Create a `.env` file in the root directory with your OpenRouter API key:
   ```
   OPENROUTER_API_KEY=your_api_key_here
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:10000`

## Security Considerations

- The API key is now stored securely on the server side
- API requests are proxied through the backend to protect the API key
- Environment variables are used for sensitive information
- The .env file is included in .gitignore to prevent accidental commits
- Fallback data is provided in case of API failures

## License

This project is licensed under the MIT License.
