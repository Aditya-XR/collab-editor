const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "title":
      return (
        <h1 className="editor-title" {...attributes}>
          {children}
        </h1>
      );
    case "heading-one":
      return (
        <h2 className="editor-heading" {...attributes}>
          {children}
        </h2>
      );
    case "image":
      return (
        <div className="editor-image-block" {...attributes}>
          <div contentEditable={false}>
            <img src={element.url} alt="" className="editor-image" />
          </div>
          {children}
        </div>
      );
    case "paragraph":
    default:
      return (
        <p className="editor-paragraph" {...attributes}>
          {children}
        </p>
      );
  }
};

export default Element;
