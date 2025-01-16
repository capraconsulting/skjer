import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { getDefaultDocumentNode } from "./config/structure";
import { schemaTypes } from "./schemas";
import { codeInput } from "@sanity/code-input";
import { nbNOLocale } from "@sanity/locale-nb-no";
import { StudioIcon } from "./components/shared/StudioIcon";
import { createExtendedEventPublishAction } from "./actions/publish-event";
import { createExtendedEventDeleteAction } from "./actions/delete-event";
import { CancelAction } from "./actions/cancel-event";

export const projectId = process.env.SANITY_STUDIO_PROJECT_ID!;
export const dataset = process.env.SANITY_STUDIO_DATASET!;
export const enivornment = process.env.MODE;

export default defineConfig({
  name: "capra-web",
  title: "Skjer",
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
    structureTool({
      name: "event",
      title: "Arrangementer",
      structure: (S) => S.documentTypeList("event"),
      defaultDocumentNode: getDefaultDocumentNode,
    }),
    presentationTool({
      title: "Forhåndsvisning",
      previewUrl: {
        origin: process.env.SANITY_STUDIO_PREVIEW_URL,
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
        return [...prev, CancelAction].map((originalAction) => {
          if (originalAction.action === "publish") {
            return createExtendedEventPublishAction(originalAction);
          }
          if (originalAction.action === "delete") {
            return createExtendedEventDeleteAction(originalAction);
          }
          return originalAction;
        });
      }
      return prev;
    },
  },
});
