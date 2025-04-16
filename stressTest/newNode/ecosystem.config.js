module.exports = {
  apps: [
    {
      name: "gold_home", // Your app name
      script: "npm",
      args: "start", // Runs `npm start`
      instances: "max", // Uses all CPU cores
      exec_mode: "cluster", // Enables clustering
      watch: true, // Prevent auto-restart on file change (disable in production)
      autorestart: true,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
