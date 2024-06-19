import { ErrorOutlineIcon, WarningOutlineIcon } from "@sanity/icons";
import { useToast, Card, Text } from "@sanity/ui";
import { useState } from "react";
import { DocumentActionProps, DocumentActionComponent } from "sanity";
import { Event } from "../models/sanity.model";
import { sendEmailEventCanceled } from "../lib/event-email";

export const CancelAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const toast = useToast();

  const publishedEvent = props.published as Event | null;
  return {
    label: "Kanseller",
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
            toast.push({
              status: "success",
              title: "Arrangementet er kansellert. Husk å avpublisere!",
            });
          } else {
            toast.push({
              status: "error",
              title: "En feil oppstod ved kansellering av arrangementet",
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
              Vennligst bekreft at du ønsker å kansellere arrangementet. En e-post kansellering blir
              sendt til alle påmeldte. Husk å avpublisere arrangementet etterpå.
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
