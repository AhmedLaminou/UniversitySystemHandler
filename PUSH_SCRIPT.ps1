#!/usr/bin/env powershell
# Script de push - Copier-coller les commandes une par une

# ============================================================
# ÉTAPE 1 : PUSH STUDENT SERVICE
# ============================================================
Write-Host "`n========== ÉTAPE 1 : PUSH STUDENT SERVICE ==========" -ForegroundColor Cyan

git checkout feature/student
git add services/student-service/
git commit -m "fix(student-service): update port to 3000 for API Gateway integration"
git push origin feature/student

Write-Host "`n✅ Student Service poussé sur feature/student`n" -ForegroundColor Green


# ============================================================
# ÉTAPE 2 : PUSH GRADE SERVICE
# ============================================================
Write-Host "`n========== ÉTAPE 2 : PUSH GRADE SERVICE ==========" -ForegroundColor Cyan

git checkout feature/grade
git add services/grade-service/
git commit -m "fix(grade-service): update port to 8000 for API Gateway integration"
git push origin feature/grade

Write-Host "`n✅ Grade Service poussé sur feature/grade`n" -ForegroundColor Green


# ============================================================
# ÉTAPE 3 : PUSH BILLING SERVICE
# ============================================================
Write-Host "`n========== ÉTAPE 3 : PUSH BILLING SERVICE ==========" -ForegroundColor Cyan

git checkout feature/billing
git add services/billing-service/
git commit -m "feat(billing-service): implement JWT security and port 8081 updates"

git push origin feature/billing

Write-Host "`n✅ Billing Service poussé sur feature/billing`n" -ForegroundColor Green


# (Résumé final supprimé)
