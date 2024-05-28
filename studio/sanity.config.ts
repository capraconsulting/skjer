import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { getDefaultDocumentNode } from "./config/structure";
import { schemaTypes } from "./schemas";
import { codeInput } from "@sanity/code-input";
import { nbNOLocale } from "@sanity/locale-nb-no";
import { StudioIcon } from "./components/shared/StudioIcon";
import { EventPublishAction } from "./action";

export const projectId = process.env.SANITY_STUDIO_PROJECT_ID!;
export const dataset = process.env.SANITY_STUDIO_DATASET!;
export const enivornment = process.env.MODE;

export default defineConfig({
  name: "capra-web",
  title: "Capra Web",
  projectId,
  dataset,
  icon: StudioIcon,
  plugins: [
    nbNOLocale(),
    codeInput({
      codeModes: [
        {
          name: "vue",
          loader: () => import("@codemirror/lang-vue").then(({ vue }) => vue()),
        },
      ],
    }),
    structureTool({ title: "Struktur", defaultDocumentNode: getDefaultDocumentNode }),
    presentationTool({
      title: "Presentasjon",
      previewUrl: {
        origin: process.env.SANITY_STUDIO_PREVIEW_URL || "http://localhost:5173",
        previewMode: {
          enable: "/preview/enable",
          disable: "/preview/disable",
        },
      },
    }),
    visionTool({ title: "GROQ" }),
  ],
  tools: (tools) => {
    if (enivornment === "development") {
      return tools;
    }
    return tools.filter(({ name }) => name !== "vision");
  },
  scheduledPublishing: {
    enabled: false,
  },
  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (prev, context) => {
      if (context.schemaType === "event") {
        return prev.map((originalAction) =>
          originalAction.action === "publish" ? EventPublishAction : originalAction
        );
      }
      return prev;
    },
  },
});
