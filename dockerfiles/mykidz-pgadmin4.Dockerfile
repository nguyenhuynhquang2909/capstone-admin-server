# Use the official pgAdmin 4 image as base
FROM dpage/pgadmin4:snapshot

# Expose port 5000
EXPOSE 5000

# Start pgAdmin
CMD ["python", "usr/local/lib/python3.8/site-packages/pgadmin4/pgAdmin4.py"]
