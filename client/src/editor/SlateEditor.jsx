import { useCallback, useMemo, useState } from "react";
import { createEditor, Transforms } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";
import Element from "./Element.jsx";
import Leaf from "./Leaf.jsx";
import Toolbar from "./Toolbar.jsx";
import withImages from "./withImages.js";
import { saveDocumentContent } from "../services/documentService.js";
import { uploadImage } from "../services/uploadService.js";

const insertImage = (editor, url) => {
  const image = {
    type: "image",
    url,
    children: [{ text: "" }]
  };

  Transforms.insertNodes(editor, image);
  Transforms.insertNodes(editor, {
    type: "paragraph",
    children: [{ text: "" }]
  });
};

const SlateEditor = ({ document, initialValue }) => {
  const editor = useMemo(() => withImages(withHistory(withReact(createEditor()))), []);
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  const handleSave = async () => {
    setError("");
    setStatus("");
    setIsSaving(true);

    try {
      await saveDocumentContent(document._id, value);
      setStatus("Document saved");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setError("");
    setStatus("");
    setIsUploading(true);

    try {
      const imageUrl = await uploadImage(file);
      insertImage(editor, imageUrl);
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="editor-shell">
      <div className="editor-header">
        <div>
          <p className="editor-kicker">Document</p>
          <h1>{document.title}</h1>
        </div>
        <button className="save-button" disabled={isSaving} onClick={handleSave} type="button">
          {isSaving ? "Saving..." : "Save Document"}
        </button>
      </div>

      <Slate editor={editor} initialValue={value} onChange={setValue}>
        <Toolbar editor={editor} isUploading={isUploading} onImageUpload={handleImageUpload} />
        <Editable
          className="editor-surface"
          placeholder="Start writing..."
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          spellCheck
        />
      </Slate>

      <div className="editor-message-row">
        {status && <p className="editor-status">{status}</p>}
        {error && <p className="editor-error">{error}</p>}
      </div>
    </section>
  );
};

export default SlateEditor;
