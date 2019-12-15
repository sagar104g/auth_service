module.exports = {
    apps : [{
      name: 'auth_service',
      script: 'app.js',
  
      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      args: 'one two',
      instances: 1,
      autorestart: true,
      watch: true,
      ignore_watch : ["node_modules", "config"],
      max_memory_restart: '300000M',
      exp_backoff_restart_delay: 100000,
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }],
  
    deploy : {
      production : {
        user : 'ubuntu',
        host : '172.31.13.137',
        ref  : 'origin/<branch>',
        repo : 'repo path',
        path : 'path of service',
        'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env development'
      }
    }
  };
  