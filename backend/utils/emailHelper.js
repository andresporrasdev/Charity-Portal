const base64ToBase64Url = (base64) => {
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const convertBase64ImagesToBase64Url = (html) => {
  return html.replace(/data:image\/([a-zA-Z]*);base64,([^"]*)/g, (match, mime, base64) => {
    const base64url = base64ToBase64Url(base64);
    return `data:image/${mime};base64,${base64url}`;
  });
};

const extractBase64Images = (html) => {
  const base64Images = [];
  const regex = /data:image\/([a-zA-Z]*);base64,([^"]*)/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    base64Images.push(`data:image/${match[1]};base64,${match[2]}`);
  }
  return base64Images;
};

// Replace image tags with empty span tags
const removeImageTags = (html) => {
  return html
    .replace(/<img[^>]*>/g, "")
    .replace(/<!-- Image removed -->/g, '<span style="display:block;height:0px;"></span>');
};

const adjustLineHeight = (html) => {
  const style = `
    <style>
      p {
        line-height: 1.0;
      }
    </style>
  `;
  return style + html;
};

const getAttachments = (base64Images) => {
  return base64Images.map((base64Image, index) => {
    return {
      filename: `image${index}.png`,
      content: base64Image.split("base64,")[1],
      encoding: "base64",
    };
  });
};

module.exports = {
  base64ToBase64Url,
  convertBase64ImagesToBase64Url,
  extractBase64Images,
  removeImageTags,
  adjustLineHeight,
  getAttachments,
};
