import React, { Component, createRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";

Quill.register("modules/imageResize", ImageResize);

class Editor extends Component {
  constructor(props) {
    super(props);
    this.quillRef = createRef();
  }

  handleChange = (html) => {
    const { onEditorChange } = this.props;
    if (onEditorChange) {
      onEditorChange(html);
    }
  };

  render() {
    const { value, placeholder } = this.props;

    return (
      <ReactQuill
        ref={this.quillRef}
        theme="snow"
        onChange={this.handleChange}
        value={value}
        modules={Editor.modules}
        formats={Editor.formats}
        bounds={"#root"}
        placeholder={placeholder}
      />
    );
  }
}

Editor.modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    ["blockquote"],
    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: true,
    clean: true,
  },
  imageResize: {
    parchment: Quill.import("parchment"),
    modules: ["Resize", "DisplaySize"],
  },
};

Editor.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
  "align",
  "script",
  "background",
  "code",
  "style",
  "alt",
  "height",
  "width",
];

export default Editor;
