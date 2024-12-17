import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Label,
  Spinner,
  Stack,
  Text,
  TextInput,
  useToast,
} from "@sanity/ui";
import { getEvent, getEventInvitationList, insertInvitation } from "../../supabase/queries";
import { AddIcon } from "@sanity/icons";

const InvitasjonerInfo = () => {
  return (
    <div>
      <i>Dette er kun for å gi en GDPR-vennlig oversikt over hvem som er invitert (ikke påmeldt). Ved å registrere noen her sender du ikke ut en invitasjon eller informasjon, men noterer at personen ble invitert.</i>
    </div>
  );
};

export default function EventInvitation({ documentId }: { documentId: string }) {
  const toast = useToast();

  const [email, setEmail] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");

  const { data: event } = useQuery({
    queryKey: ["event", documentId],
    queryFn: () => getEvent({ document_id: documentId }),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["event-invitation-list", documentId],
    queryFn: () => getEventInvitationList({ documentId }),
  });

  const queryClient = useQueryClient();

  async function handleInvitationAdd() {
    const emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{1,}$");
    if (!email || !emailRegex.test(email)) return;

    try {
      await insertInvitation({ document_id: documentId }, { full_name: fullName, email });

      queryClient.invalidateQueries({ queryKey: ["event-invitation-list"] });

      setEmail("");
      setFullName("");

      toast.push({
        status: "success",
        title: `${email} ble lagt til i listen`,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.push({
          status: "error",
          title: error.message,
        });
      }
    }
  }

  const cardProps = { border: true, padding: 3, radius: 2 };

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
        <Heading as="h2" size={4} style={{ paddingTop: "3.5px" }}>
          Ingen invitasjoner
        </Heading>
        <InvitasjonerInfo />

        {event?.data ? (
          <>
            <Grid columns={[1]} gap={4} style={{ width: "100%", marginTop: "3rem" }}>
              <Box>
                <Text size={1} style={{ marginBottom: "0.75rem", fontWeight: 500 }}>
                  Fulltnavn
                </Text>
                <TextInput
                  aria-label="Fulltnavn"
                  type="text"
                  onChange={(event) => setFullName(event.currentTarget.value)}
                  padding={2}
                  value={fullName}
                />
              </Box>
              <Box>
                <Text
                  aria-label="E-post"
                  size={1}
                  style={{ marginBottom: "0.75rem", fontWeight: 500 }}
                >
                  E-post*
                </Text>
                <TextInput
                  type="email"
                  onChange={(event) => setEmail(event.currentTarget.value)}
                  padding={2}
                  value={email}
                />
              </Box>
            </Grid>
            <Box style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
              <Button
                fontSize={[1]}
                icon={AddIcon}
                mode="ghost"
                onClick={() => handleInvitationAdd()}
                padding={3}
                text="Legg til"
              />
            </Box>
          </>
        ) : null}
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
          Invitasjoner ({data.length})
        </Heading>
        <InvitasjonerInfo />

        <Grid columns={[1]} gap={4} style={{ width: "100%", marginTop: "3rem" }}>
          <Box>
            <Text
              aria-label="Fulltnavn"
              size={1}
              style={{ marginBottom: "0.75rem", fontWeight: 500 }}
            >
              Fulltnavn
            </Text>

            <TextInput
              onChange={(event) => setFullName(event.currentTarget.value)}
              padding={2}
              value={fullName}
            />
          </Box>
          <Box>
            <Text aria-label="E-post" size={1} style={{ marginBottom: "0.75rem", fontWeight: 500 }}>
              E-post*
            </Text>
            <TextInput
              type="email"
              onChange={(event) => setEmail(event.currentTarget.value)}
              padding={2}
              value={email}
            />
          </Box>
        </Grid>

        <Box style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
          <Button
            fontSize={[1]}
            icon={AddIcon}
            mode="ghost"
            onClick={() => handleInvitationAdd()}
            padding={3}
            text="Legg til"
          />
        </Box>
      </Grid>

      <Grid gap={4} style={{ maxHeight: "300px", overflowY: "scroll", marginTop: "3rem" }}>
        {data.map(({ email, full_name }, index) => (
          <Card {...cardProps} key={index}>
            <Stack space={4}>
              <Flex align="center">
                <Text>{full_name ? `${full_name} - ${email}` : email}</Text>
              </Flex>
            </Stack>
          </Card>
        ))}
      </Grid>
    </>
  );
}
