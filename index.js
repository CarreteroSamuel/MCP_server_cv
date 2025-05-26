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

// Bilan de compétences complet de Samuel Carretero
const BILAN_COMPETENCES = `
📋 BILAN DE COMPÉTENCES COMPLET - Samuel CARRETERO
═══════════════════════════════════════════════════

👤 **PROFIL**
───────────────
🧑 Nom: Samuel CARRETERO
🎂 Âge: 34 ans (né le 22 février 1991)
🌍 Nationalité: Espagnol
📍 Domicile: Route Neuve 9, 1563 Dompierre, Fribourg (CH)
📋 Permis: C (permis de travail)
💼 Poste: Ingénieur en informatique
📈 Expérience: +10 ans
📞 Contact: 079 761 51 07 | carretero.samuel@gmail.com
🔄 Disponibilité: Immédiate

🏆 **COMPÉTENCES FONCTIONNELLES**
─────────────────────────────────

🖥️ **Développement Logiciel et Web**
├─ Développement et cross-compilation de programmes Qt
├─ Développement de programmes C#, C++, Java
├─ Création de librairies C Linux et Windows (Server et client OpcUa)
├─ Développement Web (Server Web NodeJS + client TCP, Server TCP de test)
├─ Développement d'un ERP en Power Builder, intégrant des bases de données SyBase
├─ Développement et installation de portails Web (Svelte, Play Framework, Java) avec comptes IAM et bases de données MySQL
├─ Développement d'applications serveur/client TCP/IP en NodeJS
├─ Développement d'une application Web Java EE optimisée pour iPhone
├─ Développement d'une librairie en C pour serveur/client OpcUA
├─ Développement des protocoles de communication (Serial, Ethernet)
├─ Gestion de bases de données: installation, configuration et mise en place de réplications
├─ Traitement et intégration de données : bulletins stations-service, centrales à béton, tournées grues (Koco Online)
├─ Création de scripts d'installation/update/automatisation linux (.sh) et Windows (.bat)
├─ Développement d'applications mobiles (Android) avec réseau de neurones
├─ Développement d'applications web en NextJS/React et NodeJS
├─ Création de serveurs MCP en NodeJS
└─ Automatisation de tâches avec N8N

🐧 **Conception d'Images Linux**
├─ Développement des systèmes linux et des toolchains (Yocto : U-Boot, Kernel, Rootfs)
├─ Installation de serveurs de build pour la cross-compilation
└─ Installation et configuration de serveurs Linux (DHCP, NTP, FTP, VNC)

🤖 **Programmation de Robots**
├─ Programmation de robots Meca500 et teach des positions
└─ Programmation de tâches robotiques avec moteurs, capteurs, électroaimants ou vacuums

💼 **Consulting ERP**
├─ Analyse des besoins clients et développement de solutions ERP adaptées
├─ Installation, configuration et mise à jour d'ERP sur serveurs applicatifs
├─ Conseil et accompagnement technique lors de rendez-vous clients (bureaux, gravières, centres de tri)
└─ Support logiciel transport pour les clients

🌐 **Gestion des Objets Connectés**
├─ Timbreuses DataFox et synchronisation avec l'ERP
├─ Balances (pont bascule)
├─ Barrières (KNX)
├─ Lecteurs de cartes (Six Paiement)
├─ Caméras (prise de photos et lecture de plaques)
├─ Imprimantes diverses (étiquettes, tickets de caisse)
├─ Serveurs COM (W&T, Moxa)
├─ Lecteurs QR
├─ Systèmes de signature électronique (Signotech)
└─ Configuration de formats d'impression spécifiques (A4, A5, tickets, factures QR, étiquettes)

🔍 **Veilles Technologiques**
└─ Tests approfondis sur nouveaux équipements et technologies pour évaluer leur intégration

⚙️ **COMPÉTENCES TECHNIQUES**
─────────────────────────────

🛠️ **Outils et Logiciels de Conception**
├─ Outils de développement:
│  ├─ Yocto ⭐⭐⭐⭐⭐
│  ├─ QT Creator ⭐⭐⭐⭐⭐
│  ├─ Intellij Idea ⭐⭐⭐⭐
│  ├─ Visual Studio Code ⭐⭐⭐⭐⭐
│  ├─ Visual Studio ⭐⭐⭐⭐
│  ├─ PowerBuilder ⭐⭐⭐⭐⭐
│  ├─ Eclipse ⭐⭐⭐⭐⭐
│  ├─ Netbeans ⭐⭐⭐⭐⭐
│  ├─ DataFox Studio ⭐⭐⭐⭐⭐
│  ├─ Notepad++ ⭐⭐⭐⭐⭐
│  ├─ Cursor ⭐⭐⭐⭐⭐
│  └─ N8N ⭐⭐⭐
├─ Terminal:
│  ├─ MobaXterm ⭐⭐⭐⭐⭐
│  ├─ Hercules Setup Utility ⭐⭐⭐⭐
│  ├─ Putty ⭐⭐⭐⭐
│  └─ FireFTP ⭐⭐⭐⭐
└─ Langages et technologies:
   ├─ C++ (QT) ⭐⭐⭐⭐⭐
   ├─ C# (OMachine, .Net) ⭐⭐⭐⭐
   ├─ Python (scripts) ⭐⭐⭐
   ├─ Java ⭐⭐⭐⭐⭐
   ├─ Recettes Yocto (GIT) ⭐⭐⭐⭐
   ├─ PowerScript ⭐⭐⭐⭐⭐
   ├─ TypeScript ⭐⭐⭐
   ├─ Play Framework ⭐⭐⭐
   ├─ Svelte ⭐⭐⭐
   ├─ Serveur/Client OpcUA ⭐⭐⭐⭐
   ├─ SVN/GIT ⭐⭐⭐⭐⭐
   ├─ Firedaemon ⭐⭐⭐⭐
   └─ Script Shell/Batch ⭐⭐⭐⭐⭐

🔧 **Automatisation et Programmation Industrielle**
├─ Robot Meca500 (6 axes) ⭐⭐⭐⭐
├─ Raspberry Pi ⭐⭐⭐⭐
└─ Protocoles de communication:
   ├─ EtherCAT ⭐⭐⭐
   ├─ Modbus ⭐⭐⭐⭐
   ├─ Ethernet (TCP/IP) ⭐⭐⭐⭐⭐
   ├─ I2C ⭐⭐⭐⭐
   ├─ SPI ⭐⭐⭐⭐
   ├─ UART ⭐⭐⭐⭐
   ├─ RS232 ⭐⭐⭐⭐
   └─ RS485 ⭐⭐⭐⭐

🏭 **SECTEURS D'ACTIVITÉ**
─────────────────────────
├─ Informatique ⭐⭐⭐⭐⭐
├─ Horlogerie ⭐⭐⭐⭐⭐
├─ Automation et contrôle des systèmes industriels ⭐⭐⭐⭐⭐
├─ Ingénierie industrielle ⭐⭐⭐⭐⭐
├─ Systèmes embarqués et Internet des objets (IoT) ⭐⭐⭐⭐⭐
├─ Robotique ⭐⭐⭐⭐
├─ Recherche et développement (R&D) ⭐⭐⭐⭐⭐
└─ Transport et chantier ⭐⭐⭐⭐⭐

🎓 **FORMATIONS & CERTIFICATIONS**
─────────────────────────────────
├─ 2015: Participant InnoPark – Gestion de projet, Bilan de compétences (Fribourg – Yverdon)
├─ 2011-2014: Bachelor of Science HES-SO en informatique – HEIA-FR
├─ 2010-2011: Maturité professionnelle technique – Ecole des Métiers de Fribourg
└─ 2006-2010: Informaticien CFC – Ecole des Métiers de Fribourg

🌍 **LANGUES**
─────────────
├─ Français: Bilingue ⭐⭐⭐⭐⭐
├─ Espagnol: Langue maternelle ⭐⭐⭐⭐⭐
└─ Anglais: B2 ⭐⭐⭐

📈 **EXPÉRIENCES PROFESSIONNELLES DÉTAILLÉES**
──────────────────────────────────────────────

🏢 **Arc Logiciels SA, Yverdon (2021-2024)**
Poste: Consultant/Développeur, responsable des objets connectés

📋 Contexte:
└─ Développement d'un ERP pour les entreprises du transport et du chantier

🎯 Missions principales:
├─ Installation, configuration et mise à jour d'ERP sur serveurs applicatifs
├─ Configuration des différents appareils et protocoles de communication
├─ Responsable des objets connectés (intégration complète dans les systèmes ERP)
├─ Mise en place des timbreuses DataFox selon demandes clients
├─ Consulting ERP: analyse des besoins et développement de solutions adaptées
├─ Conseil et accompagnement technique lors de rendez-vous clients
└─ Support logiciel transport

⚙️ Environnement technique:
├─ Développement: Powerbuilder, Intellij idea, Visual Studio
├─ Technologies: Play Framework, Svelte, Java, IAM, NodeJS, FireDaemon, TypeScript
├─ Outils: MobaXTerm, Hercules Setup utility
├─ Appareils IoT: Timbreuses DataFox, Balances, Barrières KNX, Lecteurs cartes, Caméras, etc.
├─ Bases de données: SyBase, MySQL
├─ Gestion projet: Freshservice, Trello
└─ Versioning: SVN/GIT

🏢 **Lécureux SA, Bienne (2016-2021)**
Poste: Ingénieur en informatique industrielle, responsable des images Linux

📋 Contexte:
└─ Production de chaînes de montages pour montres, machines de contrôle et correction des mouvements

🎯 Missions principales:
├─ Développement des systèmes linux et des toolchains (Yocto)
├─ Développement et cross-compilation de programmes Qt
├─ Création de librairies C Linux et Windows (OpcUa)
├─ Programmation Web (NodeJS + TCP)
├─ Programmation de Robots Meca500
├─ Veilles technologiques sur nouveau matériel
├─ Gestion de bases de données MSSQL
├─ Configuration réseau (Routeur OpenWrt)
├─ Documentation technique et SAV
└─ Management Redmine

⚙️ Environnement technique:
├─ OS: Linux, Windows
├─ Développement: QT Creator, Visual Studio
├─ Technologies: QT, C++, OMachine, C#, .Net, NodeJS
├─ Matériel: Robot Meca500, Caméras Basler/Cognex, Modules IMX6+/IMX7, Nvidia Jetson
├─ Bases de données: MS SQL, MySQL, PostgreSQL
└─ Outils: Redmine, SVN/GIT

🎯 **PROJETS NOTABLES**
──────────────────────

📱 **Mobile App Deep Sudoku (2015)**
├─ Projet de bachelor - Résolution de Sudoku
├─ Service web avec réseau de neurones Deep
├─ Application Android avec traitement d'image
└─ Technologies: Android Studio, Eclipse, Java, GIT

🤖 **Eurobot (2013-2014)**
├─ Tournoi européen de robotique avec équipe HEIAFR
├─ Programmation de 2 robots pour compétition
├─ Gestion des déplacements avec capteurs I2C
└─ Technologies: Eclipse, QT, C++, FPGA Xilinx Spartan

💻 **Collaborations HEIAFR (2009-2011)**
├─ Développement d'applications web et mobile pour iTIC
├─ Application Java de visualisation qualité WiFi
├─ Application Web Java EE optimisée iPhone (SECO)
└─ Projet EmfBoard - Programme Java pour cours sur tablette

💡 **POINTS FORTS**
──────────────────
├─ Polyvalence technique exceptionnelle (développement à robotique)
├─ Expertise unique en objets connectés et systèmes embarqués
├─ Capacité d'adaptation rapide aux nouvelles technologies
├─ Expérience client et consulting approfondie
├─ Maîtrise complète de la chaîne de développement (conception à déploiement)
└─ Leadership technique et accompagnement d'équipes

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
          {
            name: 'bilan-competences',
            description: 'Affiche le bilan de compétences de Samuel Carretero',
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
                  text: 'Utilise l\'outil get_skills pour récupérer la liste des compétences techniques et expériences de Samuel Carretero et les présenter de manière structurée et visuellement attrayante.',
                },
              },
            ],
          };

        case 'bilan-competences':
          return {
            description: 'Prompt pour afficher le bilan de compétences de Samuel Carretero',
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: 'Utilise l\'outil get_bilan_competences pour récupérer le bilan de compétences de Samuel Carretero et le présenter toutes les informations de manière structurée et visuellement attrayante.',
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
          {
            name: 'get_bilan_competences',
            description: 'Récupère le bilan de compétences de Samuel Carretero',
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
          
        case 'get_bilan_competences':
          return {
            content: [
              {
                type: 'text',
                text: 'Voici le bilan de compétences de Samuel Carretero :\n\n' + BILAN_COMPETENCES,
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