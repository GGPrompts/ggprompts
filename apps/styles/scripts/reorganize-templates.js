// Script to help reorganize templates into consolidated categories
const fs = require('fs');

const content = fs.readFileSync('app/templates/page.tsx', 'utf8');

// Extract the templates object
const templatesMatch = content.match(/const templates = \{([\s\S]*?)\n\};\n\n\/\/ Calculate total/);

if (templatesMatch) {
  console.log('✓ Found templates object');
  console.log('\nReorganization Plan:');
  console.log('====================');

  const categoryMapping = {
    'dashboards': ['dashboards', 'specialized_dashboards'],
    'devtools': ['devtools'],
    'ecommerce': ['ecommerce'],
    'business': ['saas', 'onboarding', 'social', 'gaming', 'compliance'],
    'auth_billing': ['auth', 'billing'],
    'marketing': ['marketing', 'landing', 'launch'],
    'content': ['blog', 'portfolio', 'projects', 'resumes'],
    'tools': ['forms', 'email'],
    'operations': ['monitoring', 'utility']
  };

  console.log('\nNew Categories:');
  Object.entries(categoryMapping).forEach(([newCat, oldCats]) => {
    console.log(`${newCat}: ${oldCats.join(', ')}`);
  });
}
