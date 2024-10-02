const { bucket } = require("../config/firebase.config");

const uploadImages = async (files, folderPath) => {
  try {
    const MAX_SIZE = 1 * 1024 * 1024;
    const uploadedUrls = [];

    for (let file of files) {
      if (file.size > MAX_SIZE) {
        throw new Error("Kích thước File tối đa là 1MB.");
      }

      const blob = bucket.file(`${folderPath}/${file.originalname}`);

      const stream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      await new Promise((resolve, reject) => {
        stream.on("error", (err) => {
          console.error(err);
          reject(err);
        });

        stream.on("finish", async () => {
          await blob.makePublic();
          const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
            bucket.name
          }/o/${encodeURIComponent(blob.name)}?alt=media`;
          uploadedUrls.push(publicUrl);
          resolve();
        });

        stream.end(file.buffer);
      });
    }

    return uploadedUrls;
  } catch (error) {
    console.error(error);
    throw new Error("Lỗi trong quá trình upload hình ảnh.");
  }
};

module.exports = {
  uploadImages,
};
