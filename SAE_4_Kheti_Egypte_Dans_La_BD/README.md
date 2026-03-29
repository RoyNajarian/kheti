# Guide d'Installation et Déploiement - Kheti

Procédure pour installer l'environnement en local, compiler le projet React (Vite) et le déployer sur un serveur Apache.

## 1. Installation en local

### Frontend (React/Vite)
1. À la racine du frontend, installez les dépendances :
   ```bash
   npm install
   ```
2. Créez un fichier `.env` pour cibler l'API locale :
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```
3. Lancez le serveur :
   ```bash
   npm run dev
   ```

### Backend (API)
1. Allez dans le dossier de l'API et installez les dépendances (`npm install` ou `composer install`).
2. Copiez `.env.example` en `.env` et configurez la connexion à la base de données.
3. Démarrez le serveur.

---

## 2. Build (Production)

Génération des fichiers statiques optimisés pour Apache.

1. Vérifiez que vos variables d'environnement sont bonnes (ex: `.env.production`).
2. Lancez la compilation :
   ```bash
   npm run build
   ```
3. Un dossier **`dist/`** est créé. C'est uniquement son contenu qui sera transféré.

---

## 3. Configuration Apache (.htaccess)

En production, le proxy Vite ne fonctionne plus. Apache doit rediriger les appels API vers le backend et gérer le routing de React.

Créez un fichier `.htaccess` dans le dossier **`dist/`** et collez ceci :

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On

  # --- PROXY API ---
  # Remplacez l'URL par celle de votre API en prod
  SSLProxyEngine On
  ProxyPass /api [http://votre-api-backend.com/api](http://votre-api-backend.com/api)
  ProxyPassReverse /api [http://votre-api-backend.com/api](http://votre-api-backend.com/api)

  # --- ROUTING REACT ---
  # Redirige sur index.html pour éviter les 404 au refresh
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```
*(Note : Les modules `mod_proxy` et `mod_proxy_http` doivent être activés sur le serveur)*

---

## 4. Déploiement FTP (FileZilla)

1. Connectez-vous au serveur.
2. Côté local (gauche), ouvrez le dossier `dist/`.
3. Côté distant (droite), allez dans la racine web (ex: `/var/www/html/` ou `public_html/`).
4. Videz l'ancienne version sur le serveur distant (gardez un backup si besoin).
5. Transférez tout le contenu de **`dist/`** (y compris le `.htaccess` et `assets/`).

---

## 5. Post-déploiement

* **Permissions :** Fichiers en `644`, dossiers en `755`.
* **Cache :** Testez en navigation privée ou videz le cache (Ctrl+F5).
* **Logs :** En cas d'erreur 500, vérifiez les logs (`/var/log/apache2/error.log`).