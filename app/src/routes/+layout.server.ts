import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  const { preview } = locals;

  let session = null;
  try {
    session = await locals.auth();
  } catch (error) {
    console.error("Auth error in layout:", error);
    if (error instanceof Error) {
      console.error("Error stack:", error.stack);
    }
    // Return null session if auth fails - this prevents the app from crashing
    session = null;
  }

  return { preview, session };
};
