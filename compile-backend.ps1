$backendDir = "C:\Users\malli\Documents\workspace-spring-tools-for-eclipse-5.2.0.RELEASE\cinerate"
Push-Location $backendDir
try {
    .\mvnw.cmd compile
} finally {
    Pop-Location
}
