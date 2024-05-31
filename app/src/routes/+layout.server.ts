import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  const { preview } = locals;
  const session = await locals.auth();

  return { preview, session };
};
