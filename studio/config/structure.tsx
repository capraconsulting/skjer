import { DefaultDocumentNodeContext, StructureBuilder } from "sanity/structure";
import EventRegistration from "../components/EventRegistration";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const getDefaultDocumentNode = (
  S: StructureBuilder,
  options: DefaultDocumentNodeContext
) => {
  if (options.schemaType === "event") {
    return S.document().views([
      S.view.form(),
      S.view
        .component(({ documentId }: { documentId: string }) => {
          return (
            <QueryClientProvider client={queryClient}>
              <EventRegistration documentId={documentId} />
            </QueryClientProvider>
          );
        })
        .title("Event Registration"),
    ]);
  }
  return S.document().views([S.view.form()]);
};
