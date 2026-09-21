/** Keep base64 upload requests comfortably below the hosting request limit. */
export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

export async function compressBlogImage(file: File): Promise<File> {
  const targetBytes = 500 * 1024;
  if (file.size <= targetBytes) return file;
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
    if (file.size <= MAX_IMAGE_BYTES) return file;
    throw new Error("This image is too large. Automatic compression supports JPG, PNG, and WebP. For an animated GIF, choose a file under 3 MB.");
  }

  const url = URL.createObjectURL(file);
  const canvas = document.createElement("canvas");
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("This image could not be read. Try exporting it as a JPG or PNG."));
      image.src = url;
    });
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Your browser could not compress this image.");

    let scale = Math.min(1, 2560 / Math.max(image.naturalWidth, image.naturalHeight));
    for (let attempt = 0; attempt < 6; attempt += 1) {
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      for (const quality of [0.88, 0.76, 0.64]) {
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
        if (blob && blob.size <= targetBytes) {
          // Browsers without WebP encoding fall back to PNG.
          const extension = blob.type === "image/webp" ? "webp" : "png";
          if (blob.size >= file.size && file.size <= MAX_IMAGE_BYTES) return file;
          return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.${extension}`, { type: blob.type });
        }
      }
      scale *= 0.75;
    }
    throw new Error("This image could not be compressed enough. Try a smaller export.");
  } finally {
    URL.revokeObjectURL(url);
    canvas.width = 0;
    canvas.height = 0;
  }
}
