"use server";

export async function getUserProfile(userId: string) {
  try {
    // Node 18+ fetch often resolves localhost to IPv6 ::1, causing ECONNREFUSED. Replace with 127.0.0.1.
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace("localhost", "127.0.0.1");
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
