import Markdoc, { type Config } from "@markdoc/markdoc";
import { getNodeText, slugify } from "./toc";

export const markdocConfig: Config = {
  nodes: {
    heading: {
      attributes: {
        level: {
          type: Number,
          required: true,
        },
      },
      transform(node, config) {
        const children = node.transformChildren(config);
        const id = slugify(getNodeText(node));

        return new Markdoc.Tag(`h${node.attributes.level}`, { id }, children);
      },
    },
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
