"use server";

export async function uploadDocumentAction(formData: FormData) {
  try {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace("localhost", "127.0.0.1");
    
    const res = await fetch(`${apiUrl}/documents/upload`, {
      method: "POST",
      body: formData,
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Backend error response:", errorText);
      return { success: false, error: "Rejeitado pelo processador de documentos." };
    }
    
    return { success: true };
  } catch (err: any) {
    console.error("Error in uploadDocumentAction:", err);
    return { success: false, error: err.message || "Falha na transmissão do arquivo." };
  }
}

export async function listDocumentsAction(businessId: string) {
  try {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace("localhost", "127.0.0.1");
    const res = await fetch(`${apiUrl}/documents/${businessId}`, {
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
    return [];
  } catch (err) {
    console.error("Error in listDocumentsAction:", err);
    return [];
  }
}

export async function deleteDocumentAction(id: string) {
  try {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace("localhost", "127.0.0.1");
    const res = await fetch(`${apiUrl}/documents/${id}`, {
      method: "DELETE",
    });
    return { success: res.ok };
  } catch (err) {
    console.error("Error in deleteDocumentAction:", err);
    return { success: false };
  }
}
