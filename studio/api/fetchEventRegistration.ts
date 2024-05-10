export async function fetchEventRegistration({ documentId }: { documentId: string }) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${1}`);
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching:", error);
    throw error;
  }
}
