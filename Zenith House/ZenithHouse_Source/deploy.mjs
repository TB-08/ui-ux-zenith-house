import fs from 'fs';
import path from 'path';

const TOKEN = 'YOUR_GITHUB_TOKEN';
const OWNER = 'TB-08';
const REPO = 'zenith-house';
const BRANCH = 'main';
const SOURCE_DIR = '.';

async function apiCall(method, endpoint, body) {
    const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/${endpoint}`, {
        method,
        headers: {
            'Authorization': `token ${TOKEN}`,
            'User-Agent': 'node.js',
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API Error ${res.status}: ${text}`);
    }
    return res.json();
}

async function getFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'deploy.mjs' || file === 'check_token.mjs') continue;
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            await getFiles(filePath, fileList);
        } else {
            fileList.push(filePath);
        }
    }
    return fileList;
}

async function run() {
    try {
        console.log('Fetching latest commit...');
        const refData = await apiCall('GET', `git/ref/heads/${BRANCH}`);
        const latestCommitSha = refData.object.sha;

        console.log('Fetching latest commit tree...');
        const commitData = await apiCall('GET', `git/commits/${latestCommitSha}`);
        const baseTreeSha = commitData.tree.sha;

        console.log('Gathering files...');
        const files = await getFiles(SOURCE_DIR);
        const treeItems = [];

        console.log(`Uploading ${files.length} files in parallel...`);
        
        const CHUNK_SIZE = 20;
        for (let i = 0; i < files.length; i += CHUNK_SIZE) {
            const chunk = files.slice(i, i + CHUNK_SIZE);
            await Promise.all(chunk.map(async (file) => {
                const content = fs.readFileSync(file);
                const isBinary = file.match(/\.(png|jpg|jpeg|gif|ico|woff|woff2|ttf|eot|pdf|svg|webp|mp4|webm)$/i);
                const contentStr = isBinary ? content.toString('base64') : content.toString('utf-8');
                const encoding = isBinary ? 'base64' : 'utf-8';

                const blobData = await apiCall('POST', 'git/blobs', {
                    content: contentStr,
                    encoding: encoding
                });
                
                let githubPath = file.split(path.sep).join('/');
                if (githubPath.startsWith('./')) {
                    githubPath = githubPath.substring(2);
                }
                if (githubPath.startsWith('ZenithHouse_Source/')) {
                    githubPath = githubPath.substring('ZenithHouse_Source/'.length);
                }

                treeItems.push({
                    path: githubPath,
                    mode: '100644',
                    type: 'blob',
                    sha: blobData.sha
                });
            }));
            console.log(`Uploaded ${Math.min(i + CHUNK_SIZE, files.length)}/${files.length} files...`);
        }

        console.log('Creating tree...');
        const treeData = await apiCall('POST', 'git/trees', {
            tree: treeItems
        });

        console.log('Creating commit...');
        const newCommitData = await apiCall('POST', 'git/commits', {
            message: 'Deploy Zenith House website via Optimized Node API',
            tree: treeData.sha,
            parents: [latestCommitSha]
        });

        console.log('Updating reference...');
        await apiCall('PATCH', `git/refs/heads/${BRANCH}`, {
            sha: newCommitData.sha,
            force: true
        });

        console.log('Deployment complete!');
        console.log(`URL: https://${OWNER}.github.io/${REPO}/`);
    } catch (e) {
        console.error(e);
    }
}

run();
