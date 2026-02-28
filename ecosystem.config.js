module.exports = {
    apps: [
      {
        name: "ws-server",
        script: "./apps/ws-server/dist/index.js",
        cwd: "/home/ubuntu/meta100x",
        instances: 1, 
        env: {
          NODE_ENV: "production",
        },
        max_memory_restart: "500M",
        log_date_format: "YYYY-MM-DD HH:mm:ss Z",
        error_file: "/home/ubuntu/logs/ws-server-error.log",
        out_file: "/home/ubuntu/logs/ws-server-out.log",
        merge_logs: true,
        restart_delay: 5000,
        max_restarts: 10,
        min_uptime: "10s",
      },
    ],
  };