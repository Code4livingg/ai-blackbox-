# Git Quick Reference

## Initial Setup

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## Basic Commands

```bash
# Check status
git status

# Stage changes
git add .
git add src/file.ts

# Commit
git commit -m "feat: Add new feature"

# View history
git log --oneline

# View branches
git branch -a
```

## Branching

```bash
# Create branch
git checkout -b feature/name

# Switch branch
git checkout develop

# Delete branch
git branch -d feature/name

# Merge branch
git merge feature/name
```

## Remote

```bash
# Add remote
git remote add origin https://github.com/user/repo.git

# Push
git push -u origin master
git push origin feature/name

# Pull
git pull origin master

# View remotes
git remote -v
```

## Undo Changes

```bash
# Discard changes
git checkout -- file.ts

# Unstage file
git reset HEAD file.ts

# Amend last commit
git commit --amend

# Revert commit
git revert <hash>
```

## Stash

```bash
# Save changes
git stash

# List stashes
git stash list

# Apply stash
git stash apply

# Apply and remove
git stash pop
```

## Useful Aliases

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.visual "log --graph --oneline --all"
```

## Commit Types

```
feat:     New feature
fix:      Bug fix
docs:     Documentation
style:    Code style
refactor: Refactoring
perf:     Performance
test:     Tests
chore:    Build/dependencies
```

## Current Status

✅ Repository initialized
✅ Initial commit: `feb4a99`
✅ 87 files tracked
✅ Ready for remote

## Next Steps

1. Create remote repository
2. Add remote: `git remote add origin <url>`
3. Push: `git push -u origin master`
4. Invite team members

---

**Status**: ✅ Ready
