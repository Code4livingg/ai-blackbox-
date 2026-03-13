# AI Blackbox - Git Setup Guide

## Repository Initialized ✅

The AI Blackbox project has been initialized as a Git repository with the initial commit.

## Initial Commit Details

**Commit Hash**: `feb4a99`
**Branch**: `master`
**Message**: "Initial commit - AI Blackbox forensic accountability system"

**Files Included**: 87 files
- Backend source code (src/)
- Frontend dashboard (dashboard/)
- Configuration files (serverless.yml, tsconfig.json, etc.)
- Documentation (40+ markdown files)
- Scripts (setup, cleanup, testing)
- Package configurations

## Repository Structure

```
ai-blackbox/
├── .git/                          # Git repository
├── .gitignore                     # Git ignore rules
├── src/                           # Backend source
│   ├── api/
│   │   ├── server.ts
│   │   └── handler.ts
│   ├── crypto/
│   ├── risk/
│   ├── replay/
│   └── storage/
├── dashboard/                     # Frontend React app
│   ├── src/
│   ├── public/
│   └── package.json
├── serverless.yml                 # Serverless config
├── package.json                   # Backend dependencies
├── tsconfig.json                  # TypeScript config
├── scripts/                       # Utility scripts
└── [40+ documentation files]      # Comprehensive docs
```

## Git Configuration

### Set User Information

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Set Global Configuration (Optional)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Common Git Commands

### View Commit History

```bash
# View last commit
git log -1

# View last 10 commits
git log -10

# View commits with details
git log --oneline --graph --all

# View commits for specific file
git log -- src/api/server.ts
```

### Create Branches

```bash
# Create new branch
git branch feature/new-feature

# Switch to branch
git checkout feature/new-feature

# Create and switch in one command
git checkout -b feature/new-feature

# List all branches
git branch -a
```

### Make Changes and Commit

```bash
# Check status
git status

# Stage specific file
git add src/api/server.ts

# Stage all changes
git add .

# Commit changes
git commit -m "Add new feature"

# Commit with detailed message
git commit -m "Add new feature

- Detailed description
- More details
- Even more details"
```

### Push to Remote

```bash
# Add remote repository
git remote add origin https://github.com/username/ai-blackbox.git

# Push to remote
git push -u origin master

# Push specific branch
git push origin feature/new-feature

# Push all branches
git push --all
```

### Pull from Remote

```bash
# Pull latest changes
git pull origin master

# Pull specific branch
git pull origin feature/new-feature
```

## Branching Strategy

### Recommended Workflow

```
master (production)
  ↑
  ├── develop (development)
  │   ├── feature/severity-scoring
  │   ├── feature/landing-page
  │   └── feature/serverless-deployment
  │
  └── hotfix/bug-fix
```

### Branch Naming Conventions

- **Feature**: `feature/description` (e.g., `feature/severity-scoring`)
- **Bugfix**: `bugfix/description` (e.g., `bugfix/hash-chain-error`)
- **Hotfix**: `hotfix/description` (e.g., `hotfix/critical-security-issue`)
- **Release**: `release/version` (e.g., `release/1.0.0`)

## Commit Message Guidelines

### Format

```
<type>: <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions/changes
- `chore`: Build/dependency changes

### Examples

```bash
# Simple commit
git commit -m "feat: Add severity scoring system"

# Detailed commit
git commit -m "feat: Add severity scoring system

- Implement 0-100 severity score model
- Add risk escalation detection
- Add security keyword detection
- Integrate with /api/analyze endpoint"
```

## Remote Repository Setup

### GitHub

1. **Create Repository on GitHub**:
   - Go to github.com/new
   - Name: `ai-blackbox`
   - Description: "Forensic accountability system for AI decisions"
   - Make it public or private
   - Don't initialize with README (we have one)

2. **Add Remote**:
   ```bash
   git remote add origin https://github.com/username/ai-blackbox.git
   ```

3. **Push Initial Commit**:
   ```bash
   git branch -M main
   git push -u origin main
   ```

### GitLab

```bash
git remote add origin https://gitlab.com/username/ai-blackbox.git
git push -u origin master
```

### Bitbucket

```bash
git remote add origin https://bitbucket.org/username/ai-blackbox.git
git push -u origin master
```

## Collaboration Workflow

### For Team Members

1. **Clone Repository**:
   ```bash
   git clone https://github.com/username/ai-blackbox.git
   cd ai-blackbox
   ```

2. **Create Feature Branch**:
   ```bash
   git checkout -b feature/your-feature
   ```

3. **Make Changes**:
   ```bash
   # Edit files
   git add .
   git commit -m "feat: Your feature description"
   ```

4. **Push Branch**:
   ```bash
   git push origin feature/your-feature
   ```

5. **Create Pull Request**:
   - Go to GitHub/GitLab
   - Create PR from `feature/your-feature` to `develop`
   - Add description and request review

6. **Merge After Review**:
   ```bash
   git checkout develop
   git pull origin develop
   git merge feature/your-feature
   git push origin develop
   ```

## Useful Git Aliases

Add to `.gitconfig`:

```bash
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = log --graph --oneline --all
    amend = commit --amend --no-edit
