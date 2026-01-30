import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/** Nota de validez que debe aparecer al inicio de cada documento privado (Código Civil Federal y, en su caso, del Estado de Sonora). */
const NOTA_VALIDEZ = `DOCUMENTO PRIVADO: El presente instrumento es un documento privado celebrado de conformidad con la legislación aplicable en los Estados Unidos Mexicanos (Código Civil Federal y, en su caso, Código Civil del Estado de Sonora). Surtirá efectos jurídicos entre las partes signantes una vez que sea firmado por ellas. Para su validez frente a terceros o su inscripción en el Registro Público, podrá requerirse su formalización ante Notario Público o fedatario competente. No constituye asesoría legal ni garantía de resultado.`;

export interface DocumentGenerationParams {
  documentType: string;
  userInputs: Record<string, string>;
  language?: string;
}

/**
 * Genera un documento de ejemplo a partir de los datos del usuario (sin OpenAI).
 * Útil cuando OPENAI_API_KEY no está configurada (ej. superusuario en modo demo).
 */
export function generateFallbackDocument(params: DocumentGenerationParams): string {
  const { documentType, userInputs } = params;
  const lines: string[] = [
    "",
    documentType.toUpperCase(),
    "=".repeat(Math.min(60, documentType.length + 10)),
    "",
    "--- NOTA DE VALIDEZ ---",
    NOTA_VALIDEZ,
    "----------------------------------------",
    "",
    `Documento generado el ${new Date().toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.`,
    "",
    "DATOS DEL DOCUMENTO",
    "-".repeat(40),
    "",
  ];
  for (const [key, value] of Object.entries(userInputs)) {
    if (value == null || String(value).trim() === "") continue;
    const label = key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    lines.push(`${label}: ${String(value).trim()}`);
    lines.push("");
  }
  lines.push("-".repeat(40));
  lines.push("");
  lines.push(
    "Este documento es un borrador generado en modo demo. Para obtener un documento legal completo generado por IA, configura OPENAI_API_KEY en tu .env."
  );
  lines.push("");
  return lines.join("\n");
}

export async function generateLegalDocument(
  params: DocumentGenerationParams
): Promise<string> {
  const { documentType, userInputs, language = "es" } = params;

  const notaValidezText = `DOCUMENTO PRIVADO: El presente instrumento es un documento privado celebrado de conformidad con la legislación aplicable en los Estados Unidos Mexicanos (Código Civil Federal y, en su caso, Código Civil del Estado de Sonora). Surtirá efectos jurídicos entre las partes signantes una vez que sea firmado por ellas. Para su validez frente a terceros o su inscripción en el Registro Público, podrá requerirse su formalización ante Notario Público o fedatario competente. No constituye asesoría legal ni garantía de resultado.`;

  const instruccionBienesMuebles =
    documentType.toLowerCase().includes("compraventa") || documentType.toLowerCase().includes("donación") || documentType.toLowerCase().includes("donacion")
      ? " 4. Si el documento es de COMPRAVENTA o DONACIÓN: indica explícitamente que aplica ÚNICAMENTE a bienes muebles (no a inmuebles como terrenos o casas); para inmuebles se requiere formalización notarial."
      : "";

  const prompt = `Eres un abogado experto en derecho mexicano (civil y mercantil). Genera un documento legal profesional del tipo "${documentType}" en español.

Información proporcionada por el usuario:
${JSON.stringify(userInputs, null, 2)}

INSTRUCCIONES OBLIGATORIAS:
1. Al inicio del documento, inmediatamente después del título, incluye un recuadro con esta NOTA DE VALIDEZ (texto exacto o muy similar):
"${notaValidezText}"

2. El documento debe incluir de manera clara: identificación completa de las partes, declaraciones, cláusulas específicas (objeto, obligaciones, duración, causales de terminación), domicilio para oír y recibir notificaciones, y un bloque de firmas con espacios para nombre, firma y fecha.

3. Usa la estructura y formato estándar reconocidos en la legislación mexicana (Código Civil Federal, Código Civil del Estado de Sonora cuando aplique, Código de Comercio, Ley Federal del Trabajo, según corresponda). Lenguaje claro y sin ambigüedades.
${instruccionBienesMuebles}

Responde SOLO con el contenido del documento legal, sin comentarios adicionales.`;

  const rawKey = process.env.OPENAI_API_KEY?.trim() ?? "";
  const isPlaceholder =
    !rawKey ||
    rawKey.length <= 10 ||
    rawKey === "your_openai_api_key" ||
    !rawKey.startsWith("sk-");

  if (isPlaceholder) {
    throw new Error(
      "OPENAI_API_KEY no configurada o es un valor de ejemplo. Añade tu clave real en .env.local (empieza por sk-). Sin clave puedes usar el modo superusuario para ver un documento de ejemplo."
    );
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Eres un asistente legal experto en derecho mexicano (civil y mercantil), con conocimiento del Código Civil Federal y del Estado de Sonora. Generas documentos legales profesionales. Siempre incluyes la NOTA DE VALIDEZ al inicio (después del título) y estructuras estándar con partes, cláusulas, domicilios y firmas. En compraventa y donación, limitas explícitamente el alcance a bienes muebles.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content?.trim() || "";
    if (!content) throw new Error("OpenAI no devolvió contenido");
    return content;
  } catch (error) {
    console.error("Error generando documento:", error);
    const msg =
      error instanceof Error ? error.message : String(error);
    if (msg.includes("API key") || msg.includes("401") || msg.includes("Incorrect API key") || msg.includes("invalid_api_key")) {
      throw new Error(
        "La clave OPENAI_API_KEY no es válida o ha expirado. Revisa .env.local y usa una clave activa de https://platform.openai.com/api-keys"
      );
    }
    if (msg.includes("rate limit") || msg.includes("429")) {
      throw new Error("Límite de uso de OpenAI alcanzado. Espera unos minutos e inténtalo de nuevo.");
    }
    throw new Error("Error al generar el documento legal. Revisa OPENAI_API_KEY y tu conexión.");
  }
}
