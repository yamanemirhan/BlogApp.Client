import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const PostDetailContent = ({ content }) => {
  const parsedContent = React.useMemo(() => {
    if (typeof content === "string") {
      try {
        return JSON.parse(content);
      } catch (e) {
        console.error("Failed to parse content:", e);
        return [];
      }
    }
    return content;
  }, [content]);

  if (!parsedContent || !Array.isArray(parsedContent)) {
    console.log("Invalid content format");
    return null;
  }

  const renderText = (textItem, index) => (
    <span
      key={index}
      className={`
        ${textItem.styles?.bold ? "font-bold" : ""}
        ${textItem.styles?.italic ? "italic" : ""}
        ${textItem.styles?.underline ? "underline" : ""}
        ${textItem.styles?.strike ? "line-through" : ""}
        ${
          textItem.styles?.textColor
            ? `text-${textItem.styles.textColor}-500`
            : ""
        }
      `}
    >
      {textItem.text || ""}
    </span>
  );

  const getAlignment = (props) => {
    switch (props?.textAlignment) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  const renderContent = (item) => {
    if (!item || !item.type) return null;

    switch (item.type) {
      case "image":
        return (
          <div key={item.id} className="my-6">
            <div className="rounded-lg overflow-hidden">
              <img
                src={item.props?.url}
                alt={item.props?.name || ""}
                className="max-w-[1000px] h-auto object-cover"
              />
            </div>
            {item.props?.caption && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                {item.props.caption}
              </p>
            )}
          </div>
        );

      case "heading":
        const HeadingTag = `h${item.props?.level || 1}`;
        const headingSizes = {
          1: "text-4xl",
          2: "text-3xl",
          3: "text-2xl",
          4: "text-xl",
          5: "text-lg",
          6: "text-base",
        };
        return (
          <HeadingTag
            key={item.id}
            className={`font-bold ${
              headingSizes[item.props?.level || 1]
            } mb-4 mt-8 ${getAlignment(item.props)}`}
          >
            {item.content?.map((textItem, index) =>
              renderText(textItem, index)
            )}
          </HeadingTag>
        );

      case "paragraph":
        if (!item.content?.length) return null;
        return (
          <p
            key={item.id}
            className={`mb-4 text-lg leading-relaxed ${getAlignment(
              item.props
            )}`}
          >
            {item.content.map((textItem, index) => renderText(textItem, index))}
          </p>
        );

      case "bulletListItem":
      case "numberedListItem":
        const ListTag = item.type === "bulletListItem" ? "ul" : "ol";
        return (
          <ListTag
            key={item.id}
            className={`mb-4 ml-6 ${
              item.type === "bulletListItem" ? "list-disc" : "list-decimal"
            }`}
          >
            <li className={getAlignment(item.props)}>
              {item.content.map((textItem, index) =>
                renderText(textItem, index)
              )}
            </li>
          </ListTag>
        );

      case "checkListItem":
        return (
          <div key={item.id} className="flex items-center gap-2 mb-2">
            <Checkbox checked={item.props?.checked} disabled />
            <span className={getAlignment(item.props)}>
              {item.content.map((textItem, index) =>
                renderText(textItem, index)
              )}
            </span>
          </div>
        );

      case "table":
        return (
          <div key={item.id} className="overflow-x-auto my-4">
            <table className="min-w-full border-collapse border border-gray-200">
              <tbody>
                {item.content?.rows?.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.cells[0].map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={`border border-gray-200 p-2 ${
                          rowIndex === 0 ? "font-bold bg-gray-50" : ""
                        }`}
                      >
                        {renderText(cell, cellIndex)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="mx-auto bg-slate-400 border-none py-2 rounded-md">
      <CardContent>
        {parsedContent.map((item) => renderContent(item))}
      </CardContent>
    </Card>
  );
};

export default PostDetailContent;
