def writeSummary() {
    env.BUILD_RESULT = currentBuild.currentResult ?: 'SUCCESS'
    sh '''
        mkdir -p ci-summary
        RESULT="${BUILD_RESULT:-EM ANDAMENTO}"
        {
            echo "<!DOCTYPE html>"
            echo "<html lang=\\"pt-BR\\">"
            echo "<head>"
            echo "<meta charset=\\"utf-8\\">"
            echo "<title>CI Summary - ${JOB_NAME} #${BUILD_NUMBER}</title>"
            echo "<style>"
            echo "  * { box-sizing:border-box; }"
            echo "  body { font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif; background:linear-gradient(180deg,#f6f8fb 0%,#eef1f6 100%); color:#1b1f23; margin:0; padding:32px 24px 60px; }"
            echo "  .hero { background:linear-gradient(135deg,#1f2430 0%,#2d3446 60%,#3a2f55 100%); color:#fff; border-radius:14px; padding:28px 32px; margin-bottom:28px; box-shadow:0 8px 24px rgba(20,20,40,0.25); animation:fadeSlideDown .5s ease both; }"
            echo "  .hero h1 { font-size:24px; margin:0 0 10px 0; letter-spacing:.2px; }"
            echo "  .meta { color:#c7cbe0; font-size:13px; display:flex; flex-wrap:wrap; gap:6px 4px; align-items:center; }"
            echo "  .meta code { background:rgba(255,255,255,0.12); color:#fff; }"
            echo "  .result-pill { display:inline-block; padding:3px 14px; border-radius:20px; font-size:12px; font-weight:700; letter-spacing:.5px; text-transform:uppercase; }"
            echo "  .result-pill.success { background:#2da44e; color:#fff; }"
            echo "  .result-pill.failure, .result-pill.unstable { background:#cf222e; color:#fff; }"
            echo "  .result-pill.em, .result-pill.andamento { background:#9a6700; color:#fff; }"
            echo "  .cards { display:flex; flex-direction:column; gap:16px; }"
            echo "  .card { background:#ffffff; border-radius:10px; box-shadow:0 1px 2px rgba(20,20,40,0.06), 0 8px 20px rgba(20,20,40,0.05); padding:18px 22px; border-left:6px solid #8a8f98; opacity:0; transform:translateY(14px); animation:fadeSlideUp .45s ease forwards; transition:box-shadow .2s ease, transform .2s ease; }"
            echo "  .card:hover { box-shadow:0 2px 6px rgba(20,20,40,0.08), 0 14px 28px rgba(20,20,40,0.10); transform:translateY(-2px); }"
            echo "  .card.ok { border-left-color:#2da44e; }"
            echo "  .card.fail { border-left-color:#cf222e; }"
            echo "  .card h2 { font-size:16px; margin:0 0 10px 0; display:flex; align-items:center; gap:8px; }"
            echo "  .badge { display:inline-block; padding:2px 10px; border-radius:12px; font-size:12px; font-weight:600; }"
            echo "  .badge.ok { background:#dafbe1; color:#116329; }"
            echo "  .badge.fail { background:#ffebe9; color:#82071e; }"
            echo "  table { border-collapse:collapse; margin:10px 0; width:100%; max-width:520px; }"
            echo "  th, td { border:1px solid #d0d7de; padding:7px 14px; text-align:left; font-size:13px; }"
            echo "  th { background:#f6f8fa; }"
            echo "  pre { background:#0d1117; color:#c9d1d9; padding:12px 14px; border-radius:8px; overflow-x:auto; font-size:12px; max-height:420px; }"
            echo "  code { background:#eef0f2; padding:1px 6px; border-radius:4px; font-size:12px; }"
            echo "  a { color:#0969da; }"
            echo "  @keyframes fadeSlideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }"
            echo "  @keyframes fadeSlideUp { to { opacity:1; transform:translateY(0); } }"
            echo "  .cards .card:nth-child(1) { animation-delay:.15s; }"
            echo "  .cards .card:nth-child(2) { animation-delay:.23s; }"
            echo "  .cards .card:nth-child(3) { animation-delay:.31s; }"
            echo "  .cards .card:nth-child(4) { animation-delay:.39s; }"
            echo "  .cards .card:nth-child(5) { animation-delay:.47s; }"
            echo "  .cards .card:nth-child(6) { animation-delay:.55s; }"
            echo "  .cards .card:nth-child(7) { animation-delay:.63s; }"
            echo "  .cards .card:nth-child(8) { animation-delay:.71s; }"
            echo "  .cards .card:nth-child(9) { animation-delay:.79s; }"
            echo "  .cards .card:nth-child(10) { animation-delay:.87s; }"
            echo "</style>"
            echo "</head>"
            echo "<body>"
            RESULT_CLASS=$(echo "$RESULT" | tr '[:upper:]' '[:lower:]' | tr -c '[:alnum:]' '-')
            echo "<div class=\\"hero\\">"
            echo "<h1>CI Summary &mdash; ${JOB_NAME} #${BUILD_NUMBER}</h1>"
            echo "<div class=\\"meta\\"><span class=\\"result-pill ${RESULT_CLASS}\\">${RESULT}</span> &nbsp;Commit: <code>${GIT_COMMIT}</code> &nbsp;Branch: <code>${GIT_BRANCH}</code></div>"
            echo "</div>"
            echo "<div class=\\"cards\\">"
            for f in ci-summary/01-build.html ci-summary/02-gitleaks.html ci-summary/03-trivy-repo.html ci-summary/04-docker-build.html ci-summary/05-slim.html ci-summary/06-verify-image.html ci-summary/07-trivy-image.html ci-summary/08-sonarqube.html ci-summary/09-zap.html ci-summary/10-publish.html; do
                if [ -f "$f" ]; then
                    cat "$f"
                fi
            done
            echo "</div>"
            echo "</body>"
            echo "</html>"
        } > ci-summary/summary.html
    '''
}

