import { Event } from "../../app/src/models/sanity.model";
import { DocumentActionProps, DocumentActionComponent } from "sanity";
import { deleteEvent } from "../supabase/queries";

export function createExtendedEventDeleteAction(originalDeleteAction: DocumentActionComponent) {
  const EventDeleteAction: DocumentActionComponent = (props: DocumentActionProps) => {
    const originalResult = originalDeleteAction(props);
    const publishedEvent = props.published as Event | null;

    return {
      ...originalResult,
      label: "Slett",
      onHandle: () => {
        if (publishedEvent) {
          handleDeleteEvent(props.id);
        }

        if (originalResult?.onHandle) {
          originalResult.onHandle();
        }
      },
    };
  };
  return EventDeleteAction;
}

const handleDeleteEvent = async (id: string) => {
  try {
    await deleteEvent({ document_id: id });
  } catch (error) {
    console.error("Error handling event deletion:", error);
  }
};
