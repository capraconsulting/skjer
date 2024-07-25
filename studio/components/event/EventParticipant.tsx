import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEventParticipantList } from "../../supabase/queries";
import { Box, Card, Grid, Heading, Spinner, Stack, Text, TextInput, Inline } from "@sanity/ui";
import { SearchIcon } from "@sanity/icons";
import ExcelExport, { ExcelObject } from "../shared/ExcelExport";

type Props = {
  documentId: string;
  title?: string;
  isDigital: boolean;
  openForExternals: boolean;
};

export default function EventParticipant({
  documentId,
  title,
  isDigital,
  openForExternals,
}: Props) {
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

  const excelData: ExcelObject[] =
    data?.event_participant.map((participant) => {
      const options = participant.event_participant_option.reduce<{ [key: string]: string }>(
        (acc, item) => {
          if (item.value) {
            acc[item.option] = item.value;
          }
          return acc;
        },
        {}
      );

      return {
        Navn: participant.full_name,
        Epost: participant.email,
        ...(openForExternals && {
          Telefon: participant.telephone || "",
          Selskap: participant.firm || "",
        }),
        ...(isDigital && { Digitalt: participant.attending_digital ? "Ja" : "Nei" }),
        ...options,
      };
    }) || [];

  const cardProps = { border: true, padding: 3, radius: 2 };

  if (isLoading) {
    return (
      <Grid gap={4}>
        <Spinner muted />
      </Grid>
    );
  }

  if (isError) {
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
  }

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
          {title ? <ExcelExport data={excelData} fileName={title} /> : ""}
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

      <Grid gap={4} style={{ maxHeight: "400px", overflowY: "scroll" }}>
        {filteredData?.map(({ event_participant_id, full_name, email }) => (
          <Card {...cardProps} key={event_participant_id}>
            <Stack space={3}>
              <Text weight="bold">{full_name}</Text>
              <Text textOverflow={"ellipsis"}>{email}</Text>
            </Stack>
          </Card>
        ))}
      </Grid>
    </>
  );
}
