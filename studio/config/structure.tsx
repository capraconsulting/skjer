import { DefaultDocumentNodeContext, StructureBuilder } from "sanity/structure";
import { QueryClient } from "@tanstack/react-query";
import EventFoodPreference from "../components/event/EventFoodPreference";
import EventLayout from "../components/event/EventLayout";
import EventParticipant from "../components/event/EventParticipant";
import EventInvitation from "../components/event/EventInvitation";

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
              <EventInvitation documentId={documentId} />
            </EventLayout>
          );
        })
        .title("Invitasjoner"),
      S.view
        .component((props) => {
          return (
            <EventLayout queryClient={queryClient}>
              <EventParticipant
                documentId={props.documentId}
                title={props.document.displayed.title}
                isDigital={props.document.displayed.isDigital}
                openForExternals={props.document.displayed.openForExternals}
              />
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
        .title("Matpreferanser/allergier"),
    ]);
  }
  return S.document().views([S.view.form()]);
};
