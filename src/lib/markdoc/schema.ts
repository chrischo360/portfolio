import type { Config } from "@markdoc/markdoc";

export const markdocConfig: Config = {
  nodes: {
    fence: {
      render: "ArticleCode",
      attributes: {
        content: {
          type: String,
          required: true,
        },
        language: {
          type: String,
        },
      },
    },
  },
  tags: {
    callout: {
      render: "ArticleCallout",
      attributes: {
        tone: {
          type: String,
          default: "neutral",
          matches: ["neutral", "warning", "success"],
        },
        title: {
          type: String,
          required: true,
        },
      },
    },
    media: {
      render: "ArticleMedia",
      selfClosing: true,
      attributes: {
        type: {
          type: String,
          required: true,
          matches: ["image", "gif", "video", "embed"],
        },
        status: {
          type: String,
          default: "ready",
          matches: ["ready", "planned"],
        },
        src: {
          type: String,
        },
        alt: {
          type: String,
        },
        title: {
          type: String,
        },
        caption: {
          type: String,
        },
        poster: {
          type: String,
        },
      },
    },
  },
};
