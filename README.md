# Unified API Example

A comprehensive example application demonstrating how to use [Membrane](https://integration.app/) to create a application that connects to multiple CRM, marketing, and business applications. This project showcases fetching, creating, updating, and deleting records across various integrations through a single, consistent interface.

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Integration.app account

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/membranehq/unified-api-example.git
cd unified-api-example
pnpm install
```

### 2. Import the Scenario Template

This example uses a pre-configured scenario template with all interfaces ready to use:

1. Import the scenario template (link will be provided)
2. The template includes:
   - **Data Sources**: Pre-configured data models for Contacts, Companies, Users, Jobs, Job Applications, and other objects
   - **Integrations**: 50+ integrations
   - **Actions**: CRUD operations for all supported object types

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Integration.app Configuration
INTEGRATION_API_KEY=your_integration_api_key
INTEGRATION_WORKSPACE_ID=your_workspace_id
```

### 4. Configure Integrations

In your Membrane workspace:

1. Navigate to your [Integrations page](https://console.integration.app/w/0/external-apps/integrations)
2. For each integration you want to use, add the necessary credentials, some integrations use our [Auth Proxy](https://docs.integration.app/docs/auth-proxy#/) so providing adding credentials isn't required.

### 5. Start the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔗 Links

- [Membrane Docs](https://docs.integration.app/)
- [Membrane Platform](https://integration.app/)
- [API Documentation](https://docs.integration.app/docs/api)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
