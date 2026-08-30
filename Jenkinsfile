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
            echo "  .card h3 { font-size:13px; margin:14px 0 6px 0; padding-top:12px; border-top:1px solid #eaecef; color:#57606a; text-transform:uppercase; letter-spacing:.4px; }"
            echo "  .card h3:first-of-type { border-top:none; padding-top:0; margin-top:0; }"
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
            for f in ci-summary/01-build.html ci-summary/02-gitleaks.html ci-summary/03-trivy-repo.html ci-summary/04-docker-build.html; do
                if [ -f "$f" ]; then
                    cat "$f"
                fi
            done
            if [ -f ci-summary/05a-status.txt ] || [ -f ci-summary/05b-status.txt ]; then
                CARD_CLASS="ok"
                if [ -f ci-summary/05a-status.txt ] && [ "$(cat ci-summary/05a-status.txt)" = "fail" ]; then CARD_CLASS="fail"; fi
                if [ -f ci-summary/05b-status.txt ] && [ "$(cat ci-summary/05b-status.txt)" = "fail" ]; then CARD_CLASS="fail"; fi
                ICON="&#9989;"
                if [ "$CARD_CLASS" = "fail" ]; then ICON="&#10060;"; fi
                echo "<div class=\\"card ${CARD_CLASS}\\">"
                echo "<h2>${ICON} Imagem Otimizada (SlimToolkit + Trivy)</h2>"
                if [ -f ci-summary/05a-body.html ]; then cat ci-summary/05a-body.html; else echo "<p><em>Aguardando SlimToolkit...</em></p>"; fi
                if [ -f ci-summary/05b-body.html ]; then cat ci-summary/05b-body.html; else echo "<p><em>Aguardando Trivy image scan...</em></p>"; fi
                echo "</div>"
            fi
            for f in ci-summary/08-sonarqube.html ci-summary/09-checkov.html ci-summary/10-zap.html ci-summary/11-publish.html; do
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

def tryUnstash(name) {
    try {
        unstash name
    } catch (e) {
        echo "Aviso: stash '${name}' nao encontrado (stage correspondente pode nao ter rodado)."
    }
}

