import { Suspense } from "react";
import ReportPrintClient from "./ReportPrintClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportPrintClient />
    </Suspense>
  );
} 