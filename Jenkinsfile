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

        stage('Optimize Image (SlimToolkit)') {
            steps {
                sh '''
                    export DOCKER_API_VERSION=1.44
                    slim --crt-api-version 1.44 build \
                        --target maquinaroupa:ci \
                        --tag maquinaroupa:slim \
                        --http-probe \
                        --sensor-ipc-mode proxy \
                        --preserve-path /usr/share/nginx/html
                '''
            }
        }

        stage('Verify Optimized Image') {
            steps {
                sh '''
                    FAT_CONTAINER=$(docker create maquinaroupa:ci)
                    SLIM_CONTAINER=$(docker create maquinaroupa:slim)
                    mkdir -p bundle-fat bundle-slim
                    docker cp "$FAT_CONTAINER:/usr/share/nginx/html/." bundle-fat/
                    docker cp "$SLIM_CONTAINER:/usr/share/nginx/html/." bundle-slim/
                    docker rm -f "$FAT_CONTAINER" "$SLIM_CONTAINER"

                    if ! diff --recursive --brief bundle-fat bundle-slim; then
                        echo "ERRO: SlimToolkit removeu ou alterou arquivos do bundle estatico."
                        exit 1
                    fi

                    if grep --recursive --extended-regexp \
                        'eyJ[A-Za-z0-9_-]{20,}\\.[A-Za-z0-9_-]{20,}\\.[A-Za-z0-9_-]{20,}|sb_publishable_[A-Za-z0-9_-]+' \
                        bundle-slim; then
                        echo "ERRO: imagem contem uma chave Supabase incorporada."
                        exit 1
                    fi

                    rm -rf bundle-fat bundle-slim
                '''
            }
        }

        stage('Trivy (optimized image scan)') {
            steps {
                sh '''
                    trivy image \
                        --severity CRITICAL,HIGH \
                        --exit-code 1 \
                        --ignore-unfixed \
                        --format table \
                        -o trivy-image-report.txt \
                        maquinaroupa:slim
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'trivy-image-report.txt', allowEmptyArchive: true
                }
            }
        }
    }
}
