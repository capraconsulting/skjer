import { DocumentActionProps, DocumentActionComponent, useDocumentOperation } from "sanity";
import { deleteEvent } from "../supabase/queries";
import { Card, Stack, Text, Button, useToast } from "@sanity/ui";
import { useState } from "react";

export function createExtendedEventDeleteAction(originalDeleteAction: DocumentActionComponent) {
  const EventDeleteAction = (props: DocumentActionProps) => {
    const toast = useToast();
    const originalResult = originalDeleteAction(props);
    const operation = useDocumentOperation(props.id, props.type);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDeleteEvent = async () => {
      setDialogOpen(false);

      try {
        await deleteEvent({ document_id: props.id });
        operation.delete.execute();
      } catch (error) {
        console.error("Error handling event deletion:", error);
        toast.push({
          status: "error",
          title: "Det oppstod en feil ved sletting av arrangementet",
        });
      }

      props.onComplete();
    };

    return {
      ...originalResult,
      label: "Slett",
      onHandle: () => {
        setDialogOpen(true);
      },
      dialog: dialogOpen && {
        header: "Bekreft slett",
        type: "dialog",
        onClose: props.onComplete,
        content: (
          <Card padding={3}>
            <Stack space={3}>
              <Text>
                <span>
                  Er du sikker på at du vil slette arrangementet? Hvis arrangementet har påmeldte,
                  vil de ikke bli varslet om dette.
                </span>
              </Text>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <Button mode="ghost" tone="critical" onClick={handleDeleteEvent}>
                  Ja, slett
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
  return EventDeleteAction;
}
