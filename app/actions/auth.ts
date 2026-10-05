"use server";

export async function getUserProfile(userId: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const res = await fetch(`${apiUrl}/users/me/${userId}`, {
      cache: "no-store",
    });
    
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (e) {
    console.error("Failed to fetch user profile in server action:", e);
    return null;
  }
}
