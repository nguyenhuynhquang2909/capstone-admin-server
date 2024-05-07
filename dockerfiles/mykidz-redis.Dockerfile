# Use the official Redis image as base
FROM redis:7.2.4-bookworm

# Expose port 6379
EXPOSE 6379

# Start Redis server
CMD ["redis-server"]
