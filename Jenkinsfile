pipeline {
    agent any
    
    stages {
        stage('Stop Docker Compose, Update Images') {
            steps {
                echo "Stopping Docker Compose..."
                sh "docker-compose down"

                echo "Running Docker Compose..."
                sh "docker-compose pull"

                echo "Cleaning Volumes..."
                sh "docker volume prune -f"
            }
        }

        stage('Download docker-compose.yaml file') {
            steps {
                script {
                    echo "Downloading docker-compose.yaml file..."
                    sh "aws s3 cp s3://capstone-aws-mykidz-dev-jenkins-server-resource/docker-compose.yaml ."
                }
            }
        }

        stage('Run Docker Compose') {
            steps {
                echo "Running Docker Compose..."
                sh "docker-compose up -d"
                
                echo "Cleaning Unused Images..."
                sh "docker image prune -f"
            }
        }
    }
}
