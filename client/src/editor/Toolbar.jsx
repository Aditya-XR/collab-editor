import { Editor, Element as SlateElement, Transforms } from "slate";

const marks = [
  { label: "B", format: "bold" },
  { label: "I", format: "italic" },
  { label: "U", format: "underline" }
];

const blockTypes = [
  { label: "Heading", format: "heading-one" },
  { label: "Paragraph", format: "paragraph" }
];

const isMarkActive = (editor, format) => {
  const activeMarks = Editor.marks(editor);
  return activeMarks ? activeMarks[format] === true : false;
};

const toggleMark = (editor, format) => {
  if (isMarkActive(editor, format)) {
    Editor.removeMark(editor, format);
    return;
  }

  Editor.addMark(editor, format, true);
};

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: (node) => SlateElement.isElement(node) && node.type === format
  });

  return Boolean(match);
};

const setBlockType = (editor, format) => {
  Transforms.setNodes(editor, { type: format }, {
    match: (node) => SlateElement.isElement(node) && node.type !== "image"
  });
};

const Toolbar = ({ editor, onImageUpload, isUploading }) => {
  return (
    <div className="editor-toolbar" role="toolbar" aria-label="Editor toolbar">
      {marks.map((mark) => (
        <button
          className={isMarkActive(editor, mark.format) ? "toolbar-button active" : "toolbar-button"}
          key={mark.format}
          onMouseDown={(event) => {
            event.preventDefault();
            toggleMark(editor, mark.format);
          }}
          type="button"
        >
          {mark.label}
        </button>
      ))}

      {blockTypes.map((block) => (
        <button
          className={isBlockActive(editor, block.format) ? "toolbar-button active" : "toolbar-button"}
          key={block.format}
          onMouseDown={(event) => {
            event.preventDefault();
            setBlockType(editor, block.format);
          }}
          type="button"
        >
          {block.label}
        </button>
      ))}

      <label className={isUploading ? "toolbar-button disabled" : "toolbar-button"}>
        {isUploading ? "Uploading" : "Image"}
        <input
          accept="image/*"
          disabled={isUploading}
          hidden
          onChange={onImageUpload}
          type="file"
        />
      </label>
    </div>
  );
};

export default Toolbar;
