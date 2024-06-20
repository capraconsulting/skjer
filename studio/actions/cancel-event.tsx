import { ErrorOutlineIcon, WarningOutlineIcon } from "@sanity/icons";
import { useToast, Card, Text } from "@sanity/ui";
import { useState } from "react";
import { DocumentActionProps, DocumentActionComponent, useDocumentOperation } from "sanity";
import { Event } from "../models/sanity.model";
import { sendEmailEventCanceled } from "../lib/event-email";

export const CancelAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const toast = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const { patch, unpublish } = useDocumentOperation(props.id, props.type);

  const publishedEvent = props.published as Event | null;
  return {
    disabled: !publishedEvent,
    label: "Avlys arrangement",
    tone: "critical",
    icon: ErrorOutlineIcon,
    onHandle: () => {
      setDialogOpen(true);
    },
    dialog: dialogOpen && {
      type: "confirm",
      onCancel: props.onComplete,
      onConfirm: async () => {
        if (publishedEvent) {
          const result = await handleEventCancel(publishedEvent);
          if (result) {
            if (!publishedEvent.title.endsWith("Avlyst")) {
              patch.execute([{ set: { title: `${publishedEvent.title} | Avlyst` } }]);
            }

            unpublish.execute();

            toast.push({
              status: "success",
              title: "Arrangementet er avlyst",
            });
          } else {
            toast.push({
              status: "error",
              title: "En feil oppstod ved avlysing av arrangementet",
            });
          }
        }
        props.onComplete();
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
              Vennligst bekreft at du ønsker å avlyse arrangementet. Alle påmeldte blir varslet på
              e-post om at arrangementet er avlyst.
            </span>
          </Text>
        </Card>
      ),
    },
  };
};

const handleEventCancel = async ({ _id, title, summary, start, end, place, organisers }: Event) => {
  const emailProps = {
    id: _id,
    summary: title,
    description: summary,
    start,
    end,
    location: place,
    organiser: organisers.join(" | "),
  };
  try {
    const result = await sendEmailEventCanceled(emailProps);
    if (result?.error) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error handling cancel event:", error);
    return false;
  }
};
