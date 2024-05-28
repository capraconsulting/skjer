import { useDocumentOperation } from "sanity";
import { supabase } from "./api/supabase.api";

export function EventPublishAction(props) {
  const { id, type, onComplete } = props;
  const { publish } = useDocumentOperation(id, type);

  return {
    label: "Publish",
    onHandle: () => {
      publish.execute();
      onComplete();

      createNewEvent(id);
    },
  };
}

export const createNewEvent = async (document_id: string) => {
  const { error } = await supabase.from("event").upsert({
    document_id,
  });

  if (!error) {
    console.log("Event created");
  }
};
