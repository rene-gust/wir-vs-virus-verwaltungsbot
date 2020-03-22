'use strict';

async function getAnswer(channel, questionId) {
  const channelInDb = await strapi
    .query("channel").model
    .where({ "key": channel })
    .fetch();

  const channelId = channelInDb.attributes.id;

  const result = await strapi
    .query("answers").model
    .where({ "question_id": questionId, "channel": channelId })
    .fetch();
  strapi.log.info("Query result: ", result)
  return result;
}

/**
 * A set of functions called "actions" for `Intent`
 */

module.exports = {
  index: async ctx => {
    const body = ctx.request.body;

    // TODO: Verify body is json
    const { queryResult: { parameters: { questionId } } } = body;
    const { originalDetectIntentRequest: { payload: { channel } } } = body;

    let answer
    try {
      answer = await getAnswer(channel, questionId)
      answer = answer.attributes.answer_text
    } catch (e) {
      answer = JSON.stringify(e)
    }

    ctx.send({
      fulfillmentText: `This should be the answer to question: ${questionId} in channel: ${channel}
                        Answer loaded from db: ${answer}`,
    });
  },
};
