import { DefaultDocumentNodeContext, StructureBuilder } from "sanity/structure";
import EventParticipant from "../components/EventParticipant";
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
              <EventParticipant documentId={documentId} />
            </QueryClientProvider>
          );
        })
        .title("Påmeldinger"),
    ]);
  }
  return S.document().views([S.view.form()]);
};
