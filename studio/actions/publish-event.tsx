import { Event } from "../../app/src/models/sanity.model";
import { DocumentActionProps, DocumentActionComponent } from "sanity";
import { useState } from "react";
import { Card, Text, useToast } from "@sanity/ui";
import { WarningOutlineIcon } from "@sanity/icons";
import { createEventIfNotExist } from "../supabase/queries";
import { createSlackMessage } from "../lib/event-slack";
import { sendEmailEventUpdate } from "../lib/event-email";
import { eventChangeRequiresUpdate } from "../lib/event-check";

export function createExtendedEventPublishAction(originalPublishAction: DocumentActionComponent) {
  const EventPublishAction: DocumentActionComponent = (props: DocumentActionProps) => {
    const originalResult = originalPublishAction(props);

    const toast = useToast();
    const [dialogOpen, setDialogOpen] = useState(false);

    const { id, draft, published } = props;
    const draftEvent = draft as Event | null;
    const publishedEvent = published as Event | null;

    const isNewEvent = !!(!publishedEvent && draftEvent);
    const isExistingEvent = !!(publishedEvent && draftEvent);

    return {
      ...originalResult,
      label: "Publiser",
      disabled: !!draftEvent?.title.endsWith("Avlyst"),
      onHandle: () => {
        if (!originalResult?.onHandle) {
          return;
        }

        if (isNewEvent) {
          handleNewEvent(id, draftEvent);
        }

        if (isExistingEvent) {
          const showConfirmation = eventChangeRequiresUpdate(draftEvent, publishedEvent);
          if (showConfirmation) {
            setDialogOpen(true);
            return;
          }
        }
        originalResult.onHandle();
      },

      dialog: dialogOpen && {
        type: "confirm",
        onCancel: props.onComplete,
        onConfirm: async () => {
          if (!originalResult?.onHandle || !isExistingEvent) {
            return;
          }
          setDialogOpen(false);
          const result = await handleExistingEvent(draftEvent, publishedEvent);
          if (result) {
            toast.push({
              status: "success",
              title: "E-post oppdatering er sendt",
            });
          } else {
            toast.push({
              status: "error",
              title: "En feil oppstod ved sending av e-post oppdatering",
            });
          }

          originalResult.onHandle();
        },
        message: (
          <Card padding={4}>
            <Text>
              <WarningOutlineIcon
                style={{
                  color: "red",
                  fontSize: "24px",
                  marginRight: "3px",
                  marginLeft: "1px",
                }}
              />
              <span>
                Det er gjort endringer i tid eller sted på arrangementet. Ved å bekrefte vil det
                sendes en e-post med oppdatert informasjon til alle påmeldte.
              </span>
            </Text>
          </Card>
        ),
      },
    };
  };
  return EventPublishAction;
}

const handleNewEvent = async (id: string, event: Event) => {
  try {
    const created = await createEventIfNotExist({ document_id: id });
    if (created) {
      createSlackMessage(id, event);
    }
  } catch (error) {
    console.error("Error handling event creation or slack message:", error);
  }
};

const handleExistingEvent = async (draft: Event, published: Event) => {
  const emailProps = {
    id: published._id,
    summary: draft.title,
    description: draft.summary,
    start: draft.start,
    end: draft.end,
    location: draft.place,
    organiser: draft.organisers.join(" | "),
  };
  try {
    const result = await sendEmailEventUpdate(emailProps);

    if (result?.error) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error handling cancel event:", error);
    return false;
  }
};
