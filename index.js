#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Données personnelles de Samuel Carretero
const PERSONAL_INFO = `
🧑 Informations Personnelles
══════════════════════════

👤 Nom: Samuel CARRETERO
📧 Email: carretero.samuel@gmail.com
📱 Téléphone: 079 761 51 07
🏠 Adresse: Route Neuve 9, 1563 Dompierre, Suisse
🎂 Date de naissance: 22 février 1991
💼 Poste actuel: Ingénieur en Informatique
🏢 Dernière entreprise: Arc Logiciels SA, Yverdon (décembre 2024)
🌍 Nationalité: Espagnol
👨‍👩‍👧‍👦 Situation familiale: Marié, 2 enfants
📚 Formation actuelle: Master of Blockchain Engineering (2025)
🎓 Établissement: CodeCrypto Academy
`;

// Compétences et expériences de Samuel Carretero
const SKILLS_INFO = `
🚀 Compétences Techniques de Samuel CARRETERO
══════════════════════════════════════════

💻 **Langages de Programmation**
├─ Java ⭐⭐⭐⭐⭐
├─ C/C++ ⭐⭐⭐⭐
├─ C# ⭐⭐⭐
├─ QT ⭐⭐⭐⭐
├─ JavaScript/TypeScript ⭐⭐⭐
└─ Powerbuilder ⭐⭐⭐⭐⭐
└─ Python ⭐⭐

🌐 **Développement Web & Mobile**
├─ Frontend
│  ├─ Svelte ⭐⭐⭐
│  ├─ React ⭐⭐⭐⭐
│  ├─ AngularJS ⭐⭐
│  └─ HTML/JSON/XML ⭐⭐⭐⭐⭐
├─ Backend
│  ├─ Node.js ⭐⭐⭐⭐⭐
│  ├─ Play Framework ⭐⭐⭐
│  └─ JEE ⭐⭐⭐⭐
└─ Mobile
   └─ Android ⭐⭐⭐

🖥️ **Systèmes & Embarqué**
├─ Linux ⭐⭐⭐⭐
├─ Yocto ⭐⭐⭐⭐
├─ i.MX ⭐⭐⭐⭐
├─ Raspberry Pi ⭐⭐⭐
├─ Nvidia Jetson ⭐⭐
├─ Router Openwrt ⭐⭐⭐
└─ Scripts Shell ⭐⭐⭐⭐

🤖 **Robotique & IoT**
├─ Robots (Meca500) ⭐⭐⭐⭐
├─ Objets connectés ⭐⭐⭐⭐⭐
├─ Capteurs & Servomoteurs ⭐⭐⭐⭐
├─ Caméras ⭐⭐⭐⭐
└─ UPS ⭐⭐⭐⭐

📡 **Protocoles & Communication**
├─ TCP/IP ⭐⭐⭐⭐⭐
├─ OPC UA ⭐⭐⭐⭐
├─ I2C/SPI/UART ⭐⭐⭐⭐
├─ RS232/RS485 ⭐⭐⭐⭐
└─ REST APIs ⭐⭐⭐⭐⭐

🔧 **Outils & Technologies**
├─ Docker ⭐⭐⭐⭐
├─ Jenkins ⭐⭐⭐⭐
├─ Redmine ⭐⭐⭐⭐⭐
├─ N8N ⭐⭐⭐
├─ MCP ⭐⭐⭐
├─ Agents IA ⭐⭐⭐⭐
├─ SQL ⭐⭐⭐⭐⭐
├─ UML ⭐⭐⭐⭐⭐
└─ Services FireDaemon ⭐⭐⭐⭐

🎓 **Formations & Certifications**
├─ Master Blockchain Engineering (2025) - CodeCrypto Academy
├─ Bachelor of Science HES-SO (2014) - HEIA-FR
├─ Maturité professionnelle technique (2011) - EMF
└─ CFC d'informaticien (2010) - EMF

💼 **Expériences Clés**
├─ Consultant/Développeur - Arc Logiciels SA (2021-2024)
│  └─ Responsable des objets connectés
│  └─ Développement d'applications
│  └─ Consulting chez les clients
│  └─ Installation et mise à jour sur les serveurs
├─ Ingénieur Informatique Industrielle - Lécureux SA (2016-2021)
│  └─ Responsable des images Linux, Yocto
│  └─ Développement embarqué
│  └─ Robotique
└─ Projets notables
   ├─ Mobile App Deep Sudoku (2014) - Réseaux de neurones
   └─ Eurobot 2014 - Tournois européenne de robotique


🌍 **Langues**
├─ Français ⭐⭐⭐⭐⭐ (Langue maternelle)
├─ Espagnol ⭐⭐⭐⭐⭐ (Langue maternelle)
└─ Anglais ⭐⭐⭐ (B2)

🎯 **Qualités Personnelles**
├─ Polyvalent ⭐⭐⭐⭐⭐
├─ Méthodique ⭐⭐⭐⭐⭐
├─ Autonome ⭐⭐⭐⭐⭐
├─ Communicatif ⭐⭐⭐⭐⭐
└─ Adaptabilité ⭐⭐⭐⭐⭐

🎪 **Centres d'Intérêt**
├─ Veille technologique
├─ Bricolage & DIY
├─ Temps en famille
├─ Jeux de stratégie/cartes
└─ Lecture de mangas

⭐ Légende: ⭐ = Notions | ⭐⭐ = Débutant | ⭐⭐⭐ = Intermédiaire | ⭐⭐⭐⭐ = Avancé | ⭐⭐⭐⭐⭐ = Expert
`;

class SamuelCarreteroMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'samuel-carretero-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          prompts: {},
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  setupHandlers() {
    // Handler pour lister les prompts disponibles
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      return {
        prompts: [
          {
            name: 'informations-personnelles',
            description: 'Récupère les informations personnelles de Samuel Carretero',
            arguments: [],
          },
          {
            name: 'skills',
            description: 'Affiche le profil détaillé des compétences techniques, expériences et formations de Samuel Carretero',
            arguments: [],
          },
        ],
      };
    });

    // Handler pour récupérer un prompt spécifique
    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name } = request.params;

      switch (name) {
        case 'informations-personnelles':
          return {
            description: 'Prompt pour récupérer les informations personnelles de Samuel Carretero',
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: 'Utilise l\'outil get_personal_info pour récupérer les informations personnelles de Samuel Carretero et les afficher de manière claire et organisée.',
                },
              },
            ],
          };

        case 'skills':
          return {
            description: 'Prompt pour afficher les compétences de Samuel Carretero',
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: 'Utilise l\'outil get_skills pour récupérer la liste complète des compétences techniques et expériences de Samuel Carretero et les présenter de manière structurée et visuellement attrayante.',
                },
              },
            ],
          };

        default:
          throw new Error(`Prompt inconnu: ${name}`);
      }
    });

    // Handler pour lister les outils disponibles
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_personal_info',
            description: 'Récupère les informations personnelles de Samuel Carretero (nom, email, téléphone, adresse, etc.)',
            inputSchema: {
              type: 'object',
              properties: {},
              required: [],
            },
          },
          {
            name: 'get_skills',
            description: 'Récupère le profil complet des compétences techniques, expériences et formations de Samuel Carretero',
            inputSchema: {
              type: 'object',
              properties: {},
              required: [],
            },
          },
        ],
      };
    });

    // Handler pour exécuter les outils
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name } = request.params;

      switch (name) {
        case 'get_personal_info':
          return {
            content: [
              {
                type: 'text',
                text: 'Voici les informations personnelles de Samuel Carretero :\n\n' + PERSONAL_INFO,
              },
            ],
          };

        case 'get_skills':
          return {
            content: [
              {
                type: 'text',
                text: 'Voici le profil complet des compétences et expériences de Samuel Carretero :\n\n' + SKILLS_INFO,
              },
            ],
          };

        default:
          throw new Error(`Outil inconnu: ${name}`);
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Serveur MCP Samuel Carretero - Informations personnelles démarré');
  }
}

// Démarrage du serveur
const server = new SamuelCarreteroMCPServer();
server.run().catch(console.error);