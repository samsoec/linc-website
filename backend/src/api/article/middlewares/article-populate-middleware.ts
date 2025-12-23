"use strict";

/**
 * `article-populate-middleware` middleware
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const populate = {
      blocks: {
        on: {
          'shared.media': {
            populate: {
              file: {
                fields: ["url", "alternativeText", "caption", "width", "height"],
              },
            },
          },
          'shared.quote': {
            populate: '*',
          },
          'shared.rich-text': {
            populate: '*',
          },
          'shared.slider': {
            populate: {
              files: {
                fields: ["url", "alternativeText", "caption", "width", "height"],
              },
            },
          },
          'shared.video-embed': {
            populate: '*',
          },
        },
      },
      cover: {
        fields: ["url", "alternativeText", "caption", "width", "height"],
      },
      category: {
        fields: ["name", "slug"],
      },
      authorsBio: {
        populate: {
          avatar: {
            fields: ["url", "alternativeText"],
          },
        },
      },
      seo: {
        fields: ["metaTitle", "metaDescription"],
        populate: { shareImage: true },
      },
    };
    
    ctx.query = {
      ...ctx.query,
      populate,
    };

    await next();
  };
};
