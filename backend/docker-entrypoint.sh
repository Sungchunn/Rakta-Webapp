#!/bin/bash
set -e

# =============================================================================
# Docker Entrypoint Script for Rakta Backend
# =============================================================================
# This script parses Render's DATABASE_URL (postgres://user:pass@host:port/db)
# and converts it to Spring-compatible SPRING_DATASOURCE_* environment variables.
#
# Render provides DATABASE_URL in postgres:// format, but Spring Boot needs:
#   - SPRING_DATASOURCE_URL=jdbc:postgresql://host:port/db
#   - SPRING_DATASOURCE_USERNAME=user
#   - SPRING_DATASOURCE_PASSWORD=pass
# =============================================================================

# Parse DATABASE_URL if provided and SPRING_DATASOURCE_URL is not already set
if [ -n "$DATABASE_URL" ] && [ -z "$SPRING_DATASOURCE_URL" ]; then
    echo "🔧 Parsing DATABASE_URL for Spring datasource configuration..."
    
    # Remove postgres:// or postgresql:// prefix
    url_without_protocol="${DATABASE_URL#postgres://}"
    url_without_protocol="${url_without_protocol#postgresql://}"
    
    # Extract user:password (everything before @)
    userpass="${url_without_protocol%%@*}"
    
    # Extract username (everything before first :)
    export SPRING_DATASOURCE_USERNAME="${userpass%%:*}"
    
    # Extract password (everything after first :)
    export SPRING_DATASOURCE_PASSWORD="${userpass#*:}"
    
    # Extract host:port/database (everything after @)
    hostportdb="${url_without_protocol#*@}"
    
    # Extract host:port (everything before /)
    host_port="${hostportdb%%/*}"
    
    # Extract database name (everything after /, but before any query params)
    database="${hostportdb#*/}"
    database="${database%%\?*}"
    
    # Construct JDBC URL
    export SPRING_DATASOURCE_URL="jdbc:postgresql://${host_port}/${database}"
    
    echo "✅ Configured datasource: jdbc:postgresql://${host_port}/${database}"
    echo "✅ Configured username: ${SPRING_DATASOURCE_USERNAME}"
    echo "✅ Password: [REDACTED]"
fi

# Execute the main command (java -jar app.jar)
echo "🚀 Starting Spring Boot application..."
exec "$@"
