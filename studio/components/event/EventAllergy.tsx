import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEventAllergies } from "../../api/fetchEventAllergies";
import { Card, Grid, Heading, Spinner, Stack, Text } from "@sanity/ui";

export default function EventAllergy({ documentId }: { documentId: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["event-alergy", documentId],
    queryFn: () => fetchEventAllergies({ documentId }),
  });

  const cardProps = { shadow: 1, padding: 3, radius: 2 };

  if (isLoading) {
    return (
      <Grid gap={4}>
        <Spinner muted />
      </Grid>
    );
  }

  if (isError)
    return (
      <Grid gap={4}>
        <Text muted size={1}>
          Event
        </Text>
        <Heading as={"h2"} size={4} style={{ paddingTop: "3.5px" }}>
          En feil har oppstått
        </Heading>
      </Grid>
    );

  if (!data?.length) {
    return (
      <Grid gap={4}>
        <Text muted size={1}>
          Event
        </Text>
        <Heading as={"h2"} size={4} style={{ paddingTop: "3.5px" }}>
          Ingen matallergier
        </Heading>
      </Grid>
    );
  }

  return (
    <>
      <Grid gap={4}>
        <Text muted size={1}>
          Event
        </Text>
        <Heading as={"h2"} size={4} style={{ paddingTop: "3.5px" }}>
          Matallergier ({data?.length})
        </Heading>
      </Grid>

      <Grid gap={4} style={{ marginTop: "4rem" }}>
        {data.map(({ allergy, count }, index) => (
          <Card {...cardProps} key={index}>
            <Stack space={4}>
              <Text weight="bold">{allergy}</Text>
              <Text>{count}</Text>
            </Stack>
          </Card>
        ))}
      </Grid>
    </>
  );
}
