import {StructureBuilder} from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Site Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .child(S.editor().id('siteSettings').schemaType('siteSettings').documentId('siteSettings')),
      ...S.documentTypeListItems().filter((listItem) => {
        return !['siteSettings'].includes(listItem?.getId()?.toString() || '')
      }),
    ])
