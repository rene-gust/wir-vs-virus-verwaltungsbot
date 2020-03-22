"use strict";

const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      data.author = ctx.state.user.id;
      entity = await strapi.services.answer.create(data, { files });
    } else {
      ctx.request.body.author = ctx.state.user.id;
      entity = await strapi.services.answer.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.article });
  }

  /**
   * Update a record.
   *
   * @return {Object}
   */

  async update(ctx) {
    let entity;

    const [answer] = await strapi.services.answer.find({
      id: ctx.params.id,
      'author.id': ctx.state.user.id,
    });

    if (!article) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.article.update(ctx.params, data, {
        files,
      });
    } else {
      entity = await strapi.services.article.update(
        ctx.params,
        ctx.request.body
      );
    }

    return sanitizeEntity(entity, { model: strapi.models.article });
  },
};
