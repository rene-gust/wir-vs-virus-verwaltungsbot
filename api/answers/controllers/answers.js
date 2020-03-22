"use strict";

const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  async find(ctx) {
    const userChannel = ctx.state.user.channel;

    const query = {
      ...ctx.query,
      channel: userChannel,
    }


    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.answers.search(query);
    } else {
      entities = await strapi.services.answers.find(query);
    }

    return entities.map(entity =>
      sanitizeEntity(entity, { model: strapi.models.answers })
    );
  },

  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    /** New answers need to be added by administrators for now */
    return ctx.unauthorized(`You can't add answers, you can only edit.`);
    /**
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
     */
  },

  /**
   * Update a record.
   *
   * @return {Object}
   */

  async update(ctx) {
    const userChannel = ctx.state.user.channel;

    let entity;

    const [answer] = await strapi.services.answer.find({
      id: ctx.params.id,
    });

    if (!answer) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (answer.channel.id != userChannel) {
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
