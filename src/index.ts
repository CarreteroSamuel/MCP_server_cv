import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import nodemailer from 'nodemailer';
//import { readFile } from 'fs/promises';
//import { join } from 'path';

// Importer vos données statiques
import { INFO_PERSONNELLES } from "../data/informations_personnelles.js";
import { SKILLS_INFO } from "../data/skills.js";
import { BILAN_COMPETENCES } from "../data/bilan_competences.js";

// Configuration email - À adapter selon votre service
const EMAIL_CONFIG = {
	// Gmail/Google Workspace
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USER || 'carretero.samuel@gmail.com',
		pass: process.env.EMAIL_PASSWORD || 'your-app-password' // Mot de passe d'application
	},
};

// Email de destination (Samuel)
const SAMUEL_EMAIL = process.env.SAMUEL_EMAIL || 'carretero.samuel@gmail.com';

// Define our MCP agent with tools
export class SamuelCarreteroMCP extends McpAgent {
	server = new McpServer({
		name: "CV Samuel Carretero",
		description: "Un agent MCP qui fait office de Curriculum Vitae de Samuel Carretero.",
		version: "1.0.0",
	});

	async init() {
		// Ressouce contenant les informations du CV de Samuel Carretero
		/*this.server.resource(
			"CV Samuel Carretero",
			"file:///cv.txt",
			async (uri) => {
				try {
					// Chemin vers votre fichier cv.txt
					const filePath = join(process.cwd(), 'data', 'cv.txt');
					const fileContent = await readFile(filePath, 'utf-8');
					
					return {
						contents: [
							{
								uri: uri.pathname,
								text: fileContent,
								mimeType: "text/plain"
							},
						],
					};
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
					return {
						contents: [
							{
								uri: uri.pathname,
								text: `Erreur lors de la lecture du fichier CV: ${errorMessage}`,
								mimeType: "text/plain"
							},
						],
					};
				}
			}
		);*/

		// Outil pour récupérer les informations personnelles
		this.server.tool(
			"get_personal_info",
			{},
			async () => ({
				content: [
					{
						type: "text" as const,
						text: `Informations personnelles de Samuel Carretero :\n\n${INFO_PERSONNELLES}`,
					},
				],
			})
		);

		// Outil pour récupérer les compétences et expériences
		this.server.tool(
			"get_skills",
			{},
			async () => ({
				content: [
					{
						type: "text" as const,
						text: `Voici le profil complet des compétences et expériences de Samuel Carretero :\n\n${SKILLS_INFO}`,
					},
				],
			})
		);

		// Outil pour récupérer le bilan de compétences
		this.server.tool(
			"get_bilan_competences",
			{},
			async () => ({
				content: [
					{
						type: "text" as const,
						text: `Voici le bilan de compétences de Samuel Carretero :\n\n${BILAN_COMPETENCES}`,
					},
				],
			})
		);

		// Outil pour envoyer un message à Samuel
		this.server.tool(
			"send_message",
			{
				sujet: z.string().min(1, "Le sujet ne peut pas être vide").describe("Sujet de l'email"),
				message: z.string().min(1, "Le message ne peut pas être vide").describe("Contenu du message"),
				expediteur: z.string().min(1, "Le nom ne peut pas être vide").describe("Nom de l'expéditeur"),
				email: z.string()
					.email("Format d'email invalide")
					.min(1, "L'email ne peut pas être vide")
					.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "L'email doit avoir un format valide")
					.describe("Email de l'expéditeur"),
			},
			async ({ sujet, message, expediteur, email }) => {
				try {
					// Validation supplémentaire côté serveur
					const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
					if (!emailRegex.test(email)) {
						return {
							content: [
								{
									type: "text" as const,
									text: `❌ Erreur: L'adresse email "${email}" n'est pas valide. Veuillez fournir une adresse email au format correct (exemple: nom@domaine.com).`,
								},
							],
						};
					}

					// Validation des champs requis
					if (!sujet.trim() || !message.trim() || !expediteur.trim()) {
						return {
							content: [
								{
									type: "text" as const,
									text: `❌ Erreur: Tous les champs sont obligatoires. Veuillez remplir le sujet, le message et votre nom.`,
								},
							],
						};
					}

					// Création du transporteur email
					const transporter = nodemailer.createTransport(EMAIL_CONFIG);

					// Vérification de la connexion
					await transporter.verify();

					// Préparation du contenu email
					const htmlContent = `
						<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
							<h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
								📧 Nouveau message via CV MCP
							</h2>
							
							<div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
								<h3 style="color: #495057; margin-top: 0;">Informations de l'expéditeur</h3>
								<p><strong>Nom:</strong> ${expediteur.trim()}</p>
								<p><strong>Email:</strong> <a href="mailto:${email.toLowerCase().trim()}">${email.toLowerCase().trim()}</a></p>
							</div>
							
							<div style="margin: 20px 0;">
								<h3 style="color: #495057;">Sujet</h3>
								<p style="font-size: 16px; font-weight: bold; color: #333;">${sujet.trim()}</p>
							</div>
							
							<div style="margin: 20px 0;">
								<h3 style="color: #495057;">Message</h3>
								<div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #007bff; margin: 10px 0; white-space: pre-wrap;">${message.trim()}</div>
							</div>
							
							<hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
							<p style="color: #6c757d; font-size: 12px; text-align: center;">
								Ce message a été envoyé automatiquement via le CV MCP de Samuel Carretero<br>
								Date: ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}
							</p>
						</div>
					`;

					const textContent = `
Nouveau message via CV MCP de Samuel Carretero

De: ${expediteur.trim()} (${email.toLowerCase().trim()})
Sujet: ${sujet.trim()}

Message:
${message.trim()}

---
Date: ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}
					`;

					// Configuration du mail
					const mailOptions = {
						from: {
							name: `CV MCP - ${expediteur.trim()}`,
							address: EMAIL_CONFIG.auth.user
						},
						to: SAMUEL_EMAIL,
						replyTo: email.toLowerCase().trim(),
						sujet: `[CV MCP] ${sujet.trim()}`,
						text: textContent,
						html: htmlContent,
						headers: {
							'X-Original-Sender': email.toLowerCase().trim(),
							'X-Original-Name': expediteur.trim(),
							'X-Source': 'CV-MCP-Server'
						}
					};

					// Envoi du mail
					const info = await transporter.sendMail(mailOptions);

					// Email de confirmation à l'expéditeur (optionnel)
					const confirmationMail = {
						from: {
							name: 'Samuel Carretero - CV MCP',
							address: EMAIL_CONFIG.auth.user
						},
						to: email.toLowerCase().trim(),
						sujet: `Confirmation: Votre message a été envoyé à Samuel Carretero`,
						html: `
							<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
								<h2 style="color: #28a745;">✅ Message envoyé avec succès !</h2>
								<p>Bonjour ${expediteur.trim()},</p>
								<p>Votre message a bien été transmis à Samuel Carretero.</p>
								<p><strong>Sujet:</strong> ${sujet.trim()}</p>
								<p>Vous recevrez une réponse directement à cette adresse email.</p>
								<p>Cordialement,<br>Le système CV MCP de Samuel Carretero</p>
							</div>
						`
					};

					// Envoi de la confirmation (non-bloquant)
					transporter.sendMail(confirmationMail).catch((err:any) => {
						console.warn('Erreur envoi confirmation:', err.message);
					});

					return {
						content: [
							{
								type: "text" as const,
								text: `✅ Message envoyé avec succès à Samuel Carretero !

📧 **Récapitulatif:**
- **À:** ${SAMUEL_EMAIL}
- **De:** ${expediteur.trim()} (${email.toLowerCase().trim()})
- **Sujet:** ${sujet.trim()}
- **ID Message:** ${info.messageId}
- **Date:** ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}

📬 Un email de confirmation a également été envoyé à ${email.toLowerCase().trim()}

Samuel vous répondra directement à votre adresse email.`,
							},
						],
					};

				} catch (error: any) {
					console.error('Erreur envoi email:', error);
					
					// Messages d'erreur spécifiques
					let errorMessage = "❌ Erreur lors de l'envoi de l'email.";
					
					if (error.code === 'EAUTH') {
						errorMessage += " Problème d'authentification email. Vérifiez les identifiants.";
					} else if (error.code === 'ECONNECTION') {
						errorMessage += " Impossible de se connecter au serveur email.";
					} else if (error.code === 'EMESSAGE') {
						errorMessage += " Problème avec le contenu du message.";
					} else {
						errorMessage += ` Détails: ${error.message}`;
					}

					return {
						content: [
							{
								type: "text" as const,
								text: `${errorMessage}\n\nVeuillez réessayer plus tard ou contacter Samuel directement à ${SAMUEL_EMAIL}`,
							},
						],
					};
				}
			}
		);

