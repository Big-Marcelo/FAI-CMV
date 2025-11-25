import admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

if (!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_BASE64 não definida.");
}

let decoded;
try {
  decoded = Buffer.from(
    process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
    "base64"
  ).toString("utf8");
} catch (err) {
  console.error("Erro ao decodificar o Base64:", err);
  throw err;
}

console.log("Decoded service account JSON:", decoded);

let credentials;
try {
  credentials = JSON.parse(decoded);
} catch (err) {
  console.error("Decoded não é JSON válido:", err);
  throw new Error("FIREBASE_SERVICE_ACCOUNT_BASE64 decodificado não é JSON válido");
}

console.log("Parsed credentials:", credentials);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(credentials),
  });
}

const db = admin.firestore();

export async function saveTicket({ sender, mensagem_original, sala, tipo_problema }) {
  const path = `artifacts/${process.env.APP_ID}/public/data/suporte_chamados`;
  const docRef = db.collection(path).doc();

  const ticket = {
    sender,
    mensagem_original,
    sala,
    tipo_problema,
    data_hora_abertura: Timestamp.now(),
    status: "PENDENTE",
    data_hora_fechamento: null,
    tecnico_fechamento: null,
  };

  await docRef.set(ticket);
  console.log("Ticket salvo:", ticket);
}
