import { useQuery } from "@tanstack/react-query";
import { fetchEventRegistration } from "../api/fetchEventRegistration";
import { Card, Spinner, Text } from "@sanity/ui";

export default function EventRegistration({ documentId }: { documentId: string }) {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["event-registration", documentId],
    queryFn: () => fetchEventRegistration({ documentId }),
  });

  const cardProps = { shadow: 1, padding: 3, radius: 2 };

  if (isError)
    return (
      <Card tone="critical" {...cardProps}>
        <Text>There has been an error</Text>
      </Card>
    );

  if (isLoading)
    return (
      <Card tone="default" {...cardProps}>
        <Spinner />
      </Card>
    );

  return (
    <Card tone="positive" {...cardProps}>
      <Text>Success! {data.length} Event Found</Text>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Card>
  );
}
