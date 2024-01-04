# 24-Stunden-Lauf-App v2

## Nützliche Erweiterungen

- [Folder Path Color](https://marketplace.visualstudio.com/items?itemName=VisbyDev.folder-path-color)
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)

## Frontend

### Next.js

Next ist das JavaScript-Framework, welches für die Entwicklung der App verwendet wird. Es basiert auf React.

- `yarn` - Installiert alle Abhängigkeiten (**Wichtig! Diesen Befehl im Haupt-Ordner ausführen!**)
- `yarn dev` - Startet den Entwicklungsserver

### Tailwind

Tailwind ist das CSS-Framework, welches für die Gestaltung der App verwendet wird. [Mehr](https://v2.tailwindcss.com/)

### Daisy UI

Daisy UI ist eine Erweiterung für Tailwind, welche vorgefertigte Komponenten zur Verfügung stellt. [Mehr](https://daisyui.com/)

## Cypress

Cypress ist das Framework, welches für das testen verwendet wird.

## Backed

### Firebase

Firebase ist die Plattform, welche für die Datenbank und die Authentifizierung verwendet wird. Firebase ist von Google und bietet eine Vielzahl an Funktionen, davon werden Firestore, Functions, Auth und Remote Config verwendet.

- `npm i` - Installiert alle Abhängigkeiten (**Wichtig! Diesen Befehl im `functions`-Ordner ausführen!**)
- `firebase deploy` - Deployt die Firebase-Funktionen (Die Firebase CLI muss installiert sein)

## Deployment

Das Deployment erfolgt automatisch über Vercel. Jeder Push auf den `main`-Branch löst ein neues Deployment aus. Falls das Repository nicht mehr mit Vercel verbunden ist,
kann es nach dieser [Anleitung](https://nextjs.org/learn-pages-router/basics/deploying-nextjs-app/deploy) importiert werden. Diese Art des Deployments ist relativ
schnell und unkompliziert, allerdings gibt es gewisse [**Einschränkungen durch die kostenlose Version**](https://vercel.com/pricing).
