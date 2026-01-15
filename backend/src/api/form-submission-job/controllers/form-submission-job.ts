/**
 * form-submission-job controller
 */

import { factories } from '@strapi/strapi'

const UPLOAD_FOLDER_NAME = 'Job Applications';

async function getOrCreateUploadFolder(strapi) {
  // Try to find existing folder
  const existingFolder = await strapi.db.query('plugin::upload.folder').findOne({
    where: { name: UPLOAD_FOLDER_NAME },
  });

  if (existingFolder) {
    return existingFolder.id;
  }

  // Create folder if it doesn't exist
  const newFolder = await strapi.db.query('plugin::upload.folder').create({
    data: {
      name: UPLOAD_FOLDER_NAME,
      pathId: Date.now(), // unique path identifier
      path: `/${Date.now()}`,
    },
  });

  return newFolder.id;
}

export default factories.createCoreController('api::form-submission-job.form-submission-job', ({ strapi }) => ({
  async create(ctx) {
    try {
      const { data } = ctx.request.body;
      const files = ctx.request.files;

      // Parse the data if it's a string (from FormData)
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

      // Create the entry first
      const entity = await strapi.entityService.create('api::form-submission-job.form-submission-job', {
        data: parsedData,
      });

      // If there's a resume file, upload it and link it to the entry
      // Using the correct Strapi upload service method for linking files to entries
      if (files && files['files.resume']) {
        const resumeFile = files['files.resume'];
        const resumeFiles = Array.isArray(resumeFile) ? resumeFile : [resumeFile];

        // Get or create the upload folder
        const folderId = await getOrCreateUploadFolder(strapi);

        // Upload and link file to the entry using the upload plugin service
        await strapi.plugin('upload').service('upload').upload({
          data: {
            ref: 'api::form-submission-job.form-submission-job',
            refId: entity.id,
            field: 'resume',
            fileInfo: {
              folder: folderId,
            },
          },
          files: resumeFiles,
        });
      }

      // Fetch the entry with populated resume
      const result = await strapi.entityService.findOne('api::form-submission-job.form-submission-job', entity.id, {
        populate: ['resume'],
      });

      return { data: result };
    } catch (error) {
      console.error('Error creating form submission:', error);
      ctx.throw(400, error);
    }
  },
}));
