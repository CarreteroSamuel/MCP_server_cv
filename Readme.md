# Serveur MCP - Informations Personnelles & Compétences

Ce serveur MCP fournit deux prompts personnalisés à Claude Desktop pour afficher vos informations personnelles et vos compétences techniques.

## 🚀 Installation

### 1. Prérequis
- Node.js 18+ installé sur votre système
- Claude Desktop installé

### 2. Installation du projet

```bash
# Clonez ou créez le dossier du projet
mkdir personal-info-mcp-server
cd personal-info-mcp-server

# Créez le package.json et installez les dépendances
npm init -y
npm install @modelcontextprotocol/sdk
```

### 3. Copiez les fichiers
- Copiez le contenu du fichier `index.js` dans votre projet
- Modifiez le `package.json` avec la configuration fournie

### 4. Configuration de Claude Desktop

#### Sur macOS/Linux :
Éditez le fichier `~/Library/Application Support/Claude/claude_desktop_config.json`

#### Sur Windows :
Éditez le fichier `%APPDATA%\Claude\claude_desktop_config.json`

Ajoutez la configuration MCP :

```json
{
  "mcpServers": {
    "personal-info": {
      "command": "node",
      "args": ["/chemin/absolu/vers/votre/projet/index.js"],
      "env": {}
    }
  }
}
```

**Important**: Remplacez `/chemin/absolu/vers/votre/projet/index.js` par le chemin réel vers votre fichier index.js

### 5. Redémarrage
Redémarrez Claude Desktop pour charger le nouveau serveur MCP.

## 🎯 Utilisation

### Prompts disponibles :

1. **"Informations personnelles"** - Affiche vos informations de contact et professionnelles
2. **"Skills"** - Présente vos compétences techniques organisées par catégories

### Comment utiliser :
1. Ouvrez Claude Desktop
2. Dans une nouvelle conversation, tapez `/` pour voir les prompts disponibles
3. Sélectionnez "Informations personnelles" ou "Skills"
4. Claude utilisera automatiquement les outils MCP pour récupérer et afficher les informations

## 🔧 Personnalisation

### Modifier les informations personnelles :
Éditez la constante `PERSONAL_INFO` dans `index.js` avec vos vraies informations.

### Modifier les compétences :
Éditez la constante `SKILLS_INFO` dans `index.js` avec vos compétences réelles.

## 🐛 Dépannage

### Le serveur ne se connecte pas :
1. Vérifiez que le chemin dans la configuration est correct
2. Assurez-vous que Node.js est dans votre PATH
3. Vérifiez les logs de Claude Desktop

### Les prompts n'apparaissent pas :
1. Redémarrez Claude Desktop
2. Vérifiez la syntaxe JSON de votre configuration
3. Testez le serveur en mode standalone : `node index.js`

## 📁 Structure du projet

```
personal-info-mcp-server/
├── index.js                 # Serveur MCP principal
├── package.json            # Configuration npm
└── README.md              # Documentation
```

## 🔄 Développement

Pour développer et tester :

```bash
# Mode développement avec rechargement automatique
npm run dev

# Démarrage normal
npm start
```

## 📝 Notes

- Les données sont actuellement en dur dans le code
- Pour une version production, vous pourriez les externaliser dans un fichier JSON ou une base de données
- Le serveur utilise le transport stdio pour communiquer avec Claude Desktop