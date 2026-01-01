#!/bin/bash
# Deploy design app to Vercel from monorepo root
set -e

cd "$(dirname "$0")/.."

# Backup current .vercel link
if [ -f .vercel/project.json ]; then
    cp .vercel/project.json .vercel/project.json.bak
fi

# Set design project
echo '{"projectId":"prj_NARsJll7bFsjK8tkst75rcKSenEk","orgId":"team_cxSo0zrpA4SWClAmnEd8VZyb"}' > .vercel/project.json

# Temporarily remove root vercel.json so it doesn't interfere
if [ -f vercel.json ]; then
    mv vercel.json vercel.json.bak
fi

# Deploy using project settings (already configured via API)
echo "Deploying design app..."
vercel deploy --prod --yes --force

# Restore vercel.json
if [ -f vercel.json.bak ]; then
    mv vercel.json.bak vercel.json
fi

# Restore original .vercel link
if [ -f .vercel/project.json.bak ]; then
    mv .vercel/project.json.bak .vercel/project.json
fi

echo "Done!"
