import * as htmlToImage from 'html-to-image';

export interface ExportCardOptions {
  fileName?: string;
  pixelRatio?: number;
  format?: 'png' | 'jpeg';
}

/**
 * Capture a styled DOM element and convert to a high-resolution downloadable image using html-to-image.
 * Used for exporting Instagram Story (9:16) and Post (4:5) Cultural Cards.
 */
export async function exportElementToImage(
  element: HTMLElement,
  options: ExportCardOptions = {}
): Promise<string> {
  await document.fonts?.ready;
  await Promise.all(Array.from(element.querySelectorAll('img')).map(img => img.decode()));
  const pixelRatio = options.pixelRatio || 2;
  const isJpeg = options.format === 'jpeg';

  const exportFn = isJpeg ? htmlToImage.toJpeg : htmlToImage.toPng;

  return await exportFn(element, {
    pixelRatio,
    cacheBust: true,
    quality: 0.95,
    backgroundColor: '#FAF7F2',
    style: {
      transform: 'none',
      margin: '0',
    },
    filter: (domNode: Node) => {
      // Exclude interactive buttons or scrollbars from the snapshot
      if (domNode instanceof HTMLElement) {
        if (domNode.dataset.exportIgnore === 'true') {
          return false;
        }
      }
      return true;
    },
  });
}

/**
 * Convert dataUrl to a downloadable File/Blob and trigger browser download
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
