import { useDocumentOperation, DocumentActionProps } from "sanity";
import { supabase } from "./supabase/client";

export function eventPublishAction(props: DocumentActionProps) {
  const { id, type, onComplete } = props;
  const { publish } = useDocumentOperation(id, type);

  return {
    label: "Publish",
    onHandle: () => {
      publish.execute();
      onComplete();
      createEventIfNotExist({ document_id: id });
    },
  };
}

export const createEventIfNotExist = async ({ document_id }: { document_id: string }) => {
  const { error } = await supabase.from("event").upsert({
    document_id,
  });

  if (!error) {
    console.log("Event created in Postgres");
  }
};
