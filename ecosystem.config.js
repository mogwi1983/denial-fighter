module.exports = {
  apps: [{
    name: 'denial-fighter',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    env: {
      PORT: 3005,
      NODE_ENV: 'production',
    },
    env_file: '.env.local',
    max_memory_restart: '500M',
    error_file: '/var/log/denial-fighter.err.log',
    out_file: '/var/log/denial-fighter.out.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  }]
};
