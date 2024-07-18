import { Component } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import "./EditorStyle.css";

Quill.register("modules/imageResize", ImageResize);

class Editor extends Component {
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
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote"],
    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"], // remove formatting button
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
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
  "video",
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
