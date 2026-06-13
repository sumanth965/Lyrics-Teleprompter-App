"use client";

import StudioScreen from "../../components/StudioScreen";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function StudioPage() {
  return (
    <ProtectedRoute>
      <StudioScreen />
    </ProtectedRoute>
  );
}
