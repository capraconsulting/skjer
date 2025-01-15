import { ErrorOutlineIcon } from "@sanity/icons";
import { useToast, Stack, Button, Card, Text } from "@sanity/ui";
import { useState } from "react";
import { DocumentActionProps, DocumentActionComponent, useDocumentOperation } from "sanity";
import { Event } from "../models/sanity.model";
import { sendEmailEventCanceled } from "../lib/event-email";

export const CancelAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const toast = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const { patch, unpublish } = useDocumentOperation(props.id, props.type);

  const publishedEvent = props.published as Event | null;

  const handleCancelEvent = async () => {
    if (!publishedEvent) return;

    const emailProps = {
      id: publishedEvent._id,
      summary: publishedEvent.title,
      description: publishedEvent.summary,
      start: publishedEvent.start,
      end: publishedEvent.end,
      location: publishedEvent.place,
      organiser: publishedEvent.organisers,
      subject: publishedEvent.emailTemplate.cancelSubject,
      message: publishedEvent.emailTemplate.cancelMessage,
    };

    try {
      const result = await sendEmailEventCanceled(emailProps);

      if (!result) {
        toast.push({
          status: "error",
          title: "En feil oppstod ved utsending av e-post",
        });
        props.onComplete();
        return;
      }

      patch.execute([{ set: { cancelId: props.id } }]);
      unpublish.execute();

      toast.push({
        status: "success",
        title: "Arrangementet er avlyst",
      });
    } catch (error) {
      console.error("Error handling cancel event:", error);
      toast.push({
        status: "error",
        title: "En feil oppstod ved avlysning av arrangementet",
      });
    }
    props.onComplete();
  };

  return {
    disabled: !publishedEvent,
    label: "Avlys arrangement",
    tone: "critical",
    icon: ErrorOutlineIcon,
    onHandle: () => {
      setDialogOpen(true);
    },
    dialog: dialogOpen && {
      header: "Bekreft avlysning",
      type: "dialog",
      onClose: props.onComplete,
      content: (
        <Card padding={3}>
          <Stack space={3}>
            <Text>
              <span>
                Vennligst bekreft at du ønsker å avlyse arrangementet. Alle påmeldte blir varslet på
                e-post om at arrangementet er avlyst.
              </span>
            </Text>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <Button mode="ghost" tone="critical" onClick={handleCancelEvent}>
                Ja, avlys
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
