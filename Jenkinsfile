pipeline {
    agent { label 'docker' }

    tools {
        nodejs 'node-22'
    }

    options {
        ansiColor('xterm')
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Lint & Test') {
            steps {
                sh 'npm ci'
                sh 'npm run lint'
                sh 'npm run test'
                sh 'npm run build'
            }
        }
    }
}
