# Health-Setu backend

## Symptom assistant setup

The dashboard Clinical Copilot uses Gemini through the authenticated `POST /api/v1/ai/chat` endpoint, which accepts `{"message":"..."}` and returns `{"reply":"..."}`. The related symptom endpoint is `POST /api/v1/ai/symptom-chat`, with `{"symptoms":"..."}` and `{"response":"..."}`. Configure an API key in the backend process environment; do not put the key in frontend code or commit it to source control.

### Spring Tools Suite / Eclipse

1. In Google AI Studio, create a **new** Gemini API key. Revoke any key that was previously stored in this project's source files.
2. Open **Run → Run Configurations…**, select the Spring Boot application for this backend, and open its **Environment** tab.
3. Add `GEMINI_API_KEY` with the new key and `GEMINI_API_MODEL` with `gemini-2.5-flash`. Do not paste the key into chat, source files, or screenshots.
4. Click **Apply**, stop the currently running backend, and launch it again. The model and key are read when Spring Boot starts.
5. Keep the frontend running at `http://127.0.0.1:5173`, sign in, and retry the Clinical Copilot.

### Command line

If Maven is installed, start the backend from the `backend` directory in PowerShell:

```powershell
$env:GEMINI_API_KEY = "your-Gemini-API-key"
$env:GEMINI_API_MODEL = "gemini-2.5-flash"
mvn spring-boot:run
```

`GEMINI_API_MODEL` is optional and defaults to `gemini-2.5-flash`. Restart the backend after setting or changing either variable. If a Gemini key was previously stored in source control or shared, revoke it in Google AI Studio and replace it with a new key in the backend environment.

The assistant gives general possibilities and safety guidance, not a diagnosis or a prescription. Do not submit patient names or other identifying information. Urgent symptoms require local emergency services or direct clinician assessment.
