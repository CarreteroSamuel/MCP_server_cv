#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

class SamuelCarreteroMCPServer {
  constructor() {
    // Lecture du fichier cv.txt comme ressource
    const cvFilePath = path.resolve(process.cwd(), 'cv.txt');
    let cvContent = '';
    try {
      cvContent = fs.readFileSync(cvFilePath, 'utf-8');
    } catch (e) {
      console.error('Impossible de lire le fichier cv.txt:', e);
    }

    this.cvResource = cvContent;

    this.server = new Server(
      {
        name: 'samuel-carretero-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          prompts: {},
          tools: {},
          resources: {},
        },
      }
    );

    this.setupHandlers();
  }

  // Méthode pour extraire les informations du CV
  extractPersonalInfo() {
    const lines = this.cvResource.split('\n');
    let personalInfo = '';
    let capturing = false;
    
    for (const line of lines) {
      if (line.includes('🧑 Informations Personnelles') || line.includes('Informations Personnelles')) {
        capturing = true;
        personalInfo += line + '\n';
        continue;
      }
      
      if (capturing) {
        if (line.trim() === '' && personalInfo.trim() !== '') {
          // Fin de section si ligne vide après avoir capturé du contenu
          break;
        }
        if (line.includes('🚀') || line.includes('Compétences') || line.includes('📋 BILAN')) {
          // Début d'une nouvelle section
          break;
        }
        personalInfo += line + '\n';
      }
    }
    
    return personalInfo.trim() || this.cvResource.substring(0, 500) + '...';
  }

  extractSkills() {
    const lines = this.cvResource.split('\n');
    let skillsInfo = '';
    let capturing = false;
    
    for (const line of lines) {
      if (line.includes('🚀 Compétences') || line.includes('Compétences Techniques')) {
        capturing = true;
        skillsInfo += line + '\n';
        continue;
      }
      
      if (capturing) {
        if (line.includes('📋 BILAN') || line.includes('BILAN DE COMPÉTENCES')) {
          // Début du bilan de compétences
          break;
        }
        skillsInfo += line + '\n';
      }
    }
    
    return skillsInfo.trim() || 'Informations sur les compétences non trouvées dans le CV.';
  }

  extractBilanCompetences() {
    const lines = this.cvResource.split('\n');
    let bilanInfo = '';
    let capturing = false;
    
    for (const line of lines) {
      if (line.includes('📋 BILAN') || line.includes('BILAN DE COMPÉTENCES')) {
        capturing = true;
        bilanInfo += line + '\n';
        continue;
      }
      
      if (capturing) {
        bilanInfo += line + '\n';
      }
    }
    
    return bilanInfo.trim() || 'Bilan de compétences non trouvé dans le CV.';
  }

  // Méthode pour extraire l'email du CV
  extractEmail() {
    const emailMatch = this.cvResource.match(/carretero\.samuel@gmail\.com|📧\s*Email:\s*([^\s\n]+)/i);
    return emailMatch ? (emailMatch[1] || emailMatch[0]) : 'carretero.samuel@gmail.com';
  }

  setupHandlers() {
    // Handler pour lister les ressources disponibles
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'cv://samuel-carretero/personal-info',
            name: 'Informations personnelles de Samuel Carretero',
            description: 'Informations de contact et détails personnels',
            mimeType: 'text/plain',
          },
          {
            uri: 'cv://samuel-carretero/skills',
            name: 'Compétences techniques de Samuel Carretero',
            description: 'Profil complet des compétences, expériences et formations',
            mimeType: 'text/plain',
          },
          {
            uri: 'cv://samuel-carretero/bilan-competences',
            name: 'Bilan de compétences de Samuel Carretero',
            description: 'Bilan détaillé des compétences professionnelles',
            mimeType: 'text/plain',
          },
          {
            uri: 'cv://samuel-carretero/full-cv',
            name: 'CV complet de Samuel Carretero',
            description: 'Document CV complet',
            mimeType: 'text/plain',
          },
        ],
      };
    });

    // Handler pour lire une ressource spécifique
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      switch (uri) {
        case 'cv://samuel-carretero/personal-info':
          return {
            contents: [
              {
                uri: uri,
                mimeType: 'text/plain',
                text: this.extractPersonalInfo(),
              },
            ],
          };

        case 'cv://samuel-carretero/skills':
          return {
            contents: [
              {
                uri: uri,
                mimeType: 'text/plain',
                text: this.extractSkills(),
              },
            ],
          };

        case 'cv://samuel-carretero/bilan-competences':
          return {
            contents: [
              {
                uri: uri,
                mimeType: 'text/plain',
                text: this.extractBilanCompetences(),
              },
            ],
          };

        case 'cv://samuel-carretero/full-cv':
          return {
            contents: [
              {
                uri: uri,
                mimeType: 'text/plain',
                text: this.cvResource,
              },
            ],
          };

        default:
          throw new Error(`Ressource non trouvée: ${uri}`);
      }
    });
     
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
          {
            name: 'envoyer-message',
            description: 'Permet d\'envoyer un message à Samuel Carretero via email',
            arguments: [
              { name: 'sujet', type: 'string', description: 'Sujet du message' },
              { name: 'message', type: 'string', description: 'Contenu du message' },
              { name: 'Nom', type: 'string', description: 'Nom de l\'expéditeur' },
              { name: 'Email', type: 'string', description: 'Email de l\'expéditeur' }
            ],
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

        case 'envoyer-message':
          return {
            description: 'Prompt pour envoyer un message à Samuel Carretero',
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `Utilise l'outil send_message pour envoyer un email à Samuel Carretero. Demande à l'utilisateur le sujet, le contenu du message, son nom et son email, puis transmets ces informations à l'outil.`,
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
          {
            name: 'send_message',
            description: 'Contacter Samuel Carretero',
            inputSchema: {
              type: 'object',
              properties: {
                subject: {
                  type: 'string',
                  description: 'Sujet de l\'email',
                },
                message: {
                  type: 'string',
                  description: 'Contenu du message',
                },
                senderName: {
                  type: 'string',
                  description: 'Nom de l\'expéditeur',
                },
                senderEmail: {
                  type: 'string',
                  description: 'Email de l\'expéditeur',
                },
              },
              required: ['subject', 'message', 'senderName', 'senderEmail'],
            },
          },
        ],
      };
    });

    // Handler pour exécuter les outils
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'get_personal_info':
          return {
            content: [
              {
                type: 'text',
                text: 'Voici les informations personnelles de Samuel Carretero :\n\n' + this.extractPersonalInfo(),
              },
            ],
          };

        case 'get_skills':
          return {
            content: [
              {
                type: 'text',
                text: 'Voici le profil complet des compétences et expériences de Samuel Carretero :\n\n' + this.extractSkills(),
              },
            ],
          };
          
        case 'get_bilan_competences':
          return {
            content: [
              {
                type: 'text',
                text: 'Voici le bilan de compétences de Samuel Carretero :\n\n' + this.extractBilanCompetences(),
              },
            ],
          };

        case 'send_message':
          try {
            const { subject, message, senderName, senderEmail } = args;
            const recipientEmail = this.extractEmail();
            
            // Configuration du transporteur email (exemple avec Gmail)
            // Note: En production, utilisez des variables d'environnement pour les credentials
            const transporter = nodemailer.createTransporter({
              service: 'gmail',
              auth: {
                user: process.env.GMAIL_USER || 'your-email@gmail.com',
                pass: process.env.GMAIL_APP_PASSWORD || 'your-app-password'
              }
            });

            const mailOptions = {
              from: `"${senderName}" <${senderEmail}>`,
              to: recipientEmail,
              subject: subject,
              text: `Message de: ${senderName} (${senderEmail})\n\n${message}`,
              html: `
                <h3>Nouveau message via le serveur MCP</h3>
                <p><strong>De:</strong> ${senderName} (${senderEmail})</p>
                <p><strong>Sujet:</strong> ${subject}</p>
                <div style="margin-top: 20px; padding: 10px; border-left: 3px solid #007bff;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              `
            };

            // En mode développement/test, on simule l'envoi
            if (process.env.NODE_ENV === 'development' || !process.env.GMAIL_USER) {
              return {
                content: [
                  {
                    type: 'text',
                    text: `✅ Email simulé (mode développement):\n\nDe: ${senderName} (${senderEmail})\nÀ: ${recipientEmail}\nSujet: ${subject}\n\nMessage:\n${message}\n\n⚠️ Pour envoyer de vrais emails, configurez GMAIL_USER et GMAIL_APP_PASSWORD dans les variables d'environnement.`,
                  },
                ],
              };
            }

            const info = await transporter.sendMail(mailOptions);
            
            return {
              content: [
                {
                  type: 'text',
                  text: `✅ Email envoyé avec succès à ${recipientEmail}!\n\nID du message: ${info.messageId}\nDe: ${senderName} (${senderEmail})\nSujet: ${subject}`,
                },
              ],
            };

          } catch (error) {
            return {
              content: [
                {
                  type: 'text',
                  text: `❌ Erreur lors de l'envoi de l'email: ${error.message}\n\nVérifiez la configuration de votre transporteur email et vos credentials.`,
                },
              ],
            };
          }

        default:
          throw new Error(`Outil inconnu: ${name}`);
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Serveur MCP Samuel Carretero - Curriculum Vitae');
  }
}

// Démarrage du serveur
const server = new SamuelCarreteroMCPServer();
server.run().catch(console.error);