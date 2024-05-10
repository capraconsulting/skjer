import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEventParticipants } from "../api/fetchEventParticipants";
import { Button, Card, Spinner, Text } from "@sanity/ui";
import { TrashIcon } from "@sanity/icons";
import "../styles//event-participant.css";

export default function EventParticipant({ documentId }: { documentId: string }) {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["event-registration", documentId],
    queryFn: () => fetchEventParticipants({ documentId }),
  });

  const cardProps = { shadow: 1, padding: 3, radius: 2 };

  if (isLoading)
    return (
      <Card tone="default" {...cardProps}>
        <Spinner />
      </Card>
    );

  if (isError)
    return (
      <Card tone="critical" {...cardProps}>
        <Text>En feil har oppstått</Text>
      </Card>
    );

  if (!data?.length) {
    return (
      <Card tone="primary" {...cardProps}>
        <Text>Ingen påmeldte</Text>
      </Card>
    );
  }

  return (
    <div>
      <Card tone="positive" {...cardProps}>
        <Text>Antall påmeldte: {data.length}</Text>
      </Card>

      <div className="table-container">
        <table className="responsive-table">
          <thead>
            <tr>
              <th>Fulltnavn</th>
              <th>E-post</th>
              <th>Telefon</th>
              <th>Firma</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map(({ full_name: fullName, email, telephone, firm }, index) => (
              <tr key={index}>
                <td>{fullName}</td>
                <td>{email}</td>
                <td>{telephone}</td>
                <td>{firm}</td>
                <td>
                  <Button
                    fontSize={[2]}
                    icon={TrashIcon}
                    mode="ghost"
                    tone="critical"
                    padding={[2]}
                    text="Avmeld"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
