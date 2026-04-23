# Leveling-Up: Strategic Growth Dashboard

**Leveling-Up** is a technical, RPG-inspired productivity dashboard designed to turn personal growth, habits, and task management into a gamified system. Track your progress with high-precision metrics, manage complex quest-lines, and level up your life through a high-performance, accessible interface.


[**try it out!**](https://disciplinewebapp.netlify.app/)
---

## 🚀 Key Features

### 1. Advanced Character System
- **Dynamic Leveling**: Earn XP by completing tasks and watch your level rise.
- **Rank Evolution**: Progress through system-defined ranks based on your level.
- **Identity Customization**: Set your character name and profile identity.

### 2. Tailored Status Attributes (Stats)
- Create custom status bars (e.g., Health, Mana, Stamina, Social, Knowledge).
- Assign unique colors to each stat for instant visual identification.
- Set manual maximums for each parameter.

### 3. Comprehensive Quest Engine
- **Main Quests**: High-priority "Prime Directives" for your long-term vision.
- **Side Quests**: Intermediate objectives with specific rewards.
- **Infinite Grind**: Repeatable tasks and habits designed for continuous improvement.
- **Custom Rewards**: Configure specific stat increases for every task you complete.

### 4. Active Threat Management
- Track "System Threats" (errors or bad habits) that carry XP penalties.
- "Accept" threats to apply penalties to your total XP when you slip up.

### 5. Skill Mastery
- Maintain a library of personal skills with descriptions.
- Track current expertise levels and unlock new capabilities.

### 6. Interaction History & Logging
- **Daily Protocol Log**: Automatically records every task completed, reward claimed, and system change.
- **Timeline View**: Review your daily activity to track consistency.

### 7. Global Diagnostics & Settings
- **Multilingual Support**: Fully localized in **English**, **French**, and **Russian**.
- **System Themes**: Choose from technical aesthetics like **Indigo**, **Rose**, **Amber**, or **Emerald**.
- **Data Management**:
    - **Export/Import**: Save your entire system state to a JSON file.
    - **Example Data**: Load a pre-configured template to see the system in action.
    - **Erase All**: Complete system wipe for a fresh start.

---

## 🛠 Technical Highlights

- **Bento-Grid UI**: A modern, structured layout that organizes information hierarchically.
- **High Performance**: Optimized for Core Web Vitals (LCP) with pre-connected fonts and efficient asset loading.
- **Accessibility (A11y)**: WCAG AA compliant contrast, semantic HTML, and full ARIA support for screen readers.
- **Responsive Design**: Fluid layout that adapts seamlessly from desktop workstations to mobile devices.
- **Data Persistence**: Synchronized in real-time with a Node.js backend using atomic JSON writes, enabling multi-device support.

---

## 📖 How to Use

1. **Initialize Your Profile**: Open the settings and set your name.
2. **Configure Your Stats**: Add the parameters you want to track (e.g., Focus, Energy).
3. **Register Tasks**: Add your first Quests or Grind tasks and assign rewards.
4. **Grind & Level Up**: Complete tasks by clicking the "Claim" or "Complete" buttons to gain XP and see your stats grow.
5. **Monitor History**: Check the History log occasionally to see your daily progress.

---

## 📦 Tech Stack
- **Frontend**: React 18+ with Vite
- **Backend**: Node.js with Express
- **Storage**: Atomic JSON File Persistence
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React

---

*This system is optimized for personal growth and productivity mapping. Proceed with consistency to unlock your full potential.*

---

## 🐧 Linux Deployment (Nginx + Systemd)

To deploy this application on a Linux server (e.g., Ubuntu/Debian), follow these steps:

### 1. Prerequisites
- Node.js 18+ installed.
- Nginx installed.
- Your code cloned to `/var/www/leveling-up`.

### 2. Build the Application
```bash
npm install
npm run build
```

### 3. Setup Systemd Service
Create a file at `/etc/systemd/system/leveling-up.service`:
```ini
[Unit]
Description=Leveling-Up Node.js Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/leveling-up
ExecStart=/usr/bin/node server.ts
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```
*Note: Using `tsx` allows running TypeScript directly in Node.js.*

### 4. Nginx Configuration
Create a site configuration at `/etc/nginx/sites-available/leveling-up`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. Permissions
Ensure the server can write to the data file:
```bash
chown -R www-data:www-data /var/www/leveling-up
chmod 664 /var/www/leveling-up/data.json
```

### 6. Start the System
```bash
sudo systemctl enable leveling-up
sudo systemctl start leveling-up
sudo ln -s /etc/nginx/sites-available/leveling-up /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Troubleshooting: MIME Type Error (.tsx)
If you see an error like `MIME type forbidden (application/octet-stream)` for `main.tsx`:
1.  **Production Mode**: Ensure you have run `npm run build` and that you are starting your server with `NODE_ENV=production`. This ensures that the server serves the compiled files from the `dist` folder instead of source files.
2.  **Nginx Configuration**: Make sure Nginx is **proxying** the requests to Node.js and not trying to serve the files itself. Avoid using `root /var/www/leveling-up;` in the same location block as `proxy_pass`.
3.  **Permissions**: Ensure the user running the service (`www-data`) has read permissions for the entire project folder.
