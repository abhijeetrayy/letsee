// /app/update-password/page.tsx

import { Suspense } from "react";
import UpdatePasswordComponent from "@components/clientComponent/update_password";

export default function UpdatePassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpdatePasswordComponent />
    </Suspense>
  );
}

// /app/update-password/UpdatePasswordComponent.tsx
