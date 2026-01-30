#!/bin/bash

# WantToGo - Watch & Rebuild Script
# Surveille les changements et rebuild automatiquement le frontend

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $(date '+%H:%M:%S') - $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%H:%M:%S') - $1"
}

log_warning() {
    echo -e "${YELLOW}[WATCH]${NC} $(date '+%H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%H:%M:%S') - $1"
}

build_frontend() {
    log_info "Building frontend..."
    cd "$FRONTEND_DIR"
    
    if npm run build; then
        log_success "Build completed successfully!"
        return 0
    else
        log_error "Build failed!"
        return 1
    fi
}

# Vérifier si inotifywait est installé
check_dependencies() {
    if ! command -v inotifywait &> /dev/null; then
        log_error "inotifywait n'est pas installé."
        log_info "Installez-le avec: sudo apt-get install inotify-tools"
        exit 1
    fi
}

# Mode dev avec Vite (hot reload natif)
dev_mode() {
    log_info "Lancement du serveur de développement Vite..."
    log_info "Le hot reload est automatique avec Vite!"
    cd "$FRONTEND_DIR"
    npm run dev
}

# Mode watch + rebuild pour production
watch_mode() {
    check_dependencies
    
    log_info "Mode Watch activé - Surveillance des fichiers..."
    log_info "Répertoire surveillé: $FRONTEND_DIR/src"
    log_warning "En attente de changements..."
    
    # Premier build
    build_frontend
    
    # Surveiller les changements
    while true; do
        inotifywait -r -e modify,create,delete,move \
            --exclude '(node_modules|dist|\.git)' \
            "$FRONTEND_DIR/src" \
            "$FRONTEND_DIR/public" \
            "$FRONTEND_DIR/index.html" \
            2>/dev/null
        
        log_warning "Changement détecté!"
        sleep 0.5  # Debounce pour éviter les builds multiples
        build_frontend
        log_warning "En attente de changements..."
    done
}

# Afficher l'aide
show_help() {
    echo ""
    echo "WantToGo - Watch & Rebuild Script"
    echo "=================================="
    echo ""
    echo "Usage: ./watch-rebuild.sh [OPTION]"
    echo ""
    echo "Options:"
    echo "  dev     Lancer le serveur de développement Vite (hot reload natif)"
    echo "  watch   Surveiller les fichiers et rebuild à chaque changement"
    echo "  build   Faire un build unique"
    echo "  help    Afficher cette aide"
    echo ""
    echo "Exemples:"
    echo "  ./watch-rebuild.sh dev     # Pour le développement (recommandé)"
    echo "  ./watch-rebuild.sh watch   # Pour des builds de production continus"
    echo "  ./watch-rebuild.sh build   # Build unique"
    echo ""
}

# Main
case "${1:-help}" in
    dev)
        dev_mode
        ;;
    watch)
        watch_mode
        ;;
    build)
        build_frontend
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        log_error "Option inconnue: $1"
        show_help
        exit 1
        ;;
esac
