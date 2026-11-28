pipeline {
    agent any

    tools {
        jdk 'jdk17'
        nodejs 'node20'
    }

    environment {
        SCANNER_HOME = tool 'sonar-scanner'
        DOCKER_IMAGE = 'sunilssaini139/swiggy'
        DOCKER_TAG   = 'latest'
    }

    stages {
        stage('Clean Workspace') {
            steps { 
		cleanWs() 
		}
        }

        stage('Checkout from Git') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/sunilsaini139/Devops-project-41.git'
            }
        }

        // ✅ NEW: install deps BEFORE tests and before sonar-scanner
        stage('Install Dependencies') {
            steps {
                sh 'npm ci || npm install'
            }
        }

        // ✅ NEW: generate coverage report BEFORE sonar-scanner
        stage('Test with Coverage') {
            steps {
                sh 'npm run test:coverage'
            }
            post {
                always {
                    archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true
                }
            }
        }

        // ✅ FIXED: no -Dsonar.sources override (let sonar-project.properties decide),
        //           and it now runs AFTER coverage exists
        stage('SonarQube Code Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    sh "$SCANNER_HOME/bin/sonar-scanner"
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Trivy Filesystem Security Scan') {
            steps {
                sh 'trivy fs . --exit-code 0 --severity HIGH,CRITICAL -f table -o trivy-fs-report.txt'
                archiveArtifacts artifacts: 'trivy-fs-report.txt', allowEmptyArchive: true
            }
        }

        stage('Docker Build & Push') {
            steps {
                withDockerRegistry(credentialsId: 'dockerhub-creds') {
                    sh """
                        docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                        docker push ${DOCKER_IMAGE}:${DOCKER_TAG}
                    """
                }
            }
        }

        stage('Trivy Image Vulnerability Scan') {
            steps {
                sh 'trivy image ${DOCKER_IMAGE}:${DOCKER_TAG} --exit-code 0 --severity HIGH,CRITICAL -f table -o trivy-image-report.txt'
                archiveArtifacts artifacts: 'trivy-image-report.txt', allowEmptyArchive: true
            }
        }

        stage('Deploy to Container') {
            steps {
                // your existing deploy steps
            }
        }
    }
}
