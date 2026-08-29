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

        stage('Verify') {
            parallel {
                stage('Build & Lint & Test') {
                    steps {
                        sh 'npm ci'
                        sh 'npm run lint'
                        sh 'npm run test'
                        sh 'npm run build'
                    }
                }

                stage('Gitleaks (secret scan)') {
                    steps {
                        sh 'gitleaks detect --source . -v'
                    }
                }

                stage('Trivy (repository scan)') {
                    steps {
                        sh '''
                            trivy fs \
                                --severity CRITICAL,HIGH \
                                --exit-code 1 \
                                --ignore-unfixed \
                                --format table \
                                -o trivy-report.txt \
                                .
                        '''
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'trivy-report.txt', allowEmptyArchive: true
                        }
                    }
                }
            }
        }
    }
}
