import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEventParticipantList } from "../../supabase/queries";
import {
  Box,
  Badge,
  Card,
  Grid,
  Heading,
  Spinner,
  Stack,
  Text,
  TextInput,
  Inline,
} from "@sanity/ui";
import { SearchIcon } from "@sanity/icons";
import ExcelExport from "../shared/ExcelExport";

export default function EventParticipant({ documentId }: { documentId: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["event-participant-list", documentId],
    queryFn: () => getEventParticipantList({ documentId }),
  });

  const [searchQuery, setValue] = useState("");

  const filteredData = data?.event_participant.filter((participant) => {
    return Object.values(participant).some(
      (value) =>
        typeof value === "string" && value.toLowerCase().includes(searchQuery.toLowerCase())
    );
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

  if (!data?.event_participant.length) {
    return (
      <Grid gap={4}>
        <Text muted size={1}>
          Arrangement
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
          Arrangement
        </Text>
        <Inline style={{ display: "flex", justifyContent: "space-between" }}>
          <Heading as={"h2"} size={4} style={{ paddingTop: "3.5px" }}>
            Påmeldinger ({data?.event_participant.length})
          </Heading>
          <ExcelExport data={data.event_participant} fileName={"test"} />
        </Inline>
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
        {filteredData?.map(({ event_participant_id, full_name, email, attending }) => (
          <Card {...cardProps} key={event_participant_id}>
            <Stack space={2}>
              <Inline space={2} style={{ justifyContent: "space-between", display: "flex" }}>
                <Text weight="bold">{full_name}</Text>
                {attending && <Badge tone="positive">Påmeldt</Badge>}
                {!attending && <Badge tone="critical">Avmeldt</Badge>}
              </Inline>
              <Text textOverflow={"ellipsis"}>{email}</Text>
            </Stack>
          </Card>
        ))}
      </Grid>
    </>
  );
}
