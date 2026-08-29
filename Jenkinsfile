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
        stage('Verify') {
            parallel {
                stage('Build & Lint & Test') {
                    steps {
                        dir('verify-build') {
                            checkout scm
                            sh 'npm ci'
                            sh 'npm run lint'
                            sh 'npm run test'
                            sh 'npm run build'
                        }
                    }
                }

                stage('Gitleaks (secret scan)') {
                    steps {
                        dir('verify-gitleaks') {
                            checkout scm
                            sh 'gitleaks detect --source . -v'
                        }
                    }
                }

                stage('Trivy (repository scan)') {
                    steps {
                        dir('verify-trivy') {
                            checkout scm
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
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'verify-trivy/trivy-report.txt', allowEmptyArchive: true
                        }
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('docker-build') {
                    checkout scm
                    sh '''
                        export DOCKER_BUILDKIT=1
                        docker build \
                            --file IAC/Dockerfile \
                            --tag maquinaroupa:ci \
                            --label org.opencontainers.image.revision="${GIT_COMMIT}" \
                            .
                    '''
                }
            }
        }
    }
}
