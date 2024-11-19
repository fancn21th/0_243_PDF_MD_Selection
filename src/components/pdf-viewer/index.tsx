/* eslint-disable @typescript-eslint/no-explicit-any */

import { MD_DRIVE_PDF } from "@/constant/event";
// import { message } from "antd";
// import { TaskIdProgress, TaskIdResItem } from "@/api/extract";
import React, { useEffect, useRef } from "react";
import { useLatest } from "ahooks";
import {
  DEFAULT_COLOR_SECTION,
  PDF_COLOR_PICKER,
} from "@/constant/pdf-color-picker";

 type ExtractTaskType =
  | "pdf"
  | "formula-detect"
  | "formula-extract"
  | "table-recogn";

interface TaskIdProgress {
  state: "running" | "done" | "pending" | "failed" | "unknown";
  markdownUrl: string[] | [];
  fullMdLink: string;
  content: string[] | [];
  url: string;
  fileName: string;
  thumb: string;
  type: ExtractTaskType | "unknown";
  isTemplate?: boolean;
  fileInfo?: {
    pages: number;
    width: number;
    height: number;
  };
}

interface TaskIdResItem {
  queues: number;
  rank: number;
  id?: number;
  url: string;
  fileName?: string;
  fullMdLink?: string;
  type: ExtractTaskType | "unknown";
  state: "running" | "done" | "pending" | "failed" | "unknown";
  markdownUrl: string[];
  file_key?: string;
}

interface PDFViewerState {
  page: number;
}

interface Bbox {
  type: "title" | "text" | "discarded" | "image";
  bbox: [number, number, number, number];
  color: any;
}

interface ExtractLayerItem {
  preproc_blocks: Bbox[];
  page_idx: number;
  page_size: [number, number];
  discarded_blocks: Bbox[];
}

// func
const formatJson = (layerList: ExtractLayerItem[]) => {
  return layerList?.map((i) => {
    const bboxes = [] as { type: string; bbox: number[]; color: any }[];

    i?.preproc_blocks?.forEach((item) => {
      bboxes.push({
        type: item.type,
        bbox: item.bbox,
        color: PDF_COLOR_PICKER?.[item.type] || DEFAULT_COLOR_SECTION,
      });
    });

    i?.discarded_blocks?.forEach((item) => {
      bboxes.push({
        type: item.type,
        bbox: item.bbox,
        color: PDF_COLOR_PICKER?.[item.type] || DEFAULT_COLOR_SECTION,
      });
    });

    return {
      ...i,
      bboxes,
    };
  });
};

const PDFViewer = ({
  taskInfo,
  onChange,
}: {
  taskInfo?: TaskIdProgress & TaskIdResItem;
  onChange?: (state: PDFViewerState) => void;
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const _layerData = useLatest(taskInfo?.content);

  // const pdfUrl = taskInfo?.url;
  const pdfUrl = `/sample/test.pdf`;

  const sendMessageToIframe = (type: string, message: any) => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        {
          type,
          data: message,
        },
        import.meta.env.BASE_URL || "*"
      );
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event?.data?.pageNum) {
        const num = event?.data?.pageNum || 1;
        sendMessageToIframe("pageChange", num);
      }

      if (event?.data?.pageNumDetail) {
        const pageNumDetail = event?.data?.pageNumDetail || 1;
        onChange?.({
          page: pageNumDetail,
        });
        sendMessageToIframe("pageNumDetail", pageNumDetail);
      }

      if (event?.data?.status) {
        const status = event?.data?.status;
        if (status === "loaded") {
          sendMessageToIframe(
            "initExtractLayerData",
            formatJson(_layerData?.current as any)
          );
          sendMessageToIframe("title", "");
        }
      }

      if (event?.data?.error) {
        // message?.error(event?.data?.error);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    const handlePageChange = ({ detail }: CustomEvent) => {
      sendMessageToIframe("setPage", detail + 1);
    };
    document.addEventListener(MD_DRIVE_PDF, handlePageChange as EventListener);
    return () => {
      document.removeEventListener(
        MD_DRIVE_PDF,
        handlePageChange as EventListener
      );
    };
  }, []);

  return (
    <>
      {pdfUrl ? (
        <iframe
          ref={iframeRef}
          className="w-full border-0 h-full"
          src={`${
            import.meta.env.BASE_URL
          }pdfjs-dist/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`}
        ></iframe>
      ) : null}
    </>
  );
};

export default PDFViewer;
