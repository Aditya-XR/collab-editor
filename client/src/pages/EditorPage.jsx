import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SlateEditor from "../editor/SlateEditor.jsx";
import { getDocument } from "../services/documentService.js";

const defaultEditorValue = [
  {
    type: "title",
    children: [{ text: "Untitled" }]
  },
  {
    type: "paragraph",
    children: [{ text: "" }]
  }
];

const getInitialEditorValue = (document) => {
  return Array.isArray(document.latestSnapshot) && document.latestSnapshot.length > 0
    ? document.latestSnapshot
    : defaultEditorValue;
};

const EditorPage = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [initialValue, setInitialValue] = useState(defaultEditorValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDocument = async () => {
      setIsLoading(true);
      setError("");

      try {
        const fetchedDocument = await getDocument(id);
        setDocument(fetchedDocument);
        setInitialValue(getInitialEditorValue(fetchedDocument));
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  if (isLoading) {
    return (
      <main className="editor-page">
        <p className="page-state">Loading document...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="editor-page">
        <p className="page-error">{error}</p>
      </main>
    );
  }

  return (
    <main className="editor-page">
      <SlateEditor document={document} initialValue={initialValue} />
    </main>
  );
};

export default EditorPage;
