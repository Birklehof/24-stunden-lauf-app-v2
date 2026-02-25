# 24-Stunden-Lauf-App v2

## Organisation

Die App an sich enthält keine Administrationsoberfläche. Die Administration erfolgt über ein [Python-Skript](https://github.com/Birklehof/24-stunden-lauf-app-admin-cli).

### Ablauf

- 🔧 Import der Schüler und Mitarbeiter als Läufer
- 🔧 Export der Teilnehmerliste
- Verteilung der Startnummern **entsprechend der Teilnehmerliste**
- 🔧 Erstellung der Zugangscodes für die Helfer (Die Helfer können sich mit diesen Zugangscodes anmelden und die gelaufenen Runden erfassen)
- 🎰 24-Stunden-Lauf (Rundenerfassung, Live-Statistiken, etc.)
- 🔧 Export der Ergebnisse (Die Ergebnisliste ist eine einfache CSV-Datei, die Daten sollten dementsprechend aufbereitet werden)

🔧 - dieser Schritt erfolgt im Python-Skript
🎰 - dieser Schritt erfolgt in der App

## Frontend

### Next.js

Next ist das JavaScript-Framework, welches für die Entwicklung der App verwendet wird. Es basiert auf React. [Mehr](https://nextjs.org/)

(`nvm use 22.19`)

- `yarn` - Installiert alle Abhängigkeiten (**Wichtig! Diesen Befehl im Haupt-Ordner ausführen!**)
- `yarn dev` - Startet den Entwicklungsserver

### Tailwind

Tailwind ist das CSS-Framework, welches für die Gestaltung der App verwendet wird. [Mehr](https://v2.tailwindcss.com/)

### Daisy UI

Daisy UI ist eine Erweiterung für Tailwind, welche vorgefertigte Komponenten zur Verfügung stellt. [Mehr](https://daisyui.com/)

## Backend

### Firebase

Firebase ist die Plattform, welche für die Datenbank und die Authentifizierung verwendet wird. Firebase ist von Google und bietet eine Vielzahl an Funktionen, davon werden Firestore, Functions, Auth und Remote Config verwendet.

Der Code und die Konfiguration für Firebase findet sich [hier](https://github.com/Birklehof/24-stunden-lauf-app-firebase).

## Deployment

Das Deployment erfolgt automatisch über Vercel. Jeder Push auf den `main`-Branch löst ein neues Deployment aus. Falls das Repository nicht mehr mit Vercel verbunden ist,
kann es nach dieser [Anleitung](https://nextjs.org/learn-pages-router/basics/deploying-nextjs-app/deploy) importiert werden. Diese Art des Deployments ist relativ
schnell und unkompliziert, allerdings gibt es gewisse [**Einschränkungen durch die kostenlose Version**](https://vercel.com/pricing).

## Sonstiges

### Nützliche Erweiterungen

- [Folder Path Color](https://marketplace.visualstudio.com/items?itemName=VisbyDev.folder-path-color)
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