		// Prompts pour guider l'utilisation des outils
		this.server.prompt(
			"informations-personnelles",
			"Récupère les informations personnelles de Samuel Carretero",
			{},
			async () => ({
				description: "Prompt pour récupérer les informations personnelles de Samuel Carretero",
				messages: [
					{
						role: "user" as const,
						content: {
							type: "text",
							text: "Utilise l'outil get_personal_info pour récupérer les informations personnelles de Samuel Carretero et les afficher de manière claire et organisée.",
						},
					},
				],
			})
		);

		this.server.prompt(
			"skills",
			"Affiche le profil détaillé des compétences techniques, expériences et formations de Samuel Carretero",
			{},
			async () => ({
				description: "Prompt pour afficher les compétences de Samuel Carretero",
				messages: [
					{
						role: "user" as const,
						content: {
							type: "text",
							text: "Utilise l'outil get_skills pour récupérer la liste des compétences techniques et expériences de Samuel Carretero et les présenter de manière structurée et visuellement attrayante.",
						},
					},
				],
			})
		);

		this.server.prompt(
			"bilan-competences",
			"Affiche le bilan de compétences de Samuel Carretero",
			{},
			async () => ({
				description: "Prompt pour afficher le bilan de compétences de Samuel Carretero",
				messages: [
					{
						role: "user" as const,
						content: {
							type: "text",
							text: "Utilise l'outil get_bilan_competences pour récupérer le bilan de compétences de Samuel Carretero et le présenter toutes les informations de manière structurée et visuellement attrayante.",
						},
					},
				],
			})
		);

		this.server.prompt(
			"send-message",
			"Envoyer un message à Samuel Carretero",
			{
				sujet: z.string().min(1, "Le sujet ne peut pas être vide").describe("Sujet du message"),
				message: z.string().min(1, "Le message ne peut pas être vide").describe("Contenu du message"),
				expediteur: z.string().min(1, "Le nom ne peut pas être vide").describe("Nom de l'expéditeur"),
				email: z.string()
					.email("Format d'email invalide")
					.min(1, "L'email ne peut pas être vide")
					.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "L'email doit avoir un format valide")
					.describe("Email de l'expéditeur"),
			},
			async ({ sujet, message, expediteur, email }) => ({
				description: "Prompt pour envoyer un message à Samuel Carretero",
				messages: [
					{
						role: "user" as const,
						content: {
							type: "text",
							text: `Envoie un message à Samuel Carretero avec les informations suivantes :
- Sujet: ${sujet}
- Message: ${message}
- Nom de l'expéditeur: ${expediteur}
- Email de l'expéditeur: ${email}

Utilise l'outil send_message pour transmettre ces informations.`,
						},
					},
				],
			})
		);
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return SamuelCarreteroMCP.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			return SamuelCarreteroMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};