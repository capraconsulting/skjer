import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Flex, Grid, Heading, Spinner, Stack, Text } from "@sanity/ui";
import { getEventFoodPreferences } from "../../supabase/queries";

export default function EventFoodPreference({ documentId }: { documentId: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["event-food-preference-list", documentId],
    queryFn: () => getEventFoodPreferences({ documentId }),
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
          Arrangement
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
          Arrangement
        </Text>
        <Heading as={"h2"} size={4} style={{ paddingTop: "3.5px" }}>
          Ingen matpreferanser
        </Heading>
      </Grid>
    );
  }

  return (
    <>
      <Grid gap={4}>
        <Text muted size={1}>
          Arrangement
        </Text>
        <Heading as={"h2"} size={4} style={{ paddingTop: "3.5px" }}>
          Matallergier ({data.length})
        </Heading>
      </Grid>

      <div style={{ marginTop: "3rem" }}>
        {data.map(({ text }, index) => (
          <Card {...cardProps} key={index}>
            <Stack space={4}>
              <Flex align="center">
                <Text>{text}</Text>
              </Flex>
            </Stack>
          </Card>
        ))}
      </div>
    </>
  );
}