def publishSummary() {
    publishHTML target: [
        allowMissing: true,
        alwaysLinkToLastBuild: true,
        keepAll: true,
        reportDir: 'ci-summary',
        reportFiles: 'summary.html',
        reportName: 'CI Summary'
    ]
}

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
        stage('Prepare Summary') {
            steps {
                sh 'rm -rf ci-summary && mkdir -p ci-summary'
            }
        }

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
                    post {
                        success {
                            sh '''
                                cat <<'HTMLEOF' > "${WORKSPACE}/ci-summary/01-build.html"
<div class="card ok">
<h2>&#9989; Build &amp; Lint &amp; Test</h2>
<p>Status: <span class="badge ok">SUCESSO</span></p>
<p><code>npm ci</code>, <code>npm run lint</code>, <code>npm run test</code> e <code>npm run build</code> concluidos com sucesso.</p>
</div>
HTMLEOF
                            '''
                            script { writeSummary() }
                        }
                        failure {
                            sh '''
                                cat <<'HTMLEOF' > "${WORKSPACE}/ci-summary/01-build.html"
<div class="card fail">
<h2>&#10060; Build &amp; Lint &amp; Test</h2>
<p>Status: <span class="badge fail">FALHOU</span></p>
<p>Uma das etapas (lint, test ou build) falhou. Consulte o log do stage "Build &amp; Lint &amp; Test" para detalhes.</p>
</div>
HTMLEOF
                            '''
                            script { writeSummary() }
                        }
                    }
                }

                stage('Gitleaks (secret scan)') {
                    steps {
                        dir('verify-gitleaks') {
                            checkout scm
                            sh '''
                                gitleaks detect --source . -v > gitleaks-output.txt 2>&1
                                RC=$?
                                cat gitleaks-output.txt
                                exit $RC
                            '''
                        }
                    }
                    post {
                        success {
                            sh '''
                                cat <<'HTMLEOF' > "${WORKSPACE}/ci-summary/02-gitleaks.html"
<div class="card ok">
<h2>&#9989; Gitleaks (secret scan)</h2>
<p>Status: <span class="badge ok">nenhum segredo detectado</span></p>
</div>
HTMLEOF
                            '''
                            script { writeSummary() }
                        }
                        failure {
                            sh '''
                                {
                                    echo "<div class=\\"card fail\\">"
                                    echo "<h2>&#10060; Gitleaks (secret scan)</h2>"
                                    echo "<p>Status: <span class=\\"badge fail\\">segredo(s) detectado(s)</span></p>"
                                    echo "<pre>"
                                    sed -e 's/&/\\&amp;/g' -e 's/</\\&lt;/g' -e 's/>/\\&gt;/g' verify-gitleaks/gitleaks-output.txt 2>/dev/null || echo "Relatorio nao gerado; consulte os logs."
                                    echo "</pre>"
                                    echo "</div>"
                                } > "${WORKSPACE}/ci-summary/02-gitleaks.html"
                            '''
                            script { writeSummary() }
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
                        success {
                            sh '''
                                {
                                    echo "<div class=\\"card ok\\">"
                                    echo "<h2>&#9989; Trivy Repository Scan</h2>"
                                    echo "<p>Status: <span class=\\"badge ok\\">nenhuma vulnerabilidade HIGH/CRITICAL detectada</span></p>"
                                    echo "<pre>"
                                    sed -e 's/&/\\&amp;/g' -e 's/</\\&lt;/g' -e 's/>/\\&gt;/g' verify-trivy/trivy-report.txt 2>/dev/null || echo "Relatorio nao gerado; consulte os logs."
                                    echo "</pre>"
                                    echo "</div>"
                                } > "${WORKSPACE}/ci-summary/03-trivy-repo.html"
                            '''
                            script { writeSummary() }
                        }
                        failure {
                            sh '''
                                {
                                    echo "<div class=\\"card fail\\">"
                                    echo "<h2>&#10060; Trivy Repository Scan</h2>"
                                    echo "<p>Status: <span class=\\"badge fail\\">vulnerabilidade(s) HIGH/CRITICAL detectada(s)</span></p>"
                                    echo "<pre>"
                                    sed -e 's/&/\\&amp;/g' -e 's/</\\&lt;/g' -e 's/>/\\&gt;/g' verify-trivy/trivy-report.txt 2>/dev/null || echo "Relatorio nao gerado; consulte os logs."
                                    echo "</pre>"
                                    echo "</div>"
                                } > "${WORKSPACE}/ci-summary/03-trivy-repo.html"
                            '''
                            script { writeSummary() }
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
            post {
                success {
                    sh '''
                        cat <<'HTMLEOF' > "${WORKSPACE}/ci-summary/04-docker-build.html"
<div class="card ok">
<h2>&#9989; Build Docker Image</h2>
<p>Status: <span class="badge ok">SUCESSO</span></p>
<p>Imagem <code>maquinaroupa:ci</code> construida com sucesso.</p>
</div>
HTMLEOF
                    '''
                    script { writeSummary() }
                }
                failure {
                    sh '''
                        cat <<'HTMLEOF' > "${WORKSPACE}/ci-summary/04-docker-build.html"
<div class="card fail">
<h2>&#10060; Build Docker Image</h2>
<p>Status: <span class="badge fail">FALHOU</span></p>
<p>A construcao da imagem <code>maquinaroupa:ci</code> falhou. Consulte o log do stage para detalhes.</p>
</div>
HTMLEOF
                    '''
                    script { writeSummary() }
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
                        --preserve-path /usr/share/nginx/html > slim-output.txt 2>&1
                    RC=$?
                    cat slim-output.txt
                    exit $RC
                '''
            }
            post {
                success {
                    sh '''
                        ORIGINAL_BYTES=$(docker image inspect maquinaroupa:ci --format '{{.Size}}' 2>/dev/null || echo 0)
                        SLIM_BYTES=$(docker image inspect maquinaroupa:slim --format '{{.Size}}' 2>/dev/null || echo 0)
                        ORIGINAL_SIZE=$(numfmt --to=iec-i --suffix=B "$ORIGINAL_BYTES" 2>/dev/null || echo "${ORIGINAL_BYTES} B")
                        SLIM_SIZE=$(numfmt --to=iec-i --suffix=B "$SLIM_BYTES" 2>/dev/null || echo "${SLIM_BYTES} B")
                        REDUCTION=$(awk -v original="$ORIGINAL_BYTES" -v slim="$SLIM_BYTES" 'BEGIN { if (original > 0) { printf "%.1f", (1 - slim / original) * 100 } else { print "0.0" } }')
                        FACTOR=$(grep -o "by='[0-9.]*X'" slim-output.txt 2>/dev/null | tail -1 | grep -o "[0-9.]*X" || echo "n/d")

                        {
                            echo "<div class=\\"card ok\\">"
                            echo "<h2>&#9989; Optimize Image (SlimToolkit)</h2>"
                            echo "<p>Status: <span class=\\"badge ok\\">SUCESSO</span></p>"
                            echo "<table>"
                            echo "<tr><th>Imagem</th><th>Tamanho</th></tr>"
                            echo "<tr><td>Antes - <code>maquinaroupa:ci</code></td><td>${ORIGINAL_SIZE}</td></tr>"
                            echo "<tr><td>Depois - <code>maquinaroupa:slim</code></td><td>${SLIM_SIZE}</td></tr>"
                            echo "</table>"
                            echo "<p>Reducao estimada: <strong>${REDUCTION}%</strong> &mdash; fator relatado pelo SlimToolkit: <strong>${FACTOR}</strong></p>"
                            echo "</div>"
                        } > "${WORKSPACE}/ci-summary/05-slim.html"
                    '''
                    script { writeSummary() }
                }
                failure {
                    sh '''
                        {
                            echo "<div class=\\"card fail\\">"
                            echo "<h2>&#10060; Optimize Image (SlimToolkit)</h2>"
                            echo "<p>Status: <span class=\\"badge fail\\">FALHOU</span></p>"
                            echo "<pre>"
                            sed -e 's/&/\\&amp;/g' -e 's/</\\&lt;/g' -e 's/>/\\&gt;/g' slim-output.txt 2>/dev/null || echo "Relatorio nao gerado; consulte os logs."
                            echo "</pre>"
                            echo "</div>"
                        } > "${WORKSPACE}/ci-summary/05-slim.html"
                    '''
                    script { writeSummary() }
                }
            }
        }

        stage('Verify Optimized Image') {
            steps {
                sh '''
                    (
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
                    ) > verify-image-output.txt 2>&1
                    RC=$?
                    cat verify-image-output.txt
                    exit $RC
                '''
            }
            post {
                success {
                    sh '''
                        cat <<'HTMLEOF' > "${WORKSPACE}/ci-summary/06-verify-image.html"
<div class="card ok">
<h2>&#9989; Verify Optimized Image</h2>
<p>Status: <span class="badge ok">SUCESSO</span></p>
<p>Bundle estatico identico entre imagem original e otimizada, e nenhuma chave Supabase incorporada foi encontrada.</p>
</div>
HTMLEOF
                    '''
                    script { writeSummary() }
                }
                failure {
                    sh '''
                        {
                            echo "<div class=\\"card fail\\">"
                            echo "<h2>&#10060; Verify Optimized Image</h2>"
                            echo "<p>Status: <span class=\\"badge fail\\">FALHOU</span></p>"
                            echo "<pre>"
                            sed -e 's/&/\\&amp;/g' -e 's/</\\&lt;/g' -e 's/>/\\&gt;/g' verify-image-output.txt 2>/dev/null || echo "Relatorio nao gerado; consulte os logs."
                            echo "</pre>"
                            echo "</div>"
                        } > "${WORKSPACE}/ci-summary/06-verify-image.html"
                    '''
                    script { writeSummary() }
                }
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
                success {
                    sh '''
                        {
                            echo "<div class=\\"card ok\\">"
                            echo "<h2>&#9989; Trivy Optimized Image Scan</h2>"
                            echo "<p>Status: <span class=\\"badge ok\\">imagem sem vulnerabilidades HIGH/CRITICAL</span></p>"
                            echo "<pre>"
                            sed -e 's/&/\\&amp;/g' -e 's/</\\&lt;/g' -e 's/>/\\&gt;/g' trivy-image-report.txt 2>/dev/null || echo "Relatorio nao gerado; consulte os logs."
                            echo "</pre>"
                            echo "</div>"
                        } > "${WORKSPACE}/ci-summary/07-trivy-image.html"
                    '''
                    script { writeSummary() }
                }
                failure {
                    sh '''
                        {
                            echo "<div class=\\"card fail\\">"
                            echo "<h2>&#10060; Trivy Optimized Image Scan</h2>"
                            echo "<p>Status: <span class=\\"badge fail\\">vulnerabilidade(s) HIGH/CRITICAL detectada(s) na imagem</span></p>"
                            echo "<pre>"
                            sed -e 's/&/\\&amp;/g' -e 's/</\\&lt;/g' -e 's/>/\\&gt;/g' trivy-image-report.txt 2>/dev/null || echo "Relatorio nao gerado; consulte os logs."
                            echo "</pre>"
                            echo "</div>"
                        } > "${WORKSPACE}/ci-summary/07-trivy-image.html"
                    '''
                    script { writeSummary() }
                }
            }
        }

        stage('SonarQube') {
            steps {
                dir('sonarqube') {
                    checkout scm
                    sh '''
                        (
                            sonar-scanner \
                                -Dsonar.host.url="${SONAR_HOST_URL}" \
                                -Dsonar.token="${SONAR_TOKEN}"

                            TASK_ID=$(grep '^ceTaskId=' .scannerwork/report-task.txt | cut -d= -f2)
                            STATUS="PENDING"
                            for _ in $(seq 1 30); do
                                STATUS=$(curl -s -H "Authorization: Bearer ${SONAR_TOKEN}" "${SONAR_HOST_URL}/api/ce/task?id=${TASK_ID}" | jq -r '.task.status')
                                echo "status=$STATUS"
                                if [ "$STATUS" = "SUCCESS" ] || [ "$STATUS" = "FAILED" ] || [ "$STATUS" = "CANCELED" ]; then
                                    break
                                fi
                                sleep 5
                            done
                            if [ "$STATUS" != "SUCCESS" ]; then
                                echo "Processamento da analise terminou com status $STATUS"
                                exit 1
                            fi

                            ISSUES_JSON=$(curl -s -H "Authorization: Bearer ${SONAR_TOKEN}" "${SONAR_HOST_URL}/api/issues/search?componentKeys=${SONAR_PROJECT_KEY}&severities=BLOCKER,CRITICAL,MAJOR&resolved=false&ps=1&facets=severities")
                            ISSUES=$(echo "$ISSUES_JSON" | jq -r '.total')
                            BLOCKER=$(echo "$ISSUES_JSON" | jq -r '([.facets[]? | select(.property=="severities").values[]? | select(.val=="BLOCKER").count] | first) // 0')
                            CRITICAL=$(echo "$ISSUES_JSON" | jq -r '([.facets[]? | select(.property=="severities").values[]? | select(.val=="CRITICAL").count] | first) // 0')
                            MAJOR=$(echo "$ISSUES_JSON" | jq -r '([.facets[]? | select(.property=="severities").values[]? | select(.val=="MAJOR").count] | first) // 0')
                            HOTSPOTS=$(curl -s -H "Authorization: Bearer ${SONAR_TOKEN}" "${SONAR_HOST_URL}/api/hotspots/search?projectKey=${SONAR_PROJECT_KEY}&status=TO_REVIEW&ps=1" | jq -r '.paging.total')

                            echo "BLOCKER=$BLOCKER" > sonar-result.env
                            echo "CRITICAL=$CRITICAL" >> sonar-result.env
                            echo "MAJOR=$MAJOR" >> sonar-result.env
                            echo "HOTSPOTS=$HOTSPOTS" >> sonar-result.env
                            echo "DASHBOARD=${SONAR_HOST_URL}/dashboard?id=${SONAR_PROJECT_KEY}" >> sonar-result.env

                            echo "Issues MAJOR ou piores: $ISSUES"
                            echo "Security hotspots pendentes: $HOTSPOTS"
                            if [ "$ISSUES" -gt 0 ] || [ "$HOTSPOTS" -gt 0 ]; then
                                echo "SonarQube encontrou $ISSUES issue(s) MAJOR+ e $HOTSPOTS security hotspot(s) pendentes."
                                exit 1
                            fi
                        ) > sonar-output.txt 2>&1
                        RC=$?
                        cat sonar-output.txt
                        exit $RC
                    '''
                }
            }
            post {
                success {
                    sh '''
                        . sonarqube/sonar-result.env 2>/dev/null || true
                        {
                            echo "<div class=\\"card ok\\">"
                            echo "<h2>&#9989; SonarQube</h2>"
                            echo "<p>Status: <span class=\\"badge ok\\">sem issues MAJOR+ e sem hotspots pendentes</span></p>"
                            echo "<table>"
                            echo "<tr><th>Metrica</th><th>Resultado</th></tr>"
                            echo "<tr><td>Blocker</td><td>${BLOCKER:-0}</td></tr>"
                            echo "<tr><td>Critical</td><td>${CRITICAL:-0}</td></tr>"
                            echo "<tr><td>Major</td><td>${MAJOR:-0}</td></tr>"
                            echo "<tr><td>Security hotspots pendentes</td><td>${HOTSPOTS:-0}</td></tr>"
                            echo "</table>"
                            echo "<p><a href=\\"${DASHBOARD}\\" target=\\"_blank\\">Ver dashboard completo no SonarCloud</a></p>"
                            echo "</div>"
                        } > "${WORKSPACE}/ci-summary/08-sonarqube.html"
                    '''
                    script { writeSummary() }
                }
                failure {
                    sh '''
                        {
                            echo "<div class=\\"card fail\\">"
                            echo "<h2>&#10060; SonarQube</h2>"
                            echo "<p>Status: <span class=\\"badge fail\\">issues MAJOR+ ou hotspots pendentes encontrados</span></p>"
                            echo "<pre>"
                            sed -e 's/&/\\&amp;/g' -e 's/</\\&lt;/g' -e 's/>/\\&gt;/g' sonarqube/sonar-output.txt 2>/dev/null || echo "Relatorio nao gerado; consulte os logs."
                            echo "</pre>"
                            echo "</div>"
                        } > "${WORKSPACE}/ci-summary/08-sonarqube.html"
                    '''
                    script { writeSummary() }
                }
            }
        }
    }

    post {
        always {
            script {
                writeSummary()
                publishSummary()
            }
        }
    }
}
