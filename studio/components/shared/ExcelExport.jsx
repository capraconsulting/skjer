import React from "react";
import { saveAs } from "file-saver";
import { Button } from "@sanity/ui";
import { ArrowUpIcon } from "@sanity/icons";

export default function ExcelExport({ data, fileName }) {
  console.log(data);
  const exportToExcel = async () => {
    const XLSX = await import("xlsx");

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Påmeldinger");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
  };

  return (
    <Button
      icon={ArrowUpIcon}
      tone="positive"
      fontSize={1}
      onClick={exportToExcel}
      text="Eksporter til Excel"
    />
  );
}
