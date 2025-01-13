import { uuid } from "@sanity/uuid";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "emailTemplate",
  title: "E-post maler",
  type: "object",
  options: { columns: 1, collapsed: true },
  fields: [
    defineField({
      name: "registrationSubject",
      title: "Tilpass emne for påmelding",
      type: "string",
      initialValue: "Du er påmeldt! 🎉 Velkommen til oss!",
      validation: (Rule) => Rule.required().min(3).max(100),
    }),
    defineField({
      name: "registrationMessage",
      title: "Tilpass innhold for påmelding",
      type: "blockContent",
      initialValue: [
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "Gode nyheter - du er offisielt påmeldt! 🎊 Vi gleder oss til å ha deg med!",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "Har du noen spørsmål så håper vi at du tar kontakt.",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "Forbered deg på spennende innhold, nye bekjentskaper og en god start på/avslutning på dagen. Dette vil du ikke gå glipp av!",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "Vennlig hilsen oss i Capra, Fryde og Liflig",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "P.S. Følg med på innboksen din for flere spennende oppdateringer og overraskelser før arrangementet! 🚀",
            },
          ],
          markDefs: [],
          style: "normal",
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "unregistrationSubject",
      title: "Tilpass emne for avmelding",
      type: "string",
      initialValue: "Du har meldt deg av 🥲",
      validation: (Rule) => Rule.required().min(3).max(100),
    }),
    defineField({
      name: "unregistrationMessage",
      title: "Tilpass innhold for avmelding",
      type: "blockContent",
      initialValue: [
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "Hei,",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "Vi fikk nettopp beskjed om at du har meldt deg av vårt arrangement.",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "Ingen bekymringer - det kommer flere muligheter til å få litt faglig eller sosialt påfyll hos oss. Følg med her eller meld deg på vårt nyhetsbrev.",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "Vi håper å se deg på et av våre fremtidige arrangementer!",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "Vennlig hilsen oss i Capra, Liflig og Fryde",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "PS. Det er lov å ombestemme seg og melde seg på igjen.",
            },
          ],
          markDefs: [],
          style: "normal",
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cancelSubject",
      title: "Tilpass emne for avlysning",
      type: "string",
      initialValue: "Viktig beskjed: Arrangementet er dessverre avlyst",
      validation: (Rule) => Rule.required().min(3).max(100),
    }),
    defineField({
      name: "cancelMessage",
      title: "Tilpass innhold for avlysning",
      type: "blockContent",
      initialValue: [
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "Ånei!",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "Arrangementet er dessverre avlyst. Vi hadde gledet oss til å ta deg imot og beklager ulempene dette måtte medføre.",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "Vi vet at mange hadde gledet seg til arrangementet, og vi deler deres skuffelse.",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "Hvis du har noen spørsmål eller trenger ytterligere informasjon, er du hjertelig velkommen til å ta kontakt med oss.",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "Vi setter stor pris på din forståelse.",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "Vennlig hilsen oss i Capra, Liflig og Fryde",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "P.S. Vi lover å gjøre det neste arrangementet verdt ventetiden!",
            },
          ],
          markDefs: [],
          style: "normal",
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
});
