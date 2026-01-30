# Subir proyecto Avatar Legal AI a GitHub (WeroMilk/AvatarLegalAI)
# Ejecutar en PowerShell desde la carpeta del proyecto: .\push-to-github.ps1

$ErrorActionPreference = "Stop"
$repoUrl = "git@github.com:WeroMilk/AvatarLegalAI.git"
$httpsUrl = "https://github.com/WeroMilk/AvatarLegalAI.git"

Set-Location $PSScriptRoot

# Comprobar que Git está instalado
$git = Get-Command git -ErrorAction SilentlyContinue
if (-not $git) {
    Write-Host "ERROR: Git no está instalado o no está en el PATH." -ForegroundColor Red
    Write-Host "Instala Git desde https://git-scm.com/download/win y vuelve a ejecutar este script." -ForegroundColor Yellow
    exit 1
}

# Inicializar repo si no existe
if (-not (Test-Path ".git")) {
    Write-Host "Inicializando repositorio Git..." -ForegroundColor Cyan
    git init
}

# Remover remote origin si ya existía (para actualizar la URL)
git remote remove origin 2>$null

# Añadir remote
Write-Host "Configurando remote origin..." -ForegroundColor Cyan
git remote add origin $repoUrl

# Rama main
git branch -M main

# Añadir todos los archivos (respetando .gitignore)
Write-Host "Añadiendo archivos..." -ForegroundColor Cyan
git add .

$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    $hasCommit = git rev-parse --verify HEAD 2>$null
    if (-not $hasCommit) {
        Write-Host "No hay archivos que subir (todo está ignorado o no hay cambios)." -ForegroundColor Yellow
        Write-Host "Si es la primera vez, asegúrate de que hay código en la carpeta." -ForegroundColor Yellow
        exit 0
    }
    Write-Host "No hay cambios nuevos. El repositorio ya está al día." -ForegroundColor Green
    Write-Host "Para subir de todos modos: git push -u origin main" -ForegroundColor Gray
    exit 0
}

# Primer commit o commit de cambios
$msg = "Initial commit: Avatar Legal AI"
$existing = git rev-parse --verify HEAD 2>$null
if ($existing) { $msg = "Update: Avatar Legal AI" }

Write-Host "Creando commit..." -ForegroundColor Cyan
git commit -m $msg

Write-Host "Subiendo a GitHub..." -ForegroundColor Cyan
git push -u origin main

Write-Host ""
Write-Host "Listo. Repositorio: https://github.com/WeroMilk/AvatarLegalAI" -ForegroundColor Green
