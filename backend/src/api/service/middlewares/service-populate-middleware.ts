"use strict";

/**
 * `service-populate-middleware` middleware
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const populate = {
      picture: {
        fields: ["url", "alternativeText", "caption", "width", "height"],
      },
      icon: {
        fields: ["url", "alternativeText", "width", "height"],
      },
      // sections: {
      //   on: {
      //     // Populate all components in the sections dynamic zone
      //   },
      // },
    };

    ctx.query = {
      populate,
      filters: ctx.query.filters && ctx.query.filters.slug ? { slug: ctx.query.filters.slug } : undefined,
      locale: ctx.query.locale,
    };

    await next();
  };
};
