import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEventAllergies } from "../../api/fetchEventAllergies";
import { Card, Flex, Grid, Heading, Spinner, Stack, Text } from "@sanity/ui";
import { UserIcon } from "@sanity/icons";

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
          Arrangement
        </Text>
        <Heading as={"h2"} size={4} style={{ paddingTop: "3.5px" }}>
          En feil har oppstått
        </Heading>
      </Grid>
    );

  if (!data) {
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
          Matallergier
        </Heading>
        <Text size={2} style={{ paddingTop: "10px" }}>
          Totalt {data.total_participant_count} personer med allergier har meldt seg på dette
          arrangementet.
        </Text>
      </Grid>

      <div style={{ marginTop: "3rem" }}>
        {data.allergy_details?.map(({ allergies, participant_count }, index) => (
          <Card {...cardProps} key={index}>
            <Stack space={4}>
              <Flex align="center">
                <Text>{participant_count}</Text>
                <UserIcon style={{ fontSize: 20 }} />
                <Text weight="bold" style={{ marginLeft: 20 }}>
                  <span>{allergies?.join(", ")}</span>
                </Text>
              </Flex>
            </Stack>
          </Card>
        ))}
      </div>
    </>
  );
}
