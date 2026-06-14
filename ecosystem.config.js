
module.exports = {

  apps: [{

    name: 'recipe-scanner-api',

    script: './dist/main.js',

    cwd: '/opt/recipe-scanner/apps/api',

    env: {

      DATABASE_URL: 'postgresql://recipe_user:Zsx18085478812%40@127.0.0.1:5432/recipe_scanner?schema=public'

    }

  }]

};

