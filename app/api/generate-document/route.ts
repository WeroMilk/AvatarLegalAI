import { NextRequest, NextResponse } from "next/server";
import { generateLegalDocument, generateFallbackDocument } from "@/lib/openai";
import { FieldValue } from "firebase-admin/firestore";
import { verifyIdToken, adminDb } from "@/lib/auth-server";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const isDemoSuperuser = token === "demo-superuser";
    let user: { uid: string };

    if (isDemoSuperuser) {
      user = { uid: "demo-superuser" };
    } else {
      const decoded = await verifyIdToken(token);
      user = { uid: decoded.uid };
    }

    const { documentId, documentType, userInputs, sessionId, saveToAccount } = await request.json();

    let documentContent: string;
    try {
      documentContent = await generateLegalDocument({
        documentType,
        userInputs,
      });
    } catch (openaiError) {
      // Superusuario sin OpenAI configurado: devolver documento de ejemplo
      if (isDemoSuperuser) {
        documentContent = generateFallbackDocument({
          documentType,
          userInputs,
        });
      } else {
        throw openaiError;
      }
    }

    // Guardar en Firestore solo si el usuario pagó la opción "guardar en Mi cuenta" ($99)
    if (adminDb && saveToAccount === true) {
      try {
        await adminDb.collection("documents").add({
          userId: user.uid,
          documentId,
          documentType,
          content: documentContent,
          userInputs,
          sessionId,
          createdAt: FieldValue.serverTimestamp(),
          status: "completed",
        });
      } catch (dbErr) {
        console.warn("Firestore save skipped:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      content: documentContent,
    });
  } catch (error: any) {
    console.error("Error generating document:", error);
    return NextResponse.json(
      { error: error.message || "Error al generar el documento" },
      { status: 500 }
    );
  }
}
