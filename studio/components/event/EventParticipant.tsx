import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEventParticipants } from "../../api/fetchEventParticipants";
import { Box, Button, Card, Grid, Heading, Stack, Text, TextInput } from "@sanity/ui";
import { RevertIcon, SearchIcon } from "@sanity/icons";

export default function EventParticipant({ documentId }: { documentId: string }) {
  const { isError, data } = useQuery({
    queryKey: ["event-participant", documentId],
    queryFn: () => fetchEventParticipants({ documentId }),
  });

  const [searchQuery, setValue] = useState("");

  const filteredData = data?.filter((participant) => {
    const searchText = searchQuery.toLowerCase();
    return Object.values(participant).some(
      (value) => typeof value === "string" && value.toLowerCase().includes(searchText)
    );
  });

  const cardProps = { shadow: 1, padding: 3, radius: 2 };

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
          Ingen påmeldinger
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
          Påmeldinger ({data.length})
        </Heading>
      </Grid>

      <Box style={{ marginTop: "4rem", marginBottom: "1rem" }}>
        <TextInput
          fontSize={2}
          icon={SearchIcon}
          onChange={({ currentTarget: { value } }) => setValue(value)}
          padding={3}
          placeholder="Søk"
          value={searchQuery}
        />
      </Box>

      <Grid gap={4}>
        {filteredData?.map(({ participant_id, full_name, email, telephone, firm, created_at }) => (
          <Card {...cardProps} key={participant_id}>
            <Stack space={4}>
              <Text weight="bold">{full_name}</Text>
              <Text textOverflow={"ellipsis"}>{email}</Text>
              <Text>{telephone}</Text>
              <Text>{firm}</Text>
              <Text>{Intl.DateTimeFormat().format(new Date(created_at || ""))}</Text>
              <Button
                fontSize={1}
                padding={2}
                icon={RevertIcon}
                mode="ghost"
                tone="critical"
                text="Trekk"
              />
            </Stack>
          </Card>
        ))}
      </Grid>
    </>
  );
}