pipeline {
    agent none

    options {
        ansiColor('xterm')
        timestamps()
    }

    stages {
        stage('Verify') {
            parallel {
                stage('Build & Lint & Test') {
                    agent { label 'docker' }
                    tools {
                        nodejs 'node-22'
                    }
                    steps {
                        sh 'mkdir -p ci-summary'
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
                            stash name: 'summary-01', includes: 'ci-summary/01-build.html'
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
                            stash name: 'summary-01', includes: 'ci-summary/01-build.html'
                        }
                    }
                }

                stage('Gitleaks (secret scan)') {
                    agent { label 'docker' }
                    steps {
                        sh 'mkdir -p ci-summary'
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
                            stash name: 'summary-02', includes: 'ci-summary/02-gitleaks.html'
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
                            stash name: 'summary-02', includes: 'ci-summary/02-gitleaks.html'
                        }
                    }
                }

                stage('Trivy (repository scan)') {
                    agent { label 'docker' }
                    steps {
                        sh 'mkdir -p ci-summary'
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
                            stash name: 'summary-03', includes: 'ci-summary/03-trivy-repo.html'
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
                            stash name: 'summary-03', includes: 'ci-summary/03-trivy-repo.html'
                        }
                    }
                }

                stage('Checkov (IaC security scan)') {
                    agent { label 'docker' }
                    steps {
                        sh 'mkdir -p ci-summary'
                        dir('checkov') {
                            checkout scm
                            sh '''
                                checkov \
                                    --directory . \
                                    --compact \
                                    --skip-framework terraform_plan \
                                    > checkov-output.txt 2>&1
                                RC=$?
                                cat checkov-output.txt
                                exit $RC
                            '''
                        }
                    }
                    post {
                        success {
                            sh '''
                                {
                                    echo "<div class=\\"card ok\\">"
                                    echo "<h2>&#9989; Checkov (IaC security scan)</h2>"
                                    echo "<p>Status: <span class=\\"badge ok\\">nenhuma politica de seguranca violada</span></p>"
                                    echo "</div>"
                                } > "${WORKSPACE}/ci-summary/09-checkov.html"
                            '''
                            stash name: 'summary-09', includes: 'ci-summary/09-checkov.html'
                        }
                        failure {
                            sh '''
                                {
                                    echo "<div class=\\"card fail\\">"
                                    echo "<h2>&#10060; Checkov (IaC security scan)</h2>"
                                    echo "<p>Status: <span class=\\"badge fail\\">violacoes ou erros de analise encontrados</span></p>"
                                    echo "<pre>"
                                    sed -e 's/&/\\&amp;/g' -e 's/</\\&lt;/g' -e 's/>/\\&gt;/g' checkov/checkov-output.txt 2>/dev/null || echo "Relatorio nao gerado; consulte os logs."
                                    echo "</pre>"
                                    echo "</div>"
                                } > "${WORKSPACE}/ci-summary/09-checkov.html"
                            '''
                            stash name: 'summary-09', includes: 'ci-summary/09-checkov.html'
                        }
                    }
                }
            }
        }

        stage('Build & Optimize') {
            parallel {
                stage('Docker Image Pipeline') {
                    agent { label 'docker' }
                    stages {
                        stage('Build Docker Image') {
                            steps {
                                sh 'mkdir -p ci-summary'
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
                                            echo "<h3>SlimToolkit</h3>"
                                            echo "<p>Status: <span class=\\"badge ok\\">SUCESSO</span></p>"
                                            echo "<table>"
                                            echo "<tr><th>Imagem</th><th>Tamanho</th></tr>"
                                            echo "<tr><td>Antes - <code>maquinaroupa:ci</code></td><td>${ORIGINAL_SIZE}</td></tr>"
                                            echo "<tr><td>Depois - <code>maquinaroupa:slim</code></td><td>${SLIM_SIZE}</td></tr>"
                                            echo "</table>"
                                            echo "<p>Reducao estimada: <strong>${REDUCTION}%</strong> &mdash; fator relatado pelo SlimToolkit: <strong>${FACTOR}</strong></p>"
                                        } > "${WORKSPACE}/ci-summary/05a-body.html"
                                        echo "ok" > "${WORKSPACE}/ci-summary/05a-status.txt"
                                    '''
                                }
                                failure {
                                    sh '''
                                        {
                                            echo "<h3>SlimToolkit</h3>"
                                            echo "<p>Status: <span class=\\"badge fail\\">FALHOU</span></p>"
                                            echo "<pre>"
                                            sed -e 's/&/\\&amp;/g' -e 's/</\\&lt;/g' -e 's/>/\\&gt;/g' slim-output.txt 2>/dev/null || echo "Relatorio nao gerado; consulte os logs."
                                            echo "</pre>"
                                        } > "${WORKSPACE}/ci-summary/05a-body.html"
                                        echo "fail" > "${WORKSPACE}/ci-summary/05a-status.txt"
                                    '''
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
                                            echo "<h3>Trivy Scan (imagem otimizada)</h3>"
                                            echo "<p>Status: <span class=\\"badge ok\\">sem vulnerabilidades HIGH/CRITICAL</span></p>"
                                            echo "<pre>"
                                            sed -e 's/&/\\&amp;/g' -e 's/</\\&lt;/g' -e 's/>/\\&gt;/g' trivy-image-report.txt 2>/dev/null || echo "Relatorio nao gerado; consulte os logs."
                                            echo "</pre>"
                                        } > "${WORKSPACE}/ci-summary/05b-body.html"
                                        echo "ok" > "${WORKSPACE}/ci-summary/05b-status.txt"
                                    '''
                                }
                                failure {
                                    sh '''
                                        {
                                            echo "<h3>Trivy Scan (imagem otimizada)</h3>"
                                            echo "<p>Status: <span class=\\"badge fail\\">vulnerabilidade(s) HIGH/CRITICAL detectada(s)</span></p>"
                                            echo "<pre>"
                                            sed -e 's/&/\\&amp;/g' -e 's/</\\&lt;/g' -e 's/>/\\&gt;/g' trivy-image-report.txt 2>/dev/null || echo "Relatorio nao gerado; consulte os logs."
                                            echo "</pre>"
                                        } > "${WORKSPACE}/ci-summary/05b-body.html"
                                        echo "fail" > "${WORKSPACE}/ci-summary/05b-status.txt"
                                    '''
                                }
                            }
                        }

                        stage('OWASP ZAP (DAST)') {
                            environment {
                                DOCKER_NET = 'lab-jenkins_default'
                            }
                            steps {
                                sh '''
                                    (
                                        set -e
                                        if [ -z "${VITE_SUPABASE_URL}" ]; then
                                            echo "ERRO: VITE_SUPABASE_URL nao configurado."
                                            exit 1
                                        fi
                                        if [ -z "${VITE_SUPABASE_ANON_KEY}" ]; then
                                            echo "ERRO: VITE_SUPABASE_ANON_KEY nao configurado."
                                            exit 1
                                        fi

                                        docker rm -f maquinaroupa-security 2>/dev/null || true
                                        docker run -d --name maquinaroupa-security \
                                            --network "${DOCKER_NET}" \
                                            --env VITE_SUPABASE_URL="${VITE_SUPABASE_URL}" \
                                            --env VITE_SUPABASE_ANON_KEY="${VITE_SUPABASE_ANON_KEY}" \
                                            maquinaroupa:slim

                                        READY=0
                                        for _ in $(seq 1 30); do
                                            if curl --silent --fail "http://maquinaroupa-security:8080/" > /dev/null; then
                                                READY=1
                                                break
                                            fi
                                            sleep 2
                                        done
                                        if [ "$READY" != "1" ]; then
                                            echo "ERRO: aplicacao nao respondeu antes do timeout."
                                            docker logs maquinaroupa-security || true
                                            exit 1
                                        fi

                                        docker rm -f zap-scan 2>/dev/null || true
                                        set +e
                                        docker volume rm -f zap-wrk 2>/dev/null || true
                                        docker run --name zap-scan --network "${DOCKER_NET}" --user root --volume zap-wrk:/zap/wrk ghcr.io/zaproxy/zaproxy:stable \
                                            zap-baseline.py -t "http://maquinaroupa-security:8080" -J zap-report.json -r zap-report.html -I
                                        ZAP_EXIT_CODE=$?
                                        set -e

                                        mkdir -p zap-report
                                        docker cp zap-scan:/zap/wrk/zap-report.json zap-report/zap-report.json 2>/dev/null || echo "{}" > zap-report/zap-report.json
                                        docker cp zap-scan:/zap/wrk/zap-report.html zap-report/zap-report.html 2>/dev/null || true
                                        docker rm -f zap-scan maquinaroupa-security 2>/dev/null || true

                                        HIGH=$(jq '[.site[]?.alerts[]? | select(.riskcode == "3")] | length' zap-report/zap-report.json 2>/dev/null || echo 0)
                                        MEDIUM=$(jq '[.site[]?.alerts[]? | select(.riskcode == "2")] | length' zap-report/zap-report.json 2>/dev/null || echo 0)
                                        LOW=$(jq '[.site[]?.alerts[]? | select(.riskcode == "1")] | length' zap-report/zap-report.json 2>/dev/null || echo 0)

                                        echo "HIGH=$HIGH" > zap-result.env
                                        echo "MEDIUM=$MEDIUM" >> zap-result.env
                                        echo "LOW=$LOW" >> zap-result.env

                                        echo "ZAP exit code: $ZAP_EXIT_CODE"
                                        echo "Alertas HIGH: $HIGH  MEDIUM: $MEDIUM  LOW: $LOW"

                                        if [ "$ZAP_EXIT_CODE" -gt 1 ]; then
                                            echo "ERRO: scan do ZAP nao foi concluido corretamente."
                                            exit 1
                                        fi
                                        if [ "$HIGH" -gt 0 ]; then
                                            echo "ERRO: OWASP ZAP encontrou $HIGH alerta(s) de risco alto."
                                            exit 1
                                        fi
                                        exit 0
                                    ) > zap-output.txt 2>&1
                                    RC=$?
                                    cat zap-output.txt
                                    exit $RC
                                '''
                            }
                            post {
                                always {
                                    archiveArtifacts artifacts: 'zap-report/zap-report.html,zap-report/zap-report.json', allowEmptyArchive: true
                                }
                                success {
                                    sh '''
                                        . ./zap-result.env 2>/dev/null || true
                                        {
                                            echo "<div class=\\"card ok\\">"
                                            echo "<h2>&#9989; OWASP ZAP (DAST)</h2>"
                                            echo "<p>Status: <span class=\\"badge ok\\">sem alertas de risco alto</span></p>"
                                            echo "<table>"
                                            echo "<tr><th>Risco</th><th>Alertas</th></tr>"
                                            echo "<tr><td>Alto</td><td>${HIGH:-0}</td></tr>"
                                            echo "<tr><td>Medio</td><td>${MEDIUM:-0}</td></tr>"
                                            echo "<tr><td>Baixo</td><td>${LOW:-0}</td></tr>"
                                            echo "</table>"
                                            echo "<p>Relatorio completo em anexo nos artefatos do build (<code>zap-report.html</code>).</p>"
                                            echo "</div>"
                                        } > "${WORKSPACE}/ci-summary/10-zap.html"
                                    '''
                                    stash name: 'summary-docker-chain', includes: 'ci-summary/04-docker-build.html,ci-summary/05a-status.txt,ci-summary/05a-body.html,ci-summary/05b-status.txt,ci-summary/05b-body.html,ci-summary/10-zap.html'
                                }
                                failure {
                                    sh '''
                                        {
                                            echo "<div class=\\"card fail\\">"
                                            echo "<h2>&#10060; OWASP ZAP (DAST)</h2>"
                                            echo "<p>Status: <span class=\\"badge fail\\">alerta(s) de risco alto ou scan incompleto</span></p>"
                                            echo "<pre>"
                                            sed -e 's/&/\\&amp;/g' -e 's/</\\&lt;/g' -e 's/>/\\&gt;/g' zap-output.txt 2>/dev/null || echo "Relatorio nao gerado; consulte os logs."
                                            echo "</pre>"
                                            echo "</div>"
                                        } > "${WORKSPACE}/ci-summary/10-zap.html"
                                    '''
                                    stash name: 'summary-docker-chain', includes: 'ci-summary/04-docker-build.html,ci-summary/05a-status.txt,ci-summary/05a-body.html,ci-summary/05b-status.txt,ci-summary/05b-body.html,ci-summary/10-zap.html', allowEmpty: true
                                }
                            }
                        }
                    }
                }

                stage('SonarQube') {
                    agent { label 'docker' }
                    steps {
                        sh 'mkdir -p ci-summary'
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
                                . ./sonarqube/sonar-result.env 2>/dev/null || true
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
                            stash name: 'summary-08', includes: 'ci-summary/08-sonarqube.html'
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
                            stash name: 'summary-08', includes: 'ci-summary/08-sonarqube.html'
                        }
                    }
                }
            }
        }

        stage('Publish Verified Image') {
            agent { label 'docker' }
            steps {
                sh 'mkdir -p ci-summary'
                sh '''
                    (
                        set -e
                        if [ -z "${GHCR_TOKEN}" ]; then
                            echo "ERRO: GHCR_TOKEN nao configurado."
                            exit 1
                        fi
                        if [ -z "${GHCR_USERNAME}" ]; then
                            echo "ERRO: GHCR_USERNAME nao configurado."
                            exit 1
                        fi

                        IMAGE="ghcr.io/math-benites/maquinaroupa"
                        SHA_TAG="${IMAGE}:${GIT_COMMIT}"
                        LATEST_TAG="${IMAGE}:latest"

                        docker tag maquinaroupa:slim "${SHA_TAG}"
                        docker tag maquinaroupa:slim "${LATEST_TAG}"

                        echo "${GHCR_TOKEN}" | docker login ghcr.io -u "${GHCR_USERNAME}" --password-stdin

                        docker push "${SHA_TAG}"
                        docker push "${LATEST_TAG}"

                        echo "SHA_TAG=${SHA_TAG}" > publish-result.env
                        echo "LATEST_TAG=${LATEST_TAG}" >> publish-result.env
                    ) > publish-output.txt 2>&1
                    RC=$?
                    cat publish-output.txt
                    exit $RC
                '''
            }
            post {
                success {
                    sh '''
                        . ./publish-result.env 2>/dev/null || true
                        {
                            echo "<div class=\\"card ok\\">"
                            echo "<h2>&#9989; Publish Verified Image</h2>"
                            echo "<p>Status: <span class=\\"badge ok\\">imagem publicada no GHCR</span></p>"
                            echo "<table>"
                            echo "<tr><th>Tag</th><th>Uso</th></tr>"
                            echo "<tr><td><code>${SHA_TAG}</code></td><td>Deploy imutavel recomendado</td></tr>"
                            echo "<tr><td><code>${LATEST_TAG}</code></td><td>Referencia conveniente para testes</td></tr>"
                            echo "</table>"
                            echo "</div>"
                        } > "${WORKSPACE}/ci-summary/11-publish.html"
                    '''
                    stash name: 'summary-11', includes: 'ci-summary/11-publish.html'
                }
                failure {
                    sh '''
                        {
                            echo "<div class=\\"card fail\\">"
                            echo "<h2>&#10060; Publish Verified Image</h2>"
                            echo "<p>Status: <span class=\\"badge fail\\">falha ao publicar imagem</span></p>"
                            echo "<pre>"
                            sed -e 's/&/\\&amp;/g' -e 's/</\\&lt;/g' -e 's/>/\\&gt;/g' publish-output.txt 2>/dev/null || echo "Relatorio nao gerado; consulte os logs."
                            echo "</pre>"
                            echo "</div>"
                        } > "${WORKSPACE}/ci-summary/11-publish.html"
                    '''
                    stash name: 'summary-11', includes: 'ci-summary/11-publish.html', allowEmpty: true
                }
            }
        }
    }

    post {
        always {
            node('docker') {
                script {
                    sh 'rm -rf ci-summary && mkdir -p ci-summary'
                    tryUnstash('summary-01')
                    tryUnstash('summary-02')
                    tryUnstash('summary-03')
                    tryUnstash('summary-09')
                    tryUnstash('summary-docker-chain')
                    tryUnstash('summary-08')
                    tryUnstash('summary-11')
                    writeSummary()
                    publishSummary()
                }
            }
        }
    }
}