```

Usage:

```bash
git st          # git status
git co -b feat  # git checkout -b feat
git ci -m "msg" # git commit -m "msg"
```

## Ignoring Files

The `.gitignore` file includes:

```
node_modules/
dist/
.env
.env.local
.vscode/
.idea/
.DS_Store
.serverless/
coverage/
logs/
```

### Add More Patterns

```bash
# Ignore specific file
echo "*.log" >> .gitignore

# Ignore directory
echo "temp/" >> .gitignore

# Commit changes
git add .gitignore
git commit -m "chore: Update gitignore"
```

## Undoing Changes

### Undo Uncommitted Changes

```bash
# Discard changes in working directory
git checkout -- src/api/server.ts

# Discard all changes
git checkout -- .

# Unstage file
git reset HEAD src/api/server.ts
```

### Undo Committed Changes

```bash
# Amend last commit
git commit --amend

# Revert specific commit
git revert <commit-hash>

# Reset to previous commit (careful!)
git reset --hard <commit-hash>
```

## Viewing Changes

```bash
# View unstaged changes
git diff

# View staged changes
git diff --staged

# View changes in specific file
git diff src/api/server.ts

# View changes between commits
git diff <commit1> <commit2>
```

## Stashing Changes

```bash
# Stash current changes
git stash

# List stashes
git stash list

# Apply stash
git stash apply

# Apply and remove stash
git stash pop

# Delete stash
git stash drop
```

## Tags

```bash
# Create tag
git tag v1.0.0

# Create annotated tag
git tag -a v1.0.0 -m "Version 1.0.0"

# List tags
git tag -l

# Push tags
git push origin --tags

# Delete tag
git tag -d v1.0.0
```

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run test
```

## Troubleshooting

### Issue: "fatal: not a git repository"

**Solution**: Initialize git:
```bash
git init
```

### Issue: "Your branch is ahead of 'origin/master'"

**Solution**: Push changes:
```bash
git push origin master
```

### Issue: "Merge conflict"

**Solution**: Resolve conflicts manually, then:
```bash
git add .
git commit -m "Resolve merge conflict"
```

### Issue: "Detached HEAD"

**Solution**: Return to branch:
```bash
git checkout master
```

## Best Practices

1. **Commit Often**: Small, logical commits are easier to review
2. **Write Good Messages**: Clear commit messages help future developers
3. **Pull Before Push**: Always pull latest changes before pushing
4. **Use Branches**: Keep master clean, use feature branches
5. **Review Code**: Use pull requests for code review
6. **Test Before Commit**: Ensure code works before committing
7. **Keep History Clean**: Use rebase for linear history (optional)
8. **Document Changes**: Update README and docs with changes

## Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)
- [Pro Git Book](https://git-scm.com/book/en/v2)

## Summary

✅ Git repository initialized
✅ Initial commit created (87 files)
✅ .gitignore configured
✅ Ready for remote repository
✅ Ready for team collaboration

## Next Steps

1. **Create Remote Repository**:
   - GitHub, GitLab, or Bitbucket

2. **Add Remote**:
   ```bash
   git remote add origin <repository-url>
   ```

3. **Push to Remote**:
   ```bash
   git push -u origin master
   ```

4. **Invite Team Members**:
   - Add collaborators to repository
   - Share repository URL

5. **Set Up CI/CD**:
   - Configure GitHub Actions or similar
   - Set up automated testing and deployment

---

**Repository Status**: ✅ Initialized and Ready
**Initial Commit**: ✅ Complete
**Files Tracked**: 87
**Ready for Remote**: Yes
