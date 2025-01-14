import { Event } from "../../app/src/models/sanity.model";
import { DocumentActionProps, DocumentActionComponent } from "sanity";
import { useState } from "react";
import { Stack, Button, Card, Text, useToast } from "@sanity/ui";
import { createEventIfNotExist } from "../supabase/queries";
import { createSlackMessage } from "../lib/event-slack";
import { sendEmailEventUpdate } from "../lib/event-email";
import { eventChangeRequiresUpdate } from "../lib/event-check";

export function createExtendedEventPublishAction(originalPublishAction: DocumentActionComponent) {
  const EventPublishAction: DocumentActionComponent = (props: DocumentActionProps) => {
    const toast = useToast();
    const originalResult = originalPublishAction(props);
    const [dialogOpen, setDialogOpen] = useState(false);

    const { id, draft, published } = props;
    const draftEvent = draft as Event | null;
    const publishedEvent = published as Event | null;

    const isNewEvent = !!(!publishedEvent && draftEvent);
    const isExistingEvent = !!(publishedEvent && draftEvent);

    const handleNewEvent = async () => {
      if (!isNewEvent) return;

      try {
        const created = await createEventIfNotExist({ document_id: id });
        if (created) {
          createSlackMessage(id, draftEvent);
        }
      } catch (error) {
        console.error("Error handling event creation or slack message:", error);
      }
    };

    const handleExistingEvent = async () => {
      if (!isExistingEvent) return;

      setDialogOpen(false);

      const emailProps = {
        id: publishedEvent._id,
        summary: draftEvent.title,
        description: draftEvent.summary,
        start: draftEvent.start,
        end: draftEvent.end,
        location: draftEvent.place,
        organiser: draftEvent.organisers.join(" | "),
        subject: draftEvent.emailTemplate.updateSubject,
        message: draftEvent.emailTemplate.updateMessage,
        reminder: draftEvent.emailReminder,
      };

      const result = await sendEmailEventUpdate(emailProps);

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

      if (originalResult?.onHandle) {
        originalResult.onHandle();
      }
    };

    return {
      ...originalResult,
      label: "Publiser",
      disabled: originalResult?.disabled || draftEvent?.cancelId === props.id,

      onHandle: () => {
        if (!originalResult?.onHandle) return;

        if (isNewEvent) {
          handleNewEvent();
        }

        if (isExistingEvent) {
          const requiresUpdate = eventChangeRequiresUpdate(draftEvent, publishedEvent);

          if (requiresUpdate) {
            setDialogOpen(true);
            return;
          }
        }

        originalResult.onHandle();
      },
      dialog: dialogOpen && {
        header: "Bekreft oppdatering",
        type: "dialog",
        onClose: props.onComplete,
        content: (
          <Card padding={3}>
            <Stack space={3}>
              <Text>
                <span>
                  Det er gjort endringer i tid eller sted på arrangementet. Ved å bekrefte vil det
                  sendes en e-post med oppdatert informasjon til alle påmeldte angående dette.
                </span>
              </Text>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <Button mode="ghost" tone="critical" onClick={() => handleExistingEvent()}>
                  Ja, bekreft
                </Button>
                <Button mode="ghost" tone="default" onClick={props.onComplete}>
                  Avbryt
                </Button>
              </div>
            </Stack>
          </Card>
        ),
      },
    };
  };
  return EventPublishAction;
}
