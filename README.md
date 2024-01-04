# 24-Stunden-Lauf-App v2

## Nützliche Erweiterungen

- [Folder Path Color](https://marketplace.visualstudio.com/items?itemName=VisbyDev.folder-path-color)
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)

## Next

### Wichtige Befehle

- `yarn dev` - Startet den Entwicklungsserver

## Firebase

### Wichtige Befehle

- `npm i` - Installiert alle Abhängigkeiten (**Wichtig! Diesen Befehl im `functions`-Ordner ausführen!**)
- `firebase deploy` - Deployt die Firebase-Funktionen (Die Firebase CLI muss installiert sein)

## Deployment auf Vercel

Das Deployment erfolgt automatisch über Vercel. Jeder Push auf den `main`-Branch löst ein neues Deployment aus. Falls das Repository nicht mehr mit Vercel verbunden ist,
kann es nach dieser [Anleitung](https://nextjs.org/learn-pages-router/basics/deploying-nextjs-app/deploy) importiert werden. Diese Art des Deployments ist relativ
schnell und unkompliziert, allerdings gibt es gewisse [**Einschränkungen durch die kostenlose Version**](https://vercel.com/pricing).
