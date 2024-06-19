import { DefaultDocumentNodeContext, StructureBuilder } from "sanity/structure";
import { QueryClient } from "@tanstack/react-query";
import EventFoodPreference from "../components/event/EventFoodPreference";
import EventLayout from "../components/event/EventLayout";
import EventParticipant from "../components/event/EventParticipant";

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
            <EventLayout queryClient={queryClient}>
              <EventParticipant documentId={documentId} />
            </EventLayout>
          );
        })
        .title("Påmeldinger"),
      S.view
        .component(({ documentId }: { documentId: string }) => {
          return (
            <EventLayout queryClient={queryClient}>
              <EventFoodPreference documentId={documentId} />
            </EventLayout>
          );
        })
        .title("Allergier/matpreferanser"),
    ]);
  }
  return S.document().views([S.view.form()]);
};
