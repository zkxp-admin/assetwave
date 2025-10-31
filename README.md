# AssetWave

A mobile-first enterprise asset management platform that transforms how organizations track, maintain, and optimize real-world hardware through blockchain verification on Solana.

> **Note**: This repository contains archived code for reference purposes. We have decided not to open source this project at this time. The code as-is will not run without significant setup and additional files.

## Overview

AssetWave combines AI-powered data capture with autonomous agents that monitor equipment, predict failures, and schedule maintenance automatically. Built on ISO 55000 standards, it provides organizations with transparent, verifiable asset management powered by blockchain technology.

### Key Features

- **AI-Powered Data Capture**: Parse photos, PDFs, and sheets to auto-extract equipment models and specs
- **Autonomous Agents**: Monitor equipment, predict failures, and schedule maintenance automatically
- **Conversational Interface**: Natural language asset management through intelligent agents
- **Multi-Agent Orchestration**: Enforces best practices across asset management workflows
- **Blockchain Verification**: Verified onchain records on Solana with ZK proofs for transparency
- **Visual Dashboards**: Surface asset health, status, location, and complete history
- **Compliance & Audit**: Role-based controls, encryption, and exportable audit trails with zero-knowledge proofs
- **Third-Party Audits**: Enable audits without exposing sensitive data

## About This App

This is a **stripped-down Expo React Native app** (Expo 54) that serves as the mobile interface for AssetWave. It provides:

- File-based routing with Expo Router
- HeroUI Native components for modern, accessible UI
- TypeScript support for type safety
- Modern styling with NativeWind/Tailwind CSS
- Theme management and customization

### Project Structure

```
src/
├── app/                      # Expo Router pages
│   ├── _layout.tsx          # Root layout
│   ├── index.tsx            # Entry point
│   ├── (auth)/              # Authentication routes
│   ├── (home)/              # Main app routes
│   │   ├── landing.tsx
│   │   ├── profile.tsx
│   │   ├── assets.tsx
│   │   ├── chat.tsx
│   │   ├── search.tsx
│   │   ├── notifications.tsx
│   │   └── assets/          # Asset management
│   └── api/                 # API routes
└── components/              # Reusable components
└── contexts/                # App context (theming)
```

## Technology Stack

- **React Native** with Expo 54
- **Expo Router** for file-based routing
- **HeroUI Native** for UI components
- **TypeScript** for type safety
- **NativeWind/Tailwind CSS** for styling
- **Solana** for blockchain verification
- **Zero-Knowledge Proofs** for privacy-preserving audits

## Learn More

- [HeroUI Native Documentation](https://github.com/heroui-inc/heroui-native)
- [Expo Documentation](https://docs.expo.dev)
- [ISO 55000 Asset Management Standards](https://en.wikipedia.org/wiki/ISO_55000)
