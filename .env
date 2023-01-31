module.exports = {
  apps : [{
    script: 'npm start',
  }
],
  deploy : {
    production : {
      user : 'azureuser',
      host : '20.226.3.124',
      ref  : 'origin/main',
      repo : 'https://github.com/victorktwar/analista-frontend-tvro.git',
      path : '/home/azureuser',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
