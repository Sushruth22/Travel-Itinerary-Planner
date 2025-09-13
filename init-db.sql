-- Create database and user if they don't exist
-- This file is optional as the postgres image will create the database based on environment variables
SELECT 'CREATE DATABASE travel_planner'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'travel_planner');
