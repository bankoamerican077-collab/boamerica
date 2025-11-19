// hooks/useUpdateUserDocument.ts
import { useState, useCallback } from "react";
import { updateUserDocumentByIdentifier } from "./updateUserDocumentByIdentifier";

type IdentifierField = "email" | "id" | "uid";

type UseUpdateUserDocReturn = {
  update: (
    collectionName: string,
    field: IdentifierField, // specify the field
    identifier: string,
    updateData: Record<string, any>
  ) => Promise<boolean>;
  loading: boolean;
  error: string | null;
};

export const useUpdateUserDocument = (): UseUpdateUserDocReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    async (
      collectionName: string,
      field: IdentifierField,
      identifier: string,
      updateData: Record<string, any>
    ) => {
      setLoading(true);
      setError(null);

      try {
        const result = await updateUserDocumentByIdentifier(
          collectionName,
          field, //  pass the field properly
          identifier,
          updateData
        );
        return result;
      } catch (err: any) {
        setError(err.message || "Update failed.");
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { update, loading, error };
};
